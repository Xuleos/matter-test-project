import Log from "@rbxts/log";
import { Entity } from "@rbxts/matter";
import { Players } from "@rbxts/services";
import { CameraInfluence } from "client/components/camera-influence";
import { CameraMouseInput } from "client/components/camera-mouse-input";
import { FaceCamera } from "client/components/face-camera";
import { FocusCamera } from "client/components/focus-camera";
import { Character } from "shared/components/character";
import { Owner } from "shared/components/owner";
import { Renderable } from "shared/components/renderable";
import { Transform } from "shared/components/transform";
import { GameSystem } from "types/matter-types";
import { Priority } from "types/priority-enum";

export const SpawnCamera: GameSystem = {
	system: (world) => {
		for (const [id, characterRecord, owner, renderable] of world.queryChanged(
			Character,
			Owner,
			Renderable,
			Transform,
		)) {
			if (
				characterRecord.old === undefined &&
				characterRecord.new !== undefined &&
				owner.value === Players.LocalPlayer
			) {
				world.spawn(
					CameraInfluence({
						priority: Priority.MEDIUM,
						mouseBehavior: Enum.MouseBehavior.LockCenter,
					}),
					CameraMouseInput({
						x: 0,
						y: 0,
						sensitivity: 1 / 250,
					}),
					FocusCamera({
						on: id as unknown as Entity<[Transform]>,
					}),
					Transform({
						cframe: new CFrame(),
					}),
				);

				if (renderable.model.PrimaryPart) {
					Log.Debug("Inserted LookAtCamera");

					world.insert(
						id,
						FaceCamera({
							axis: new Vector3(1, 0, 1),
						}),
					);
				}
			}
		}
	},
};
