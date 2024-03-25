import { Card } from "@/interfaces/card";
import { v4 } from "uuid";
export type Deck = Card[];

export var suits = ["spades", "diamonds", "clubs", "hearts"];
export var names = [
  "A",
  "10",
  "J",
  "Q",
  "K",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
];
export const generateDeck = () => {
  var deck = [];
  for (var i = 0; i < suits.length; i++) {
    for (var j = 0; j < names.length; j++) {
      deck.push({
        id: v4(),
        suit: suits[i],
        name: names[j],
        value:
          names[j] == "A"
            ? [1, 11]
            : names[j] == "J" || names[j] == "Q" || names[j] == "K"
            ? [10]
            : [Number(names[j])],
      });
    }
  }
  return deck;
};
