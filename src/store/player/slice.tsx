import { StoreStateCreator } from "@/store/useStore";
import { v4 } from "uuid";
export interface PlayerState {
  uid: string;
  name: string;
  regenerateUID: () => void;
  chips: {
    [key: string]: string[];
  };
  addChip: (currency: string) => void;
  removeChip: (currency: string) => void;
}
const usePlayerSlice: StoreStateCreator<PlayerState> = (set, get) => ({
  uid: v4(),
  name: "",
  regenerateUID: () => {
    set((draft) => {
      draft.uid = v4();
      delete draft.accounts[get().uid];
      draft.accounts[draft.uid] = get().accounts[get().uid];
      return draft;
    });
  },
  chips: {
    "5": [],
    "10": [],
    "50": [],
    "100": [],
    "500": [],
  },
  addChip: (currency) => {
    set((draft) => {
      draft.chips[currency].push(v4());
      return draft;
    });
  },
  removeChip: (currency) => {
    set((draft) => {
      draft.chips[currency].pop();
      return draft;
    });
  },
});
export default usePlayerSlice;
