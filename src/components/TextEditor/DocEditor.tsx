import React from 'react';
import 'remirror/styles/all.css';
import { AllStyledComponent } from '@remirror/styles/emotion';
import { BoldExtension, AnnotationExtension, ItalicExtension, TextHighlightExtension  } from 'remirror/extensions';
import { Remirror, useRemirror } from '@remirror/react';
import Grid from '@mui/material/Grid';
import { htmlToProsemirrorNode, prosemirrorNodeToHtml  } from 'remirror';
import Menu from './EditorMenu';
import styled from '@emotion/styled';
import { Box } from '@mui/material';

const extensions = () => [
  new BoldExtension(), 
  new AnnotationExtension(), 
  new ItalicExtension(), 
  new TextHighlightExtension() ];

  
const EditorContainer = styled.div`
  & > div.remirror-editor-wrapper {
    & > div.ProseMirror.remirror-editor {
      height: 300px;
      overflow-y: auto;
    }
}`

const DocEditor = () => {
  const { manager, state, setState } = useRemirror({
    extensions,

    // Place the cursor at the start of the document. This can also be set to
    // `end`, `all` or a numbered position.
    selection: 'start',

    // Add the string handler so that the initial
    // state can created from a html string.
    stringHandler: htmlToProsemirrorNode,

    // This content is used to create the initial value. It is never referred to again after the first render.
    content: '<p>This is the initial value</p>',
  });

  const onChange = (parameter: any) => {
    // Update the state to the latest value.
    setState(parameter.state)
  }

  const saveDoc = () => {
    const html = prosemirrorNodeToHtml(state.doc)
    let wnd = window.open("about:blank", "", "_blank")
    wnd?.document.write(html)
  }

  const openMetaMenu = () => {

  }

  // Add the state and create an `onChange` handler for the state.
  return (
    <Grid container>
      <Grid item xs={1}></Grid>
      <Grid item xs={10}>
        <Box className='remirror-theme'>
          <EditorContainer>
            <Remirror
              autoRender={'start'}
              manager={manager}
              state={state}
              onChange={(parameter) => onChange(parameter)}
            >
              <Menu save={saveDoc} meta={openMetaMenu} />
            </Remirror>
          </EditorContainer>
        </Box>
      </Grid>
      <Grid item xs={1}></Grid>
    </Grid>
  )
}


export default DocEditor;