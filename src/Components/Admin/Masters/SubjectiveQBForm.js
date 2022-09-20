import React, { useState, useContext } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import API from '../../../api';
import { UserContext } from '../../../App';
import { ShowContext } from '../../../App';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from 'ckeditor5-latest';

const SubjectiveQBForm = (props) => {
    const subjects = props.subjects;
    const [myMsg, setMyMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const myInitialValues = { subjectId: '', topic: '', subtopic: '', difficultyLevel: '', marks: '', questType: 'S', question: '', qufig: '', modelAnswer: '', modelAnswerImage: '', allowImageUpload: '' };

    const { setShow, setMsg } = useContext(ShowContext);
    const ref = React.useRef();
    let topic = [];
    const { currentUser } = useContext(UserContext);
    const [confirm, setConfirm] = useState(false);
    const [userRole, setUserRole] = useState();

    let str = '';

    if (currentUser.role === 'PAPERSETTER') {
        str = "col-lg-12";
    }
    else {
        str = "col-lg-8";
    }


    for (let i = 1; i <= 50; i++) {
        topic.push(i);
    }

    return (
        !loading && subjects.length > 0 && currentUser !== undefined ? <Formik
            initialValues={myInitialValues}
            onSubmit={async (values, actions) => {
                setMyMsg('');
                setLoading(true);
                submitQB(values, setMyMsg, setShow, setMsg, props, currentUser);
                setLoading(false);
                actions.setSubmitting(false);
                actions.resetForm({
                    values: {
                        subjectId: '', topic: '', subtopic: '', difficultyLevel: '', marks: '', questType: 'S', question: '', qufig: '', modelAnswer: '', modelAnswerImage: '', allowImageUpload: ''
                    },
                });
            }}
            validationSchema={Yup.object({
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
                        <div className={str}>
                            <form id="form-Prog" method="post" className="form-horizontal" onSubmit={handleSubmit}>
                                <div className="card mb-4">
                                    <div className="card-header">
                                        <i className="fas fa-address-card mr-1" />
                                        Add Subjective Question Bank Form
                                        <div style={{ "float": "right", "color": "red" }}>
                                            <b>{
                                                userRole !== undefined ?
                                                    'You are appointed as ' + userRole + ' for this Subject.'
                                                    : null
                                            }</b>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div className="form-group">
                                            <div className="col-lg-12 row">
                                                <div className="col-lg-6 row">
                                                    <div className="col-lg-3">
                                                        Subject
                                                    </div>
                                                    <div className="col-lg-9">
                                                        <select id="subjectId" name="subjectId" className="form-control" onChange={(e) => {
                                                            handleChange(e);
                                                            if (currentUser.role === 'PAPERSETTER') {
                                                                getConfirmed(e.target.value, currentUser.inst_id, currentUser.uid, setShow, setMsg, setConfirm, setUserRole);
                                                            }
                                                        }} onBlur={handleBlur} value={values.subjectId}>
                                                            <option value="">Select Subject</option>
                                                            {
                                                                subjects.map(subject =>
                                                                (
                                                                    <option key={subject.id} value={subject.id}>
                                                                        {subject.paper_code}-{subject.paper_name}
                                                                    </option>
                                                                ))
                                                            }
                                                        </select>

                                                        {errors.subjectId ? <div className="alert alert-info">{errors.subjectId}</div> : null}
                                                    </div>
                                                </div>
                                                <div className="col-lg-6 row">
                                                    <div className="col-lg-3">
                                                        Topic
                                                    </div>
                                                    <div className="col-lg-9">
                                                        <select id="topic" name="topic" className="form-control" onChange={handleChange} onBlur={handleBlur} value={values.topic}>
                                                            <option value="">Select Topic</option>
                                                            {
                                                                topic.map((value, index) => (
                                                                    <option key={value} value={value}>
                                                                        {value}
                                                                    </option>
                                                                ))
                                                            }
                                                        </select>

                                                        {errors.topic ? <div className="alert alert-info">{errors.topic}</div> : null}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="col-lg-12 row">
                                                <div className="col-lg-6 row">
                                                    <div className="col-lg-3">
                                                        Sub Topic
                                                    </div>
                                                    <div className="col-lg-9">
                                                        <select id="subtopic" name="subtopic" className="form-control" onChange={handleChange} onBlur={handleBlur} value={values.subtopic}>
                                                            <option value="">Select Sub Topic</option>
                                                            {
                                                                topic.map((value, index) => (
                                                                    <option key={value} value={value}>
                                                                        {value}
                                                                    </option>
                                                                ))
                                                            }
                                                        </select>

                                                        {errors.subtopic ? <div className="alert alert-info">{errors.subtopic}</div> : null}
                                                    </div>
                                                </div>
                                                <div className="col-lg-6 row">
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
                                        </div>
                                        <div className="form-group">
                                            <div className="col-lg-12 row">
                                                <div className="col-lg-6 row">
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
                                                <div className="col-lg-6 row">
                                                    <div className="col-lg-3">
                                                        Question Type
                                                    </div>
                                                    <div className="col-lg-9">
                                                        <select id="questType" name="questType" className="form-control" onChange={handleChange} onBlur={handleBlur} value={values.questType}>
                                                            <option value="S">Subjective Question</option>
                                                        </select>

                                                        {errors.questType ? <div className="alert alert-info">{errors.questType}</div> : null}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="form-group">
                                            <div className="col-lg-12 row">
                                                <div className="col-lg-6 row">
                                                    <div className="col-lg-3">
                                                        Question
                                                    </div>
                                                    <div className="col-lg-9">
                                                        <CKEditor
                                                            editor={ClassicEditor}
                                                            config={
                                                                {
                                                                    toolbar: ['codeBlock', 'bold', 'italic', 'MathType', 'ChemType', 'undo', 'redo']
                                                                }
                                                            }

                                                            onChange={(event, editor) => {
                                                                values.question = editor.getData();
                                                            }}
                                                            onBlur={(event, editor) => {
                                                            }}

                                                        />
                                                        {errors.question ? <div className="alert alert-info">{errors.question}</div> : null}
                                                    </div>
                                                </div>
                                                <div className="col-lg-6 row">
                                                    <div className="col-lg-3">
                                                        Question Image
                                                    </div>
                                                    <div className="col-lg-9">
                                                        <input
                                                            id="qufig"
                                                            name="qufig"
                                                            type="file"
                                                            ref={ref}
                                                            onChange={(event) => {
                                                                setFieldValue("qufig", event.currentTarget.files[0]);
                                                            }}
                                                            onBlur={handleBlur}
                                                            className="form-control"
                                                        />
                                                        {errors.qufig ? <div className="alert alert-info">{errors.qufig}</div> : null}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="form-group">
                                            <div className="col-lg-12 row">
                                                <div className="col-lg-6 row">
                                                    <div className="col-lg-3">
                                                        Model Answer
                                                    </div>
                                                    <div className="col-lg-9">
                                                        <CKEditor
                                                            editor={ClassicEditor}
                                                            config={
                                                                {
                                                                    toolbar: ['codeBlock', 'bold', 'italic', 'MathType', 'ChemType', 'undo', 'redo']
                                                                }
                                                            }

                                                            onChange={(event, editor) => {
                                                                values.modelAnswer = editor.getData();
                                                            }}
                                                            onBlur={(event, editor) => {
                                                            }}

                                                        />
                                                        {errors.modelAnswer ? <div className="alert alert-info">{errors.modelAnswer}</div> : null}
                                                    </div>
                                                </div>
                                                <div className="col-lg-6 row">
                                                    <div className="col-lg-3">
                                                        Model Answer Image
                                                    </div>
                                                    <div className="col-lg-9">
                                                        <input
                                                            id="modelAnswerImage"
                                                            name="modelAnswerImage"
                                                            type="file"
                                                            ref={ref}
                                                            onChange={(event) => {
                                                                setFieldValue("modelAnswerImage", event.currentTarget.files[0]);
                                                            }}
                                                            onBlur={handleBlur}
                                                            className="form-control"
                                                        />
                                                        {errors.modelAnswerImage ? <div className="alert alert-info">{errors.modelAnswerImage}</div> : null}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <hr />
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
                                                <button type="submit" className="btn btn-primary" disabled={isSubmitting || confirm}>Submit</button>
                                            </center>
                                        </div>

                                        {myMsg !== '' && (
                                            <div className="alert alert-dark animate__animated animate__tada animate_slower">{myMsg}</div>)}

                                        {loading && (
                                            <div className="custom-loader"></div>
                                        )}
                                    </div>
                                </div>
                            </form>
                        </div>
                    );
                }
            }
        </Formik>
            : null
    );
};

async function getConfirmed(paperId, instId, uid, setShow, setMsg, setConfirm, setUserRole) {
    if (paperId === '') {
        setConfirm(false);
    }

    await API.get('/subject/setterAllocation', { params: { 'type': 'searchByPaperId', 'paperId': paperId, 'instId': instId, 'setterId': uid } })
        .then((res) => {
            if (res.data.status === 'success') {
                setUserRole(res.data.data[0].type === 'PS' ? 'Paper Setter' : res.data.data[0].type === 'PM' ? 'Paper Moderator' : res.data.data[0].type === 'PSM' ? 'Paper Setter and Moderator' : undefined);

                if (res.data.data[0].conf === 1) {
                    setConfirm(true);
                }
                else {
                    setConfirm(false);
                }
            }
        })
        .catch(function (error) {

        });
}


async function submitQB(values, setMyMsg, setShow, setMsg, props, currentUser) {
    let fd = new FormData();

    let subjectId = values.subjectId; fd.append("subjectId", subjectId);
    let topic = values.topic; fd.append("topic", topic);
    let subtopic = values.subtopic; fd.append("subtopic", subtopic);
    let difficultyLevel = values.difficultyLevel; fd.append("difficultyLevel", difficultyLevel);
    let marks = values.marks; fd.append("marks", marks);
    let questType = values.questType; fd.append("questType", questType);
    let question = values.question; fd.append("question", question);
    let qufig = values.qufig; fd.append("qufig", qufig);
    let modelAnswer = values.modelAnswer; fd.append("modelAnswer", modelAnswer);
    let modelAnswerImage = values.modelAnswerImage; fd.append("modelAnswerImage", modelAnswerImage);
    let allowImageUpload = values.allowImageUpload; fd.append("allowImageUpload", allowImageUpload);
    let setter = currentUser.uid; fd.append("setter", setter)


    if (question === '' || question === null || question === undefined) {
        if (qufig === '' || qufig === null || qufig === undefined) {
            setShow(true);
            setMsg('Please Add Question from Editor or as an Image...');
            return false;
        }
    }

    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    }

    await API.post('/subject/question/add', fd, config)
        .then(function (res) {
            if (res.data.status === 'success') {
                setMyMsg(res.data.message);
                props.setInserted(!props.inserted);
            }
            else {
                setShow(true);
                setMsg(res.data.message);
                props.setInserted(!props.inserted);
            }
        })
        .catch(function (error) {
            setShow(true);
            setMsg(error.response.data.message);
            props.setInserted(!props.inserted);
        });

}

export default SubjectiveQBForm;