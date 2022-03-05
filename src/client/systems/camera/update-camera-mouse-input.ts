import { UserInputService } from "@rbxts/services";
import { CameraMouseInput } from "client/components/camera-mouse-input";
import { GameSystem } from "types/matter-types";

export const UpdateCameraMouseInput: GameSystem = {
	priority: -100,
	event: "RenderStepped",
	system: (world) => {
		const delta = UserInputService.GetMouseDelta();

		for (const [id, cameraMouseInput] of world.query(CameraMouseInput)) {
			const x = cameraMouseInput.x - delta.X * cameraMouseInput.sensitivity;
			const y = cameraMouseInput.y - delta.Y * cameraMouseInput.sensitivity;

			world.insert(
				id,
				cameraMouseInput.patch({
					x: cameraMouseInput.xLimit
						? math.clamp(x, cameraMouseInput.xLimit.Min, cameraMouseInput.xLimit.Max)
						: x,
					y: cameraMouseInput.yLimit
						? math.clamp(y, cameraMouseInput.yLimit.Min, cameraMouseInput.yLimit.Max)
						: y,
				}),
			);
		}
	},
};
