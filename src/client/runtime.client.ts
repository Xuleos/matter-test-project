import { Flamework } from "@flamework/core";
import Log, { Logger } from "@rbxts/log";
import { Loop, World } from "@rbxts/matter";
import { RunService } from "@rbxts/services";
import { t } from "@rbxts/t";
import { $instance } from "rbxts-transformer-fs";
import { GameSystem } from "types/matter-types";

// eslint-disable-next-line prettier/prettier
Log.SetLogger(
	Logger.configure()
		.WriteTo(Log.RobloxOutput())
		.Create(),
);

const systems: Array<GameSystem> = [];

const loadSystems = (folder: Folder) => {
	for (const module of folder.GetDescendants()) {
		if (module.IsA("ModuleScript")) {
			const moduleContents = require(module);

			if (
				t.values(
					t.interface({
						system: t.callback,
						event: t.optional(
							t.union(
								t.literal("RenderStepped"),
								t.literal("Heartbeat"),
								t.literal("Stepped"),
								t.literal("default"),
							),
						),
						priority: t.optional(t.number),
						after: t.optional(t.array(t.table)),
					}),
				)(moduleContents)
			) {
				for (const [key, system] of moduleContents) {
					systems.push(system as GameSystem);
				}
			} else {
				Log.Warn("{name} is not a valid system. system: {system}", module, moduleContents);
			}
		}
	}
};

const sharedSystemsFolder = $instance<Folder>("src/shared/systems");
loadSystems(sharedSystemsFolder);

const serverSystemsFolder = $instance<Folder>("src/client/systems");
loadSystems(serverSystemsFolder);

const world = new World();

const loop = new Loop(world, {});
loop.scheduleSystems(systems);
loop.begin({
	default: RunService.Heartbeat,
	RenderStepped: RunService.RenderStepped,
});

for (const system of systems) {
	if (system.init) {
		system.init(world);
	}
}

Flamework.addPaths("src/client/controllers");
Flamework.addPaths("src/shared/modules/projectile/projectile-signal-handler");

Flamework.ignite();
