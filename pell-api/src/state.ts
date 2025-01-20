import { DurableObject } from "cloudflare:workers";

const EXPIRATION_MS = 1000; // 1 second in milliseconds

export interface GuestbookEntry {
	username: string;
	signInDate: string;
	lastVisitDate: string;
}

export class SharedState extends DurableObject<Env> {
	private async expire() {
		const guestbook: GuestbookEntry[] =
			(await this.ctx.storage.get("guestbook")) ?? [];
		const now = new Date();
		const filtered = guestbook.filter((entry) => {
			const lastVisit = new Date(entry.lastVisitDate);
			const diff = now.getTime() - lastVisit.getTime();
			return diff <= EXPIRATION_MS;
		});

		if (filtered.length !== guestbook.length) {
			await this.ctx.storage.put("guestbook", filtered);
		}
		return filtered;
	}

	private async scheduleExpiration() {
		const guestbook: GuestbookEntry[] =
			(await this.ctx.storage.get("guestbook")) ?? [];

		if (guestbook.length === 0) {
			// No entries to expire
			return;
		}

		// Find the next entry to expire by getting the earliest lastVisitDate
		const nextToExpire = guestbook.reduce((earliest, entry) => {
			const entryDate = new Date(entry.lastVisitDate).getTime();
			const earliestDate = new Date(earliest.lastVisitDate).getTime();
			return entryDate < earliestDate ? entry : earliest;
		});

		const expirationTime =
			new Date(nextToExpire.lastVisitDate).getTime() + EXPIRATION_MS;
		await this.ctx.storage.setAlarm(expirationTime);
	}

	async alarm() {
		await this.expire();
		// Schedule the next cleanup
		await this.scheduleExpiration();
	}

	private async incrementVisitors() {
		let value: number = (await this.ctx.storage.get("visitors")) ?? 0;
		value += 1;
		await this.ctx.storage.put("visitors", value);
		return value;
	}

	async visit() {
		const visitors = await this.incrementVisitors();
		return { visitors };
	}

	async sign(username: string) {
		const now = new Date().toISOString();
		const guestbook: GuestbookEntry[] =
			(await this.ctx.storage.get("guestbook")) ?? [];
		const existingEntry = guestbook.find(
			(entry) => entry.username === username,
		);

		if (existingEntry) {
			existingEntry.lastVisitDate = now;
		} else {
			guestbook.push({
				username,
				signInDate: now,
				lastVisitDate: now,
			});
		}

		await this.ctx.storage.put("guestbook", guestbook);
		await this.scheduleExpiration();
		const visitors = await this.incrementVisitors();

		const entry = existingEntry ?? guestbook[guestbook.length - 1];
		const { signInDate, ...responseEntry } = entry;

		return {
			success: true,
			entry: responseEntry,
			visitors,
		};
	}
}
