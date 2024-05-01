export type Skill = {
    name: string,
    start_year: number, 
    experience: 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 4.5 | 5,
    image_path: string
}

export const skills: Skill[] = [
    {
        name: "Python",
        start_year: 2016,
        experience: 4,
        image_path: `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original-wordmark.svg`
    },
    {
        name: "HTML/CSS",
        start_year: 2017,
        experience: 5,
        image_path: `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original-wordmark.svg`
    },
    {
        name: "JavaScript",
        start_year: 2017,
        experience: 5,
        image_path: `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg`
    },
    {
        name: "Java",
        start_year: 2018,
        experience: 4,
        image_path: `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-plain-wordmark.svg`
    },
    {
        name: "C#",
        start_year: 2019,
        experience: 4,
        image_path: `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg`
    },
    {
        name: "C++",
        start_year: 2021,
        experience: 3,
        image_path: `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg`
    },
    {
        name: "C",
        start_year: 2022,
        experience: 5,
        image_path: `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/c/c-original.svg`
    },
    {
        name: "PHP",
        start_year: 2022,
        experience: 3,
        image_path: `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg`
    },
    {
        name: "SQL",
        start_year: 2022,
        experience: 3.5,
        image_path: `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azuresqldatabase/azuresqldatabase-original.svg`
    },
    {
        name: "Bash",
        start_year: 2022,
        experience: 3,
        image_path: `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bash/bash-original.svg`
    },
    {
        name: "Selenium",
        start_year: 2023,
        experience: 3,
        image_path: `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/selenium/selenium-original.svg`  
    },
    {
        name: "Vulkan",
        start_year: 2023,
        experience: 2,
        image_path: `https://www.svgrepo.com/show/306945/vulkan.svg`
    },
    {
        name: "Rust",
        start_year: 2023,
        experience: 3,
        image_path: `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/rust/rust-original.svg`
    },
    {
        name: "TypeScript",
        start_year: 2023,
        experience: 4,
        image_path: `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg`
    },
    {
        name: "React",
        start_year: 2023,
        experience: 4,
        image_path: `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original-wordmark.svg`
    },
    {
        name: "WebGPU",
        start_year: 2024,
        experience: 3.5,
        image_path: `https://codelabs.developers.google.com/static/your-first-webgpu-app/img/b2dfc2b7faba3c13_856.png`
    }
];

export default skills;