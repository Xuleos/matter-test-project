import { component } from "@rbxts/matter";

export const Owner = component<{ value: Player }>();
export type Owner = ReturnType<typeof Owner>;
