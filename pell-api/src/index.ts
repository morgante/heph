import { Hono } from "hono";
export { SharedState } from "./state";

type Variables = Record<string, never>;

const app = new Hono<{ Bindings: Env; Variables: Variables }>();

app.get("/", async (c) => {
	const env = c.env;
	const id: DurableObjectId = env.DURABLE_STATE.idFromName(env.APP);
	const stub = env.DURABLE_STATE.get(id);
	const { visitors } = await stub.visit();

	return c.json({ visitors, app: env.APP });
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

export default {
	fetch: app.fetch,
} satisfies ExportedHandler<Env>;
