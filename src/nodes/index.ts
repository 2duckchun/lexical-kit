import type { Klass, LexicalNode } from 'lexical'
import { HeadingNode } from './heading-node'
import { HorizontalNode } from './horizontal-node'
import { IframeNode } from './iframe-node'
import { ImageNode } from './image-node'
import { LinkNode } from './link-node'
import { ListItemNode, ListNode } from './list-node'
import { QuoteNode } from './quote-node'
import { StyledTextNode } from './styled-text-node'
import { TableCellNode, TableNode, TableRowNode } from './table-node'

export const nodes: Klass<LexicalNode>[] = [
  HeadingNode,
  HorizontalNode,
  QuoteNode,
  ListNode,
  StyledTextNode,
  ListItemNode,
  LinkNode,
  ImageNode,
  TableNode,
  TableRowNode,
  TableCellNode,
  IframeNode,
]
