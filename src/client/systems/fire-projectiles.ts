import Log from "@rbxts/log";
import { useThrottle } from "@rbxts/matter";
import { Players, UserInputService } from "@rbxts/services";
import { Owner } from "shared/components/owner";
import { ProjectileFire } from "shared/components/projectile-fire";
import { Transform } from "shared/components/transform";
import CharacterUtil from "shared/modules/character-util";
import { ProjectileType } from "shared/modules/projectile/projectile-type";
import { GameSystem } from "types/matter-types";

export const FireProjectiles: GameSystem = {
	system: (world) => {
		if (UserInputService.IsMouseButtonPressed(Enum.UserInputType.MouseButton1) && useThrottle(0.1)) {
			CharacterUtil.getCharacterEntityForPlayer(world, Players.LocalPlayer).match(
				({ id }) => {
					const transform = world.get(id, Transform);
					if (transform === undefined) return;

					const direction = Players.LocalPlayer.GetMouse().Hit.Position.sub(transform.cframe.Position).Unit;

					world.spawn(
						ProjectileFire({
							projectileType: ProjectileType.NORMAL,
							direction: direction,
							render: true,
						}),
						Transform({
							cframe: transform.cframe,
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
