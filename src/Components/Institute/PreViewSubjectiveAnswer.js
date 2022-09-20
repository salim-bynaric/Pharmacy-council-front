import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from 'ckeditor5-latest';

const PreViewSubjectiveAnswer = ({questions,myIndex}) => {
    return (
        <div className="col-lg-12">
            <div className="form-group">
                {
                    questions[myIndex].allowImageUpload === 'Y' ?
                    <>
                        <button className="btn btn-success btn-sm">Upload Answer as File</button>
                    </>
                    :null
                }
                <div className="col-lg-12"><br/>
                    <CKEditor
                        editor={ClassicEditor}
                        disabled={true}
                        config={
                            {
                                toolbar: {
                                    items: [
                                        'heading', '|',
                                        'bold', 'italic', 'strikethrough', 'underline', 'subscript', 'superscript', '|',
                                        'link', '|',
                                        'outdent', 'indent', '|',
                                        'bulletedList', 'numberedList', 'todoList', '|',
                                        'blockQuote', '|',
                                        'MathType', 'ChemType', 'codeBlock', '|',
                                        'undo', 'redo'
                                    ],
                                }
                            }
                        }
                    />
                </div>
            </div>
        </div>
    );
};

export default PreViewSubjectiveAnswer;