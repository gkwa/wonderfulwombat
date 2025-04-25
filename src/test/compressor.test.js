import { describe, it } from "node:test"
import { strict as assert } from "node:assert"
import { compress } from "../lib/compressor.js"
import { encode, decode } from "../lib/encoding.js"
import { inflate, inflateRaw, ungzip } from "pako"

describe("Compression tests", () => {
  // Using a longer string with repetitive content that will actually compress
  const testData = "Hello, WonderfulWombat! ".repeat(20)

  it("should compress and decompress using deflate", () => {
    const compressed = compress(testData, "deflate")
    assert.ok(compressed.length < Buffer.from(testData).length, "Data should be compressed")

    const decompressed = inflate(compressed)
    const decompressedText = new TextDecoder().decode(decompressed)
    assert.equal(decompressedText, testData, "Should restore the original data after decompression")
  })

  it("should compress and decompress using raw", () => {
    const compressed = compress(testData, "raw")
    assert.ok(compressed.length < Buffer.from(testData).length, "Data should be compressed")

    const decompressed = inflateRaw(compressed)
    const decompressedText = new TextDecoder().decode(decompressed)
    assert.equal(decompressedText, testData, "Should restore the original data after decompression")
  })

  it("should compress and decompress using gzip", () => {
    const compressed = compress(testData, "gzip")
    assert.ok(compressed.length < Buffer.from(testData).length, "Data should be compressed")

    const decompressed = ungzip(compressed)
    const decompressedText = new TextDecoder().decode(decompressed)
    assert.equal(decompressedText, testData, "Should restore the original data after decompression")
  })

  it("should encode and decode properly", () => {
    const compressed = compress(testData, "deflate")

    const base64Encoded = encode(compressed, "base64")
    assert.ok(typeof base64Encoded === "string", "Base64 encoded data should be a string")

    const decoded = decode(base64Encoded, "base64")
    assert.deepEqual(
      Array.from(decoded),
      Array.from(compressed),
      "Decoded data should match original compressed data",
    )

    const decompressed = inflate(decoded)
    const decompressedText = new TextDecoder().decode(decompressed)
    assert.equal(
      decompressedText,
      testData,
      "Should restore the original data after decoding and decompression",
    )
  })
})
