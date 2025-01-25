import { Alert } from "@material-tailwind/react";
import { mdiClose } from "@mdi/js";
import Icon from "@mdi/react";
import { GenericComponentProps } from "components/Generic";
import Button from "components/Generic/Button";
import { useEffect, useState } from "react";

export type ToastProps = GenericComponentProps & {
  on_close: () => void
}

export default function Toast({children, on_close } : ToastProps) {
  const [show_alert, set_show_alert] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => {
      set_show_alert(false)
    }, 3000)
  });

  return (
    <Alert 
        className="fixed left-8 bottom-8 w-fit 
          bg-primary text-onprimary/80 py-1 px-2 cursor-pointer
          select-none flex flex-row space-x-1 items-center
          " 
        open={show_alert}
        action={
          <div
          >
            <Button 
              containerClassName="flex flex-row items-center"
              onMouseUp={() => { set_show_alert(false); on_close(); }}
            >
              <Icon path={mdiClose} size={1}/>
            </Button>
          </div>
        }
      >
        {children}
    </Alert>
  );
}