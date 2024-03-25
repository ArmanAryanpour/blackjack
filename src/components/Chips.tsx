import { HTMLMotionProps, motion } from "framer-motion";
import React, { memo, useCallback } from "react";

const _StackOfChips = ({
  currency,
  chips,
  handleClick,
  showEmptyState,
  emptyStateId,
  slice,
}: HTMLMotionProps<"div"> & {
  currency: keyof typeof chipMap;
  chips: string[];
  handleClick?: (currency: string) => void;
  showEmptyState?: boolean;
  emptyStateId?: string;
  slice?: boolean;
}) => {
  var onClick = useCallback(() => {
    handleClick && handleClick(currency);
  }, [currency, handleClick]);
  const Chip = chipMap[currency];
  return (
    <StackOfChipsWrapper>
      {(slice ? chips.slice(-5) : chips).map((item, index) => {
        return (
          <StackedChipWrapper key={`${item}-${index}`} index={index}>
            <Chip key={item} layoutId={item} onClick={onClick} />
          </StackedChipWrapper>
        );
      })}
      {
        // Show a dummy chip if there are no chips in the stack and showEmptyState is true
        showEmptyState && (
          <EmptyChip>
            <Chip
              key={`${emptyStateId}-${currency}-empty`}
              layoutId={`${emptyStateId}-${currency}-empty`}
              onClick={onClick}
            />
          </EmptyChip>
        )
      }
      {
        // Hide empty state if there are no chips unless showEmptyState is true
        (chips.length > 0 || showEmptyState) && (
          <ChipCount count={chips.length} />
        )
      }
    </StackOfChipsWrapper>
  );
};
export const StackOfChips = memo(_StackOfChips);

export function StackOfChipsWrapper({ ...props }: HTMLMotionProps<"div">) {
  return (
    <motion.div
      layout="position"
      className="relative w-10 h-10 md:w-12 md:h-12 xl:w-14 xl:h-14 text-[0.65rem]"
      {...props}
    />
  );
}
export function StackedChipWrapper({
  index,
  ...props
}: React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & { index: number }) {
  return (
    <div
      className={`${index > 0 && "absolute"} h-full w-full`}
      style={{
        top: `-${index < 5 ? index * 5 : 0 * 5}px`,
        zIndex: index < 5 ? 10 : 0,
      }}
      {...props}
    />
  );
}

export function EmptyChip({
  ...props
}: React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>) {
  return <div className={` inset-0 z-0 absolute  opacity-50`} {...props} />;
}
export function ChipCount({ count }: { count: number }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.25 }}
      className="flex absolute -bottom-1 w-full justify-center pointer-events-none select-none z-40"
    >
      <div className="bg-gray-800  bg-opacity-75 rounded-full p-1 px-1.5  text-white text-xs scale-75">
        {count}x
      </div>
    </motion.div>
  );
}
export function Chip({
  className,
  children,
  layoutId,
  ...props
}: HTMLMotionProps<"button">) {
  console.log("inside chip");
  return (
    <motion.button
      whileHover={{
        y: [-2, 0, 2, 0, -2],
        transition: { repeat: Infinity, bounce: 1, duration: 0.5 },
      }}
      whileTap={{
        scale: 1.15,
      }}
      className={`${className} w-full h-full   cursor-pointer rounded-full border-dashed border-4 relative select-none border-white flex  z-10`}
      layoutId={layoutId}
      id={layoutId}
      layout="position"
      transition={{ duration: 0.4 }}
      {...props}
    >
      <div className="border-2 border-dashed flex rounded-full w-[85%] h-[85%]  m-auto">
        <span className="m-auto text-white font-semibold ">{children}</span>
      </div>
    </motion.button>
  );
}
export const PurpleChip = memo((props: React.ComponentProps<typeof Chip>) => (
  <Chip {...props} className={`${props.className} bg-indigo-500`}>
    5
  </Chip>
));
export const BlueChip = memo((props: React.ComponentProps<typeof Chip>) => (
  <Chip {...props} className={`${props.className} bg-blue-500`}>
    10
  </Chip>
));

export const RedChip = memo((props: React.ComponentProps<typeof Chip>) => (
  <Chip {...props} className={`${props.className} bg-red-500`}>
    50
  </Chip>
));

export const YellowChip = memo((props: React.ComponentProps<typeof Chip>) => (
  <Chip {...props} className={`${props.className} bg-yellow-600`}>
    100
  </Chip>
));
export const BlackChip = memo((props: React.ComponentProps<typeof Chip>) => (
  <Chip {...props} className={`${props.className} bg-gray-800`}>
    500
  </Chip>
));
export const chipMap = {
  "5": PurpleChip,
  "10": BlueChip,
  "50": RedChip,
  "100": YellowChip,
  "500": BlackChip,
};
