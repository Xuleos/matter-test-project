import { Queue } from "@rbxts/datastructures";
import { useHookState } from "@rbxts/matter";

type UseSignalStorage<T> = {
	queue?: Queue<T>;
	connection?: RBXScriptConnection;
};

type GetCallback<T extends object, S extends keyof T> = T[S] extends (cb: infer A) => void
	? A extends Callback
		? A
		: never
	: never;

export function useSignal<T extends object, S extends keyof T, E extends GetCallback<T, S>>(
	obj: T,
	callbackKey: S,
): IterableFunction<LuaTuple<Parameters<E>>> {
	const callback = obj[callbackKey] as unknown as (
		obj: T,
		cb: (...args: Parameters<E>) => void,
	) => RBXScriptConnection;

	const storage = useHookState<UseSignalStorage<Parameters<E>>>(tostring(callback), (storage) => {
		storage.connection?.Disconnect();

		table.clear(storage);

		return true;
	});

	if (storage.queue === undefined) {
		storage.queue = new Queue<Parameters<E>>();

		storage.connection = callback(obj, (...args: Parameters<E>) => {
			storage.queue!.Push(args);
		});
	}

	return (() => {
		if (storage.queue) {
			const value = storage.queue.Pop();

			if (value !== undefined) {
				return value as LuaTuple<Parameters<E>>;
			} else {
				return undefined;
			}
		}
	}) as IterableFunction<LuaTuple<Parameters<E>>>;
}
