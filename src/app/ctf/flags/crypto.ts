export const CRYPTO_FLAGS = {
  6: "flag{ebg13_vf_gbb_rnfl_5566}", // Cipher
  17: "flag{base64_encoding_is_not_encryption_2211}", // Base64 Decode
} as const

export const CRYPTO_HINTS = {
  6: "Decode the strange text file.",
  17: "Base64 decode the secret.",
} as const
