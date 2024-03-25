import { StoreState } from "@/interfaces/app";
import { Card } from "@/interfaces/card";
import { StoreStateCreator } from "@/store/useStore";
import { WritableDraft } from "immer/dist/internal";
import { Deck, generateDeck } from "./static";
export interface DeckState {
  deck: Deck;
  getCard: (draft: WritableDraft<StoreState>) => Card;
  returnCards: (cards: Deck, draft: WritableDraft<StoreState>) => void;
}
const useDeckSlice: StoreStateCreator<DeckState> = (set, get) => ({
  deck: generateDeck(),
  getCard: (draft) =>
    draft.deck.splice(Math.floor(Math.random() * draft.deck.length), 1)[0],
  returnCards: (cards, draft) => {
    draft.deck = draft.deck.concat(cards);
  },
});
export default useDeckSlice;
