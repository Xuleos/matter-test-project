import { Renderable } from "shared/components/renderable";
import { Transform } from "shared/components/transform";
import { GameSystem } from "types/matter-types";

export const UpdateTransforms: GameSystem = {
	priority: -100,
	system: (world) => {
		for (const [_, transformRecord, { model }] of world.queryChanged(Transform, Renderable)) {
			if (transformRecord.new && !transformRecord.new.dontReconcile) {
				model.SetPrimaryPartCFrame(transformRecord.new.cframe);
			}
		}

		for (const [_, modelRecord, transform] of world.queryChanged(Renderable, Transform)) {
			if (modelRecord.new) {
				modelRecord.new.model.SetPrimaryPartCFrame(transform.cframe);
			}
		}

		for (const [id, { model }, transform] of world.query(Renderable, Transform)) {
			if (model.PrimaryPart?.Anchored) continue;

			const existingCFrame = transform.cframe;
			const currentCFrame = model.PrimaryPart!.CFrame;

			if (currentCFrame !== existingCFrame) {
				world.insert(id, Transform({ cframe: currentCFrame, dontReconcile: true }));
			}
		}
	},
};
