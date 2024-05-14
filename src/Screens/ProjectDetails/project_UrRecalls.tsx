import { Text } from "components/Generic/Text";
import { Link } from "react-router-dom";
import UrRecalls from "assets/images/UrRecalls_Mockup.png";
import { Strong } from "components/Generic/Strong";

export default function UrRecallsContent() {
    return <>
    <Text type="h2" className="mt-2">Introduction</Text>
    <Text>
      During my third and final year at NJIT, I worked on an industry project with <Link target="_blank" rel="noreferrer"  to="https://www.scanavert.com/">ScanAvert LLC</Link>. The company was offering the “UrRecalls” software project this semester, a mobile application for gathering and presenting recall information and notifications to consumers. UrRecalls has been worked on by four previous semesters of other NJIT capstone students over two years. While I was originally brought on to work on the <Strong>UI redesign</Strong>, I quickly assumed the role of a thorough <Strong>front-end redesign to tackle technical debt.</Strong>
    </Text>
    <Text type="h2" className="mt-2">Main Obstacles</Text>
    <Text>
    The UI of the application was clunky and unconducive to a modern mobile experience. This was relatively straightforward to fix; we utilized <Link target="_blank" rel="noreferrer" to="https://m3.material.io/">Google's Material Design Language</Link> to improve the cohesiveness and clarity of the application.
    </Text>
    <Text>
    Unfortunately refactoring the existing codebase proved to be a more daunting challenge. It was evident the previous teams either did not have a lot of experience with the technologies used. Documentation was non-existent, code styles changed haphazardly with unused files being scattered throughout the repository, and egregious security issues left vulnerable to exploitation. <Strong>It was not optimal.</Strong>
    </Text>
    <Text type="h2" className="mt-2">Solution</Text>
    <Text>
    Several techniques were utilized to tackle the problems. UI mockups were designed and iteratively refined to the business owner for feedback and improvement. Overall, this improved the <Strong>user experience</Strong> for the intended audience: ordinary consumers concerned about the safety of their food and drug products.
    </Text>
    <img
        src={UrRecalls}
        className="w-full h-auto my-4"
    />
    <Text>
    Validation and maintainability has always been one of the team's main considerations throughout development. Therefore as we refactored the project to modern best practices, we focused on the most important tasks: 
    </Text>
    <ol className="list-disc list-inside my-4">
        <li><Text className="inline">Migrating from JavaScript to the safer TypeScript.</Text></li>
        <li><Text className="inline">Using a standard styling theme and reusable components for the entire application.</Text></li>
        <li><Text className="inline">Fixing the API queries to improve performance.</Text></li>
        <li><Text className="inline">Documenting all existing and current work.</Text></li>
    </ol>
    <Text>
        These changes improved the quality of the code base and made it easier to test and review code written from other people. At the end of the semester, we tackled all the tasks assigned and went above and beyond to fix critical bugs as a result of the original project structure. 
    </Text>
    <Text type="h2" className="mt-2">Retrospective</Text>
    <Text>
    As my final project in my undergraduate studies, I tried to approach this project with the mindset of a professional developer. Compared to my earlier works, I can see how I placed a greater emphasis on <Strong>readability and maintainability</Strong> with more effort put into planning and designing solutions. It is my belief that, while my work may not have been perfect, it will have made the lives of future UrRecalls developers easier.
    </Text>
    <Text type="h1" className="mt-2">References</Text>
    <Text>
      <Link target="_blank" rel="noreferrer" to="https://www.scanavert.com/">
        ScanAvert LLC - https://www.scanavert.com/
      </Link>
    </Text>
    <Text>
      <Link target="_blank" rel="noreferrer" to="https://m3.material.io/">
        Google's Material Design Language - https://m3.material.io/
      </Link>
    </Text>
  </>
}