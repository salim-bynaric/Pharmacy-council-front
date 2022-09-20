import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from 'ckeditor5-latest';

const Answer = ({ index, questions }) => {
    let answer = (questions[index].stdanswer !== undefined &&  questions[index].stdanswer !== null) ? questions[index].stdanswer : '';
    let ImgArray = questions[index].answerImage;
    return (
        <div>
            <div className="col-lg-12">
                <CKEditor
                    editor={ClassicEditor}
                    data={answer}
                    onReady={(editor) => {  editor.isReadOnly = true;  }}
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
                            },
                            
                        }
                    }

                />

            </div><br />

            <div className="col-lg-12 row">
                {ImgArray !== '' && ImgArray !== null && ImgArray !== undefined ?
                    ImgArray.toString().split(',').map((element,index) => {
                        let base_url = process.env.REACT_APP_PROJPATH;
                        let str = element;
                                               

                        if (str.indexOf('.jpg') > 0 || str.indexOf('.jpeg') > 0 || str.indexOf('.JPG') > 0 || str.indexOf('.JPEG') > 0) {
                            return <span key={index} className="col-lg-2 ansImage"><img src={base_url+''+str + '?t=' + Date.now()} height={50} width={100} style={{ 'borderRadius': "5px", "marginLeft": "10px" }} title={str} onDoubleClick={() => {
                                window.open(base_url+''+str, "_blank");
                            }} onDragStart={(e) => {e.preventDefault();}}/>
                            </span>
                        }

                        if (str.indexOf('.pdf') > 0 || str.indexOf('.PDF') > 0) {
                            return <span className="col-lg-2 ansImage"><img src={base_url + 'assets/images/pdf.png?t=' + Date.now()} height={50} width={100} style={{ 'borderRadius': "5px", "marginLeft": "10px" }} title={str} onDoubleClick={() => {
                                window.open(str, "_blank");
                            }} onDragStart={(e) => {e.preventDefault();}}/>
                            </span>
                        }

                        if (str.indexOf('.docx') > 0 || str.indexOf('.doc') > 0) {
                            return <span className="col-lg-2 ansImage"><img src={base_url + 'assets/images/doc.png?t=' + Date.now()} height={50} width={100} style={{ 'borderRadius': "5px", "marginLeft": "10px" }} title={str} onDoubleClick={() => {
                                window.open(str, "_blank");
                            }} onDragStart={(e) => {e.preventDefault();}}/>
                            </span>
                        }

                        if (str.indexOf('.xlsx') > 0 || str.indexOf('.xls') > 0) {
                            return <span className="col-lg-2 ansImage"><img src={base_url + 'assets/images/xls.png?t=' + Date.now()} height={50} width={100} style={{ 'borderRadius': "5px", "marginLeft": "10px" }} title={str} onDoubleClick={() => {
                                window.open(str, "_blank");
                            }} onDragStart={(e) => {e.preventDefault();}}/>
                            </span>
                        }

                        if (str.indexOf('.pptx') > 0 || str.indexOf('.ppt') > 0) {
                            return <span className="col-lg-2 ansImage">={base_url + 'assets/images/ppt.png?t=' + Date.now()} height={50} width={100} style={{ 'borderRadius': "5px", "marginLeft": "10px" }} title={str} onDoubleClick={() => {
                                window.open(str, "_blank");
                            }} />
                            </span>
                        }

                    })
                    : null}
            </div>
        </div>
    );
};

export default Answer;