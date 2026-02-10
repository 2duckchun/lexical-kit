import type { SerializedLexicalNode, Spread } from 'lexical'
import { DecoratorNode } from 'lexical'

export type SerializedIframeNode = Spread<
  { type: 'iframe'; src: string; width: string; height: string; version: 1 },
  SerializedLexicalNode
>

export class IframeNode extends DecoratorNode<React.ReactNode> {
  __src: string
  __width: string
  __height: string

  static getType() {
    return 'iframe'
  }

  constructor(src: string, width = '500px', height = '890px', key?: string) {
    super(key)
    this.__src = src
    this.__width = width
    this.__height = height
  }

  static clone(node: IframeNode) {
    return new IframeNode(node.__src, node.__width, node.__height, node.__key)
  }

  createDOM(): HTMLElement {
    const wrapper = document.createElement('div')
    wrapper.className = 'flex w-full justify-center'
    return wrapper
  }

  static importDOM() {
    return {
      iframe: (dom: HTMLElement) => {
        if (!(dom instanceof HTMLIFrameElement)) return null

        const src = dom.src || dom.getAttribute('src') || ''
        const width =
          dom.getAttribute('width') ??
          (dom.style.width ? dom.style.width : '500px')
        const height =
          dom.getAttribute('height') ??
          (dom.style.height ? dom.style.height : '890px')

        return {
          conversion() {
            return { node: new IframeNode(src, width, height) }
          },
          priority: 1 as const,
        }
      },
    } as const
  }

  updateDOM() {
    return false
  }

  exportDOM(): { element: HTMLElement } {
    const wrapper = document.createElement('div')
    wrapper.style.display = 'flex'
    wrapper.style.justifyContent = 'center'
    wrapper.style.width = '100%'

    const iframe = document.createElement('iframe')
    iframe.src = this.__src
    iframe.width = this.__width
    iframe.height = this.__height
    iframe.allowFullscreen = true
    iframe.style.borderRadius = '6px'

    wrapper.appendChild(iframe)

    return { element: wrapper }
  }

  exportJSON(): SerializedIframeNode {
    return {
      type: 'iframe',
      src: this.__src,
      width: this.__width,
      height: this.__height,
      version: 1,
    }
  }

  static importJSON(j: SerializedIframeNode) {
    return new IframeNode(j.src, j.width, j.height)
  }

  decorate() {
    return (
      <iframe
        src={this.__src}
        width={this.__width}
        height={this.__height}
        allowFullScreen
        className="rounded-md"
      />
    )
  }
}
