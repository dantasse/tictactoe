# Tic Tac Toe

A thrilling game of adventure and intrigue

## To run

install npm, then:

- npm install
- npm run dev
- visit localhost:5173

## To play

It's a 10x10 "tic tac toe" vs an AI, where you need to get 4 in a row to win.

## 3d tic tac toe

Ok I implemented this too; to play it, checkout the `3d` branch, then npm install and npm run dev.

## Approach

Honestly, with Open Hands, making tic tac toe was pretty easy. The plan was:

- make a grid that you can click to make each square an X, and it says you win if you get 3 in a row
- make an opponent that makes some moves
- make the opponent's moves actually smart
- then, because 3x3 tic tac toe is basically solved, that's it! But let's make it harder: try a larger board (and 4 in a row, because 3 in a row gets pretty trivial)
- also, because this is not solved, we need a smarter solution, and minimax is, as far as I know, the simplest not-trivial game tree search algorithm, so implement that for the computer's moves
- and then try rendering this in 3d

But most of these lines were solved by asking Open Hands to do them. So I'm largely guiding the LLM, rather than writing myself. In a sense, the main challenge is understanding the implementation, so I know if it goes off the rails and how, or if it's avoiding some edge cases or otherwise not doing what I want.

## Tools used, and how
All Open Hands. My approach is something like "specify well, then code review" - I want to know what it's doing. I like that it asks me as it goes, so I can review each step, instead of just getting a mountain of code at the end.

Because time is short, I think I fell short of 100% understanding, especially in the minimax implementation and three.js code. When I'm doing similar things in production code, I'd spend more time with it and/or ask someone else to look through it with me.

## With more time

I suppose I'd dig into the minimax algorithm to make the computer better, because it's pretty easy as is.
I guess we could make it multiplayer as well, though that would require a server for shared state, so it would add some implementation time.