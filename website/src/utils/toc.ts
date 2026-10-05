import { CollectionSection } from "src/graphql/dailp"
import { Chapter } from "src/pages/edited-collections/edited-collection-context"

// Tuple to hold chapter and its index repreentation
export type NumberedChapter = [chapter: Chapter, indexNumber: string]

// Previous implementation used ordered list elements to display number of chapter.
// Takes chapter list and reutrns list of numbered chapters to maintain index.
export const assignNumbers = (
  chapters: Chapter[],
  section: CollectionSection
): NumberedChapter[] => {
  // The body uses decimal and the intro + credit use roman numerals
  const isBody = section === CollectionSection.Body
  const result: NumberedChapter[] = []

  chapters.forEach((chapter, i) => {
    const parentNum = isBody ? String(i + 1) : toRoman(i + 1)
    result.push([chapter, parentNum])

    // Children should display parent number then their own number
    chapter.children?.forEach((child, j) => {
      const childNum = isBody
        ? `${i + 1}.${j + 1}`
        : `${toRoman(i + 1)}.${toRoman(j + 1)}`
      result.push([child, childNum])
    })
  })

  return result
}

const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1]
const symbols = [
  "m",
  "cm",
  "d",
  "cd",
  "c",
  "xc",
  "l",
  "xl",
  "x",
  "ix",
  "v",
  "iv",
  "i",
]

// Number to roman numeral string for chapter representation
export const toRoman = (num: number): string => {
  let result = ""

  for (let i = 0; i < values.length; i++) {
    while (num >= values[i]!) {
      result += symbols[i]
      num -= values[i]!
    }
  }
  return result
}

// Return numbered chapters with substring of user input
export const filterNumberedChapters = (
  numbered: NumberedChapter[],
  userInput: string
): NumberedChapter[] => {
  const q = userInput.toLowerCase().trim()

  return numbered.filter(([chapter]) => chapter.title.toLowerCase().includes(q))
}
