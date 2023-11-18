#!/bin/zsh

G='\033[0;32m'
R='\033[0;31m'
RS='\033[0m'

# Install dependencies
if [ ! -d "./node_modules/" ] 
then
    echo "${G}Installing NPM modules...${RS}"
    npm install
fi

# Compile source code
if [ ! -f "./build/bin.js" ] 
then
    echo "${G}Compiling from source code...${RS}"
    tsc
fi

# Throw an error if no params were supplied
if [ $# -eq 0 ]; then
    echo "${R}Error: No parameters provided${RS}"
    exit 1
fi

for company in "$@"; do
    node ./build/bin.js -f ./font.ttf -i ./test.pdf -o "./out/{name}.pdf" -cn $company -ms "130"
done