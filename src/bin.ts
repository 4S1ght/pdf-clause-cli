#!/usr/bin/env node

import fs from 'fs'
import url from 'url'
import path from 'path'
import { Command } from 'commander'
import c from 'chalk'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))
const __package = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf-8'))
const __cwd = process.cwd()
const __clause = 'Wyrażam zgodę na przetwarzanie moich danych osobowych przez {name} w celu prowadzenia rekrutacji na aplikowane przeze mnie stanowisko.'

const program = new Command()

// Helpers ================================================

const toAbsolute = (p: string) => path.isAbsolute(p) ? p : path.join(__cwd, p)
const err = (msg: string) => { console.error(c.red(msg)); process.exit(-1) }

// Program ================================================

program
    .name(__package.name)
    .description(__package.description)
    .version(__package.version)
    .option('-i, --in <inFile>', 'The PDF file to take in.')
    .option('-o, --out <outFile>', 'The output file name. Must include a wildcard "{name}" to replace with company name.')
    .option('-c, --clause <string>', 'The text to use for the GDPR clause. Must include a "{name}" wildcard.', __clause)
    .option('-cn, --companyNames <names...>', 'The company names to take to include in the GDPR clause.')
    .option('-mb, --marginBottom <mb>', 'The amount of margin to be left at the bottom of the page.', '60')
    .option('-ms, --marginSides <ms>', 'The amount of margin to be left at the left/right edge of the page.', '43')
    .option('-fs, --fontSize <fs>', 'Clause font size', '11')
    .option('-f, --font <font>', 'path to the font .ttf/.otf file')
    .action(async (arg) => {

        if (!arg.in) err('--in option required.')
        if (!arg.companyNames) err('--companyNames option required.')
        if (!arg.font) err('--font option required.')

        // Prepare parameters
        const input     = toAbsolute(arg.in)
        const output    = toAbsolute(arg.out || path.join(__cwd, path.basename(arg.in)))
        const mb        = parseInt(arg.marginBottom)
        const ms        = parseInt(arg.marginSides)
        const fontsize  = parseInt(arg.fontSize)
        const clause    = arg.clause
        const font      = toAbsolute(arg.font)

        if (!output.includes('{name}')) err('No {name} specified in the file name.')

        const bytes = fs.readFileSync(input)

        for (let i = 0; i < arg.companyNames.length; i++) {

            const cn = arg.companyNames[i]
            const readyClause = clause.replace('{name}', cn)

            const pdfDoc = await PDFDocument.load(bytes)
            const page = pdfDoc.getPages()[0]
            const { width, height } = page.getSize()

            pdfDoc.registerFontkit(fontkit)
            const documentFont = await pdfDoc.embedFont(fs.readFileSync(font))

            // Draw a string of text diagonally across the first page
            page.drawText(readyClause, {
                x: ms,
                y: mb,
                size: fontsize,
                font: documentFont,
                maxWidth: width - ms*2,
                color: rgb(0, 0, 0),
            })

            // Serialize the PDFDocument to bytes (a Uint8Array)
            const pdfBytes = await pdfDoc.save()
            const out = output.replace('{name}', cn)

            // Save the newly generated file
            fs.mkdirSync(path.dirname(output), { recursive: true })
            fs.writeFileSync(out, pdfBytes)
            console.log(`Out: "${out}"`)

        }

        console.log(`Done in ${process.uptime().toPrecision(1)}s`)

    })

program.parse()