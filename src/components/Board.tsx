import { motion } from "framer-motion";
import { PropsWithChildren } from "react";

type Props = {
  isDealer?: boolean;
  isActive?: boolean;
};
export function BoardWrapper({ children, isDealer }: PropsWithChildren<Props>) {
  return (
    <div
      className={`select-none mx-auto items-center flex-col justify-between flex py-4 max-w-xl w-full px-5 ${
        isDealer ? "h-[35%] flex-col-reverse" : "h-[35%]"
      } `}
    >
      {children}
    </div>
  );
}

export function Board({
  isDealer,
  id,
  isActive,
  bets,
  balance,
  name,
  img,
  children,
}: {
  id: string;
  img: string;
  name?: string;
  isDealer?: boolean;
  isActive: boolean;
  bets?: React.ReactNode;
  balance?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <BoardWrapper isDealer={isDealer} isActive={isActive}>
      {isActive && children}
      {!isActive && (
        <div
          className={`flex w-full items-center ${
            isDealer && "pointer-events-none"
          } ${
            isActive ? "justify-between pointer-events-none" : "justify-center"
          } space-x-2  relative min-w-[100px]   `}
        >
          {
            <div
              className={`items-center flex flex-col ${
                isDealer && "flex-col-reverse space-y-reverse"
              } space-y-2`}
            >
              {bets && (
                <motion.div
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1, scale: isActive ? 0.75 : 0.85 }}
                  exit={{
                    y: -50,
                    opacity: 0,
                  }}
                  key={`${id}-betting-chips`}
                  className={`flex my-auto space-x-5  flex-wrap`}
                >
                  {bets}
                </motion.div>
              )}
              {name && (
                <motion.div
                  layout="position"
                  initial={{ y: -50 }}
                  layoutId={`${id}-name`}
                  animate={{ y: 0 }}
                  key={`${id}-name`}
                  className={`text-green-700 w-min  text-xs  rounded-full text-center truncate  px-4 bg-white py-0.5 ${
                    isDealer && "!mt-2"
                  }`}
                >
                  {name}
                </motion.div>
              )}

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                layoutId={`${id}-avatar`}
                key={`${id}-avatar`}
                className="w-20 h-20 scale-90  relative  shadow rounded-full "
              >
                <img
                  alt={name}
                  src={img}
                  className="w-full p-1 z-10 absolute h-full shadow-2xl rounded-full "
                />
                <div className="rounded-full   left-0 -bottom-1 right-0 h-full scale-95 bg-white  absolute"></div>
              </motion.div>
            </div>
          }
        </div>
      )}

      {balance && (
        <motion.div
          key={`${id}-balance-chips`}
          initial={{ y: 50 }}
          animate={{ y: 0, scale: isActive ? 0.85 : 1 }}
          exit={{
            y: 50,
          }}
          className={`flex space-x-5 ${
            isDealer && "pointer-events-none"
          } pt-2 ${isActive && `pointer-events-none left-0 right-0  `} `}
        >
          {balance}
        </motion.div>
      )}
    </BoardWrapper>
  );
}
