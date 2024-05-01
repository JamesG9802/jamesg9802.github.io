import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { RouteObject, RouterProvider, createBrowserRouter, createHashRouter } from 'react-router-dom'
import Home from 'Screens/Home/index.tsx'
import AboutMe from 'Screens/AboutMe/index.tsx'

const router = createHashRouter([
    {
        path: "/",
        element: <Home key={1}/>,
        errorElement: <Home key={-1}/>
    },
    {
        path: "aboutme",
        element: <AboutMe key={2}/>,
        
    },
    {
        path: "projects",
        element: <AboutMe key={3}/>,
    }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
    <RouterProvider router={router} />
)
