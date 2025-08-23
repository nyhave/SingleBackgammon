# Single Backgammon

Single Backgammon is a single-player backgammon implementation built with plain JavaScript and served through GitHub Pages. Open the game at [nyhave.github.io/SingleBackgammon](https://nyhave.github.io/SingleBackgammon/) or by loading `index.html` locally.

## How to play

Roll the dice with the **Roll** button or press **Enter**. Selecting a checker highlights its legal destinations; click a highlighted point to move. Use the **Help** button at any time to read instructions.

## Features so far

- Visual dice with clear face values that roll automatically at game start and at the beginning of each turn.
- Checkers highlight their available moves and can be dragged to legal points.
- Autoplay mode lets the AI play itself, with a step-through option for pausing and advancing one move at a time.
- Startup instructions overlay and an in-game help dialog explain the rules.
- A cache-clearing reload button is available for development or troubleshooting.
- A log button captures the current game state to the console for debugging.

## Development

No build step is required. Modify the source files and open `index.html` in a browser to test changes. Service workers enable offline support; use the cache-clearing button to update cached assets after modifying files.
