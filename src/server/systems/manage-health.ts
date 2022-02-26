import { Character } from "shared/components/character";
import { Health } from "shared/components/health";
import { GameSystem } from "types/matter-types";
import { DealDamage } from "./deal-damage";

export const ManageHealth: GameSystem = {
	system: (world) => {
		for (const [_, healthRecord, character] of world.queryChanged(Health, Character)) {
			character.humanoid.Health = healthRecord.new.value;
		}
	},
	after: [DealDamage],
};
