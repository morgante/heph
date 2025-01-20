import { DurableObject } from "cloudflare:workers";

export class SharedState extends DurableObject<Env> {
	async visit() {
		let value: number = (await this.ctx.storage.get("visitors")) ?? 0;
		value += 1;
		await this.ctx.storage.put("visitors", value);
		return { visitors: value };
	}
}
