import { GenericComponentProps } from "..";

import { motion } from "motion/react";

export type ButtonProps = GenericComponentProps & {
  onMouseUp: React.MouseEventHandler<HTMLDivElement> | undefined,
  hidden_initial?: boolean,
  containerClassName?: string
};

function stop_animation(event: Event) {
  (event.currentTarget as EventTarget & HTMLDivElement).style.animation = "";
}

export default function Button({className, containerClassName, children, hidden_initial, onMouseUp}: ButtonProps): JSX.Element {
  return (
    <motion.div
      className={className}
      initial={hidden_initial && { opacity: 0, scale: 0, pointerEvents: "none" }}
      animate={{ opacity: 1, scale: 1, pointerEvents: "auto" }}
      transition={{
        duration: 0.4,
        delay: 1,
        scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
      }}
      whileTap={{ scale : 0.9}}
    >
      <div
        className={`w-fit mx-auto
          rounded-md shadow-primary/50 shadow-md
          cursor-pointer
          hover:bg-primary hover:text-onprimary
          transition-colors duration-500
          outline-transparent outline-offset-0 outline outline-1
          select-none
          ${containerClassName}`}
        onMouseOver={(e) => {
          e.currentTarget.removeEventListener("animationiteration", stop_animation);
          e.currentTarget.style.animation = "animateOutline 2s ease infinite";
        }}

        onMouseLeave={(e) => {
          e.currentTarget.addEventListener("animationiteration", stop_animation, { once: true });
        }}

        onMouseUp={onMouseUp}
      >
        {children}
       </div>
    </motion.div>
  )
}