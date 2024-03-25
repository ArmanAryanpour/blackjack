import ReactConfetti from "react-confetti";
import useWindowSize from "src/hooks/useWindowSize";

export default function Confetti() {
  const { width, height } = useWindowSize();
  return (
    <ReactConfetti
      gravity={0.025}
      colors={["#1bee68", "#e70c0c"]}
      width={width}
      height={height}
      recycle={false}
      opacity={0.75}
      numberOfPieces={1000}
    />
  );
}
