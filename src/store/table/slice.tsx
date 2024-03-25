import { StoreState } from "@/interfaces/app";
import { Card } from "@/interfaces/card";
import { StoreStateCreator } from "@/store/useStore";
import { WritableDraft } from "immer/dist/internal";
import _ from "lodash";
import { v4 } from "uuid";
export type PlayerState = {
  id: string;
  cards: Card[];
  name: string;
  isBusted: boolean;
  isBlackJack: boolean;
  isStanding: boolean;
  totals: number[];
  total: number;
};
type GameState = {
  players: {
    [playerId: string]: PlayerState;
  };
  isActive: boolean;
  isFinished: boolean;
  isStarted: boolean;
  isBetting: boolean;
};
export interface TableState {
  games: {
    [gameId: string]: GameState;
  };
  activeGameId: string;
  newGame: () => void;
  newPlayer: (name: string) => void;
  getPlayer: () => PlayerState | undefined;
  getDealer: () => PlayerState | undefined;
  isActiveGame: () => boolean;
  isActiveGameStarted: () => boolean;
  isActiveGameBetting: () => boolean;
  isActiveGameReadyToStart: () => boolean;
  isActiveGameFinished: () => boolean;
  startActiveGame: () => void;
  startActiveGameBetting: () => void;
  stopActiveGameBetting: () => void;
  handleTotal: (playerId: string, draft: WritableDraft<StoreState>) => void;
  hit: (playerId: string, draft: WritableDraft<StoreState>) => void;
  hitPlayer: () => void;
  standPlayer: () => void;
  handleCardState: (playerId: string, draft: WritableDraft<StoreState>) => void;
  handleDealerDecision: (
    playerId: string,
    draft: WritableDraft<StoreState>,
  ) => void;
  handleGameResult: (draft: WritableDraft<StoreState>) => void;
  handleCardReturn: (draft: WritableDraft<StoreState>) => void;
}
const useTableSlice: StoreStateCreator<TableState> = (set, get) => ({
  games: {},
  activeGameId: "",
  newGame: () =>
    set(
      (draft) => {
        var gameId = v4();
        get().handleCardReturn(draft);
        draft.games[gameId] = {
          players: {
            dealer: {
              id: "dealer",
              cards: [],
              name: "",
              isBusted: false,
              isBlackJack: false,
              isStanding: false,
              totals: [0],
              total: 0,
            },
          },
          isActive: true,
          isFinished: false,
          isStarted: false,
          isBetting: false,
        };
        draft.activeGameId = gameId;
        return draft;
      },
      false,
      `table/newGame`,
    ),
  newPlayer: (name) => {
    if (get().isActiveGame()) {
      set(
        (draft) => {
          draft.games[draft.activeGameId].players[get().uid] = {
            id: get().uid,
            cards: [],
            name,
            isBusted: false,
            isBlackJack: false,
            isStanding: false,
            totals: [0],
            total: 0,
          };
          draft.name = name;
          get().createPlayerAccount(draft);
          return draft;
        },
        false,
        `table/${get().activeGameId}/newPlayer/${get().uid}`,
      );
    }
  },

  hitPlayer: () => {
    set((draft) => {
      var player = get().getPlayer();
      if (player) {
        get().hit(player.id, draft);
        get().handleDealerDecision(player.id, draft);
      }
      return draft;
    });
  },
  standPlayer: () => {
    set((draft) => {
      var player = get().getPlayer();
      if (player) {
        draft.games[draft.activeGameId].players[player.id].isStanding = true;
        get().handleDealerDecision(player.id, draft);
      }
      return draft;
    });
  },
  handleCardReturn: (draft: WritableDraft<StoreState>) => {
    if (get().isActiveGame()) {
      var dealer = draft.games[draft.activeGameId].players["dealer"];
      var player = draft.games[draft.activeGameId].players[draft.uid];
      if (dealer && player) {
        get().returnCards(player.cards.concat(dealer.cards), draft);
        player.cards = [];
        dealer.cards = [];
      }
    }
  },
  handleGameResult: (draft) => {
    var dealer = draft.games[draft.activeGameId].players["dealer"];
    var player = draft.games[draft.activeGameId].players[draft.uid];
    if (dealer && player) {
      draft.games[draft.activeGameId].isFinished = true;
      if (
        player.isBusted ||
        (dealer.isBlackJack && player.isStanding) ||
        (dealer.total > player.total && !dealer.isBusted)
      ) {
        // player is busted, dealer wins
        // dealer blackjack, player standing, dealer wins
        // dealer total > player total, dealer wins
        draft.returnBetToBalance("dealer", draft);
        draft.transfetBetToBalance(draft.uid, "dealer", draft);
      } else if (
        dealer.isBusted ||
        dealer.total < player.total ||
        player.isBlackJack
      ) {
        // player wins
        draft.returnBetToBalance(draft.uid, draft);
        draft.transfetBetToBalance("dealer", draft.uid, draft);
      } else if (dealer.total == player.total) {
        // draw, give people their bets back
        draft.returnBetToBalance(draft.uid, draft);
        draft.returnBetToBalance("dealer", draft);
      }
    }
  },
  handleDealerDecision: (playerId, draft) => {
    var player = draft.games[get().activeGameId].players[playerId];
    if (player.isBusted || player.isBlackJack || player.isStanding) {
      var dealer = draft.games[get().activeGameId].players.dealer;

      if (dealer.total >= 17) {
        dealer.isStanding = true;
      }
      while (!(dealer.isBlackJack || dealer.isBusted || dealer.isStanding)) {
        get().hit("dealer", draft);
        if (dealer.total >= 17) {
          dealer.isStanding = true;
        }
      }
      get().handleGameResult(draft);
    }
    return draft;
  },
  hit: (playerId, draft) => {
    draft.games[draft.activeGameId].players[playerId].cards.push(
      get().getCard(draft),
    );
    get().handleCardState(playerId, draft);
    return draft;
  },
  handleCardState: (playerId, draft) => {
    get().handleTotal(playerId, draft);
    var totals = draft.games[get().activeGameId].players[playerId].totals;
    if (totals.every((total) => total > 21)) {
      draft.games[draft.activeGameId].players[playerId].isBusted = true;
    } else if (totals[0] === 21 || (totals.length > 1 && totals[1] === 21)) {
      draft.games[draft.activeGameId].players[playerId].isBlackJack = true;
    }
    return draft;
  },
  handleTotal: (playerId, draft) => {
    var player = draft.games[get().activeGameId].players[playerId];
    var aceIndex = player.cards.findIndex((card) => card.name === "A");
    const others =
      aceIndex >= 0
        ? player.cards.filter((card, index) => index !== aceIndex)
        : player.cards;
    const total = others.reduce((acc, card) => acc + card.value[0], 0);
    if (aceIndex < 0) {
      player.totals = [total];
    } else {
      player.totals = [
        total + player.cards[aceIndex].value[0],
        total + player.cards[aceIndex].value[1],
      ];
    }
    player.total =
      _.max(player.totals.filter((number) => number < 22)) || player.totals[0];
  },
  getPlayer: () =>
    get().isActiveGame()
      ? get().games[get().activeGameId].players[get().uid]
      : undefined,
  getDealer: () =>
    get().isActiveGame()
      ? get().games[get().activeGameId].players["dealer"]
      : undefined,
  isActiveGame: () => _.isEmpty(get().activeGameId) == false,
  isActiveGameStarted: () =>
    get().isActiveGame() && get().games[get().activeGameId!].isStarted,

  isActiveGameBetting: () =>
    get().isActiveGame() && get().games[get().activeGameId!].isBetting,
  isActiveGameReadyToStart: () =>
    get().isActiveGame() && get().getPlayer() != undefined,
  isActiveGameFinished: () =>
    get().isActiveGame() && get().games[get().activeGameId!].isFinished,
  startActiveGame: () => {
    set(
      (draft) => {
        var player = get().getPlayer();
        if (get().isActiveGame() && player) {
          draft.games[draft.activeGameId].isStarted = true;
          draft.games[draft.activeGameId].isBetting = false;
          get().hit(player.id, draft);
          get().hit(player.id, draft);
          get().hit("dealer", draft);
          get().hit("dealer", draft);
          if (draft.games[draft.activeGameId].players[player.id].isBlackJack) {
            get().handleGameResult(draft);
          }
        }
        return draft;
      },
      false,
      `table/${get().activeGameId}/start`,
    );
  },
  startActiveGameBetting: () =>
    set(
      (draft) => {
        if (draft.isActiveGame()) {
          draft.games[draft.activeGameId].isBetting = true;
        }
        return draft;
      },
      false,
      `table/${get().activeGameId}/bet`,
    ),
  stopActiveGameBetting: () =>
    set((draft) => {
      if (draft.isActiveGame()) {
        draft.games[draft.activeGameId].isBetting = false;
      }
      return draft;
    }),
});
export default useTableSlice;
