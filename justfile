# List available recipes
default:
    just --list

# e2e test
e2e:
    just setup test clean

# Setup everything needed for testing
setup:
    ./setup.sh

# Run all tests
test:
    pnpm test
    ./test.sh

# Clean up test files and artifacts
clean:
    ./cleanup.sh
