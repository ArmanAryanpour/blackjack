import { Card } from "@/interfaces/card";
import { AnimatePresence, HTMLMotionProps, motion } from "framer-motion";

interface CardComponentProps extends Card {
  show?: boolean;
}
export const DeckWrapper = ({ children, ...props }: HTMLMotionProps<"div">) => (
  <motion.div
    layout="position"
    className="flex justify-center  relative h-[15%]  items-center "
    {...props}
  >
    <AnimatePresence>{children}</AnimatePresence>
  </motion.div>
);
export const DeckCardWrapper = ({
  index,
  isRed,
  ...props
}: HTMLMotionProps<"div"> & { index: number; isRed: boolean }) => (
  <motion.div
    layout="position"
    initial={{ left: -100 }}
    animate={{
      transition: { duration: 0.75 },
      left: `${index * 1.25 + 5}px`,
      top: [isRed ? 100 : -100, 0, isRed ? -100 : 100, 0],
    }}
    className={`absolute flex top-0 bottom-0 `}
    {...props}
  />
);
export default function CardComponent({
  suit,
  name,
  show = false,
}: CardComponentProps) {
  const isRed = suit === "diamonds" || suit === "hearts";
  const color = isRed ? "fill-red-500" : "fill-black";
  const classNames = ` ${color}  m-auto 
bg-white
h-20 w-[3.5rem] p-1
md:h-24 md:w-16 
lg:h-28 lg:w-20 rounded-md justify-center flex items-center border-1 border-gray-300 border `;
  return (
    <AnimatePresence exitBeforeEnter>
      {show && (
        <motion.div
          key={`front-${suit}-${name}`}
          initial={{ opacity: 0 }}
          animate={{
            rotate: [0, 2, -2, 0],
            opacity: 1,
          }}
          className={classNames}
        >
          <img
            alt="front"
            src={`/icons/${suit}-${name}.svg`}
            className="w-full"
          />
        </motion.div>
      )}

      {!show && (
        <motion.div key={`back-${suit}-${name}`} className={classNames}>
          <img
            alt="back"
            src={`/icons/${isRed ? "red" : "black"}-back.svg`}
            className="w-full"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
