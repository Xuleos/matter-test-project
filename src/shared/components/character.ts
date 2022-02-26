import { component } from "@rbxts/matter";

export const Character = component<{
	humanoid: Humanoid;
}>();
export type Character = ReturnType<typeof Character>;
