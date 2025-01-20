import { DurableObject } from "cloudflare:workers";

const EXPIRATION_MS = (env: Env) => Number(env.GUESTBOOK_EXPIRATION_MS); // Expiration time in milliseconds from environment variable

interface Session {
	webSocket: WebSocket;
	username: string;
}

interface WebSocketMessage {
	type: "user_joined" | "user_expired";
	username: string;
}

export interface GuestbookEntry {
	username: string;
	signInDate: string;
	lastVisitDate: string;
	visitorId: string;
}

export class SharedState extends DurableObject<Env> {
	ctx: DurableObjectState;
	sessions: Map<WebSocket, Session>;

	constructor(state: DurableObjectState, env: Env) {
		console.log(`Construting shared state for ${env.APP}`);
		super(state, env);
		this.ctx = state;
		this.sessions = new Map();

		// Restore any existing WebSocket sessions
		for (const webSocket of this.ctx.getWebSockets()) {
			const meta = webSocket.deserializeAttachment();
			if (meta?.username) {
				this.sessions.set(webSocket, { webSocket, username: meta.username });
			}
		}
	}

	private broadcast(message: WebSocketMessage) {
		const messageStr = JSON.stringify(message);

		for (const [webSocket, session] of this.sessions) {
			try {
				webSocket.send(messageStr);
			} catch (err) {
				session.quit = true;
				this.sessions.delete(webSocket);
			}
		}
	}

	private async closeOrErrorHandler(webSocket: WebSocket) {
		const session = this.sessions.get(webSocket);
		if (!session) return;

		this.sessions.delete(webSocket);
	}

	async webSocketClose(webSocket: WebSocket) {
		await this.closeOrErrorHandler(webSocket);
	}

	async webSocketError(webSocket: WebSocket) {
		await this.closeOrErrorHandler(webSocket);
	}

	async webSocketMessage(ws: WebSocket, message: string) {
		console.log("Received message:", message);
	}

	private async expire() {
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

			// Notify all clients about expired users
			const expiredUsers = guestbook.filter(
				(entry) => !filtered.find((f) => f.username === entry.username),
			);
			console.log(`Expired guestbook entries: ${expiredUsers.length}`);

			for (const expiredUser of expiredUsers) {
				this.broadcast({
					type: "user_left",
					username: expiredUser.username,
				});
			}
			return filtered;
		}

		console.log("No entries to expire");
		return filtered;
	}

	private async scheduleExpiration() {
		// Check if there's already an alarm scheduled
		const existingAlarm = await this.ctx.storage.getAlarm();
		if (existingAlarm) {
			console.log("Alarm already scheduled");
			return;
		}

		const guestbook: GuestbookEntry[] =
			(await this.ctx.storage.get("guestbook")) ?? [];

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
			100;
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
				visitorId: crypto.randomUUID(),
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
