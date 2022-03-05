import FastCast, { Caster } from "@rbxts/fastcast";
import { Workspace } from "@rbxts/services";
import { ProjectileType } from "./projectile-type";

export const ProjectileMeta: {
	[key in ProjectileType]: {
		caster: Caster;
		velocity: number;
		acceleration: Vector3;
		size: Vector3;
	};
} = {
	[ProjectileType.NORMAL]: {
		caster: new FastCast(),
		velocity: 800,
		acceleration: new Vector3(0, -Workspace.Gravity / 6, 0),
		size: new Vector3(1, 1, 15),
	},
};
