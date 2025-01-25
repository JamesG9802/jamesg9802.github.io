import { motion } from "motion/react";

import { Text } from "components/Generic/Text";
import PageTemplate from "pages/PageTemplate";

import "./index.css";
import { useNavigate } from "react-router-dom";
import AppFooter from "components/AppFooter";
import Button from "components/Generic/Button";

type TitleProps = {
  text: string
}

/**
 * Renders the animated title.
 * @returns 
 */
function TitleComponent({ text }: TitleProps): JSX.Element {
  return (
    <div className="text-center shine"
    >
      <motion.h1 aria-hidden>
        {Array.from(text).map((letter, index) => (
          <motion.div
            key={index}
            initial={{
              translateY: -1000
            }}
            animate={{
              translateY: 0
            }}
            transition={{
              type: "spring",
              stiffness: 50,
              delay: 1 + .15 * index,
            }}
            className="inline-block whitespace-pre"
          >
            <Text type="h1">
              {letter}
            </Text>
          </motion.div>
        ))}
      </motion.h1>
      <Text type="h1" className="sr-only">
        {text}
      </Text>

    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();

  return (
    <PageTemplate className={`bg-background 
      text-onbackground transition-all duration-500 max-h-[100vh] overflow-hidden`
    }>
      <div className="mx-auto max-w-screen-md px-4 h-screen flex flex-col">
        <div className="flex-1">
          <div className="pt-10 pb-4 border-solid border-0 border-b-2 border-outline/50">
            <TitleComponent text="James Gaiser" />
          </div>
          <div className="mt-24">
            <Button onMouseUp={() => {navigate("/blog/0");}}>
              <Text className="py-8 px-8" type="h2">
                  Read Latest post
              </Text>
            </Button>
          </div>
        </div>
        <AppFooter/>
      </div>
    </PageTemplate>
  );
}