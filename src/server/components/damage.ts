import { AnyEntity, component } from "@rbxts/matter";

export const Damage = component<{
	value: number;
	to: AnyEntity;
	from?: AnyEntity;
}>();
export type Damage = ReturnType<typeof Damage>;
