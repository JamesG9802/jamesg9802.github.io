import { Strong } from "components/Generic/Strong";
import { Text } from "components/Generic/Text";
import { Link } from "react-router-dom";

import CTT_pregame from "assets/images/ChaosTicTacToe_pregame.png";
import CTT_game from "assets/images/ChaosTicTacToe_game.png";
import { TextPD } from ".";

export default function ChaosTicTacToeContent() {
    return <>
    <Text type="h1" className="mt-2">Introduction</Text>
    <TextPD>
        I've been programming for a few years at this point and have been experimenting with Unity. At this point in my life, I was enamored with the idea of making a game engine, even though I had no real idea how game engines were even made. Nevertheless, I decided to make a simple Tic-Tac-Toe game in a custom 2D engine in Java based on what I knew from using Unity.
    </TextPD>
    <Text type="h1" className="mt-2">Tic-Tac-Toe Variations</Text>
    <TextPD>
        Not satisfied with just regular Tic-Tac-Toe, I wanted to add different variations of TIc-Tac-Toe that I found at the time on Wikipedia. However, I decided I wanted to make a "Chaos" Tic-Tac-Toe by turning the variants into rules and letting players select any combination of rules. This would allow players to mix and match different variations for more crazy games. I decided to implement five different variations as rules:
    </TextPD>
    <ul className="list-disc list-inside my-4">
        <li><Text className="inline"><Strong>Ultimate:</Strong> The board expands from a 3x3 board to a 9x9 board.</Text></li>
        <li><Text className="inline"><Strong>Wild:</Strong> You can use either X or O.</Text></li>
        <li><Text className="inline"><Strong>Misere:</Strong> You lose the game if you would normally win.</Text></li>
        <li><Text className="inline"><Strong>Notakto:</Strong> Only X is allowed.</Text></li>
        <li><Text className="inline"><Strong>Random:</Strong> A coin toss determines which player's turn it is.</Text></li>
    </ul>
    <TextPD>
        Below is an image showing the application selection screen for picking the rule variants you want for the game. The 'Random' rule variant is chosen here. 
    </TextPD>
    <img
        src={CTT_pregame}
        className="w-full h-auto"
    />
    <TextPD>
        The next screen shows the actual game board. On the top right are the active rules, indicated by the blue dot. Because the 'Random' rule is chosen, the current turn is decided by the coin. The coin's face is currently heads so it is Player 1's turn to move.
    </TextPD>
    <img
        src={CTT_game}
        className="w-full h-auto"
    />
    <Text type="h1" className="mt-2">Retrospective</Text>
    <TextPD>
        On the one hand, I definitely think I should be happy that I managed to design a—relatively—unique game and actually bring it to fruition. It required researching and moving beyond the relatively basic concepts taught at school to synthesize a working system.
    </TextPD>
    <TextPD>
        But on the other hand, there are so many strange software design decisions and antipatterns used that I will likely never touch this code again; I would much rather rewrite the entire thing completely. Screens do not resize properly, everything relies on hard coded magic numbers, and the user interface is just unpolished in general.
    </TextPD>
    <TextPD>
        Nevertheless I still find it a valuable experience, both in the act of creating Chaos Tic-Tac-Toe and reviewing my old work to examine my failings. Every programmer needs to write their first program, afterall. Being able to accurately assess one's work is an essential skill for improvement.
    </TextPD>
    <TextPD>
        Though even I have to question my own sanity when I see these nightmare code constantly sprinkled throughout:
    </TextPD>
    <div className="py-2">
        <Text className="font-mono bg-l_background-200 dark:bg-d_background-200 text-l_onBackground-200 dark:text-d_onBackground-200">
            {
`g.fillRect((int) (objectSpecs[1][0]+(3/38.0)*objectSpecs[1][2]+i%3*(11/38.0)*objectSpecs[1][2]),
(int) (objectSpecs[1][1]+(3/38.0)*objectSpecs[1][2]+i/3*(11/38.0)*objectSpecs[1][2]),
(int) (objectSpecs[1][2]*(10/38.0)),
(int) (objectSpecs[1][3]*(10/38.0)));`
            }
        </Text>
    </div>
    <Text type="h1" className="mt-2">References</Text>
    <Text>
      <Link target="_blank" rel="noreferrer" to="https://en.wikipedia.org/wiki/Tic-tac-toe_variants">
        Tic-Tac-Toe variants - https://en.wikipedia.org/wiki/Tic-tac-toe_variants
      </Link>
    </Text>
    <Text>
      <Link target="_blank" rel="noreferrer" to="https://github.com/JamesG9802/Chaos-TicTacToe">
        Source Code - https://github.com/JamesG9802/Chaos-TicTacToe
      </Link>
    </Text>
  </>
}