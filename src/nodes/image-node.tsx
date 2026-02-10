import type {
  SerializedLexicalNode,
  Spread,
} from 'lexical'
import { DecoratorNode } from 'lexical'
import ResizableImageDecorator from '../decorator/image-resizable-decorator'

export type SerializedImageNode = Spread<
  {
    type: 'image'
    src: string
    alt: string
    width: number | 'auto'
    height: number | 'auto'
    version: 1
  },
  SerializedLexicalNode
>

export class ImageNode extends DecoratorNode<React.ReactNode> {
  __src: string
  __alt: string
  __width: number | 'auto'
  __height: number | 'auto'

  static getType() {
    return 'image'
  }

  constructor(
    src: string,
    alt: string = '',
    width: number | 'auto' = 'auto',
    height: number | 'auto' = 'auto',
    key?: string,
  ) {
    super(key)
    this.__src = src
    this.__alt = alt
    this.__width = width
    this.__height = height
  }

  static clone(node: ImageNode) {
    return new ImageNode(
      node.__src,
      node.__alt,
      node.__width,
      node.__height,
      node.__key,
    )
  }

  setSize(width: number | 'auto', height: number | 'auto') {
    const writable = this.getWritable()
    writable.__width = width
    writable.__height = height
  }

  createDOM() {
    const container = document.createElement('span')
    container.className = 'inline-block'
    return container
  }

  static importDOM() {
    const convert = (el: HTMLImageElement) => {
      const src = el.getAttribute('src') ?? ''
      const alt = el.getAttribute('alt') ?? ''
      const wAttr = el.getAttribute('width')
      const hAttr = el.getAttribute('height')

      const width = wAttr !== null ? parseInt(wAttr, 10) : 'auto'
      const height = hAttr !== null ? parseInt(hAttr, 10) : 'auto'

      return { node: new ImageNode(src, alt, width, height) }
    }

    return {
      img: (dom: HTMLElement) =>
        dom instanceof HTMLImageElement
          ? { conversion: () => convert(dom), priority: 1 as const }
          : null,

      span: (dom: HTMLElement) => {
        const onlyChild = dom.childNodes.length === 1 ? dom.firstChild : null
        if (!(onlyChild instanceof HTMLImageElement)) return null

        return {
          conversion: () => convert(onlyChild),
          priority: 3 as const,
        }
      },
    } as const
  }

  exportDOM() {
    const img = document.createElement('img')
    img.setAttribute('src', this.__src)
    img.setAttribute('alt', this.__alt)

    if (this.__width !== 'auto') img.setAttribute('width', String(this.__width))
    else img.removeAttribute('width')

    if (this.__height !== 'auto')
      img.setAttribute('height', String(this.__height))
    else img.removeAttribute('height')

    img.setAttribute('data-lexical-image', 'true')
    return { element: img }
  }

  updateDOM(prev: ImageNode, dom: HTMLElement) {
    const el = dom as HTMLImageElement
    if (prev.__src !== this.__src) el.src = this.__src
    if (prev.__alt !== this.__alt) el.alt = this.__alt

    if (prev.__width !== this.__width) {
      if (this.__width === 'auto') el.removeAttribute('width')
      else el.setAttribute('width', String(this.__width))
    }
    if (prev.__height !== this.__height) {
      if (this.__height === 'auto') el.removeAttribute('height')
      else el.setAttribute('height', String(this.__height))
    }
    return false
  }

  exportJSON(): SerializedImageNode {
    return {
      type: 'image',
      src: this.__src,
      alt: this.__alt,
      width: this.__width,
      height: this.__height,
      version: 1,
    }
  }

  static importJSON(serialized: SerializedImageNode): ImageNode {
    const { src, alt, width, height } = serialized
    return new ImageNode(src, alt, width, height)
  }

  decorate() {
    return (
      <ResizableImageDecorator
        src={this.__src}
        alt={this.__alt}
        width={this.__width}
        height={this.__height}
        nodeKey={this.getKey()}
      />
    )
  }
}
