import { BEGINNER_FLAGS, BEGINNER_HINTS } from './beginner'
import { WEB_FLAGS, WEB_HINTS } from './web'
import { SYSTEM_FLAGS, SYSTEM_HINTS } from './system'
import { CRYPTO_FLAGS, CRYPTO_HINTS } from './crypto'
import { MISC_FLAGS, MISC_HINTS } from './misc'
import { DEEP_FLAGS, DEEP_HINTS } from './deep'

export const FLAGS = {
  ...BEGINNER_FLAGS,
  ...WEB_FLAGS,
  ...SYSTEM_FLAGS,
  ...CRYPTO_FLAGS,
  ...MISC_FLAGS,
  ...DEEP_FLAGS,
}

export const FLAG_HINTS = {
  ...BEGINNER_HINTS,
  ...WEB_HINTS,
  ...SYSTEM_HINTS,
  ...CRYPTO_HINTS,
  ...MISC_HINTS,
  ...DEEP_HINTS,
}