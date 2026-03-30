declare module 'react-quill-new' {
  import { ComponentType } from 'react'

  interface ReactQuillProps {
    theme?: string
    value?: string
    defaultValue?: string
    onChange?: (value: string) => void
    onChangeSelection?: (range: { index: number; length: number } | null, source: string, editor: any) => void
    onFocus?: (range: { index: number; length: number }, source: string, editor: any) => void
    onBlur?: (previousRange: { index: number; length: number }, source: string, editor: any) => void
    placeholder?: string
    readOnly?: boolean
    disabled?: boolean
    modules?: Record<string, any>
    formats?: string[]
    style?: React.CSSProperties
    className?: string
    bounds?: string | HTMLElement
    scrollingContainer?: string | HTMLElement
    preserveWhitespace?: boolean
  }

  const ReactQuill: ComponentType<ReactQuillProps>
  export default ReactQuill
}
