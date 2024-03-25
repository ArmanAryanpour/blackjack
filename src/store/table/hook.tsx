import useStore from "@/store/useStore";
import _ from "lodash";

export const useTableActions = () =>
  useStore((state) => ({
    newGame: state.newGame,
    newPlayer: state.newPlayer,
    startBetting: state.startActiveGameBetting,
    stopBetting: state.stopActiveGameBetting,
    startGame: state.startActiveGame,
    hitPlayer: state.hitPlayer,
    standPlayer: state.standPlayer,
  }));

export const useTableState = () =>
  useStore((state) => ({
    isActiveGame: state.isActiveGame(),
    isActiveGameStarted: state.isActiveGameStarted(),
    isActiveGameBetting: state.isActiveGameBetting(),
    isActiveGameReadyToStart: state.isActiveGameReadyToStart(),
    isActiveGameFinished: state.isActiveGameFinished(),
    dealer: state.getDealer(),
    player: state.getPlayer(),
    isWaitingForBets:
      _.isEmpty(state.uid) || _.isEmpty(state.accounts[state.uid])
        ? false
        : state.getBet(state.uid).total == 0,
  }));
