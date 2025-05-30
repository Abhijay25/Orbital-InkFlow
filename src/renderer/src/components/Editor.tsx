import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder';
import '../styles/Editor.css'

const extensions = [StarterKit, 
   Placeholder.configure({
        placeholder: 'Title',
      }),
]

const content = '<h1></h1>'

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
