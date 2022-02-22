import { ActiveCast } from "@rbxts/fastcast";
import { component } from "@rbxts/matter";

export const Projectile = component<{
	activeCast: ActiveCast;
}>();
export type Projectile = ReturnType<typeof Projectile>;
