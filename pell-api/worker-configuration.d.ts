// Generated by Wrangler by running `wrangler types`

interface Env {
	APP: "pell";
	GUESTBOOK_EXPIRATION_MS: 1000;
	DURABLE_STATE: DurableObjectNamespace<import("./src/index").SharedState>;
}
