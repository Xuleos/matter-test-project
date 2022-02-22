import { Controller, OnInit, OnStart, Service } from "@flamework/core";
import { Caster } from "@rbxts/fastcast";
import Signal from "@rbxts/signal";
import { ProjectileMeta } from "./projectile-meta";
import { ProjectileType } from "./projectile-type";

type RBXScriptSignalValue<T> = T extends RBXScriptSignal<infer A> ? A : never;

/**
 * FastCast has some funky behavior whenever you connect to any of it's signals multiple times,
 * so we're using this to get proxy around that
 */
@Controller({})
@Service({})
export class ProjectileSignalHandler implements OnStart, OnInit {
	private projectileTypeToSignals = new Map<
		ProjectileType,
		{
			castTerminating: Signal<RBXScriptSignalValue<Caster["CastTerminating"]>>;
			rayHit: Signal<RBXScriptSignalValue<Caster["RayHit"]>>;
			lengthChanged: Signal<RBXScriptSignalValue<Caster["LengthChanged"]>>;
			rayPierced: Signal<RBXScriptSignalValue<Caster["RayPierced"]>>;
		}
	>();

	onInit() {
		for (const [projectileType, meta] of pairs(ProjectileMeta)) {
			this.projectileTypeToSignals.set(projectileType, {
				castTerminating: new Signal(),
				rayHit: new Signal(),
				lengthChanged: new Signal(),
				rayPierced: new Signal(),
			});

			meta.caster.CastTerminating.Connect((...args) => {
				this.projectileTypeToSignals.get(projectileType)!.castTerminating.Fire(...args);
			});

			meta.caster.LengthChanged.Connect((...args) => {
				this.projectileTypeToSignals.get(projectileType)!.lengthChanged.Fire(...args);
			});

			meta.caster.RayHit.Connect((...args) => {
				this.projectileTypeToSignals.get(projectileType)!.rayHit.Fire(...args);
			});

			meta.caster.RayPierced.Connect((...args) => {
				this.projectileTypeToSignals.get(projectileType)!.rayPierced.Fire(...args);
			});
		}
	}

	onStart() {}

	public getCastTerminating(projectileType: ProjectileType) {
		return this.projectileTypeToSignals.get(projectileType)!.castTerminating;
	}

	public getLengthChanged(projectileType: ProjectileType) {
		return this.projectileTypeToSignals.get(projectileType)!.lengthChanged;
	}

	public getRayHit(projectileType: ProjectileType) {
		return this.projectileTypeToSignals.get(projectileType)!.rayHit;
	}

	public getRayPierced(projectileType: ProjectileType) {
		return this.projectileTypeToSignals.get(projectileType)!.rayPierced;
	}
}
