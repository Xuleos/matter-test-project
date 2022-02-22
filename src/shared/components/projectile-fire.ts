import { component } from "@rbxts/matter";
import { ProjectileType } from "shared/modules/projectile/projectile-type";

export const ProjectileFire = component<{
	projectileType: ProjectileType;
	direction: Vector3;
	render: boolean;
}>();
export type ProjectileFire = ReturnType<typeof ProjectileFire>;
