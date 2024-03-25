import useStore from "@/store/useStore";

export const useDeckState = () =>
  useStore((state) => ({
    deck: state.deck,
  }));
export const useDeckActions = () => useStore((state) => ({}));
