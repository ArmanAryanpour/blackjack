import { chipMap, StackOfChips } from "@/components/Chips";
import { Balance } from "@/store/bank/static";
export const useChips = (
  bills: Balance["bills"],
  handleClick?: (currency: string) => void,
  slice = true,
  showEmptyState = false,
  emptyStateId?: string,
) => {
  const currencies = Object.keys(bills);
  return currencies.map((currency) => {
    if (!showEmptyState && bills[currency].length === 0) return null;
    return (
      <StackOfChips
        key={currency}
        chips={bills[currency]}
        currency={currency as keyof typeof chipMap}
        handleClick={handleClick}
        showEmptyState={showEmptyState}
        emptyStateId={emptyStateId}
        slice={slice}
      />
    );
  });
};
