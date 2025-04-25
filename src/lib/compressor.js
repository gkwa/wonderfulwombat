import { deflate, deflateRaw, gzip } from "pako"

/**
 * Compress data using the specified format
 * @param {string} data - The data to compress
 * @param {string} format - Compression format (deflate, raw, gzip)
 * @returns {Uint8Array} The compressed data
 */
export function compress(data, format) {
  switch (format.toLowerCase()) {
    case "raw":
      return deflateRaw(data)
    case "gzip":
      return gzip(data)
    case "deflate":
    default:
      return deflate(data)
  }
}
