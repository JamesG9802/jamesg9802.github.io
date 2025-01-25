import Icon from '@mdi/react';
import { mdiLink } from '@mdi/js';

import { useState } from 'react';

import { GenericComponentProps } from "components/Generic";
import Toast from 'components/Generic/Toast';

export type TextProps = {
  /**
   * The type of text which affects the styling. Defaults to normal if no type is specified.
   */
  type?: "normal" | "title" | "h1" | "h2" | "h3" | "h4" | "h5"

  text?: string

  id?: string
  linkable?: boolean
} & GenericComponentProps;

/**
 * Generic component for text.
 * @param props for Text
 * @returns 
 */
export function Text({ type, className, style, text, children, id, linkable }: TextProps) {
  let Tag: keyof JSX.IntrinsicElements;
  let class_styling;

  const [is_hovered, set_is_hovered] = useState<boolean>(false);
  const [show_alert, set_show_alert] = useState<boolean>(false);

  switch (type) {
    default:
      Tag = "p";
      class_styling = "text-base";
      break;
    case "title":
      Tag = "h1";
      class_styling = "font-bold text-5xl";
      break;
    case "h1":
      Tag = "h1";
      class_styling = "font-bold text-4xl";
      break;
    case "h2":
      Tag = "h2";
      class_styling = "font-bold text-3xl";
      break;
    case "h3":
      Tag = "h3";
      class_styling = "font-bold text-2xl";
      break;
    case "h4":
      Tag = "h4";
      class_styling = "font-bold text-xl";
      break;
    case "h5":
      Tag = "h5";
      class_styling = "font-bold text-lg";
      break;
  }

  return (
    <div>
      <Tag
        style={style}
        className={className != undefined ? class_styling + " " + className : class_styling}
        id={id}
        onMouseEnter={() => { set_is_hovered(true) }}
        onMouseLeave={() => { set_is_hovered(false) }}
      >
        {text}{children}
        {
          linkable &&
          <span
            className={`${is_hovered ? "" : "opacity-0"} 
              cursor-pointer hover:fill-primary hover:text-primary`
            }
            onClick={() => {
              const origin = window.location.origin;
              const page = window.location.hash.split("#")[1];
              navigator.clipboard.writeText(origin + "#" + page + "#" + id)
              .then(() => { set_show_alert(true); })
            }}
          >
            <Icon className="align-middle"
              path={mdiLink}
              size={1}
            />
          </span>
        }
      </Tag>
      {
        show_alert && 
        <Toast on_close={() => { set_show_alert(false); }}>
          Copied link to clipboard.
        </Toast>
      }
    </div >
  );
}