#!/usr/bin/env bash

# Adapted from https://dev.to/davidsbond/golang-structuring-repositories-with-protocol-buffers-3012

# Get current directory.
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# Find all directories containing at least one prototfile.
# Based on: https://buf.build/docs/migration-prototool#prototool-generate.
for dir in $(find ${DIR}/Protos -name '*.proto' -print0 | xargs -0 -n1 dirname | sort | uniq); do
  files=$(find "${dir}" -name '*.proto')

  # Generate all files with protoc-gen-go.
  # protoc -I ${DIR} --go_out=paths=source_relative --go-grpc_out=paths=source_relative:${DIR}/gen ${files}
  protoc -I ${DIR} --go_out=${DIR}/gen --go_opt=paths=source_relative \
    --go-grpc_out=${DIR}/gen --go-grpc_opt=paths=source_relative \
    ${files}
done

