import ReactDOM from 'react-dom/client'
import { RouterProvider, createHashRouter } from 'react-router-dom'
import Home from 'Screens/Home/index.tsx'
import AboutMe from 'Screens/AboutMe/index.tsx'
import Contact from 'Screens/Contact/index.tsx'
import { ThemeProvider, createTheme, useMediaQuery } from '@mui/material'
import Projects from 'Screens/Projects'
import ProjectDetails from 'Screens/ProjectDetails'

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
        element: <Projects key={3}/>,
    },
    {
        path: "contact",
        element: <Contact key={4}/>
    },
    {
        path: "projects/:index",
        element: <ProjectDetails key={5}/>
    }
])

const darkTheme = createTheme({ 
    palette: { mode: 'dark' },
  });
const lightTheme = createTheme({
    ...darkTheme, 
    palette: { mode: 'light' }
});

function Main() {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const theme = prefersDarkMode ? darkTheme : lightTheme;
    return (
    <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
    </ThemeProvider>
    );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <Main/>
)
