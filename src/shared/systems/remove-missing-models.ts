import { useEvent } from "@rbxts/matter";
import { Renderable } from "shared/components/renderable";
import { GameSystem } from "types/matter-types";

export const RemoveMissingModels: GameSystem = {
	system: (world) => {
		for (const [id, { model }] of world.query(Renderable)) {
			for (const [_] of useEvent(model, "AncestryChanged")) {
				if (model.IsDescendantOf(game) === false) {
					world.remove(id, Renderable);
					break;
				}
			}

			if (!model.PrimaryPart) {
				world.remove(id, Renderable);
			}
		}

		for (const [_, modelRecord] of world.queryChanged(Renderable)) {
			if (modelRecord.new === undefined) {
				if (modelRecord.old && modelRecord.old.model) {
					modelRecord.old.model.Destroy();
				}
			}
		}
	},
};
