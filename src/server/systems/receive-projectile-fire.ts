import Log from "@rbxts/log";
import { Events } from "server/events";
import { Owner } from "shared/components/owner";
import { ProjectileFire } from "shared/components/projectile-fire";
import { Transform } from "shared/components/transform";
import CharacterUtil from "shared/modules/character-util";
import { useSignal } from "shared/modules/useSignal";
import { GameSystem } from "types/matter-types";

export const ReceiveProjectileFire: GameSystem = {
	system: (world) => {
		for (const [player, projectileFireData, transformData] of useSignal(Events.fireGun, "connect")) {
			CharacterUtil.getCharacterEntityForPlayer(world, player).match(
				({ id }) => {
					const transform = world.get(id, Transform);
					if (transform === undefined) return;

					const characterPosition = transform.cframe.Position;
					if (characterPosition.sub(transformData.cframe.Position).Magnitude > 6) {
						Log.Warn("Projectile position was too far from character");
						return;
					}

					world.spawn(
						ProjectileFire({ ...projectileFireData, render: false }),
						Transform(transformData),
						Owner({
							value: player,
						}),
					);
				},
				() => {
					Log.Warn("Expected player firing gunFire to have a character");
				},
			);
		}
	},
};
