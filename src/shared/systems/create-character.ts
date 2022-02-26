import { Players } from "@rbxts/services";
import { Character } from "shared/components/character";
import { Health } from "shared/components/health";
import { Owner } from "shared/components/owner";
import { Renderable } from "shared/components/renderable";
import { Transform } from "shared/components/transform";
import CharacterUtil from "shared/modules/character-util";
import { GameSystem } from "types/matter-types";

export const CreateCharacter: GameSystem = {
	system: (world) => {
		for (const player of Players.GetPlayers()) {
			if (player.Character === undefined) continue;

			const characterOption = CharacterUtil.getCharacterEntityForPlayer(world, player);

			characterOption.match(
				({ id }) => {
					const renderable = world.get(id, Renderable);
					if (renderable === undefined || renderable.model !== player.Character) {
						world.despawn(id);
					}
				},
				() => {
					const humanoid = player.Character!.FindFirstChildWhichIsA("Humanoid");

					if (humanoid) {
						world.spawn(
							Renderable({
								model: player.Character!,
							}),
							Owner({
								value: player,
							}),
							Character({
								humanoid: humanoid,
							}),
							Transform({
								cframe: player.Character!.GetPrimaryPartCFrame(),
							}),
							Health({
								value: 100,
							}),
						);
					}
				},
			);
		}
	},
};
