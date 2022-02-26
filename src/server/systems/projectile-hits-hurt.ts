import { Damage } from "server/components/damage";
import { Health } from "shared/components/health";
import { Owner } from "shared/components/owner";
import { ProjectileHit } from "shared/components/projectile-hit";
import { Transform } from "shared/components/transform";
import CharacterUtil from "shared/modules/character-util";
import { GameSystem } from "types/matter-types";

export const ProjectileHitsHurt: GameSystem = {
	priority: 10,
	system: (world) => {
		for (const [projectileHitId, projectileHit] of world.query(ProjectileHit, Owner, Transform)) {
			world.despawn(projectileHitId);

			const model = projectileHit.hitObject.FindFirstAncestorWhichIsA("Model");
			if (model === undefined) return;

			CharacterUtil.getCharacterEntityForModel(world, model).match(
				({ id: characterId }) => {
					const health = world.get(characterId, Health);
					if (health === undefined) return;

					world.spawn(
						Damage({
							value: 25,
							to: characterId,
							from: projectileHitId,
						}),
					);
				},
				() => {},
			);
		}
	},
};
