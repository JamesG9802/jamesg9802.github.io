import { ReactNode, useEffect, useRef, useState } from "react";
import "./index.css";

export type IconSwapperProps = {
  className?: string
  icons?: ReactNode[]
};

/**
 * Component that animates swapping between different icons.
 */
export default function IconSwapper({className, icons}: IconSwapperProps) {
  const [current_index, set_current_index] = useState(0);
  const index = useRef(0);
  useEffect(() => {
    if(icons)
    {
      const interval = setInterval(
        () => {
          index.current = index.current + 1 < icons?.length ? index.current + 1 : 0;
          set_current_index(index.current);
        }, 
        3000
      );
      return () => {
        clearInterval(interval);
      }
    }
  }, [])
  if(!icons || icons.length == 0)
    return <></>;
  return (
    <div className={className + " relative"}>
      {
        icons.map((value, index) => {
          return (
            <div 
              key={index}
              className={"IconSwapper-Container " +
              ( 
                //  inactive -> Active
                index == current_index ? "IconSwapper-Active" :
                //  active -> inactive
                index == current_index - 1 || (index == icons.length - 1 && current_index == 0) ? "IconSwapper-Active-to-Inactive" :
                //  inactive -> inactive
                "IconSwapper-Inactive"
              )
            }>
              {value}
            </div>
          )
        })
      }
    </div>
  );
}