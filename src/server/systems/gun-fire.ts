import Log from "@rbxts/log";
import { Option } from "@rbxts/rust-classes";
import { Events } from "server/events";
import { Character } from "shared/components/character";
import { Owner } from "shared/components/owner";
import { ProjectileFire } from "shared/components/projectile-fire";
import { Transform } from "shared/components/transform";
import { useSignal } from "shared/modules/useSignal";
import { GameSystem } from "types/matter-types";

export const GunFire: GameSystem = {
	system: (world) => {
		for (const [player, projectileFireData, transformData] of useSignal(Events.fireGun, "connect")) {
			let characterPositionOption = Option.none<Vector3>();

			for (const [_, owner, transform] of world.query(Owner, Transform, Character)) {
				if (owner.value === player) {
					characterPositionOption = Option.some(transform.cframe.Position);
					break;
				}
			}

			characterPositionOption.match(
				(characterPosition) => {
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
