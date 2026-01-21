import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { unstable_dev } from "wrangler";
import type { Unstable_DevWorker } from "wrangler";

interface VisitorResponse {
	visitors: number;
	app: string;
}

interface GuestbookResponse {
	success: boolean;
	entry: {
		username: string;
		lastVisitDate: string;
		visitorId: string;
	};
	visitors: number;
}

interface MessageEntry {
	id: string;
	username: string;
	message: string;
	createdAt: string;
	replies: ReplyEntry[];
}

interface ReplyEntry {
	id: string;
	username: string;
	message: string;
	createdAt: string;
}

interface MessageResponse {
	success: boolean;
	message: MessageEntry;
	total: number;
}

interface MessageListResponse {
	messages: MessageEntry[];
	total: number;
}

interface ReplyResponse {
	success: boolean;
	messageId: string;
	reply: ReplyEntry;
	totalReplies: number;
}

describe("Guestbook API", () => {
	let worker: Unstable_DevWorker;

	beforeAll(async () => {
		worker = await unstable_dev("src/index.ts", {
			experimental: { disableExperimentalWarning: true },
			env: "test",
		});
	});

	afterAll(async () => {
		await worker.stop();
	});

	it("should increment visitors on root endpoint", async () => {
		const resp = await worker.fetch("/");
		expect(resp.status).toBe(200);
		const data = (await resp.json()) as VisitorResponse;
		expect(data).toHaveProperty("visitors");
		expect(typeof data.visitors).toBe("number");
		expect(data.app).toContain("test");
	});

	it("should require username for sign endpoint", async () => {
		const resp = await worker.fetch("/sign", {
			method: "POST",
		});
		expect(resp.status).toBe(400);
		const data = (await resp.json()) as { error: string };
		expect(data).toEqual({ error: "Username is required" });
	});

	it("should create new guestbook entry", async () => {
		const username = "test_user_new";
		const resp = await worker.fetch(`/sign?username=${username}`, {
			method: "POST",
		});
		expect(resp.status).toBe(200);
		const data = (await resp.json()) as GuestbookResponse;
		expect(data).toHaveProperty("success", true);
		expect(data).toHaveProperty("visitors");
		expect(data.entry).toEqual({
			username,
			lastVisitDate: expect.any(String),
			visitorId: expect.any(String),
		});
		// Ensure signInDate is not included in response
		expect(data.entry).not.toHaveProperty("signInDate");
	});

	it("should update lastVisitDate for existing user", async () => {
		const username = "test_user_update";
		const resp1 = await worker.fetch(`/sign?username=${username}`, {
			method: "POST",
		});
		const data1 = (await resp1.json()) as GuestbookResponse;

		// Wait a bit to ensure different timestamps
		await new Promise((resolve) => setTimeout(resolve, 10));

		const resp2 = await worker.fetch(`/sign?username=${username}`, {
			method: "POST",
		});
		const data2 = (await resp2.json()) as GuestbookResponse;

		expect(resp2.status).toBe(200);
		expect(data2.entry.username).toBe(username);
		expect(data2.entry.lastVisitDate).not.toBe(data1.entry.lastVisitDate);
		expect(data2.entry.visitorId).toBe(data1.entry.visitorId); // Visitor ID should remain stable
		expect(data2.visitors).toBeGreaterThan(data1.visitors);
	});

	it("should expire guestbook after expiration time", async () => {
		const username = "test_user_expire";
		const resp = await worker.fetch(`/sign?username=${username}`, {
			method: "POST",
		});
		expect(resp.status).toBe(200);
		const data = (await resp.json()) as GuestbookResponse;
		expect(data).toHaveProperty("success", true);
		expect(data).toHaveProperty("visitors");
		expect(data.entry).toEqual({
			username,
			lastVisitDate: expect.any(String),
			visitorId: expect.any(String),
		});

		await new Promise((resolve) => setTimeout(resolve, 200));

		const resp2 = await worker.fetch(`/sign?username=${username}`, {
			method: "POST",
		});
		expect(resp2.status).toBe(200);
		const data2 = (await resp2.json()) as GuestbookResponse;
		expect(data2.entry.visitorId).not.toBe(data.entry.visitorId); // Should get new visitor ID after expiration
	});

	it("should require username for messages endpoint", async () => {
		const resp = await worker.fetch("/messages", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ message: "Hello there" }),
		});

		expect(resp.status).toBe(400);
		const data = (await resp.json()) as { error: string };
		expect(data).toEqual({ error: "Username is required" });
	});

	it("should require message for messages endpoint", async () => {
		const resp = await worker.fetch("/messages", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ username: "message_user" }),
		});

		expect(resp.status).toBe(400);
		const data = (await resp.json()) as { error: string };
		expect(data).toEqual({ error: "Message is required" });
	});

	it("should create and list messages", async () => {
		const username = "message_author";
		const message = "Hello from the guestbook";

		const createResp = await worker.fetch("/messages", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ username, message }),
		});

		expect(createResp.status).toBe(200);
		const created = (await createResp.json()) as MessageResponse;
		expect(created).toHaveProperty("success", true);
		expect(created).toHaveProperty("total");
		expect(created.message).toEqual({
			id: expect.any(String),
			username,
			message,
			createdAt: expect.any(String),
			replies: [],
		});

		const listResp = await worker.fetch("/messages");
		expect(listResp.status).toBe(200);
		const listData = (await listResp.json()) as MessageListResponse;
		expect(listData).toHaveProperty("total");
		expect(Array.isArray(listData.messages)).toBe(true);
		expect(
			listData.messages.some((entry) => entry.id === created.message.id),
		).toBe(true);
		expect(
			listData.messages.every((entry) => Array.isArray(entry.replies)),
		).toBe(true);
	});

	it("should add replies to messages", async () => {
		const createResp = await worker.fetch("/messages", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				username: "original_author",
				message: "Original message",
			}),
		});
		expect(createResp.status).toBe(200);
		const created = (await createResp.json()) as MessageResponse;

		const replyPayload = {
			username: "reply_author",
			message: "Replying to the original",
		};
		const replyResp = await worker.fetch(
			`/messages/${created.message.id}/replies`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(replyPayload),
			},
		);

		expect(replyResp.status).toBe(200);
		const replyData = (await replyResp.json()) as ReplyResponse;
		expect(replyData).toEqual({
			success: true,
			messageId: created.message.id,
			totalReplies: 1,
			reply: {
				id: expect.any(String),
				username: replyPayload.username,
				message: replyPayload.message,
				createdAt: expect.any(String),
			},
		});

		const listResp = await worker.fetch("/messages");
		const listData = (await listResp.json()) as MessageListResponse;
		const target = listData.messages.find(
			(entry) => entry.id === created.message.id,
		);
		expect(target).toBeTruthy();
		expect(target?.replies.some((reply) => reply.id === replyData.reply.id)).toBe(
			true,
		);
	});

	it("should return 404 when replying to missing message", async () => {
		const resp = await worker.fetch("/messages/missing/replies", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				username: "missing_reply",
				message: "Replying to nothing",
			}),
		});

		expect(resp.status).toBe(404);
		const data = (await resp.json()) as { error: string };
		expect(data).toEqual({ error: "Message not found" });
	});
});
