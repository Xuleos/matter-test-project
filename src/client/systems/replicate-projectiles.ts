import { Players } from "@rbxts/services";
import { Events } from "client/events";
import { Owner } from "shared/components/owner";
import { ProjectileFire } from "shared/components/projectile-fire";
import { Transform } from "shared/components/transform";
import { GameSystem } from "types/matter-types";

export const ReplicateProjectiles: GameSystem = {
	system: (world) => {
		for (const [_, fireProjectile, transform, owner] of world.query(ProjectileFire, Transform, Owner)) {
			if (owner.value === Players.LocalPlayer) {
				Events.fireGun.fire(fireProjectile, transform);
			}
		}
	},
	priority: 1,
};
