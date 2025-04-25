package main

import (
	"bytes"
	"compress/flate"
	"compress/gzip"
	"compress/zlib"
	"encoding/base64"
	"encoding/hex"
	"flag"
	"fmt"
	"io"
	"os"
)

func main() {
	// Define command line flags
	inputFile := flag.String("i", "", "Input file (defaults to stdin)")
	outputFile := flag.String("o", "", "Output file (defaults to stdout)")
	format := flag.String("f", "deflate", "Compression format (deflate, raw, gzip)")
	encoding := flag.String("e", "base64", "Input encoding (base64, hex, binary)")
	flag.Parse()

	// Read input data
	var inputData []byte
	var err error
	if *inputFile != "" {
		inputData, err = os.ReadFile(*inputFile)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error reading input file: %v\n", err)
			os.Exit(1)
		}
	} else {
		inputData, err = io.ReadAll(os.Stdin)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error reading from stdin: %v\n", err)
			os.Exit(1)
		}
	}

	// Decode the input based on encoding
	var decodedData []byte
	switch *encoding {
	case "hex":
		decodedData, err = hex.DecodeString(string(inputData))
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error decoding hex data: %v\n", err)
			os.Exit(1)
		}
	case "binary":
		decodedData = inputData
	case "base64":
		// Trim any whitespace or newlines from base64 input
		cleanInput := bytes.TrimSpace(inputData)
		decodedData, err = base64.StdEncoding.DecodeString(string(cleanInput))
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error decoding base64 data: %v\n", err)
			os.Exit(1)
		}
	default:
		fmt.Fprintf(os.Stderr, "Unknown encoding: %s\n", *encoding)
		os.Exit(1)
	}

	// Decompress the data
	var decompressedData []byte
	switch *format {
	case "deflate":
		// Try with zlib first (this is what pako's deflate actually produces)
		zlibReader, err := zlib.NewReader(bytes.NewReader(decodedData))
		if err == nil {
			decompressedData, err = io.ReadAll(zlibReader)
			zlibReader.Close()
			if err != nil {
				fmt.Fprintf(os.Stderr, "Error decompressing with zlib: %v\n", err)
				os.Exit(1)
			}
		} else {
			// Fallback to regular flate if zlib fails
			r := flate.NewReader(bytes.NewReader(decodedData))
			decompressedData, err = io.ReadAll(r)
			r.Close()
			if err != nil {
				fmt.Fprintf(os.Stderr, "Error decompressing deflate data: %v\n", err)
				os.Exit(1)
			}
		}
	case "raw":
		r := flate.NewReader(bytes.NewReader(decodedData))
		decompressedData, err = io.ReadAll(r)
		r.Close()
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error decompressing raw deflate data: %v\n", err)
			os.Exit(1)
		}
	case "gzip":
		r, err := gzip.NewReader(bytes.NewReader(decodedData))
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error creating gzip reader: %v\n", err)
			os.Exit(1)
		}
		decompressedData, err = io.ReadAll(r)
		r.Close()
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error decompressing gzip data: %v\n", err)
			os.Exit(1)
		}
	default:
		fmt.Fprintf(os.Stderr, "Unknown format: %s\n", *format)
		os.Exit(1)
	}

	// Write the output
	if *outputFile != "" {
		err = os.WriteFile(*outputFile, decompressedData, 0o644)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error writing output file: %v\n", err)
			os.Exit(1)
		}
	} else {
		_, err = os.Stdout.Write(decompressedData)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error writing to stdout: %v\n", err)
			os.Exit(1)
		}
	}
}
