import { Button, Grid, Typography } from '@material-ui/core';
import { Editor, EditorState } from 'draft-js';
import { useRouter } from 'next/router';
import React , {useState} from 'react';
import CodeEditor from '../CodeEditor';

export default function Examiner(props){
    const [editorState, setEditorState] = useState(
        () => EditorState.createEmpty(),
    );
    
    const router = useRouter();


    const goToAddPage = (e) => {
        e.preventDefault();
        router.push("examiner/add");
    }
    return(
        <>
            <Grid container>
                <Grid item lg={3}>
                    <Button onClick={goToAddPage}>Add test</Button>
                    <Typography>Tests report</Typography>
                </Grid>
                <Grid item lg={9}>
                {
                    <div>
                        <Editor editorState={editorState} onChange={setEditorState} />
                    </div>
                }
                </Grid>
            </Grid>
        </>
    );
}