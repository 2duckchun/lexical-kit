'use client'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { TablePlugin } from '@lexical/react/LexicalTablePlugin'
import { INSERT_TABLE_COMMAND } from '@lexical/table'
import { Table } from 'lucide-react'

import { Button } from '../ui/button'

export default function TableInsertPlugin() {
  const [editor] = useLexicalComposerContext()

  const insertTable = () => {
    const rows = parseInt(prompt('Rows?', '3') ?? '0', 10)
    const cols = parseInt(prompt('Cols?', '3') ?? '0', 10)
    if (!rows || !cols) return
    editor.dispatchCommand(INSERT_TABLE_COMMAND, {
      rows: String(rows),
      columns: String(cols),
      includeHeaders: false,
    })
  }

  return (
    <>
      <TablePlugin hasCellBackgroundColor />
      <Button
        type="button"
        variant="outline"
        size="icon"
        title="Table"
        onClick={insertTable}
        className="rounded-full"
      >
        <Table />
      </Button>
    </>
  )
}
