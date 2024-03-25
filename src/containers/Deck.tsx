import CardComponent, { DeckCardWrapper, DeckWrapper } from "@/components/Card";
import { useChips } from "@/hooks/useChips";
import { useBankActions } from "@/store/bank/hook";
import { useDeckState } from "@/store/deck/hook";
import { useTableState } from "@/store/table/hook";

type Props = {};

export default function Deck({}: Props) {
  const { deck } = useDeckState();
  const { getAllBetBills } = useBankActions();
  const { isActiveGameBetting } = useTableState();
  const bets = useChips(getAllBetBills(), undefined, false);
  return (
    <DeckWrapper>
      {deck.map((card, index) => (
        <DeckCardWrapper
          key={`card-${card.suit}-${card.name}-${card.id}`}
          layoutId={`card-${card.suit}-${card.name}-${card.id}`}
          isRed={card.suit == "hearts" || card.suit == "diamonds"}
          index={index}
        >
          <CardComponent key={`card-${card.suit}-${card.name}`} {...card} />
        </DeckCardWrapper>
      ))}
      {!isActiveGameBetting && <div className="flex space-x-5">{bets}</div>}
    </DeckWrapper>
  );
}
