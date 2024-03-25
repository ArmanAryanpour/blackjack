import { Board, BoardWrapper } from "@/components/Board";
import {
  CardTotal,
  DisplayCards,
  DisplayCardsWrapper,
} from "@/components/DisplayCards";
import { useBankActions } from "@/store/bank/hook";
import { useTableState } from "@/store/table/hook";
import { AvatarGenerator } from "random-avatar-generator";
import { useChips } from "src/hooks/useChips";
const generator = new AvatarGenerator();

export default function DealerBoard() {
  const {
    player,
    isActiveGameBetting,
    isActiveGameStarted,
    dealer,
    isActiveGameFinished,
  } = useTableState();
  const { getBet, getBetBillsCount, getBalanceBillsCount, getBalance } =
    useBankActions();

  const balance = useChips(getBalance("dealer").bills);
  const bets = useChips(getBet("dealer").bills, undefined, false);
  if (player == undefined || dealer == undefined) return <BoardWrapper />;
  const showCards =
    player.isBusted ||
    player.isBlackJack ||
    player.isStanding ||
    isActiveGameFinished;
  return (
    <Board
      isDealer={true}
      id={"dealer"}
      name="Dealer"
      img={generator.generateRandomAvatar("DEALER")}
      balance={(isActiveGameBetting || isActiveGameStarted) && balance}
      bets={(isActiveGameBetting || isActiveGameStarted) && bets}
      isActive={isActiveGameStarted}
    >
      <DisplayCardsWrapper key={"dealer-cards"}>
        <DisplayCards hand={dealer.cards} showCards={showCards} />
        {showCards && <CardTotal totals={dealer.totals} />}
      </DisplayCardsWrapper>
    </Board>
  );
}
