import React, { useState, useContext } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import API from '../../../api';
import { UserContext } from '../../../App';
import { ShowContext } from '../../../App';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from 'ckeditor5-latest';

const QuestionBankForm = (props) => {
    const [myMsg, setMyMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [mySection,setMySection] = useState('');
    const [mySectionFlg,setMySectionFlg] = useState(false);
    
    const subjects = props.subjects;
    const myInitialValues = { subjectId: '', topic: '', subtopic: '', difficultyLevel: '', marks: '', questType: '', question: '', qufig: '', optiona: '', a1: '', optionb: '', a2: '', optionc: '', a3: '', optiond: '', a4: '', correctoption: '',sectionFlg:mySectionFlg,section:'' };
    
    const { setShow, setMsg } = useContext(ShowContext);
    const ref = React.useRef();
    const { currentUser } = useContext(UserContext);
    const [confirm, setConfirm] = useState(false);
    const [userRole, setUserRole] = useState();

    let topic = [];
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
                        subjectId: '', topic: '', subtopic: '', difficultyLevel: '', marks: '', questType: '', question: '', qufig: '', optiona: '', a1: '', optionb: '', a2: '', optionc: '', a3: '', optiond: '', a4: '', correctoption: '',sectionFlg:false,section:''
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

                question: Yup.string().when('questType', {
                    is: (val) => ((val === 'N') || (val === 'N2') ? true : false),
                    then: Yup.string().required("Question Text is Required..."),
                }),

                qufig: Yup.string().when('questType', {
                    is: (val) => ((val === 'N1') || (val === 'N3') ? true : false),
                    then: Yup.string().required("Question Image is Required..."),
                }),

                optiona: Yup.string().when('questType', {
                    is: (val) => ((val === 'N') || (val === 'N1') ? true : false),
                    then: Yup.string().required("Option A Text is Required..."),
                }),

                a1: Yup.string().when('questType', {
                    is: (val) => ((val === 'N2') || (val === 'N3') ? true : false),
                    then: Yup.string().required("Option A Image is Required..."),
                }),

                optionb: Yup.string().when('questType', {
                    is: (val) => ((val === 'N') || (val === 'N1') ? true : false),
                    then: Yup.string().required("Option B Text is Required..."),
                }),

                a2: Yup.string().when('questType', {
                    is: (val) => ((val === 'N2') || (val === 'N3') ? true : false),
                    then: Yup.string().required("Option B Image is Required..."),
                }),

                optionc: Yup.string().when('questType', {
                    is: (val) => ((val === 'N') || (val === 'N1') ? true : false),
                    then: Yup.string().required("Option C Text is Required..."),
                }),

                a3: Yup.string().when('questType', {
                    is: (val) => ((val === 'N2') || (val === 'N3') ? true : false),
                    then: Yup.string().required("Option C Image is Required..."),
                }),

                optiond: Yup.string().when('questType', {
                    is: (val) => ((val === 'N') || (val === 'N1') ? true : false),
                    then: Yup.string().required("Option D Text is Required..."),
                }),

                a4: Yup.string().when('questType', {
                    is: (val) => ((val === 'N2') || (val === 'N3') ? true : false),
                    then: Yup.string().required("Option D Image is Required..."),
                }),

                correctoption: Yup.string()
                .required("Correct Option is Required"),

                sectionFlg: Yup.boolean(),
                section: Yup.string().when('sectionFlg', {
                    is: (val) => val === true ? true:false,
                    then: Yup.string().required("Section is Required..."),
                }),
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
                            <form id="form-Prog" method="post" className="form-horizontal" onSubmit={(e) => handleSubmit(e)}>
                                <div className="card mb-4">
                                    <div className="card-header">
                                        <i className="fas fa-address-card mr-1" />
                                        Add Question Bank Form
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
                                                        Select Subject
                                                    </div>
                                                    <div className="col-lg-9">
                                                        <select id="subjectId" name="subjectId" className="form-control" onChange={(e) => 
                                                        {
                                                            getSection(e.target.value,subjects,setMySection,setMySectionFlg,setFieldValue);
                                                            handleChange(e);
                                                            if (currentUser.role === 'PAPERSETTER') {
                                                                getConfirmed(e.target.value, currentUser.inst_id, currentUser.uid, setShow, setMsg, setConfirm, setUserRole);
                                                            }
                                                        }} onBlur={handleBlur} value={values.subjectId}>
                                                            <option value="">Select Subject</option>
                                                            {
                                                                subjects.map(subject =>
                                                                {
                                                                    return <option key={subject.id} value={subject.id}>
                                                                        ({subject.paper_code}) {subject.paper_name}
                                                                    </option>
                                                                })
                                                            }
                                                        </select>

                                                        {errors.subjectId ? <div className="alert alert-info">{errors.subjectId}</div> : null}
                                                    </div>
                                                </div>
                                                <div className="col-lg-6 row">
                                                    <div className="col-lg-3">
                                                        Select Topic/CO
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
                                                        Select Sub Topic/LO
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
                                                            <option value="">Select Question Type</option>
                                                            <option value="N">No Figure</option>
                                                            <option value="N1">Question as Figure and Answer in Text</option>
                                                            <option value="N2">Question as Text and Answer as Figure</option>
                                                            <option value="N3">Question and Answer both as Figure</option>
                                                        </select>

                                                        {errors.questType ? <div className="alert alert-info">{errors.questType}</div> : null}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
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
                                                    {values.questType === 'N1' || values.questType === 'N3' ?
                                                        <div className="form-group" style={{"marginTop":"15px"}}>
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
                                                        : null}
                                                </div>
                                                <div className="col-lg-6 row">
                                                    <div className="col-lg-3">
                                                        Option A
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
                                                                values.optiona = editor.getData();
                                                            }}
                                                            onBlur={(event, editor) => {
                                                            }}
                                                        />
                                                        {errors.optiona ? <div className="alert alert-info">{errors.optiona}</div> : null}
                                                    </div>
                                                    {values.questType === 'N2' || values.questType === 'N3' ?
                                                        <div className="form-group" style={{"marginTop":"15px"}}>
                                                            <div className="col-lg-12 row">
                                                                <div className="col-lg-3">
                                                                    Option A Image
                                                                </div>
                                                                <div className="col-lg-9">
                                                                    <input
                                                                        id="a1"
                                                                        name="a1"
                                                                        type="file"
                                                                        ref={ref}
                                                                        onChange={(event) => {
                                                                            setFieldValue("a1", event.currentTarget.files[0]);
                                                                        }}
                                                                        onBlur={handleBlur}
                                                                        className="form-control"
                                                                    />
                                                                    {errors.a1 ? <div className="alert alert-info">{errors.a1}</div> : null}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        : null}
                                                </div>
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="form-group">
                                            <div className="col-lg-12 row">
                                                <div className="col-lg-6 row">
                                                    <div className="col-lg-3">
                                                        Option B
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
                                                                values.optionb = editor.getData();
                                                            }}
                                                            onBlur={(event, editor) => {
                                                            }}
                                                        />
                                                        {errors.optionb ? <div className="alert alert-info">{errors.optionb}</div> : null}
                                                    </div>
                                                    {values.questType === 'N2' || values.questType === 'N3' ?
                                                        <div className="form-group" style={{"marginTop":"15px"}}>
                                                            <div className="col-lg-12 row">
                                                                <div className="col-lg-3">
                                                                    Option B Image
                                                                </div>
                                                                <div className="col-lg-9">
                                                                    <input
                                                                        id="a2"
                                                                        name="a2"
                                                                        type="file"
                                                                        ref={ref}
                                                                        onChange={(event) => {
                                                                            setFieldValue("a2", event.currentTarget.files[0]);
                                                                        }}
                                                                        onBlur={handleBlur}
                                                                        className="form-control"
                                                                    />
                                                                    {errors.a2 ? <div className="alert alert-info">{errors.a2}</div> : null}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        : null}
                                                </div>
                                                <div className="col-lg-6 row">
                                                    <div className="col-lg-3">
                                                        Option C
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
                                                                values.optionc = editor.getData();
                                                            }}
                                                            onBlur={(event, editor) => {
                                                            }}
                                                        />
                                                        {errors.optionc ? <div className="alert alert-info">{errors.optionc}</div> : null}
                                                    </div>
                                                    {values.questType === 'N2' || values.questType === 'N3' ?
                                                        <div className="form-group" style={{"marginTop":"15px"}}>
                                                            <div className="col-lg-12 row">
                                                                <div className="col-lg-3">
                                                                    Option C Image
                                                                </div>
                                                                <div className="col-lg-9">
                                                                    <input
                                                                        id="a3"
                                                                        name="a3"
                                                                        type="file"
                                                                        ref={ref}
                                                                        onChange={(event) => {
                                                                            setFieldValue("a3", event.currentTarget.files[0]);
                                                                        }}
                                                                        onBlur={handleBlur}
                                                                        className="form-control"
                                                                    />
                                                                    {errors.a3 ? <div className="alert alert-info">{errors.a3}</div> : null}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        : null}
                                                </div>
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="form-group">
                                            <div className="col-lg-12 row">
                                                <div className="col-lg-6 row">
                                                    <div className="col-lg-3">
                                                        Option D
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
                                                                values.optiond = editor.getData();
                                                            }}
                                                            onBlur={(event, editor) => {
                                                            }}
                                                        />
                                                        {errors.optiond ? <div className="alert alert-info">{errors.optiond}</div> : null}
                                                    </div>
                                                    {values.questType === 'N2' || values.questType === 'N3' ?
                                                        <div className="form-group" style={{"marginTop":"15px"}}>
                                                            <div className="col-lg-12 row">
                                                                <div className="col-lg-3">
                                                                    Option D Image
                                                                </div>
                                                                <div className="col-lg-9">
                                                                    <input
                                                                        id="a4"
                                                                        name="a4"
                                                                        type="file"
                                                                        ref={ref}
                                                                        onChange={(event) => {
                                                                            setFieldValue("a4", event.currentTarget.files[0]);
                                                                        }}
                                                                        onBlur={handleBlur}
                                                                        className="form-control"
                                                                    />
                                                                    {errors.a4 ? <div className="alert alert-info">{errors.a4}</div> : null}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    : null}
                                                </div>
                                                <div className="col-lg-6 row">
                                                    <div className="col-lg-3">
                                                        Correct Option
                                                    </div>
                                                    <div className="col-lg-9">
                                                        <select id="correctoption" name="correctoption" className="form-control" onChange={handleChange} onBlur={handleBlur} value={values.correctoption}>
                                                            <option value="">Select Correct Option</option>
                                                            <option value="optiona">Option A</option>
                                                            <option value="optionb">Option B</option>
                                                            <option value="optionc">Option C</option>
                                                            <option value="optiond">Option D</option>
                                                        </select>

                                                        {errors.correctoption ? <div className="alert alert-info">{errors.correctoption}</div> : null}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <hr />
                                        {
                                        mySectionFlg && mySection !== '' && mySection.length > 0 ?
                                        <div className="form-group">
                                            <div className="col-lg-12 row">
                                                <div className="col-lg-6 row">
                                                    <div className="col-lg-3">
                                                        Select Section
                                                    </div>
                                                    <div className="col-lg-9">
                                                        <select id="section" name="section" className="form-control" onChange={handleChange} onBlur={handleBlur} value={values.section}>
                                                            <option value="">Select Section</option>
                                                            {
                                                                mySection.map((value, index) => (
                                                                    <option key={index} value={value}>
                                                                        {value}
                                                                    </option>
                                                                ))
                                                            }
                                                        </select>
                                                        {errors.section ? <div className="alert alert-info">{errors.section}</div> : null}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        :null
                                        }
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
            :
            null
    );
};

function getSection(subjectid,subjects,setMySection,setMySectionFlg,setFieldValue)
{
    let flg=false;
    for(let i = 0;i<subjects.length;i++)
    {
        if(subjectid == subjects[i].id)
        {
            if(subjects[i].examCategory === 'sectional')
            {
                flg = true;
                setMySection(subjects[i].sectionNames.split(","));
                setMySectionFlg(true);
                setFieldValue('sectionFlg',true);
                break;
            }
        }
    }
    if(flg === false)
    {
        setMySectionFlg(false);
        setFieldValue('sectionFlg',false);
    }
}

async function getConfirmed(paperId, instId, uid, setShow, setMsg, setConfirm, setUserRole) {
    if (paperId === '') {
        setConfirm(false);
    }

    await API.get('/subject/setterAllocation', { params: { 'type': 'searchByPaperId', 'paperId': paperId, 'instId': instId, 'setterId': uid } })
        .then((res) => {
            if (res.data.status === 'success') 
            {
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

async function submitQB(values, setMyMsg, setShow, setMsg, props, currentUser) 
{
    let fd = new FormData();

    let subjectId = values.subjectId; fd.append("subjectId", subjectId);
    let topic = values.topic; fd.append("topic", topic);
    let subtopic = values.subtopic; fd.append("subtopic", subtopic);
    let difficultyLevel = values.difficultyLevel; fd.append("difficultyLevel", difficultyLevel);
    let marks = values.marks; fd.append("marks", marks);
    let questType = values.questType; fd.append("questType", questType);
    let question = values.question; fd.append("question", question);
    let qufig = values.qufig; fd.append("qufig", qufig);
    let optiona = values.optiona; fd.append("optiona", optiona);
    let a1 = values.a1; fd.append("a1", a1);
    let optionb = values.optionb; fd.append("optionb", optionb);
    let a2 = values.a2; fd.append("a2", a2);
    let optionc = values.optionc; fd.append("optionc", optionc);
    let a3 = values.a3; fd.append("a3", a3);
    let optiond = values.optiond; fd.append("optiond", optiond);
    let a4 = values.a4; fd.append("a4", a4);
    let correctoption = values.correctoption; fd.append("correctoption", correctoption);
    let setter = currentUser ? currentUser.uid : ''; fd.append("setter", setter);
    let section = values.section; fd.append("section", section);

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

export default QuestionBankForm;