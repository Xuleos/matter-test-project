import { component } from "@rbxts/matter";

export const Transform = component<{
	cframe: CFrame;
	dontReconcile?: boolean;
}>();
export type Transform = ReturnType<typeof Transform>;
