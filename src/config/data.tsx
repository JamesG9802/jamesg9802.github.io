import UrRecalls from "assets/images/scanavert.png";
import LanguageResearch from "assets/images/LanguageFeatureResearch.png";
import GoogleQuickDraw from "assets/images/GoogleQuickDraw.png";
import TwoFourtyEight from "assets/images/2048.png";
import Vulkan from "assets/images/Vulkan.png";
import HorizonBCBS from "assets/images/HorizonBCBS.png";
import Wordle from "assets/images/wordle.png";
import Fetal from "assets/images/Fetal.png";
import ChaosTicTacToe from "assets/images/ChaosTicTacToe.png";
import { ReactNode } from "react";
import UrRecallsContent from "Screens/ProjectDetails/project_UrRecalls";
import LanguageResearchContent from "Screens/ProjectDetails/project_LanguageFeatures";
import ChaosTicTacToeContent from "Screens/ProjectDetails/project_ChaosTTT";
import FetalHealthContent from "Screens/ProjectDetails/project_FetalMachineLearning";
import WordleContent from "Screens/ProjectDetails/project_Wordle";
import HorizonBCBSContent from "Screens/ProjectDetails/project_HCBCBS";
import TwentyFortyEightContent from "Screens/ProjectDetails/project_2048";
import VulkanContent from "Screens/ProjectDetails/project_Vulkan";
import GoogleQuickDrawContent from "Screens/ProjectDetails/project_GoogleQuickDraw";

export type Skill = {
  name: string,
  start_year: number, 
  experience: 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 4.5 | 5,
  image_path: string
}

export type Project = {
  name: string,
  owner: string,
  date_range: string,
  image_path: string,
  status: "Complete" | "Work in Progress",
  short_description: string,
  technologies: string[]
  content: ReactNode
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
    name: "SPSS",
    start_year: 2024,
    experience: 2.5,
    image_path: `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/spss/spss-original.svg`
  },
  {
    name: "WebGPU",
    start_year: 2024,
    experience: 3.5,
    image_path: `https://codelabs.developers.google.com/static/your-first-webgpu-app/img/b2dfc2b7faba3c13_856.png`
  },
  {
    name: "AWS",
    start_year: 2024,
    experience: 1.5,
    image_path: `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg`
  }
];

export const projects: Project[] = [
  {
    name: "UrRecalls Mobile Application",
    owner: "ScanAvert LLC",
    date_range: "Spring 2024",
    image_path: UrRecalls,
    status: "Complete",
    short_description: "A front-end redesign of a cross-platform mobile application for food and drug product recalls.",
    technologies: ["TypeScript", "React"],
    content: <UrRecallsContent/>,
  },
  {
    name: "Language Feature and Code Review Research",
    owner: "Undergraduate NJIT",
    date_range: "Spring 2024",
    image_path: LanguageResearch,
    status: "Complete",
    short_description: "An undergraduate research project examining the correlation between programming language features and code review success.",
    technologies: ["TypeScript", "React", "SPSS"],
    content: <LanguageResearchContent/>,
  },
  {
    name: "Google QuickDraw Machine Learning",
    owner: "Undergraduate NJIT",
    date_range: "Fall 2023",
    image_path: GoogleQuickDraw,
    status: "Complete",
    short_description: "An image classifier trained on Google's QuickDraw dataset.",
    technologies: ["Python"],
    content: <GoogleQuickDrawContent/>,
  },
  {
    name: "Vulkan 3D Engine Game",
    owner: "Undergraduate NJIT",
    date_range: "Fall 2023",
    image_path: Vulkan,
    status: "Complete",
    short_description: "A farming game where demonstrating the Vulkan 3D graphics API.",
    technologies: ["C", "Vulkan", "TypeScript", "React"],
    content: <VulkanContent/>,
  },
  {
    name: "2048 Fastest Lost Research",
    owner: "Personal",
    date_range: "Fall 2023",
    image_path: TwoFourtyEight,
    status: "Work in Progress",
    short_description: "Research into the optimal way to lose a 2048 game.",
    technologies: ["TypeScript", "React"] ,
    content: <TwentyFortyEightContent/>,
  },
  {
    name: "Health Plan and System Availability UI",
    owner: "Horizon Blue Cross Blue Shield",
    date_range: "Summer 2023",
    status: "Complete",
    image_path: HorizonBCBS,
    short_description: "Applications for the business users to edit health plans.",
    technologies: ["JavaScript", "Salesforce", "Apex", "Selenium"],
    content: <HorizonBCBSContent/>,
  },
  {
    name: "Wordle Information Gain Solver",
    owner: "Personal",
    date_range: "Spring 2023",
    status: "Complete",
    image_path: Wordle,
    short_description: "A solver for the puzzle game Wordle.",
    technologies: ["JavaScript", "HTML/CSS"],
    content: <WordleContent/>,
  },
  {
    name: "Fetal Health Machine Learning",
    owner: "Undergraduate NJIT",
    date_range: "Fall 2022",
    status: "Complete",
    image_path: Fetal,
    short_description: "Developed machine learning models to analyze trends in fetal health.",
    technologies: ["Python"],
    content: <FetalHealthContent/>,
  },
  {
    name: "Chaos TicTacToe",
    owner: "Personal",
    date_range: "Spring 2021",
    status: "Complete",
    image_path: ChaosTicTacToe,
    short_description: "The Tic-Tac-Toe game with 5 spin off variants.",
    technologies: ["Java"],
    content: <ChaosTicTacToeContent/>,
  }
];