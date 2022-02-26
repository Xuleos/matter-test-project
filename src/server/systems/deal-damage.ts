import { Damage } from "server/components/damage";
import { Health } from "shared/components/health";
import { GameSystem } from "types/matter-types";

export const DealDamage: GameSystem = {
	system: (world) => {
		for (const [damageId, damage] of world.query(Damage)) {
			// consume
			world.despawn(damageId);

			const health = world.get(damage.to, Health);
			if (health === undefined) continue;

			world.insert(
				damage.to,
				Health({
					value: health.value - damage.value,
				}),
			);
		}
	},
};
