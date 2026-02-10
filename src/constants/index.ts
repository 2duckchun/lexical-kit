export const SupportedBlockType = {
  h1: 'Heading 1',
  h2: 'Heading 2',
  h3: 'Heading 3',
  paragraph: 'Paragraph',
  quote: 'Quote',
  number: 'Numbered List',
  bullet: 'Bulleted List',
} as const

export type BlockType = keyof typeof SupportedBlockType
