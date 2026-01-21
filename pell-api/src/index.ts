import { Hono } from "hono";
export { SharedState } from "./state";

type Variables = Record<string, never>;

const app = new Hono<{ Bindings: Env; Variables: Variables }>();
const MAX_USERNAME_LENGTH = 64;
const MAX_MESSAGE_LENGTH = 500;

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
	let payload: { username?: string; message?: string } | undefined;
	try {
		payload = await c.req.json();
	} catch (error) {
		return c.json({ error: "Invalid JSON body" }, 400);
	}

	const username =
		typeof payload?.username === "string" ? payload.username.trim() : "";
	const message =
		typeof payload?.message === "string" ? payload.message.trim() : "";

	if (!username) {
		return c.json({ error: "Username is required" }, 400);
	}
	if (username.length > MAX_USERNAME_LENGTH) {
		return c.json({ error: "Username is too long" }, 400);
	}
	if (!message) {
		return c.json({ error: "Message is required" }, 400);
	}
	if (message.length > MAX_MESSAGE_LENGTH) {
		return c.json({ error: "Message is too long" }, 400);
	}

	const env = c.env;
	const id: DurableObjectId = env.DURABLE_STATE.idFromName(env.APP);
	const stub = env.DURABLE_STATE.get(id);
	const result = await stub.addMessage(username, message);

	return c.json(result);
});

export default {
	fetch: app.fetch,
} satisfies ExportedHandler<Env>;
