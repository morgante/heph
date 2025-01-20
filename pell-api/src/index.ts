import { Hono } from "hono";
export { SharedState } from "./state";

type Variables = Record<string, never>;

const app = new Hono<{ Bindings: Env; Variables: Variables }>();

app.get("/", async (c) => {
	const env = c.env;
	const id: DurableObjectId = env.DURABLE_STATE.idFromName(env.APP);
	const stub = env.DURABLE_STATE.get(id);
	const { visitors } = await stub.visit();

	return c.json({
		app: env.APP,
		visitors,
	});
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

app.get("/websocket", async (c) => {
	// Check if it's a WebSocket request
	const upgradeHeader = c.req.header("Upgrade");
	if (!upgradeHeader || upgradeHeader !== "websocket") {
		return c.json({ error: "Expected WebSocket connection" }, 400);
	}

	const env = c.env;
	const id: DurableObjectId = env.DURABLE_STATE.idFromName(env.APP);
	const stub = env.DURABLE_STATE.get(id);

	return stub.fetch(c.req.raw);
});

export default {
	fetch: app.fetch,
} satisfies ExportedHandler<Env>;
