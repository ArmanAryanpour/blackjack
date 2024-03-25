import { Board, BoardWrapper } from "@/components/Board";
import {
  CardTotal,
  DisplayCards,
  DisplayCardsWrapper,
} from "@/components/DisplayCards";
import { useBankActions } from "@/store/bank/hook";
import { useTableState } from "@/store/table/hook";
import { PlayerState } from "@/store/table/slice";
import { AvatarGenerator } from "random-avatar-generator";
import { useCallback } from "react";
import { useChips } from "src/hooks/useChips";
const generator = new AvatarGenerator();

export default function PlayerBoard() {
  const { player } = useTableState();
  if (player == undefined) return <BoardWrapper />;
  return <ActiveBoard player={player} />;
}

export function ActiveBoard({ player }: { player: PlayerState }) {
  const { isActiveGameBetting, isActiveGameStarted } = useTableState();
  const { getBalance, getBet, handleBet, removeBet } = useBankActions();
  const handleBalanceClick = useCallback(
    (currency: string) => {
      if (player && player.id) {
        handleBet(player.id, currency);
        handleBet("dealer", currency);
      }
    },
    [player, handleBet],
  );
  const handleBetClick = useCallback(
    (currency: string) => {
      if (player && player.id) {
        removeBet(player.id, currency);
        removeBet("dealer", currency);
      }
    },
    [player, removeBet],
  );

  const balance = useChips(
    getBalance(player.id).bills,
    handleBalanceClick,
    false,
    true,
    "player",
  );
  const bets = useChips(getBet(player.id).bills, handleBetClick);

  return (
    <Board
      isDealer={false}
      id={player.id}
      name={player.name}
      img={generator.generateRandomAvatar(player.id)}
      balance={(isActiveGameBetting || isActiveGameStarted) && balance}
      bets={(isActiveGameBetting || isActiveGameStarted) && bets}
      isActive={isActiveGameStarted}
    >
      <DisplayCardsWrapper key={"player-cards"}>
        <DisplayCards hand={player.cards} showCards={true} />
        <CardTotal totals={player.totals} />
      </DisplayCardsWrapper>
    </Board>
  );
}
