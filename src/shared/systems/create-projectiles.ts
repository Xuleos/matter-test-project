import { Dependency } from "@flamework/core";
import FastCast from "@rbxts/fastcast";
import { Janitor } from "@rbxts/janitor";
import Make from "@rbxts/make";
import { Workspace } from "@rbxts/services";
import { Owner } from "shared/components/owner";
import { Projectile } from "shared/components/projectile";
import { ProjectileFire } from "shared/components/projectile-fire";
import { ProjectileHit } from "shared/components/projectile-hit";
import { Renderable } from "shared/components/renderable";
import { TieJanitor } from "shared/components/tie-janitor";
import { Transform } from "shared/components/transform";
import { ProjectileMeta } from "shared/modules/projectile/projectile-meta";
import { ProjectileSignalHandler } from "shared/modules/projectile/projectile-signal-handler";
import { ProjectileType } from "shared/modules/projectile/projectile-type";
import { GameSystem } from "types/matter-types";

export const CreateProjectiles: GameSystem = {
	priority: -10,
	system: (world) => {
		for (const [id, projectileFire, transform, owner] of world.query(ProjectileFire, Transform, Owner)) {
			const projectileMeta = ProjectileMeta[projectileFire.projectileType];
			const caster = projectileMeta.caster;

			const behavior = FastCast.newBehavior();
			behavior.RaycastParams = new RaycastParams();
			behavior.RaycastParams.FilterDescendantsInstances = [owner.value.Character!];
			behavior.Acceleration = projectileMeta.acceleration;

			const activeCast = caster.Fire(
				transform.cframe.Position,
				projectileFire.direction,
				projectileMeta.velocity,
				behavior,
			);

			const projectileId = world.spawn(
				Projectile({
					activeCast: activeCast,
				}),
				Transform({
					cframe: new CFrame(activeCast.GetPosition()),
				}),
			);

			if (projectileFire.render === true) {
				const part = Make("Part", {
					Anchored: true,
					CanCollide: false,
					Size: projectileMeta.size,
					Material: Enum.Material.Neon,
				});

				const model = Make("Model", {
					Parent: Workspace,
				});

				part.Parent = model;
				model.PrimaryPart = part;

				world.insert(
					projectileId,
					Renderable({
						model: model,
					}),
				);
			}

			const janitor = new Janitor();

			janitor.Add(
				Dependency<ProjectileSignalHandler>()
					.getCastTerminating(ProjectileType.NORMAL)
					.Connect((cast) => {
						if (activeCast === cast) {
							world.despawn(projectileId);
						}
					}),
			);

			janitor.Add(
				Dependency<ProjectileSignalHandler>()
					.getRayHit(ProjectileType.NORMAL)
					.Connect((cast, result) => {
						if (activeCast === cast) {
							world.spawn(
								Transform({
									cframe: CFrame.lookAt(result.Position, result.Position.add(result.Normal)),
								}),
								ProjectileHit({
									normal: result.Normal,
									hitObject: result.Instance,
									material: result.Material,
								}),
								Owner({
									value: owner.value,
								}),
							);
						}
					}),
			);

			world.insert(
				projectileId,
				TieJanitor({
					value: janitor,
				}),
			);

			// consume the projectile fire action
			world.despawn(id);
		}
	},
};
