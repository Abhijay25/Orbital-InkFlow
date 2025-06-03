import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder';
import '../styles/Editor.css'
import { forwardRef, useImperativeHandle, useEffect } from 'react'

const extensions = [StarterKit,
   Placeholder.configure({
        placeholder: 'Title',
      }),
]

const defaultContent = '<h1></h1>'

// Editor component with ref to get HTML
// This HTML is then sent, so it can be saved to the database
const Editor = forwardRef((props, ref) => {
  const editor = useEditor({
    extensions,
    content: defaultContent,
  })

  // useEffect -> fetches the latest content from db, and pasted on textEditor
  // [editor] will be the dependency array -> useEffect run when the editor changes
  useEffect(() => {

    const loadContent = async () => {
      // try-catch block used for clearer error message used for debugging
      try {
        console.log("retrieve content");
        const savedContent = await window.electronAPI.getLatestContent();
        if (savedContent && editor) {
          editor.commands.setContent(savedContent);
        }
      } catch (error) {
        console.log("Encounter error when trying to load content from database to frontend");
      }
    };

    loadContent();
    console.log("content loaded");
  }, [editor])

  useImperativeHandle(ref, () => ({
    getHTML: () => editor?.getHTML(),
  }))

  return (
    <div className="editor-container">
      <EditorContent editor={editor} />
    </div>
  )
})

export default Editor
