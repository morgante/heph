import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { unstable_dev } from "wrangler";
import type { Unstable_DevWorker } from "wrangler";

interface VisitorResponse {
	visitors: number;
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

		await new Promise((resolve) => setTimeout(resolve, 300));

		const resp2 = await worker.fetch(`/sign?username=${username}`, {
			method: "POST",
		});
		expect(resp2.status).toBe(200);
		const data2 = (await resp2.json()) as GuestbookResponse;
		expect(data2.entry.visitorId).not.toBe(data.entry.visitorId); // Should get new visitor ID after expiration
	});
});
