import ReactDOM from 'react-dom/client'
import { RouterProvider, createHashRouter } from 'react-router-dom'
import { CssBaseline, StyledEngineProvider, ThemeProvider, createTheme, useMediaQuery } from '@mui/material'
import { ErrorFallback, Home } from 'pages';

import "index.css";
import { useEffect } from 'react';

const rootElement = document.getElementById("root");

const router = createHashRouter([
    {
        path: "/",
        element: <Home/>,
        errorElement: <ErrorFallback/>
    },
]);

const darkTheme = createTheme({ 
    palette: { mode: 'dark' },
    typography: {
        fontFamily: [
            "Open Sans",
            "Roboto",
            "Helvetica",
            "Arial",
            "sans-serif",
            "ui-sans-serif",
            "system-ui",
            "Apple Color Emoji",
            "Segoe UI Emoji",
            "Segoe UI Symbol",
            "Noto Color Emoji"
        ].join(',')
    },
    //  Make portal elements inject into the root element
    //  https://mui.com/material-ui/integrations/interoperability/#tailwind-css
    components: {
        MuiPopover: {
            defaultProps: {
              container: rootElement,
            },
          },
        MuiPopper: {
            defaultProps: {
                container: rootElement,
            },
        },
        MuiDialog: {
            defaultProps: {
                container: rootElement,
            },
        },
        MuiModal: {
            defaultProps: {
                container: rootElement,
            },
        },
    }
  });
const lightTheme = createTheme({
    ...darkTheme, 
    palette: { mode: 'light' }
});

function Main() {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const theme = prefersDarkMode ? darkTheme : lightTheme;

    useEffect(() => {
        rootElement?.classList.add(prefersDarkMode ? "dark" : "light");
        rootElement?.classList.remove(prefersDarkMode ? "light" : "dark")
    }, [prefersDarkMode]);

    return (
        <>
            <CssBaseline/>
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={theme}>
                    <RouterProvider router={router}/>
                </ThemeProvider>
            </StyledEngineProvider>
        </>
    );
}

ReactDOM.createRoot(rootElement!).render(
    <Main/>
)
