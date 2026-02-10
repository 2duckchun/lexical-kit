import type { LexicalCommand } from 'lexical'
import { createCommand } from 'lexical'

export const INSERT_IMAGE_COMMAND: LexicalCommand<{
  src: string
  alt: string
  width: number
  height: number
}> = createCommand('INSERT_IMAGE_COMMAND')
