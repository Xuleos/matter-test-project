import { component } from "@rbxts/matter";
import { Priority } from "types/priority-enum";

export const CameraInfluence = component<{
	priority: Priority;
}>();
export type CameraInfluence = ReturnType<typeof CameraInfluence>;
