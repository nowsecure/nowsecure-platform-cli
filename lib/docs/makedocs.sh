#!/bin/bash

HERE="$(cd "$(dirname "$0")" && pwd)"
TMPDIR=$(mktemp -d)
SRC="$(cd "$(dirname "$0")"/.. && pwd)"

# copy slate's original source to the temp directory
cp -r "${HERE}/slate/original"/* "${TMPDIR}"

#overwrite with our changes (allow 3-level nesting)
cp -r "${HERE}/slate/modified"/* "${TMPDIR}"

# Copy our source
cp -r "${HERE}/index.html.md" "${HERE}/includes" "${HERE}/images" "${TMPDIR}/source"

rm -r "${SRC}/htmldocs"

docker run --rm \
  -v "${TMPDIR}/source":/srv/slate/source \
  -v "${TMPDIR}/lib":/srv/slate/lib \
  -v "${SRC}/htmldocs":/srv/slate/build \
  slatedocs/slate:v2.13.1 \
  build