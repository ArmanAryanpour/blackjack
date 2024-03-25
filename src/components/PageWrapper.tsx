import useWindowSize from "@/hooks/useWindowSize";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function PageWrapper({ children }: Props) {
  const windowSize = useWindowSize();
  return (
    <div
      className={` overflow-hidden bg-green-700 flex flex-col  font-mono  ${
        windowSize.height == undefined && "h-screen"
      }`}
      style={{ height: `${windowSize.height}px` }}
    >
      {children}
    </div>
  );
}
