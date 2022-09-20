import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import API from '../../../api';
import { ShowContext } from '../../../App';
import { UserContext, ExamFolderContext } from '../../../App';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from 'ckeditor5-latest';

const ModerateQB = (props) => {
    let [question, subjects, flag] = useQuestion(props);
    let history = useHistory();
    let imgChangeArray = [];
    const { examFolder } = useContext(ExamFolderContext);
    
    const [mySection,setMySection] = useState(props.question.section !== null ? props.question.section : '');

    const [mySectionFlg,setMySectionFlg] = useState(props.subject !== undefined && props.subject.examCategory === 'sectional' ? true:false);

    const sectionNames = (props.subject !== undefined && props.subject !== null && props.subject.sectionNames !== null) ? props.subject.sectionNames.split(","):'';
    const [myMsg, setMyMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const dataFolder = examFolder;
    const Path = process.env.REACT_APP_PROJPATH + 'data/' + dataFolder + '/files/';
    const { currentUser } = useContext(UserContext);

    

    let myInitialValues = question && subjects ? {
        subjectId: subjects.id, topic: question.topic, subtopic: question.subtopic, difficultyLevel: question.difficulty_level, marks: question.marks, questType: question.figure,

        question: question.question, qufig: Path + question.qu_fig,

        optiona: (question.optiona !== null && question.optiona !== '') ? question.optiona.split(':$:')[0] : '',
        a1: question.a1 ? Path + question.a1.split(':$:')[0] : '',

        optionb: (question.optionb !== null && question.optionb !== '') ? question.optionb.split(':$:')[0] : '',
        a2: question.a2 ? Path + question.a2.split(':$:')[0] : '',

        optionc: (question.optionc !== null && question.optionc !== '') ? question.optionc.split(':$:')[0] : '',
        a3: question.a3 ? Path + question.a3.split(':$:')[0] : '',

        optiond: (question.optiond !== null && question.optiond !== '') ? question.optiond.split(':$:')[0] : '',
        a4: question.a4 ? Path + question.a4.split(':$:')[0] : '',

        correctoption: question.coption, imgChange: '',

        sectionFlg:mySectionFlg,
        section:mySection 
    } : null;

    const { setShow, setMsg } = useContext(ShowContext);
    const topics = [];
    const ref = React.useRef();


    for (let x = 0; x < 50; x++) {
        topics.push(x + 1);
    }

    return (
        question && subjects && props.subject && props.question ? <Formik
            initialValues={myInitialValues}
            onSubmit={async (values, actions) => {
                setMyMsg('');
                setLoading(true);
                moderateQB(values, setMyMsg, setShow, setMsg, history, question, currentUser, flag, props);
                setLoading(false);
                actions.setSubmitting(false);
                actions.resetForm({
                    values: {
                        subjectId: '', topic: '', subtopic: '', difficultyLevel: '', marks: '', questType: '', question: '', qufig: '', optiona: '', a1: '', optionb: '', a2: '', optionc: '', a3: '', optiond: '', a4: '', correctoption: '', imgChange: '',sectionFlg:false,section:''
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
                        <div>
                            <div className="container-fluid">
                                <div className="row col-lg-12">
                                    <div className="col-xl-12">
                                        <form id="form-Prog" method="post" className="form-horizontal" onSubmit={handleSubmit}>
                                            <div className="card mb-4">
                                                <div className="card-header">
                                                    <i className="fas fa-address-card mr-1" />
                                                    {flag[0].toUpperCase() + flag.slice(1)} Question Bank Form
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
                                                                        handleChange(e);
                                                                    }} onBlur={handleBlur} value={values.subjectId}>
                                                                        <option key={subjects.id} value={subjects.id}>
                                                                            ({subjects.paper_code}) {subjects.paper_name}
                                                                        </option>
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
                                                                            topics.map((value, index) => (
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
                                                                            topics.map((value, index) => (
                                                                                <option key={index} value={value}>
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
                                                                    <select id="questType" name="questType" className="form-control" onChange={handleChange} onBlur={handleBlur} value={values.questType} disabled={true}>
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
                                                                        data={values.question}
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

                                                                        onReady={editor => {
                                                                            values.question = editor.getData();
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
                                                                                    onChange={async (event) => {
                                                                                        setFieldValue("qufig", event.currentTarget.files[0]);
                                                                                        imgChangeArray.push('qufig');
                                                                                        imgChangeArray = [...new Set(imgChangeArray)];
                                                                                        setFieldValue('imgChange', imgChangeArray);
                                                                                        let src = URL.createObjectURL(event.target.files[0])
                                                                                        values.qufig = await src;
                                                                                        document.getElementById('questImg').src = values.qufig;
                                                                                    }}
                                                                                    onBlur={handleBlur}
                                                                                    className="form-control"

                                                                                />
                                                                                {errors.qufig ? <div className="alert alert-info">{errors.qufig}</div> : null}

                                                                                <img src={values.qufig} alt="" height="100" width="100" id="questImg" style={{ "borderRadius": "5px" }} onDragStart={(e) => { e.preventDefault(); }} />
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
                                                                        data={values.optiona.split(':$:')[0]}
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

                                                                        onReady={editor => {
                                                                            values.optiona = editor.getData();
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
                                                                                    onChange={async (event) => {
                                                                                        setFieldValue("a1", event.currentTarget.files[0]);
                                                                                        imgChangeArray.push('a1');
                                                                                        imgChangeArray = [...new Set(imgChangeArray)];
                                                                                        setFieldValue('imgChange', imgChangeArray);
                                                                                        let src = URL.createObjectURL(event.target.files[0])
                                                                                        values.a1 = await src;
                                                                                        document.getElementById('a1Img').src = values.a1;
                                                                                    }}
                                                                                    onBlur={handleBlur}
                                                                                    className="form-control"
                                                                                />
                                                                                {errors.a1 ? <div className="alert alert-info">{errors.a1}</div> : null}

                                                                                <img src={values.a1} alt="" height="100" width="100" id="a1Img" onDragStart={(e) => { e.preventDefault(); }} />
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
                                                                        data={values.optionb.split(':$:')[0]}
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
                                                                        onReady={editor => {
                                                                            values.optionb = editor.getData();
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
                                                                                    src={values.a2}
                                                                                    ref={ref}
                                                                                    onChange={async (event) => {
                                                                                        setFieldValue("a2", event.currentTarget.files[0]);
                                                                                        imgChangeArray.push('a2');
                                                                                        imgChangeArray = [...new Set(imgChangeArray)];
                                                                                        setFieldValue('imgChange', imgChangeArray);
                                                                                        let src = URL.createObjectURL(event.target.files[0])
                                                                                        values.a2 = await src;
                                                                                        document.getElementById('a2Img').src = values.a2;
                                                                                    }}
                                                                                    onBlur={handleBlur}
                                                                                    className="form-control"
                                                                                />
                                                                                {errors.a2 ? <div className="alert alert-info">{errors.a2}</div> : null}

                                                                                <img src={values.a2} alt="" height="100" width="100" id="a2Img" onDragStart={(e) => { e.preventDefault(); }} />
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
                                                                        data={values.optionc.split(':$:')[0]}
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
                                                                        onReady={editor => {
                                                                            values.optionc = editor.getData();
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
                                                                                    onChange={async (event) => {
                                                                                        setFieldValue("a3", event.currentTarget.files[0]);
                                                                                        imgChangeArray.push('a3');
                                                                                        imgChangeArray = [...new Set(imgChangeArray)];
                                                                                        setFieldValue('imgChange', imgChangeArray);
                                                                                        let src = URL.createObjectURL(event.target.files[0])
                                                                                        values.a3 = await src;
                                                                                        document.getElementById('a3Img').src = values.a3;
                                                                                    }}
                                                                                    onBlur={handleBlur}
                                                                                    className="form-control"
                                                                                />
                                                                                {errors.a3 ? <div className="alert alert-info">{errors.a3}</div> : null}

                                                                                <img src={values.a3} alt="" height="100" width="100" id="a3Img" onDragStart={(e) => { e.preventDefault(); }} />
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
                                                                        data={values.optiond.split(':$:')[0]}
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
                                                                        onReady={editor => {
                                                                            values.optiond = editor.getData();
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
                                                                                    onChange={async (event) => {
                                                                                        setFieldValue("a4", event.currentTarget.files[0]);
                                                                                        imgChangeArray.push('a4');
                                                                                        imgChangeArray = [...new Set(imgChangeArray)];
                                                                                        setFieldValue('imgChange', imgChangeArray);
                                                                                        let src = URL.createObjectURL(event.target.files[0])
                                                                                        values.a4 = await src;
                                                                                        document.getElementById('a4Img').src = values.a4;
                                                                                    }}
                                                                                    onBlur={handleBlur}
                                                                                    className="form-control"
                                                                                />
                                                                                {errors.a4 ? <div className="alert alert-info">{errors.a4}</div> : null}

                                                                                <img src={values.a4} alt="" height="100" width="100" id="a4Img" onDragStart={(e) => { e.preventDefault(); }} />
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
                                                    mySectionFlg && mySection !== '' && sectionNames.length > 0 ?
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
                                                                           sectionNames.map((value, index) => (
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
                                                            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>Submit</button>
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
                                </div>
                            </div>
                        </div>
                    );
                }
            }
        </Formik>
            : null
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

async function moderateQB(values, setMyMsg, setShow, setMsg, history, question1, currentUser, flag, props) {
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
    let imgChange = values.imgChange; fd.append("imgChange", imgChange);
    let moderator = currentUser.uid; fd.append("moderator", moderator);
    fd.append("flag", flag);

    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    }

    await API.post('/question/moderate/' + question1.qnid, fd, config)
        .then(function (res) {
            if (res.data.status === 'success') {
                setShow(true);
                setMsg(res.data.message);
                props.setVisible3(false);
                props.setOpSuccess(true);
            }
            else {
                setShow(true);
                setMsg(res.data.message);
                props.setOpSuccess(false);
            }
        })
        .catch(function (error) {
            props.setOpSuccess(false);
        });

}


function useQuestion(props) {
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

export default ModerateQB;