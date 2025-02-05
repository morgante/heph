import { DurableObject } from "cloudflare:workers";

const EXPIRATION_MS = (env: Env) => Number(env.GUESTBOOK_EXPIRATION_MS); // Expiration time in milliseconds from environment variable

export interface GuestbookEntry {
	username: string;
	signInDate: string;
	lastVisitDate: string;
	visitorId: string;
}

export class SharedState extends DurableObject<Env> {
	ctx: DurableObjectState;

	constructor(state: DurableObjectState, env: Env) {
		console.log(`Construting shared state for ${env.APP}`);
		super(state, env);
		this.ctx = state;
	}

	private async getAndExpire() {
		console.log("Expiring guestbook");

		const guestbook: GuestbookEntry[] =
			(await this.ctx.storage.get("guestbook")) ?? [];
		const now = new Date();
		const filtered = guestbook.filter((entry) => {
			const lastVisit = new Date(entry.lastVisitDate);
			const diff = now.getTime() - lastVisit.getTime();
			return diff <= EXPIRATION_MS(this.env);
		});

		if (filtered.length !== guestbook.length) {
			await this.ctx.storage.put("guestbook", filtered);
			console.log("Expired guestbook entries");
			return filtered;
		}

		console.log("No entries to expire");
		return filtered;
	}

	private async scheduleExpiration(guestbook: GuestbookEntry[]) {
		// Check if there's already an alarm scheduled
		const existingAlarm = await this.ctx.storage.getAlarm();
		if (existingAlarm) {
			console.log("Alarm already scheduled");
			return;
		}

		if (guestbook.length === 0) {
			console.log("No entries to expire");
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
			new Date(nextToExpire.lastVisitDate).getTime() +
			EXPIRATION_MS(this.env) +
			10;

		await this.ctx.storage.setAlarm(expirationTime, {});
	}

	async alarm() {
		const entries = await this.getAndExpire();
		// Schedule the next cleanup
		await this.scheduleExpiration(entries);
	}

	private async incrementVisitors() {
		let value: number = (await this.ctx.storage.get("visitors")) ?? 0;
		value += 1;
		await this.ctx.storage.put("visitors", value);
		return value;
	}

	async visit() {
		const visitors = await this.incrementVisitors();
		const guestbook = await this.getAndExpire();
		return { visitors, guestbook: guestbook.length };
	}

	async sign(username: string) {
		const now = new Date().toISOString();
		const guestbook = await this.getAndExpire();

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
				visitorId: crypto.randomUUID(),
			});
		}

		await this.ctx.storage.put("guestbook", guestbook);
		await this.scheduleExpiration(guestbook);

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
