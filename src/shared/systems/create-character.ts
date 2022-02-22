import Log from "@rbxts/log";
import { useEvent } from "@rbxts/matter";
import { Players } from "@rbxts/services";
import { Character } from "shared/components/character";
import { Owner } from "shared/components/owner";
import { Renderable } from "shared/components/renderable";
import { Transform } from "shared/components/transform";
import { GameSystem } from "types/matter-types";

export const CreateCharacter: GameSystem = {
	system: (world) => {
		for (const player of Players.GetPlayers()) {
			for (const [_, character] of useEvent(player, "CharacterAdded")) {
				Log.Debug("Character added");

				world.spawn(
					Renderable({
						model: character,
					}),
					Owner({
						value: player,
					}),
					Character({}),
					Transform({
						cframe: character.GetPrimaryPartCFrame(),
					}),
				);
			}
		}
	},
};
