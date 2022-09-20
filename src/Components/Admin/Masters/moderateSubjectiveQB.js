import React,{useState, useEffect, useContext} from 'react';
import {Link,useHistory} from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import API from '../../../api';
import {ShowContext} from '../../../App';
import {UserContext,ExamFolderContext} from '../../../App';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from 'ckeditor5-latest';

const ModerateSubjectiveQB = (props) => {
    let [question,subjects,flag] = useQuestion(props);
    let history                     = useHistory();
    let imgChangeArray              = [];
    const { examFolder } = useContext(ExamFolderContext);

    const [myMsg, setMyMsg]         = useState('');
    const [loading, setLoading]     = useState(false);
    const dataFolder = examFolder;
    const Path = process.env.REACT_APP_PROJPATH + 'data/'+dataFolder+'/files/';
    const { currentUser }           = useContext(UserContext);

    let myInitialValues           = question && subjects ? {subjectId:subjects.id,topic:question.topic,subtopic:question.subtopic,difficultyLevel:question.difficulty_level,marks:question.marks,questType:question.quest_type,question:question.question,qufig:Path+question.qu_fig,modelAnswer:question.modelAnswer,modelAnswerImage:Path+question.modelAnswerImage,allowImageUpload:question.allowImageUpload,imgChange:''} : null;

    const {setShow,setMsg}          = useContext(ShowContext);
    const topics                    = [];
    const ref                       = React.useRef();
    

    for(let x=0;x<50;x++)
    {
        topics.push(x+1);
    }

    return (
        question && subjects && currentUser ? <Formik 
        initialValues= {myInitialValues}
        onSubmit= {async (values,actions) => 
        {
            setMyMsg('');
            setLoading(true);
            moderateQB(values,setMyMsg,setShow,setMsg,history,question,currentUser,flag,props);
            setLoading(false);
            actions.setSubmitting(false);
            actions.resetForm({
            values: {
                        subjectId:'',topic:'',subtopic:'',difficultyLevel:'',marks:'',questType:'',question:'',qufig:'',modelAnswer:'',modelAnswerImage:'',allowImageUpload:'',imgChange:''
                    },
            });
        }}
        validationSchema = {Yup.object({
            subjectId: Yup.number()
            .required("Subject is Required"),
            topic: Yup.number()
            .required("Topic is Required"),
            subtopic: Yup.number(),
            difficultyLevel: Yup.string()
            .required("Difficulty Level is Required"),
            marks: Yup.number()
            .required("Marks is Required"),
            questType: Yup.string()
            .required("Question Type is Required"),
            allowImageUpload: Yup.string()
            .required("Allow Image Upload is Required"),
        })}
        >
        {
            props => {
                const {
                    values,
                    errors,
                    isSubmitting,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    setFieldValue
                } = props;
                return (
        <div>
            <div className="container-fluid">
                <div className="row col-lg-12">
                <div className="col-xl-12">
                    <form id="form-Prog" method="post" className="form-horizontal" onSubmit={handleSubmit}>
                        <div className="card mb-4">
                            <div className="card-header">
                                <i className="fas fa-address-card mr-1"/>
                                Moderate Subjective Question Bank Form
                            </div>
                            <div className="card-body">
                                <div className="form-group">
                                    <div className="col-lg-12 row">
                                        <div className="col-lg-3">
                                            Select Subject
                                        </div>
                                        <div className="col-lg-9">
                                            <select id="subjectId" name="subjectId" className="form-control" onChange={handleChange} onBlur={handleBlur} value={values.subjectId}>
                                                <option key={subjects.id} value={subjects.id}>
                                                        ({subjects.paper_code}) {subjects.paper_name}
                                                </option>
                                            </select>

                                            {errors.subjectId ? <div className="alert alert-info">{errors.subjectId}</div> : null}
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="col-lg-12 row">
                                        <div className="col-lg-3">
                                            Select Topic/CO
                                        </div>
                                        <div className="col-lg-9">
                                            <select id="topic" name="topic" className="form-control" onChange={handleChange} onBlur={handleBlur} value={values.topic}>
                                                <option value="">Select Topic</option>
                                                {
                                                    topics.map((value,index) => (
                                                        <option key={index} value={value}>
                                                            {value}
                                                        </option>
                                                    ))
                                                }
                                            </select>

                                            {errors.topic ? <div className="alert alert-info">{errors.topic}</div> : null}
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="col-lg-12 row">
                                        <div className="col-lg-3">
                                            Select Sub Topic/LO
                                        </div>
                                        <div className="col-lg-9">
                                            <select id="subtopic" name="subtopic" className="form-control" onChange={handleChange} onBlur={handleBlur} value={values.subtopic}>
                                                <option value="">Select Sub Topic</option>
                                                {
                                                    topics.map((value,index) => (
                                                        <option key={index} value={value}>
                                                            {value}
                                                        </option>
                                                    ))
                                                }
                                            </select>

                                            {errors.subtopic ? <div className="alert alert-info">{errors.subtopic}</div> : null}
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="col-lg-12 row">
                                        <div className="col-lg-3">
                                            Difficulty Level
                                        </div>
                                        <div className="col-lg-9">
                                            <select id="difficultyLevel" name="difficultyLevel" className="form-control" onChange={handleChange} onBlur={handleBlur} value={values.difficultyLevel}>
                                                <option value="">Select Difficulty Level</option>
                                                <option value="R">Recall Difficulty Level</option>
                                                <option value="U">Understanding Difficulty Level</option>
                                                <option value="A">Application Difficulty Level</option>
                                            </select>

                                            {errors.difficultyLevel ? <div className="alert alert-info">{errors.difficultyLevel}</div> : null}
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="col-lg-12 row">
                                        <div className="col-lg-3">
                                            Select Marks
                                        </div>
                                        <div className="col-lg-9">
                                            <select id="marks" name="marks" className="form-control" onChange={handleChange} onBlur={handleBlur} value={values.marks}>
                                                <option value="">Select Marks</option>
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                                <option value="4">4</option>
                                                <option value="5">5</option>
                                                <option value="6">6</option>
                                                <option value="7">7</option>
                                                <option value="8">8</option>
                                                <option value="9">9</option>
                                                <option value="10">10</option>
                                                <option value="11">11</option>
                                                <option value="12">12</option>
                                            </select>

                                            {errors.marks ? <div className="alert alert-info">{errors.marks}</div> : null}
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="col-lg-12 row">
                                        <div className="col-lg-3">
                                            Question Type
                                        </div>
                                        <div className="col-lg-9">
                                            <select id="questType" name="questType" className="form-control" onChange={handleChange} onBlur={handleBlur} value={values.questType} disabled={true}>
                                                <option value="">Select Question Type</option>
                                                <option value="S">Subjective Question</option>
                                            </select>

                                            {errors.questType ? <div className="alert alert-info">{errors.questType}</div> : null}
                                        </div>
                                    </div>
                                </div>
<hr/>
                                <div className="form-group">
                                    <div className="col-lg-12 row">
                                        <div className="col-lg-3">
                                            Question
                                        </div>
                                        <div className="col-lg-9">
                                            <CKEditor
                                                editor={ ClassicEditor }
                                                data = {values.question}
                                                config = {
                                                    {
                                                        toolbar: ['codeBlock','bold','italic','MathType', 'ChemType','undo','redo']
                                                    }
                                                }
                                               
                                                onChange={ ( event, editor ) => {
                                                    values.question = editor.getData();
                                                } }
                                                onBlur={ ( event, editor ) => {
                                                } }

                                                onReady={ editor => {
                                                    values.question = editor.getData();
                                                } }
                                            />
                                            {errors.question ? <div className="alert alert-info">{errors.question}</div> : null}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="form-group">
                                    <div className="col-lg-12 row">
                                        <div className="col-lg-3">
                                            Question Image
                                        </div>
                                        <div className="col-lg-9">
                                            <input 
                                                id="qufig" 
                                                name="qufig" 
                                                type="file" 
                                            
                                                ref={ref}
                                                onChange={async (event) => {
                                                    setFieldValue("qufig", event.currentTarget.files[0]);
                                                    imgChangeArray.push('qufig');
                                                    imgChangeArray = [...new Set(imgChangeArray)];
                                                    setFieldValue('imgChange',imgChangeArray);
                                                    let src = URL.createObjectURL(event.target.files[0])
                                                    values.qufig = await src;
                                                    document.getElementById('questImg').src=values.qufig;
                                                }} 
                                                onBlur={handleBlur}
                                                className="form-control" 
                                                
                                            />
                                            {errors.qufig ? <div className="alert alert-info">{errors.qufig}</div> : null}

                                            {question.qu_fig !== '' && question.qu_fig !== null && question.qu_fig !== undefined ?
                                            <img src={values.qufig} alt=""  height="100" width="100" id="questImg" style={{"borderRadius":"5px"}} onDragStart={(e) => {e.preventDefault();}}/> : null}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="form-group">
                                    <div className="col-lg-12 row">
                                        <div className="col-lg-3">
                                            Model Answer
                                        </div>
                                        <div className="col-lg-9">
                                            <CKEditor
                                                editor={ ClassicEditor }
                                                data = {values.modelAnswer !==undefined && values.modelAnswer!== null ? values.modelAnswer : ''}
                                                config = {
                                                    {
                                                        toolbar: ['codeBlock','bold','italic','MathType', 'ChemType','undo','redo']
                                                    }
                                                }
                                                
                                                onChange={ ( event, editor ) => {
                                                    values.modelAnswer = editor.getData();
                                                } }
                                                onBlur={ ( event, editor ) => {
                                                } }

                                            />
                                            {errors.modelAnswer ? <div className="alert alert-info">{errors.modelAnswer}</div> : null}
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <div className="col-lg-12 row">
                                        <div className="col-lg-3">
                                            Model Answer Image
                                        </div>
                                        <div className="col-lg-9">
                                            <input 
                                                id="modelAnswerImage" 
                                                name="modelAnswerImage" 
                                                type="file" 
                                            
                                                ref={ref}
                                                onChange={async (event) => {
                                                    setFieldValue("modelAnswerImage", event.currentTarget.files[0]);
                                                    imgChangeArray.push('modelAnswerImage');
                                                    imgChangeArray = [...new Set(imgChangeArray)];
                                                    setFieldValue('imgChange',imgChangeArray);
                                                    let src = URL.createObjectURL(event.target.files[0])
                                                    values.modelAnswerImage = await src;
                                                    document.getElementById('ansImg').src=values.modelAnswerImage;
                                                }} 
                                                onBlur={handleBlur}
                                                className="form-control" 
                                                
                                            />
                                            {errors.modelAnswerImage ? <div className="alert alert-info">{errors.modelAnswerImage}</div> : null}

                                            {question.modelAnswerImage !== '' && question.modelAnswerImage !== null && question.modelAnswerImage !== undefined ?
                                            <img src={values.modelAnswerImage} alt=""  height="100" width="100" id="ansImg" style={{"borderRadius":"5px"}} onDragStart={(e) => {e.preventDefault();}}/> : null}
                                            
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="col-lg-12 row">
                                        <div className="col-lg-3">
                                            Allow Image to upload
                                        </div>
                                        <div className="col-lg-9">
                                            <select id="allowImageUpload" name="allowImageUpload" className="form-control" onChange={handleChange} onBlur={handleBlur} value={values.allowImageUpload}>
                                                <option value="">Select Option</option>
                                                <option value="Y">Yes</option>
                                                <option value="N">No</option>
                                            </select>

                                            {errors.allowImageUpload ? <div className="alert alert-info">{errors.allowImageUpload}</div> : null}
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className="card-footer">
                                <div className="form-group">
                                    <center>
                                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>Submit</button>
                                    </center>
                                </div>
                                
                                {myMsg !== '' &&(
                                    <div className="alert alert-dark animate__animated animate__tada animate_slower">{myMsg}</div>)}

                                {loading && (
                                    <div className="custom-loader"></div>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            </div>
            </div>
                );
            }
        }
        </Formik>
        :null
    );
};

async function moderateQB(values,setMyMsg,setShow,setMsg,history,question1,currentUser,flag,props)
{
    let fd                  = new FormData();

    let subjectId           = values.subjectId;         fd.append("subjectId",subjectId);
    let topic               = values.topic;             fd.append("topic",topic);
    let subtopic            = values.subtopic;          fd.append("subtopic",subtopic);
    let difficultyLevel     = values.difficultyLevel;   fd.append("difficultyLevel",difficultyLevel);
    let marks               = values.marks;             fd.append("marks",marks);
    let questType           = values.questType;         fd.append("questType",questType);
    let question            = values.question;          fd.append("question",question);
    let qufig               = values.qufig;             fd.append("qufig",qufig);
    let modelAnswer         = values.modelAnswer !== null ? values.modelAnswer :'';       fd.append("modelAnswer",modelAnswer);
    let modelAnswerImage    = values.modelAnswerImage;  fd.append("modelAnswerImage",modelAnswerImage);
    let allowImageUpload    = values.allowImageUpload;  fd.append("allowImageUpload",allowImageUpload);
    let imgChange           = values.imgChange;         fd.append("imgChange",imgChange);
    let moderator           = currentUser.uid;          fd.append("moderator",moderator);
                                                        fd.append("flag",flag);
    
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    }

    await API.post('/question/moderate/'+question1.qnid,fd,config)
    .then(function (res) 
    {
        if(res.data.status==='success')
        {
            setShow(true);
            setMsg(res.data.message);
            props.setVisible3(false);
            props.setOpSuccess(true);
        }
        else
        {
            setShow(true);
            setMsg(res.data.message);
            props.setOpSuccess(false);
        }
    })
    .catch(function (error) 
    {
        setShow(true);
        setMsg('Problem Moderating Question...');
        props.setOpSuccess(false);
    });

}


function useQuestion(props)
{
    const [question, setQuestion] = useState(undefined);
    const [subjects, setSubjects] = useState(undefined);
    const [flag, setFlag] = useState(undefined);

    useEffect(() => {
        if (props) {
            setSubjects(props.subject);
            setQuestion(props.question);
            setFlag(props.flag);
        }
    }, [props]);

    return [question, subjects, flag];
}

export default ModerateSubjectiveQB;