import { AnyEntity } from "@rbxts/matter";
import { Workspace } from "@rbxts/services";
import { CameraInfluence } from "client/components/camera-influence";
import { Transform } from "shared/components/transform";
import { GameSystem } from "types/matter-types";
import { Priority } from "types/priority-enum";

export const UpdateCamera: GameSystem = {
	priority: 300,
	event: "RenderStepped",
	system: (world) => {
		let highestPriority:
			| {
					id: AnyEntity;
					priority: Priority;
					transform: Transform;
			  }
			| undefined;

		for (const [id, cameraInfluence, transform] of world.query(CameraInfluence, Transform)) {
			if (highestPriority === undefined || cameraInfluence.priority > highestPriority.priority) {
				highestPriority = {
					id: id,
					priority: cameraInfluence.priority,
					transform: transform,
				};
			}
		}

		if (highestPriority && Workspace.CurrentCamera) {
			Workspace.CurrentCamera.CFrame = highestPriority.transform.cframe;
		}
	},
};
