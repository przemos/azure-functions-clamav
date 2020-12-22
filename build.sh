#!/bin/bash
set -e
pushd code 
npm run build:production
popd
docker build -t przemos/azure-func-clamav .