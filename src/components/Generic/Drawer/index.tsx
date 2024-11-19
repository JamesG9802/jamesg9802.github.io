import { Drawer as BaseDrawer, DrawerProps } from "@mui/material";

export function Drawer({...props}: DrawerProps) {
    return (
        <BaseDrawer {...props}
            PaperProps={{
                className: ""
            }}
        >
        </BaseDrawer>
    )
}