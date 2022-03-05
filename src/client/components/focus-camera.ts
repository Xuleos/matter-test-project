import { component, Entity } from "@rbxts/matter";
import { Transform } from "shared/components/transform";

export const FocusCamera = component<{
	on: Entity<[Transform]>;
}>();
export type FocusCamera = ReturnType<typeof FocusCamera>;
