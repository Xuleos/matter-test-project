import { UserInputService } from "@rbxts/services";
import { CameraInfluence } from "client/components/camera-influence";
import { CameraMouseInput } from "client/components/camera-mouse-input";
import { FocusCamera } from "client/components/focus-camera";
import { Transform } from "shared/components/transform";
import { GameSystem } from "types/matter-types";

export const CameraFocusSystem: GameSystem = {
	priority: 200,
	event: "RenderStepped",
	system: (world) => {
		for (const [id, cameraMouseInput, focusCamera] of world.query(
			CameraMouseInput,
			FocusCamera,
			CameraInfluence,
			Transform,
		)) {
			UserInputService.MouseBehavior = Enum.MouseBehavior.LockCenter;

			const focusTransform = world.get(focusCamera.on, Transform);

			const cameraCFrame = new CFrame(focusTransform.cframe.Position)
				.mul(CFrame.Angles(0, cameraMouseInput.x, 0))
				.mul(CFrame.Angles(cameraMouseInput.y, 0, 0))
				.mul(new CFrame(2, 1.5, 6));

			world.insert(
				id,
				Transform({
					cframe: cameraCFrame,
				}),
			);
		}
	},
};
