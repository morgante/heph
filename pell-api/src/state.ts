import { DurableObject } from "cloudflare:workers";

interface GuestbookEntry {
	username: string;
	signInDate: string;
	lastVisitDate: string;
}

type GuestbookResponse = Omit<GuestbookEntry, "signInDate">;

export class SharedState extends DurableObject<Env> {
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
