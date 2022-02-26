import { component } from "@rbxts/matter";

export const Health = component<{
	value: number;
}>();
export type Health = ReturnType<typeof Health>;
