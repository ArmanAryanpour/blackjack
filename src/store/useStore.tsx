import { StoreState } from "@/interfaces/app";
import useBankSlice from "@/store/bank/slice";
import create, { StateCreator } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import useDeckSlice from "./deck/slice";
import usePlayerSlice from "./player/slice";
import useTableSlice from "./table/slice";
export type StoreStateCreator<T> = StateCreator<
  StoreState,
  [
    ["zustand/immer", unknown],
    ["zustand/persist", unknown],
    ["zustand/devtools", never],
  ],
  [],
  T
>;
const useStore = create<StoreState>()(
  immer(
    devtools(
      persist(
        (...a) => {
          return {
            ...useBankSlice(...a),
            ...useDeckSlice(...a),
            ...useTableSlice(...a),
            ...usePlayerSlice(...a),
          };
        },
        {
          name: "blackjack",
          partialize(state) {
            return {
              accounts: state.accounts,
              deck: state.deck,
              games: state.games,
              activeGameId: state.activeGameId,
              uid: state.uid,
              name: state.name,
            };
          },
        },
      ),
      {
        name: "blackjack",
      },
    ),
  ),
);
export default useStore;
