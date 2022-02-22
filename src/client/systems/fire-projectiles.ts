import Log from "@rbxts/log";
import { useThrottle } from "@rbxts/matter";
import { Option } from "@rbxts/rust-classes";
import { Players, UserInputService } from "@rbxts/services";
import { Character } from "shared/components/character";
import { Owner } from "shared/components/owner";
import { ProjectileFire } from "shared/components/projectile-fire";
import { Transform } from "shared/components/transform";
import { ProjectileType } from "shared/modules/projectile/projectile-type";
import { GameSystem } from "types/matter-types";

export const FireProjectiles: GameSystem = {
	system: (world) => {
		if (UserInputService.IsMouseButtonPressed(Enum.UserInputType.MouseButton1) && useThrottle(0.1)) {
			let characterPositionOption = Option.none<Vector3>();

			for (const [_, owner, transform] of world.query(Owner, Transform, Character)) {
				if (owner.value === Players.LocalPlayer) {
					characterPositionOption = Option.some(transform.cframe.Position);
					break;
				}
			}

			characterPositionOption.match(
				(value) => {
					const direction = Players.LocalPlayer.GetMouse().Hit.Position.sub(value).Unit;

					world.spawn(
						ProjectileFire({
							projectileType: ProjectileType.NORMAL,
							direction: direction,
							render: true,
						}),
						Transform({
							cframe: new CFrame(value),
						}),
						Owner({
							value: Players.LocalPlayer,
						}),
					);
				},
				() => {
					Log.Warn("Localplayer has no character yet");
				},
			);
		}
	},
};
