import { AnyEntity, World } from "@rbxts/matter";
import { Option } from "@rbxts/rust-classes";
import { Character } from "shared/components/character";
import { Owner } from "shared/components/owner";
import { Renderable } from "shared/components/renderable";

namespace CharacterUtil {
	export function getCharacterEntityForPlayer(world: World, player: Player) {
		let characterOption = Option.none<{
			id: AnyEntity;
			character: Character;
		}>();

		for (const [id, owner, character] of world.query(Owner, Character)) {
			if (owner.value === player) {
				characterOption = Option.some({
					id: id,
					character: character,
				});
				break;
			}
		}

		return characterOption;
	}

	export function getCharacterEntityForModel(world: World, characterModel: Model) {
		let characterOption = Option.none<{
			id: AnyEntity;
			character: Character;
		}>();

		for (const [id, renderable, character] of world.query(Renderable, Character)) {
			if (renderable.model === characterModel) {
				characterOption = Option.some({
					id: id,
					character: character,
				});
				break;
			}
		}

		return characterOption;
	}
}

export = CharacterUtil;
