import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import '../styles/Editor.css'

const extensions = [StarterKit]

const content = '<p>What am I doing</p>'

const Editor = () => {
  const editor = useEditor({
    extensions,
    content,
  })

  return (
    <div className="editor-container">
        <EditorContent editor={editor} />
    </div>
  )
}

export default Editor
