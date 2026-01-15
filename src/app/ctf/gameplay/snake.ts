
import { CommandHandler } from "../commands/types"

export const snake: CommandHandler = (args, { setSnakeActive, addToHistory }) => {
    addToHistory('output', 'Launching Snake Protocol...');
    addToHistory('output', 'Controls: Arrow Keys to move. Press ESC to exit.');
    setTimeout(() => {
        setSnakeActive(true);
    }, 1000);
}
