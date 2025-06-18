import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder';
import { forwardRef, useImperativeHandle, useEffect } from 'react'
import Image from '@tiptap/extension-image';

import '../styles/Editor.css'

const extensions = [StarterKit, 
  Image.configure({allowBase64: true,}), 
  Placeholder.configure({
    placeholder: ' Title ',
  }), 
]

export interface EditorRef {
  getHTML: () => string;
  commands: {
    setContent: (content: string) => void;
  };
}

interface EditorProps {
  fileId: string;
}

const defaultContent = '<h1></h1>'

// Editor component with ref to get HTML
// This HTML is then sent, so it can be saved to the database
const Editor = forwardRef<EditorRef, EditorProps>(({ fileId }: EditorProps, ref) => {
  const editor = useEditor({
    extensions,
    content: defaultContent,

    // Auto-updates and auto-saves user's input
    onUpdate: async ({ editor }) => {
      const htmlContent = editor.getHTML();
      await window.electronAPI.saveContentToFile(fileId, htmlContent);
      console.log("content saved successfully to: ", fileId);
    }
  })

  // useEffect -> fetches the latest content from db, and pasted on textEditor
  // [editor, fileId] will be the dependency array -> useEffect run when the editor changes
  useEffect(() => {

    const loadContent = async () => {
      // try-catch block used for clearer error message used for debugging
      try {
        console.log("retrieve content for file: ", fileId);
        const savedContent = await window.electronAPI.getLatestContentByFile(fileId);
        if (savedContent && editor) {
          editor.commands.setContent(savedContent);
        }
      } catch (error) {
        console.log("Encounter error when trying to load content from database to frontend for file: ", fileId);
      }
    };

    if (fileId) {
      loadContent();
      console.log("content loaded");
    }

  }, [editor, fileId])

  useImperativeHandle(ref, () => ({
    getHTML: () => editor?.getHTML() || '',
    commands: {
      setContent: (content: string) => editor?.commands.setContent(content)
    }
  }))

  return (
    <div className="editor-container">
      <EditorContent editor={editor} />
    </div>
  )
})

export default Editor
