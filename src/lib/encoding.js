/**
 * Encode binary data in the specified format
 * @param {Uint8Array} data - The binary data to encode
 * @param {string} encoding - The encoding to use (base64, hex, binary)
 * @returns {string} The encoded data
 */
export function encode(data, encoding) {
  const buffer = Buffer.from(data)

  switch (encoding.toLowerCase()) {
    case "hex":
      return buffer.toString("hex")
    case "binary":
      return buffer.toString("binary")
    case "base64":
    default:
      return buffer.toString("base64")
  }
}

/**
 * Decode data from the specified encoding
 * @param {string} data - The encoded data
 * @param {string} encoding - The encoding to decode from (base64, hex, binary)
 * @returns {Buffer} The decoded data
 */
export function decode(data, encoding) {
  switch (encoding.toLowerCase()) {
    case "hex":
      return Buffer.from(data, "hex")
    case "binary":
      return Buffer.from(data, "binary")
    case "base64":
    default:
      return Buffer.from(data, "base64")
  }
}
