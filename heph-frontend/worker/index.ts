export default {
	fetch(request) {
		const url = new URL(request.url);

		return new Response(null, { status: 404 });
	},
} satisfies ExportedHandler<Env>;
