#!/bin/bash
set -e

echo "=== Testing WonderfulWombat ==="

# Create test input file
echo "Creating test data..."
cat >test/input.txt <<EOF
This is a test file for WonderfulWombat compression and decompression.
The quick brown fox jumps over the lazy dog.
This text is repeated to ensure we have enough data for compression to be effective.
This is a test file for WonderfulWombat compression and decompression.
The quick brown fox jumps over the lazy dog.
EOF

# Test deflate format
echo "Testing DEFLATE compression..."
node src/index.js compress -i test/input.txt -o test/compressed-deflate.txt -f deflate -e base64 -v

echo "Testing DEFLATE decompression..."
./wonderfulwombat-go -i test/compressed-deflate.txt -o test/decompressed-deflate.txt -f deflate -e base64

echo "Verifying DEFLATE results..."
if diff test/input.txt test/decompressed-deflate.txt >/dev/null; then
    echo "✅ DEFLATE test: Success!"
else
    echo "❌ DEFLATE test: Failed!"
    exit 1
fi

# Test raw format
echo "Testing RAW compression..."
node src/index.js compress -i test/input.txt -o test/compressed-raw.txt -f raw -e base64 -v

echo "Testing RAW decompression..."
./wonderfulwombat-go -i test/compressed-raw.txt -o test/decompressed-raw.txt -f raw -e base64

echo "Verifying RAW results..."
if diff test/input.txt test/decompressed-raw.txt >/dev/null; then
    echo "✅ RAW test: Success!"
else
    echo "❌ RAW test: Failed!"
    exit 1
fi

# Test gzip format
echo "Testing GZIP compression..."
node src/index.js compress -i test/input.txt -o test/compressed-gzip.txt -f gzip -e base64 -v

echo "Testing GZIP decompression..."
./wonderfulwombat-go -i test/compressed-gzip.txt -o test/decompressed-gzip.txt -f gzip -e base64

echo "Verifying GZIP results..."
if diff test/input.txt test/decompressed-gzip.txt >/dev/null; then
    echo "✅ GZIP test: Success!"
else
    echo "❌ GZIP test: Failed!"
    exit 1
fi

echo "All tests completed successfully!"
