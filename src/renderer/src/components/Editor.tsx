import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder';
import { Image } from '@tiptap/extension-image'
import '../styles/Editor.css'


const extensions = [StarterKit, Image,
   Placeholder.configure({
        placeholder: 'Title',
      }),
]

const content = '<h1></h1>'

const Editor = () => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions,
    content,
  })

  return (
    <div className="editor-container">
        <EditorContent editor={editor}  />
    </div>
  )
}

export default Editor
