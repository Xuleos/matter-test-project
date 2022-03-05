import { AnyEntity, useThrottle } from "@rbxts/matter";
import { RunService } from "@rbxts/services";
import { Renderable } from "shared/components/renderable";
import { Transform } from "shared/components/transform";
import { GameSystem } from "types/matter-types";

export const UpdateTransforms: GameSystem = {
	priority: 100,
	event: RunService.IsClient() ? "RenderStepped" : "default",
	system: (world) => {
		const list: Array<{
			id: AnyEntity;
			modelName: string;
			reconcile: boolean;
			position: Vector3;
		}> = [];

		for (const [id, transformRecord, { model }] of world.queryChanged(Transform, Renderable)) {
			list.push({
				id: id,
				modelName: model.Name,
				reconcile: transformRecord.new ? !transformRecord.new.dontReconcile : false,
				position: transformRecord.new ? transformRecord.new.cframe.Position : new Vector3(),
			});

			if (transformRecord.new && !transformRecord.new.dontReconcile) {
				model.SetPrimaryPartCFrame(transformRecord.new.cframe);
			}
		}

		if (useThrottle(5)) {
			print(list);
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
