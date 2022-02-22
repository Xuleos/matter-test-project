import { Janitor } from "@rbxts/janitor";
import { component } from "@rbxts/matter";

export const TieJanitor = component<{ value: Janitor }>();
export type TieJanitor = ReturnType<typeof TieJanitor>;
