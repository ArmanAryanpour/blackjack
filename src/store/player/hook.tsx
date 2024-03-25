import useStore from "@/store/useStore";

export const usePlayerState = () =>
  useStore((state) => ({
    uid: state.uid,
    name: state.name,
  }));
