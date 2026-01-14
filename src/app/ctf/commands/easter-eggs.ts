import { CommandHandler } from "./types"

export const vi: CommandHandler = (args, { addToHistory }) => {
    addToHistory('output', "Entering Vi Improved...")
    addToHistory('output', "Type :q! to exit.")
    addToHistory('output', "flag{vi_exit_is_hard_colon_q_bang}")
}

export const matrix: CommandHandler = (args, { addToHistory }) => {
    addToHistory('output', "Wake up, Neo...")
    addToHistory('output', "flag{follow_the_white_rabbit_matrix}")
}

export const answer: CommandHandler = (args, { addToHistory }) => {
    addToHistory('output', "The Answer to the Ultimate Question of Life, the Universe, and Everything is 42.")
    addToHistory('output', "flag{answer_to_life_universe_everything_42}")
}

export const teapot: CommandHandler = (args, { addToHistory }) => {
    addToHistory('output', "HTTP 418 I'm a teapot")
    addToHistory('output', "flag{http_418_im_a_teapot}")
}
