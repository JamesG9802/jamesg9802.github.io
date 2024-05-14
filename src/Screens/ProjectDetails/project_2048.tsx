import { Text } from "components/Generic/Text";
import { Link } from "react-router-dom";

import { TextPD } from ".";

export default function TwentyFortyEightContent() {
    return <>
    <Text type="h1" className="mt-2">Introduction</Text>
    <TextPD>
      2048 is a puzzle game where you slide tiles on a 4x4 board. If a tile collides with another tile of the same value, they merge. Sometimes I play the game trying to get a high score by merging as many tiles as possible. But other times I just need something to do with my hands and I am sliding the board at random. I noticed, however, that this takes a surprisingly long time to end a game. Thus starts one of my first serious research projects into the optimal way to lose a game of 2048 as fast as possible.
    </TextPD>
    <TextPD>
      You can read my work <Link to="https://jamesg9802.github.io/2048/" target="_blank" rel="noreferrer">here.</Link>
    </TextPD>
    <Text type="h1" className="mt-2">References</Text>
    <Text>
      <Link target="_blank" rel="noreferrer" to="https://jamesg9802.github.io/2048/">
        2048 Research - https://jamesg9802.github.io/2048/
      </Link>
    </Text>
    <Text>
      <Link target="_blank" rel="noreferrer" to="https://play2048.co/">
        2048 (Original) - https://play2048.co/
      </Link>
    </Text>
  </>
}