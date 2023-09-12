import { useCallback } from 'react';
import type { RemirrorJSON } from 'remirror';
import { OnChangeJSON } from '@remirror/react';
import { WysiwygEditor } from '@remirror/react-editors/wysiwyg';
import { Grid } from '@mui/material';

const STORAGE_KEY = 'remirror-editor-content';

const EditDocuments = () => {
  const handleEditorChange = useCallback((json: RemirrorJSON) => {
    // Store the JSON in localstorage
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(json));
  }, []);

  return <MyEditor onChange={handleEditorChange} />;
};

interface MyEditorProps {
  onChange: (json: RemirrorJSON) => void;
}

const MyEditor: React.FC<MyEditorProps> = ({ onChange }) => {
  return (
    // <div style={{ padding: 16 }}>
    <Grid container>
      <Grid item xs={1}></Grid>
      <Grid item xs={10}>
        <WysiwygEditor placeholder='Enter text...'>
          <OnChangeJSON onChange={onChange} />
        </WysiwygEditor>
      </Grid>
      <Grid item xs={1}></Grid>
    </Grid>
    // </div>
  );
};

export default EditDocuments;