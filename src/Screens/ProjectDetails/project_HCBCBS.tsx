import { Strong } from "components/Generic/Strong";
import { Text } from "components/Generic/Text";

import { TextPD } from ".";

export default function HorizonBCBSContent() {
    return <>
    <Text type="h1" className="mt-2">Introduction</Text>
    <TextPD>
        During the summer, I interned with Horizon Blue Cross Blue Shield as an enterprise applications intern to develop business-side applications. It was a rewarding experience where I got an opportunity to work in a corporate environment and utilize the agile scrum methodology. 
    </TextPD>
    <Strong>
        Due to the confidential nature of the work, some details may be omitted.
    </Strong>
    <Text type="h1" className="mt-2">Process</Text>
    <TextPD>
        One of the team's projects was to modernize health plan creation by creating a UI for business owners. We started off by gathering requirements through interviews with the employees to learn more about the current process and what features were desired in the final product.
    </TextPD>
    <TextPD>
        We developed UI mockups and implemented them on a weekly basis with SalesForce and JavaScript. During the end of the week we demonstrated our prototype's capabilities to receive feedback on what worked well and what could be improved. 
    </TextPD>
    <TextPD>
        Collaboration and consistency was a very important factor for the team as we spent a lot of time ensuring everyone was up to speed. This was achieved through constant pair programming, code reviews, and team discussions to maintain our velocity.
    </TextPD>
    <Text type="h1" className="mt-2">Retrospective</Text>
    <TextPD>
        Being immersed into the agile world was definitely very eye-opening coming from the world of college programming. I definitely learned more about how important communication is in developing software; arguably it is just as critical as being a skilled programmer. Having a consistent code style, system design, and documentation was a key factor in our success.
    </TextPD>
    <TextPD>
        Of course it is important to recognize that there were some areas where improvements could have been made. Our collective lack of web programming experience led to, quite frankly, unusual structural designs that made the code harder to extend in the future. An interesting note is how the team tended to be blind to certain quirks with our product that the business owners would quickly catch—perhaps programmers are more used to clunky terminals and user interfaces?
    </TextPD>
    <TextPD>
        I can say that I definitely remember the feedback that our managers gave to us throughout the summer and have incorporated it into my future projects ever since.
    </TextPD>
  </>
}