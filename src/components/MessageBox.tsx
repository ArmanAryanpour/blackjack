import { AnimatePresence, motion } from "framer-motion";

export default function MessageBox() {
  const item = {
    hidden: { y: -20, opacity: 0 },
    show: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 },
  };
  return (
    <div className=" h-[5%] bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <AnimatePresence exitBeforeEnter>
        <motion.h1
          key={"message"}
          variants={item}
          initial="hidden"
          animate="show"
          exit={"exit"}
          className="text-center text-white "
        >
          {"Black Jack"}
        </motion.h1>
      </AnimatePresence>
    </div>
  );
}
