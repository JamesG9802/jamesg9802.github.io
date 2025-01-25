import "./index.css";

import ReactDOM from 'react-dom/client'
import { StrictMode, useEffect } from 'react';
import { RouterProvider, createHashRouter } from 'react-router-dom'

import { ErrorFallback, Home, Post, Archive } from 'pages';

import { ThemeProvider } from "@material-tailwind/react";

const root_element = document.getElementById("root");

const router = createHashRouter([
    {
        path: "/",
        element: <Home/>,
        errorElement: <ErrorFallback/>
    },
    {
        path: "/blog/:index",
        element: <Post/>
    },
    {
        path: "/archives",
        element: <Archive/>
    }
]);

function Main() {
    function handle_dark_mode(prefers_dark_mode: boolean) {
        root_element?.classList.add(prefers_dark_mode ? "dark" : "light");
        root_element?.classList.remove(prefers_dark_mode ? "light" : "dark");
      }
    
      //  Adds an event listener to add a corresponding theme to the root HTML element.
      useEffect(() => {
        handle_dark_mode(window.matchMedia("(prefers-color-scheme: dark)").matches);
    
        window
          .matchMedia("(prefers-color-scheme: dark)")
          .addEventListener("change", event => handle_dark_mode(event.matches));
    
        return () => {
          window
            .matchMedia("(prefers-color-scheme: dark)")
            .removeEventListener("change", event => handle_dark_mode(event.matches));
        }
      }, []);

    return (
        <ThemeProvider>
            <RouterProvider router={router}/>
        </ThemeProvider>
    );
}

ReactDOM.createRoot(root_element!).render(
    <StrictMode>
        <Main/>
    </StrictMode>
)
