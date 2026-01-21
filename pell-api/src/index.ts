import { Hono } from "hono";
import type { Context } from "hono";
export { SharedState } from "./state";

type Variables = Record<string, never>;

const app = new Hono<{ Bindings: Env; Variables: Variables }>();
const MAX_USERNAME_LENGTH = 64;
const MAX_MESSAGE_LENGTH = 500;

type MessagePayload = { username?: string; message?: string };
type MessagePayloadResult =
	| { username: string; message: string }
	| { response: Response };

const readMessagePayload = async (
	c: Context,
): Promise<MessagePayloadResult> => {
	let payload: MessagePayload | undefined;
	try {
		payload = await c.req.json<MessagePayload>();
	} catch (error) {
		return { response: c.json({ error: "Invalid JSON body" }, 400) };
	}

	const username =
		typeof payload?.username === "string" ? payload.username.trim() : "";
	const message =
		typeof payload?.message === "string" ? payload.message.trim() : "";

	if (!username) {
		return { response: c.json({ error: "Username is required" }, 400) };
	}
	if (username.length > MAX_USERNAME_LENGTH) {
		return { response: c.json({ error: "Username is too long" }, 400) };
	}
	if (!message) {
		return { response: c.json({ error: "Message is required" }, 400) };
	}
	if (message.length > MAX_MESSAGE_LENGTH) {
		return { response: c.json({ error: "Message is too long" }, 400) };
	}

	return { username, message };
};

app.get("/", async (c) => {
	const env = c.env;
	const id: DurableObjectId = env.DURABLE_STATE.idFromName(env.APP);
	const stub = env.DURABLE_STATE.get(id);
	const { visitors, guestbook } = await stub.visit();

	return c.json({ visitors, app: env.APP, guestbook });
});

app.post("/sign", async (c) => {
	const username = c.req.query("username");
	if (!username) {
		return c.json({ error: "Username is required" }, 400);
	}

	const env = c.env;
	const id: DurableObjectId = env.DURABLE_STATE.idFromName(env.APP);
	const stub = env.DURABLE_STATE.get(id);
	const result = await stub.sign(username);

	return c.json(result);
});

app.get("/messages", async (c) => {
	const env = c.env;
	const id: DurableObjectId = env.DURABLE_STATE.idFromName(env.APP);
	const stub = env.DURABLE_STATE.get(id);
	const messages = await stub.listMessages();

	return c.json(messages);
});

app.post("/messages", async (c) => {
	const payloadResult = await readMessagePayload(c);
	if ("response" in payloadResult) {
		return payloadResult.response;
	}

	const env = c.env;
	const id: DurableObjectId = env.DURABLE_STATE.idFromName(env.APP);
	const stub = env.DURABLE_STATE.get(id);
	const result = await stub.addMessage(
		payloadResult.username,
		payloadResult.message,
	);

	return c.json(result);
});

app.post("/messages/:id/replies", async (c) => {
	const payloadResult = await readMessagePayload(c);
	if ("response" in payloadResult) {
		return payloadResult.response;
	}

	const messageId = c.req.param("id");
	if (!messageId) {
		return c.json({ error: "Message ID is required" }, 400);
	}

	const env = c.env;
	const id: DurableObjectId = env.DURABLE_STATE.idFromName(env.APP);
	const stub = env.DURABLE_STATE.get(id);
	const result = await stub.addReply(
		messageId,
		payloadResult.username,
		payloadResult.message,
	);

	if (!result.success) {
		return c.json({ error: result.error }, 404);
	}

	return c.json(result);
});

export default {
	fetch: app.fetch,
} satisfies ExportedHandler<Env>;
