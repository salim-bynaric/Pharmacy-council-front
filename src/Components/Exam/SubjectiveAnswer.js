import React,{useContext, useEffect, useState} from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from 'ckeditor5-latest';
import {QuestModeContext} from '../../App';
import API from '../../api';
import {AnsImgContext} from '../../App';
import {de} from '../../utils/Helper';

const SubjectiveAnswer = (props) => 
{
    const {setQuestionMode}                         = useContext(QuestModeContext);
    const index                                     = props.index;
    const allowImageUpload                          = props.questions[index].question.allowImageUpload;
    const questions                                 = props.questions;
    const [answer,setAnswer]                        = useState();
    const examId                                    = props.exam.id
    const {setImgArray}                             = useContext(AnsImgContext);

    useEffect(async () => {
        setAnswer(undefined);
        setQuestionMode('S');
        //await getAnswer(questions,index,setAnswer,props);
        const interval = await setTimeout(()=>{
            setAnswer((props.questions[index].stdanswer!==null && props.questions[index].stdanswer!==undefined) ? props.questions[index].stdanswer : '');

            props.setSubjectiveAnswer((props.questions[index].stdanswer!==null && props.questions[index].stdanswer!==undefined) ? props.questions[index].stdanswer : '');
        }, 1000);
        return () => clearInterval(interval);
    },[index]);

    useEffect(async () => {
        await getQuestions(examId,setImgArray);
    },[index]);

    return (
            answer !== undefined ?
                <div className="col-lg-12">                       
                        <div className="form-group">
                            <div className="col-lg-12">
                                <CKEditor
                                    editor={ ClassicEditor }
                                    data = { answer }
                                    config = {
                                                {
                                                    toolbar: {
                                                        items: [
                                                            'heading', '|',
                                                            'bold', 'italic', 'strikethrough', 'underline', 'subscript', 'superscript', '|',
                                                            'link', '|',
                                                            'outdent', 'indent', '|',
                                                            'bulletedList', 'numberedList', 'todoList', '|',
                                                            'blockQuote', '|',
                                                            'MathType', 'ChemType', 'codeBlock' ,'|',
                                                            'undo', 'redo'
                                                        ],
                                                    }
                                                }
                                            }
                                                
                                            onChange={ ( event, editor ) => {
                                                    props.setSubjectiveAnswer(undefined);
                                                    props.setSubjectiveAnswer(editor.getData());
                                            } }

                                            onBlur={ ( event, editor ) => {
                                            } }                        
                                />
                            </div>
                        </div>
                </div>
            : null
    );
};

async function getAnswer(questions,index,setAnswer,props)
{
    let answerId = questions[index].id;
    await API.get('/answer/'+answerId)
    .then(async (res) =>
    {
        if(res.data.status === 'success')
        {
            setAnswer(res.data.data[0].stdanswer);
            props.setSubjectiveAnswer(res.data.data[0].stdanswer);
        }
    })
}

async function getQuestions(ExamId,setImgArray)
{
  const res = await API.get('/answer',{params: {"exam_id": ExamId}});
  if(res.data.status === 'success')
  {
    let data = JSON.parse(de(res.data.data));
    let myArray = [];
    let base_url = process.env.REACT_APP_PROJPATH;

    data.forEach((element,index) => {
        if(element.answerImage!==null && element.answerImage!==undefined && element.answerImage!=='')
        {
            let strr= '';
            element.answerImage.split(',').map(path => {
                strr = strr + base_url+''+path+',';
            });
            strr = strr.replace(/,\s*$/, ""); // remove rightmost cocmma in string.
            myArray[index] = strr;
        }
        else
        {
            myArray[index] = '';
        }
    });

    setImgArray(myArray);

  }
  else
  {
    return null;
  }
}

export default SubjectiveAnswer;