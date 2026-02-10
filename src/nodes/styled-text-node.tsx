import { TextNode } from 'lexical'

export class StyledTextNode extends TextNode {
  __style: string

  static getType(): string {
    return 'styled-text'
  }

  constructor(text: string, style: string, key?: string) {
    super(text, key)
    this.__style = style
  }

  static clone(node: StyledTextNode): StyledTextNode {
    return new StyledTextNode(node.__text, node.__style, node.__key)
  }

  createDOM(): HTMLElement {
    const span = document.createElement('span')
    span.style.cssText = this.__style
    span.textContent = this.__text
    return span
  }

  exportDOM(): { element: HTMLElement } {
    const span = document.createElement('span')
    span.style.cssText = this.__style
    span.textContent = this.getTextContent()
    return { element: span }
  }

  static importDOM() {
    return {
      span: (el: HTMLElement) => {
        const style = el.getAttribute('style') ?? ''
        const text = el.textContent ?? ''
        return {
          conversion() {
            return { node: new StyledTextNode(text, style) }
          },
          priority: 2 as const,
        }
      },
    }
  }

  exportJSON() {
    return {
      ...super.exportJSON(),
      type: 'styled-text',
      style: this.__style,
    }
  }

  static importJSON(json: any) {
    return new StyledTextNode(json.text, json.style)
  }
}
