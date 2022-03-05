import { Workspace } from "@rbxts/services";
import { FaceCamera } from "client/components/face-camera";
import { Renderable } from "shared/components/renderable";
import { Transform } from "shared/components/transform";
import { GameSystem } from "types/matter-types";

export const FaceCameraSystem: GameSystem = {
	priority: 400,
	event: "RenderStepped",
	system: (world) => {
		for (const [id, faceCamera, renderable, transform] of world.query(FaceCamera, Renderable, Transform)) {
			if (renderable.model.PrimaryPart === undefined) continue;

			if (renderable.model.PrimaryPart.Anchored === false) {
				const position = transform.cframe.Position;

				world.insert(
					id,
					Transform({
						cframe: CFrame.lookAt(
							position,
							position.add(Workspace.CurrentCamera!.CFrame.LookVector.mul(faceCamera.axis)),
						),
					}),
				);
			}
		}
	},
};
