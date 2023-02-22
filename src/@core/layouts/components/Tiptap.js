import { EditorState, convertToRaw } from 'draft-js';
import { useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

function MyEditor() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const handleEditorStateChange = (state) => {
    setEditorState(state);
  };

  const handleSave = () => {
    const content = JSON.stringify(convertToRaw(editorState.getCurrentContent()));
    // simpan content ke database atau kirim ke server
  };

  return (
      <Editor
        editorState={editorState}
        onEditorStateChange={handleEditorStateChange}
      />
  );
}

export default MyEditor