import { useEffect } from 'react'
import {
  Bold,
  Code,
  Heading2,
  Heading3,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo2,
} from 'lucide-react'
import { EditorContent, useEditor, useEditorState, type Editor } from '@tiptap/react'
import { Markdown } from '@tiptap/markdown'
import { Paragraph } from '@tiptap/extension-paragraph'
import { StarterKit } from '@tiptap/starter-kit'
import { Placeholder } from '@tiptap/extensions'
import ReactMarkdown from 'react-markdown'
import remarkBreaks from 'remark-breaks'
import remarkGfm from 'remark-gfm'

import { useTranslation } from '@/shared/i18n'
import { useAppDispatch } from '@/shared/lib/hooks'
import { cn, createLinkDialogRequest } from '@/shared/lib/utils'
import { openDialog } from '@/shared/model'
import { Button } from '@/shared/ui/button'

/**
 * Styles applied to rendered editor output, both in the editable area
 * and in the static read-only view.
 */
const CONTENT_CLASS =
  '[&_h1]:text-xl [&_h1]:font-bold [&_h1]:my-3 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:my-3 ' +
  '[&_h3]:text-base [&_h3]:font-bold [&_h3]:my-3 [&_h4]:text-sm [&_h4]:font-bold [&_h4]:my-3 ' +
  '[&_h5]:text-sm [&_h5]:font-bold [&_h5]:my-3 [&_h6]:text-xs [&_h6]:font-bold [&_h6]:my-3 ' +
  '[&>*:first-child]:mt-0 [&>*:last-child]:mb-0 ' +
  '[&_p]:my-3 ' +
  '[&_p.is-empty]:before:text-muted-foreground ' +
  '[&_p.is-empty]:before:content-[attr(data-placeholder)] [&_p.is-empty]:before:float-left ' +
  '[&_p.is-empty]:before:pointer-events-none [&_p.is-empty]:before:h-0 ' +
  '[&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-5 ' +
  '[&_li]:my-0.5 [&_li_p]:my-0 ' +
  '[&_blockquote]:my-3 [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-3 ' +
  '[&_blockquote]:text-muted-foreground [&_pre]:my-3 [&_pre]:overflow-x-auto [&_pre]:rounded-md ' +
  '[&_pre]:bg-muted [&_pre]:p-2 [&_pre]:text-xs [&_code]:rounded-sm [&_code]:bg-muted [&_code]:px-1 ' +
  '[&_code]:py-0.5 [&_code]:text-xs [&_pre_code]:bg-transparent [&_pre_code]:p-0 ' +
  '[&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 ' +
  '[&_hr]:my-3 [&_hr]:border-border'

type RichTextContentProps = {
  value: string | null | undefined
  className?: string
}

/**
 * Paragraphs that serialize empty lines as `&nbsp;` so blank lines survive the
 * markdown round-trip instead of being collapsed by the parser.
 */
const ParagraphWithBlankLines = Paragraph.extend({
  renderMarkdown(node, helpers) {
    const content = Array.isArray(node.content) ? node.content : []

    if (content.length === 0) {
      return '&nbsp;'
    }

    return helpers.renderChildren(content)
  },
})

/**
 * Read-only rendering of markdown content.
 */
export function RichTextContent({ value, className }: RichTextContentProps) {
  const text = value?.trim()

  if (!text) {
    return null
  }

  return (
    <div className={cn('text-sm break-words', CONTENT_CLASS, className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{text}</ReactMarkdown>
    </div>
  )
}

type ToolbarButtonProps = {
  editor: Editor
  label: string
  active: boolean
  disabled?: boolean
  onClick: () => void
  children: React.ReactNode
}

function ToolbarButton({ editor, label, active, disabled, onClick, children }: ToolbarButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled || !editor.can().chain().focus().run()}
      onClick={onClick}
      className={cn(active && 'bg-muted text-foreground')}
    >
      {children}
    </Button>
  )
}

type RichTextEditorProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  autoFocus?: boolean
  className?: string
}

export function RichTextEditor({
  value,
  onChange,
  placeholder,
  autoFocus,
  className,
}: RichTextEditorProps) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: false,
        link: {
          openOnClick: false,
          autolink: true,
          defaultProtocol: 'https',
        },
      }),
      ParagraphWithBlankLines,
      Markdown,
      Placeholder.configure({
        placeholder: placeholder ?? '',
        // Show the placeholder only when the whole document is empty, not on
        // every empty paragraph.
        emptyNodeClass: ({ editor }) => (editor.isEmpty ? 'is-empty' : ''),
      }),
    ],
    content: value,
    contentType: 'markdown',
    editable: true,
    autofocus: autoFocus ? 'end' : false,
    onUpdate: ({ editor }) => onChange(editor.getMarkdown()),
    editorProps: {
      attributes: {
        spellcheck: 'false',
      },
    },
  })

  // Keep the editor in sync when the value is changed externally (e.g. form reset).
  useEffect(() => {
    if (editor && value !== editor.getMarkdown()) {
      editor.commands.setContent(value, { contentType: 'markdown', emitUpdate: false })
    }
  }, [editor, value])

  const {
    canUseLink,
    isBold,
    isItalic,
    isUnderline,
    isStrike,
    isCode,
    isH2,
    isH3,
    isBulletList,
    isOrderedList,
    isBlockquote,
    isCodeBlock,
    isLink,
  } = useEditorState({
    editor,
    selector: ({ editor }) => ({
      canUseLink: editor ? !editor.state.selection.empty || editor.isActive('link') : false,
      isBold: editor?.isActive('bold') ?? false,
      isItalic: editor?.isActive('italic') ?? false,
      isUnderline: editor?.isActive('underline') ?? false,
      isStrike: editor?.isActive('strike') ?? false,
      isCode: editor?.isActive('code') ?? false,
      isH2: editor?.isActive('heading', { level: 2 }) ?? false,
      isH3: editor?.isActive('heading', { level: 3 }) ?? false,
      isBulletList: editor?.isActive('bulletList') ?? false,
      isOrderedList: editor?.isActive('orderedList') ?? false,
      isBlockquote: editor?.isActive('blockquote') ?? false,
      isCodeBlock: editor?.isActive('codeBlock') ?? false,
      isLink: editor?.isActive('link') ?? false,
    }),
  }) ?? {
    canUseLink: false,
    isBold: false,
    isItalic: false,
    isUnderline: false,
    isStrike: false,
    isCode: false,
    isH2: false,
    isH3: false,
    isBulletList: false,
    isOrderedList: false,
    isBlockquote: false,
    isCodeBlock: false,
    isLink: false,
  }

  if (!editor) {
    return null
  }

  const openLinkDialog = () => {
    const previousUrl = editor.getAttributes('link').href as string | undefined
    const { requestId, result } = createLinkDialogRequest()

    // Intentional cross-layer contract: the dialog host and registry live in
    // the app layer, while the trigger lives here in shared. `shared` only
    // dispatches the request; the app registers the matching dialog.
    dispatch(
      openDialog({
        id: 'rich-text-link',
        props: {
          requestId,
          url: previousUrl ?? '',
          hasExistingLink: Boolean(previousUrl),
        },
      }),
    )

    void result.then((linkResult) => {
      if (!linkResult || editor.isDestroyed) {
        return
      }

      if (linkResult.type === 'remove') {
        editor.chain().focus().extendMarkRange('link').unsetLink().run()
        return
      }

      editor.chain().focus().extendMarkRange('link').setLink({ href: linkResult.url }).run()
    })
  }

  return (
    <div
      className={cn(
        'border-input bg-background focus-within:border-ring focus-within:ring-ring/50 overflow-hidden rounded-lg border focus-within:ring-3',
        className,
      )}
    >
      <div className="bg-muted/50 flex flex-wrap items-center gap-1 border-b px-2 py-1.5">
        <ToolbarButton
          editor={editor}
          label={t('richText.bold')}
          active={isBold}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold />
        </ToolbarButton>
        <ToolbarButton
          editor={editor}
          label={t('richText.italic')}
          active={isItalic}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic />
        </ToolbarButton>
        <ToolbarButton
          editor={editor}
          label={t('richText.underline')}
          active={isUnderline}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon />
        </ToolbarButton>
        <ToolbarButton
          editor={editor}
          label={t('richText.strike')}
          active={isStrike}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough />
        </ToolbarButton>
        <ToolbarButton
          editor={editor}
          label={t('richText.code')}
          active={isCode}
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          <Code />
        </ToolbarButton>

        <span className="bg-border mx-1 h-4 w-px" aria-hidden />

        <ToolbarButton
          editor={editor}
          label={t('richText.heading')}
          active={isH2}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 />
        </ToolbarButton>
        <ToolbarButton
          editor={editor}
          label={t('richText.heading')}
          active={isH3}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <Heading3 />
        </ToolbarButton>

        <span className="bg-border mx-1 h-4 w-px" aria-hidden />

        <ToolbarButton
          editor={editor}
          label={t('richText.bulletList')}
          active={isBulletList}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List />
        </ToolbarButton>
        <ToolbarButton
          editor={editor}
          label={t('richText.orderedList')}
          active={isOrderedList}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered />
        </ToolbarButton>

        <span className="bg-border mx-1 h-4 w-px" aria-hidden />

        <ToolbarButton
          editor={editor}
          label={t('richText.blockquote')}
          active={isBlockquote}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote />
        </ToolbarButton>
        <ToolbarButton
          editor={editor}
          label={t('richText.codeBlock')}
          active={isCodeBlock}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          <Code />
        </ToolbarButton>
        <ToolbarButton
          editor={editor}
          label={t('richText.link')}
          active={isLink}
          disabled={!canUseLink}
          onClick={openLinkDialog}
        >
          <Link2 />
        </ToolbarButton>

        <span className="bg-border mx-1 h-4 w-px" aria-hidden />

        <ToolbarButton
          editor={editor}
          label={t('richText.undo')}
          disabled={!editor.can().undo()}
          active={false}
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo2 />
        </ToolbarButton>
        <ToolbarButton
          editor={editor}
          label={t('richText.redo')}
          disabled={!editor.can().redo()}
          active={false}
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo2 />
        </ToolbarButton>
      </div>
      <EditorContent
        editor={editor}
        className={cn(
          'px-3 py-2 break-words [&_.tiptap]:min-h-32 [&_.tiptap]:text-base [&_.tiptap]:outline-none',
          CONTENT_CLASS,
        )}
      />
    </div>
  )
}
