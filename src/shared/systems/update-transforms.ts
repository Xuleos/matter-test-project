import { RunService } from "@rbxts/services";
import { Renderable } from "shared/components/renderable";
import { Transform } from "shared/components/transform";
import { GameSystem } from "types/matter-types";

export const CollectTransforms: GameSystem = {
	priority: -1000,
	event: RunService.IsClient() ? "RenderStepped" : "default",
	system: (world) => {
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

export const UpdateTransforms: GameSystem = {
	priority: 1000,
	event: RunService.IsClient() ? "RenderStepped" : "default",
	system: (world) => {
		for (const [id, transformRecord, { model }] of world.queryChanged(Transform, Renderable)) {
			if (transformRecord.new && !transformRecord.new.dontReconcile) {
				model.SetPrimaryPartCFrame(transformRecord.new.cframe);
			}
		}

		for (const [_, modelRecord, transform] of world.queryChanged(Renderable, Transform)) {
			if (modelRecord.new) {
				modelRecord.new.model.SetPrimaryPartCFrame(transform.cframe);
			}
		}
	},
};
