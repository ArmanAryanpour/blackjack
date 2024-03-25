import { motion, HTMLMotionProps } from "framer-motion";
import { DetailedHTMLProps, HTMLAttributes } from "react";
import { Field, FieldAttributes, Form } from "formik";
import { PropsWithChildren } from "react";

const MotionForm = motion(Form);
export const FormWrapper = (props: PropsWithChildren<{}>) => (
  <MotionForm
    initial={{
      opacity: 0,
      y: 20,
    }}
    animate={{
      opacity: 1,
      y: 0,
    }}
    exit={{
      opacity: 0,
      y: -20,
    }}
    key="player-form"
    className="   flex h-full justify-center space-x-5 items-center "
  >
    {props.children}
  </MotionForm>
);
export const FormField = <T,>(props: FieldAttributes<T>) => (
  <div className="space-y-0.5 py-0.5 flex flex-col ">
    <label className="text-sm text-gray-100 font-semibold" htmlFor={props.name}>
      {props.title}
    </label>
    <Field
      id={props.name}
      className={`py-1 px-2 rounded-lg outline-none text-xs shadow border-gray-200 bg-green-700  border-dashed border-2 focus:opacity-100 text-gray-100 opacity-75 `}
      {...props}
    />
  </div>
);
export const GameButton = (
  props: HTMLMotionProps<"button"> & { xs?: boolean }
) => (
  <motion.button
    initial={{
      y: 50,
    }}
    animate={{
      y: 0,
    }}
    exit={{
      y: 50,
      opacity: 0,
    }}
    className={` text-green-900 inline w-36  text-xs md:text-sm shadow-lg lg:text-base border-green-900 bg-white border-dashed border-2 rounded-lg font-semibold ${
      props.disabled ? "opacity-25" : "opacity-75 hover:opacity-100"
    }  ${props.xs ? "py-1  xl:py-1.5" : "py-2  xl:py-3"}`}
    {...props}
  >
    {props.children}
  </motion.button>
);
export function DecisionsWrapper(props: HTMLMotionProps<"div">) {
  return (
    <motion.div
      layout
      className="h-[10%] w-full bg-green-900 p-2 justify-center space-x-5 flex  items-center"
      {...props}
    />
  );
}
export function GameButtonsWrapper(
  props: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
) {
  return <div className="grid grid-cols-2 gap-2" {...props} />;
}
export function FullWidthButton(
  props: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
) {
  return <div className="col-span-2 flex justify-center" {...props} />;
}
