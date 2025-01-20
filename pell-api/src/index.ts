export { SharedState } from "./state";

export default {
	/**
	 * This is the standard fetch handler for a Cloudflare Worker
	 *
	 * @param request - The request submitted to the Worker from the client
	 * @param env - The interface to reference bindings declared in wrangler.json
	 * @param ctx - The execution context of the Worker
	 * @returns The response to be sent back to the client
	 */
	async fetch(request, env, ctx): Promise<Response> {
		const id: DurableObjectId = env.DURABLE_STATE.idFromName(env.APP);

		const stub = env.DURABLE_STATE.get(id);

		// We call the `sayHello()` RPC method on the stub to invoke the method on the remote
		// Durable Object instance
		const { visitors } = await stub.visit();

		return new Response(JSON.stringify({ visitors }));
	},
} satisfies ExportedHandler<Env>;
