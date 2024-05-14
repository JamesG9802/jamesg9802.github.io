import { Strong } from "components/Generic/Strong";
import { Text } from "components/Generic/Text";
import { Link } from "react-router-dom";
import { TextPD } from ".";

export default function LanguageResearchContent() {
    return <>
    <Text type="h2" className="mt-2">Introduction</Text>
    <TextPD>
      As a programmer, I always heard about how beloved Rust was for its memory safety. I also heard about how PHP was one of the most hated. This inspired me to see if perhaps there is some justification for this admiration. For my undergraduate research class, I chose to analyze the <Strong>potential relationship between Language Features and code reviews.</Strong> 
    </TextPD>
    <TextPD>
      You can read my paper <Link to="https://github.com/JamesG9802/Language-Feature-Code-Review/blob/main/CS485_%20Final%20Paper.pdf" target="_blank" rel="noreferrer">here.</Link>
    </TextPD>
    <Text type="h2" className="mt-2">Retrospective</Text>
    <TextPD>
      I can confidently say I've approached this research project with an appropriate level of care. However the complexity of the topic definitely hindered survey outreach and limited the power of the research. In the future I would like to restart the research with a simpler premise and with more respondents to make a more conclusive result.   
    </TextPD>
    <Text type="h1" className="mt-2">References</Text>
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
  </>
}