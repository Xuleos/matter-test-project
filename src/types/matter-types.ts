import { Component, World } from "@rbxts/matter";
import { System } from "@rbxts/matter/src/lib/Loop";

export type SystemArguments = [World];

export type GameSystem = System<SystemArguments> & {
	init?: (...arg0: SystemArguments) => void;
};

/**
 * It's recommended to prefix the name of anything that's this type with "Data"
 */
export type SerializableComponent<T extends { [index: string]: unknown }> = Omit<Component<T>, "patch">;
