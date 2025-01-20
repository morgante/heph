import { Hono } from "hono";
export { SharedState } from "./state";

type Variables = Record<string, never>;

const app = new Hono<{ Bindings: Env; Variables: Variables }>();

app.get("/", async (c) => {
	const env = c.env;
	const id: DurableObjectId = env.DURABLE_STATE.idFromName(env.APP);
	const stub = env.DURABLE_STATE.get(id);
	const { visitors } = await stub.visit();

	return c.json({ visitors });
});

export default {
	fetch: app.fetch,
} satisfies ExportedHandler<Env>;
