# pdf-clause-cli
In a classic developer fashion, I've decided It's too much hustle to spend 10 seconds on editing the GDPR clause in my resume manually, so I spent exponentially more time on writing a tool that does it for me. Hereby I present to you "pdf-clause-cli" - A small tool for automatically printing GDPR clauses on PDF resumes for multiple companies at a time!

**Note:** This tool requires the NodeJS runtime, preferably NodeJS 20 and above.

# Installation
```shell
# Clone the repository
git clone git@github.com:4S1ght/pdf-clause-cli.git ./
# Install dependencies
npm install
# Compile source code
npm run compile
# Give the program execute permissions
chmod +x ./build/bin.js
```

## Usage
The tool requires two independent input files 
- A font file in an OTF or TTF format.
- A PDF file to draw the clause on.

Download the font of your choosing and prepare the Resume PDF.  
After preparing all the files you will be able to use the command:

```shell
node ./build/bin.js
  --in ./Resume.pdf
  --out ./files/Resume {name}.pdf
  --font ./my-font.ttf
  --companyNames "Company 1 Ltd" "Company 2 Ltd"
```

The following command will take in the `Resume.pdf` file, `"Company 1 Ltd"` and `"Company 2 Ltd"` 
names and create two copies inside a `files/` directory. The clause will be written using 
the font supplied from `my-font.ttf`, at the bottom of the PDF's last page.

**Note:** It is **crucial** for the font used to support any special characters used by 
your language of choice, otherwise the program will throw errors if it encounters any 
special characters, such as `ź`, `ę`, etc.

---

The resulting command with all the supported parameters can be quite long and annoying to write,
in which case it's best to write a shell script that includes all your settings, such as the example below:
```zsh
# Using ZSH:
for company in "$@"; do
    node ./build/bin.js -f ./font.ttf -i ./test.pdf -o "./out/{name}.pdf" -cn $company -ms "130"
done
```
And then use it instead:
```zsh
./myScript.sh "Company 1 Ltd" "Company 2 Ltd"
```


### Parameters

#### Required
`-i, --in <inFile>`               - The "input" PDF file on which to draw the GDPR clause.  
`-o, --out <outFile>`             - The "output" PDF file path to which to save the resulting PDF files to. 
                                    This parameter must include a `{name}` string used as a placeholder for the company name. 
                                    This is to avoid name conflicts when generating new resumes.  
`-f, --font <font>`               - The font file used to draw the GDPR clause with.  
`-cn, --companyNames <names...>`  - Company names to write to the resulting PDF files. 
                                    Use double-quotes around company names containing spaces.  

#### Optional
`-c, --clause <string>`           - The text to use for the GDPR clause. Must include a "{name}" wildcard.
                                    Due ty my personal needs, the default clause is written in Polish.
                                    Use this parameter to specify your own value.
`-mb, --marginBottom <mb>`        - The amount of margin to be left at the bottom of the page. (default: "60")  
`-ms, --marginSides <ms>`         - The amount of margin to be left at the left/right edge of the page. (default: "43")  
`-fs, --fontSize <fs>`            - Clause font size (default: "11")  
`-fh, --fontHeight <height>`      - Height of individual lines of text produced using the supplied font. (default: "17")  
`-ctr, --center`                  - Whether to center the text. (default: true)  
