import { Text } from "components/Generic/Text";
import { Link } from "react-router-dom";

import UI from "assets/images/Wordle_UI.png";

import { TextPD } from ".";

export default function WordleContent() {
    return <>
    <Text type="h1" className="mt-2">Introduction</Text>
    <TextPD>
        Wordle is a puzzle game where you need to guess a five letter word using up to six guesses. You are told if any letters from your guesses are in the target word. In my first foray into web programming, I decided to make a solver for Wordle that computes the best guess based on information theory.  
    </TextPD>
    <Text type="h1" className="mt-2">Process</Text>
    <TextPD>
        The first thing I did was gather a list of words from the English language. The exact number varies, but the list I chose had ~15,000 words. I also needed a list of the frequency of each word. Finally, I needed a list of all the valid words that can be a possible answer in Wordle, because the target word is from a curated list that most people are familiar with. After some preprocessing to filter for only five letter words, I then built a basic UI for the solver.
    </TextPD>
    <TextPD>
        The image above shows the solver making the optimal guesses for the word “apple”.
    </TextPD>
    <img
        src={UI}
        className="w-full h-auto"
    />
    <TextPD>
        The solver's logic is based on information theory where it tries to reduce the number of guesses as much as possible. It takes into account how frequent a word is and how “valuable” a word is. 
    </TextPD>
    <TextPD>
        The value of a word is a measure of how much information can be gained; you can try to guess the word “apple” and learn that the target word has the letter “a”. However, this is not surprising because it is a very common letter in English words.  
    </TextPD>
    <TextPD>
        On the other hand, a word like “queen” would reveal a lot of information if the letter “q” was revealed to be in the target word because only a few words have that letter.  
    </TextPD>
    <TextPD>
        By picking the word that maximizes the information gained, it reduces the number of possible answers the most until only one word is left. 
    </TextPD>
    <Text type="h1" className="mt-2">Retrospective</Text>
    <TextPD>
        At the time I thought I did a great job with my Wordle Solver, given that this was my first time developing a website and publishing with Github Pages. I also was happy that I improved the performance to an acceptable level using multithreading.
    </TextPD>
    <TextPD>
        However, I definitely should have utilized an actual web development framework for designing the website. The multithreading also forcibly used every thread available in user's systems which caused buffering in their other applications. Finally, my repository was not organized properly and should have had a more cohesive structure.
    </TextPD>
    <Text type="h1" className="mt-2">References</Text>
    <Text>
      <Link target="_blank" rel="noreferrer" to="https://www.nytimes.com/games/wordle/index.html">
      Wordle - https://www.nytimes.com/games/wordle/index.html
      </Link>
    </Text>
    <Text>
      <Link target="_blank" rel="noreferrer" to="https://github.com/JamesG9802/Wordle-Information-Gain">
      Source Code - https://github.com/JamesG9802/Wordle-Information-Gain
      </Link>
    </Text>
  </>
}