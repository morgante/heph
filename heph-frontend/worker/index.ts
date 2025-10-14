export default {
	fetch(_request: Request) {
		return new Response(null, { status: 404 });
	},
} satisfies ExportedHandler<Env>;
