import Log from "@rbxts/log";
import { Projectile } from "shared/components/projectile";
import { Transform } from "shared/components/transform";
import { ProjectileMeta } from "shared/modules/projectile/projectile-meta";
import { GameSystem } from "types/matter-types";
import { CreateProjectiles } from "./create-projectiles";

export const UpdateProjectiles: GameSystem = {
	system: (world) => {
		for (const [id, projectile] of world.query(Projectile, Transform)) {
			if (projectile.activeCast.GetPosition === undefined) {
				Log.Warn("Projectile already terminated");
				continue;
			}

			const position = projectile.activeCast.GetPosition();
			const velocity = projectile.activeCast.GetVelocity();

			world.insert(
				id,
				Transform({
					cframe: CFrame.lookAt(position, position.add(velocity.Unit)).mul(
						new CFrame(0, 0, ProjectileMeta.normal.size.Z / -2),
					),
				}),
			);
		}
	},
	after: [CreateProjectiles],
};
