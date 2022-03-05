import { component } from "@rbxts/matter";
import { Priority } from "types/priority-enum";

export const CameraInfluence = component<{
	priority: Priority;
	mouseBehavior?: Enum.MouseBehavior;
}>();
export type CameraInfluence = ReturnType<typeof CameraInfluence>;
