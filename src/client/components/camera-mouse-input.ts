import { component } from "@rbxts/matter";

/**
 * helps with camera stuff mainly
 */
export const CameraMouseInput = component<{
	x: number;
	xLimit?: NumberRange;
	y: number;
	yLimit?: NumberRange;
	sensitivity: number;
}>();
export type CameraMouseInput = ReturnType<typeof CameraMouseInput>;
