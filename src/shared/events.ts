import { Networking } from "@flamework/networking";
import { SerializableComponent } from "types/matter-types";
import { ProjectileFire } from "./components/projectile-fire";
import { Transform } from "./components/transform";

interface ServerEvents {
	fireGun(
		projectileFireData: SerializableComponent<ProjectileFire>,
		transformData: SerializableComponent<Transform>,
	): void;
}

interface ClientEvents {}

export const GlobalEvents = Networking.createEvent<ServerEvents, ClientEvents>();
