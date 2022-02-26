import { component } from "@rbxts/matter";

export const ProjectileHit = component<{
	normal: Vector3;
	hitObject: Instance;
	material: Enum.Material;
}>();
export type ProjectileHit = ReturnType<typeof ProjectileHit>;
