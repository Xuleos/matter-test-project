import { TieJanitor } from "shared/components/tie-janitor";
import { GameSystem } from "types/matter-types";

export const CleanJanitors: GameSystem = {
	system: (world) => {
		for (const [_, tieJanitorRecord] of world.queryChanged(TieJanitor)) {
			if (tieJanitorRecord.new === undefined && tieJanitorRecord.old !== undefined) {
				tieJanitorRecord.old.value.Cleanup();
			}
		}
	},
};
