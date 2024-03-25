import { Card } from "@/interfaces/card";
import { AnimatePresence, HTMLMotionProps, motion } from "framer-motion";
import CardComponent from "./Card";

export const DisplayCardsWrapper = ({
  children,
  ...props
}: HTMLMotionProps<"div">) => (
  <motion.div
    layout="position"
    className=" flex-1 space-y-2 sm:flex-initial flex-col  text-center  flex justify-center"
    {...props}
  >
    {children}
  </motion.div>
);
type Props = {
  hand: Card[];
  showCards: boolean;
};
export function DisplayCards({ hand, showCards }: Props) {
  return (
    <div className="flex space-x-1   relative  justify-center ">
      <AnimatePresence>
        {hand.map((card, index) => (
          <motion.div
            layout="position"
            id={`card-${card.suit}-${card.name}-${card.id}`}
            key={`card-${card.suit}-${card.name}-${card.id}`}
            layoutId={`card-${card.suit}-${card.name}-${card.id}`}
            initial={{ rotate: 0, scale: 0.9 }}
            animate={{ rotate: 360, scale: [1.1, 1] }}
            transition={{ duration: 0.75 }}
          >
            <CardComponent {...card} show={index == 0 || showCards} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
export function CardTotal({ totals }: { totals: number[] }) {
  var isDoubleTotal =
    totals.length > 1 && totals[0] !== totals[1] && totals[1] < 22;
  return (
    <div className="flex w-full items-center justify-center">
      <span className="bg-gray-800 rounded-lg bg-opacity-70 text-gray-100 p-2">
        {totals[0]}
        {isDoubleTotal && `, ${totals[1]}`}
      </span>
    </div>
  );
}
