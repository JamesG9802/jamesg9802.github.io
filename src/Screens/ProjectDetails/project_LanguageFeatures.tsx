import { Text } from "components/Generic/Text";
import { Link } from "react-router-dom";

export default function LanguageResearchContent() {
    return <>
    <Text type="h2" className="mt-2">Introduction</Text>
    <Text>
      As a programmer, I always heard about how beloved <Link target="_blank" rel="noreferrer" to="https://www.rust-lang.org/">Rust</Link> was for its memory safety. I also heard about how <Link target="_blank" rel="noreferrer" to="https://www.php.net/">PHP</Link> was one of the most hated. This inspired me to see if perhaps there is some justification for this admiration. For my undergraduate research class, I chose to analyze the <Text className="font-bold inline">potential relationship between Language Features and code reviews.</Text>
    </Text>
    <Text type="h2" className="mt-2">Methodology</Text>
    <Text>
    I chose to design a survey where respondents could review different code snippets utilizing different language features and grade them based on measures of quality. If there were truly a relationship between language features and code reviews, then it was likely that respondents would give statistically different scores for those code snippets. 
    </Text>
    <Text>
    To better capture my survey requirements, I built a survey website to present respondents a random selection of code snippets to review. You can check out the website<Link target="_blank" rel="noreferrer" to="https://jamesg9802.github.io/Language-Feature-Code-Review/">here</Link>.
    </Text>
    <Text>
    After a period of around a month and a half, we captured enough data to analyze it. I used <Link target="_blank" rel="noreferrer" to="https://www.ibm.com/products/spss-statistics">IBM SPSS</Link> to analyze the data.
    </Text>
    <Text type="h2" className="mt-2">Results</Text>
    <Text>
    I won't be going over the actual statistical analysis, but you can find a detailed reporting in our paper at <Link target="_blank" rel="noreferrer" to="https://github.com/JamesG9802/Language-Feature-Code-Review/blob/main/CS485_%20Final%20Paper.pdf">the Github</Link>.
    </Text>
    <Text>

    </Text>
    <Text type="h2" className="mt-2">Retrospective</Text>
    <Text type="h2" className="mt-2">References</Text>
    <Text>
      <Text>
        <Link target="_blank" rel="noreferrer" to="https://www.rust-lang.org/">
          Rust Programming Language - https://www.rust-lang.org/
        </Link>
      </Text>
      <Text>
        <Link target="_blank" rel="noreferrer" to="https://www.php.net/">
          PHP Programming Language - https://www.php.net/
        </Link>
      </Text>
      <Text>
        <Link target="_blank" rel="noreferrer" to="https://jamesg9802.github.io/Language-Feature-Code-Review/">
          Research survey website - https://jamesg9802.github.io/Language-Feature-Code-Review/
        </Link>
      </Text>
      <Text>
        <Link target="_blank" rel="noreferrer" to="https://www.ibm.com/products/spss-statistics">
          IBM SPSS - https://www.ibm.com/products/spss-statistics
        </Link>
      </Text>
    </Text>
  </>
}