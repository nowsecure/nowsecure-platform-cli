#!/usr/bin/env bash

set -exv

HERE="$(cd "$(dirname "$0")" && pwd)"
SRC="$(cd "$(dirname "$0")"/.. && pwd)"
OS=$(uname)

cd "${SRC}"

# build the libraries for release

function build () {
  if [ "${CI_CD_BUILD}" ]; then
    yarn --cwd "../$1" unlink || true
    rm -rf "../$1/node_modules"
    yarn --cwd "../$1" install --frozen-lockfile
  fi
  yarn --cwd "../$1" build
  yarn --cwd "../$1" test
}

function copy_lib() {
  # use yarn pack to export only what a yarn publish would do
  yarn --cwd "../$1" pack -f "tmp/$1.tgz"
  tar -C tmp -xf "tmp/$1.tgz"
  mv tmp/package "tmp/$1"
}

# Must be in this order, sarif and github-snapshot depend on lib
build lib
build github-snapshot
build sarif

if [ -L "node_modules/@nowsecure/platform-lib" ]; then
  yarn unlink @nowsecure/platform-lib @nowsecure/github-snapshot @nowsecure/sarif
  yarn install --force --frozen-lockfile
  LINKED=1
fi

build cli
yarn prepack

# export the library to the place that `oclif pack` will look for it
rm -rf tmp
mkdir tmp
copy_lib lib
copy_lib github-snapshot
copy_lib sarif

if [[ "$OS" == 'Darwin' ]]; then
  yarn package-macos
else
  mkdir -p tmp/artifacts
  yarn package-deb
  cp dist/deb/* tmp/artifacts/
  yarn package-win
  cp dist/win32/* tmp/artifacts/
fi

if [ -n "${LINKED}" ]; then
  yarn link @nowsecure/platform-lib @nowsecure/github-snapshot @nowsecure/sarif
fi