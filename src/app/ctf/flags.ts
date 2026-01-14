// This file is server-side only
// It contains the sensitive flags for the CTF challenge
// By keeping them here, we ensure they are not included in the client-side bundle
// even if source maps are enabled for the server actions wrapper.

export { FLAGS, FLAG_HINTS } from './flags/index'
