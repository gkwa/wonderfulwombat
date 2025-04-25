#!/usr/bin/env node

import { program } from "commander"
import { compress } from "./lib/compressor.js"
import { readFileSync, writeFileSync } from "fs"
import { encode } from "./lib/encoding.js"

// Set up the CLI
program.name("wonderfulwombat").description("A tool to compress data using pako").version("1.0.0")

// Compress command
program
  .command("compress")
  .description("Compress data using pako")
  .option("-i, --input <file>", "input file (defaults to stdin)")
  .option("-o, --output <file>", "output file (defaults to stdout)")
  .option("-f, --format <format>", "compression format (deflate, raw, gzip)", "deflate")
  .option("-e, --encoding <encoding>", "output encoding (base64, hex, binary)", "base64")
  .option("-v, --verbose", "enable verbose output")
  .action((options) => {
    try {
      // Read input
      let inputData
      if (options.input) {
        inputData = readFileSync(options.input, "utf8")
      } else {
        // Read from stdin
        inputData = readFileSync(0, "utf8") // 0 is stdin file descriptor
      }

      // Compress the data
      const compressed = compress(inputData, options.format)

      // Encode the compressed data
      const encoded = encode(compressed, options.encoding)

      // Output
      if (options.output) {
        writeFileSync(options.output, encoded)
        if (options.verbose) {
          console.error(`Output written to ${options.output}`)
        }
      } else {
        process.stdout.write(encoded)
      }

      if (options.verbose) {
        const compressionRatio = (
          (compressed.length / Buffer.from(inputData).length) *
          100
        ).toFixed(2)
        console.error(
          `Compressed ${Buffer.from(inputData).length} bytes to ${compressed.length} bytes (${compressionRatio}%)`,
        )
      }
    } catch (error) {
      console.error("Error:", error.message)
      process.exit(1)
    }
  })

program.parse(process.argv)

// Default behavior if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp()
}
