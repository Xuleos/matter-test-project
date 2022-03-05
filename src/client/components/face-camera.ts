import { component } from "@rbxts/matter";

export const FaceCamera = component<{
	axis: Vector3;
}>();
export type FaceCamera = ReturnType<typeof FaceCamera>;
