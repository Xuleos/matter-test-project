import { Component, World } from "@rbxts/matter";
import { System } from "@rbxts/matter/src/lib/Loop";

export type SystemArguments = [World];

export type GameSystem = System<SystemArguments> & {
	init?: (...arg0: SystemArguments) => void;
};

export type SerializableComponent<T extends { [index: string]: unknown }> = Omit<Component<T>, "patch">;
