import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import API from '../../../api';
import { Link } from 'react-router-dom';
import ClipLoader from "react-spinners/ClipLoader";

const ConfigureTestGeneric = (props) => {
    const paperCode = 'GENERICTEST';
    const paperName = 'GENERICTEST';

    const [myMsg, setMyMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [subjectData, setSubjectData] = useState();
    const [updated, setUpdated] = useState(false);

    useEffect(() => {
        getSubjectData(setSubjectData, paperName, paperCode);
    }, [updated]);

    let myInitialValues = {};
    if (subjectData !== undefined) {
        myInitialValues = { 'score_view': subjectData.score_view, 'review_question': subjectData.review_question, 'proctoring': subjectData.proctoring, 'photo_capture': subjectData.photo_capture, 'capture_interval': subjectData.capture_interval ? subjectData.capture_interval : '', 'negative_marking': subjectData.negative_marking ? subjectData.negative_marking : '', 'negative_marks': subjectData.negative_marks, 'time_remaining_reminder': subjectData.time_remaining_reminder, 'exam_switch': subjectData.exam_switch, 'exam_switch_alerts': subjectData.exam_switch_alerts, 'option_shuffle': subjectData.option_shuffle, 'question_marks': subjectData.question_marks, 'ph_time': subjectData.ph_time, 'static_assign': subjectData.static_assign, 'questwisetimer': subjectData.questwisetimer, 'secperquest': subjectData.secperquest ? subjectData.secperquest : '','warningDriver':subjectData.warningDriver,'warningType':subjectData.warningType,'singleFileUpload':subjectData.singleFileUpload,"clearResponse": subjectData.clearResponse,"proctorMultilogin":subjectData.proctorMultilogin,"collaborativeQB":subjectData.collaborativeQB,'proctoringType':subjectData.proctoringType,'videoAudio':subjectData.videoAudio,'resolution':subjectData.resolution,"flexi_photo_capture":subjectData.flexi_photo_capture,"useTestCode":subjectData.useTestCode,"student_attendance":subjectData.student_attendance};
    }

    return (
        subjectData !== undefined ? <Formik
            initialValues={myInitialValues}
            onSubmit={async (values, actions) => {
                //-----------------Save Values to Database--------------------------------------------
                setMyMsg('');
                saveExamConfig(values, setLoading, setMyMsg, paperCode, setUpdated, updated);
                actions.setSubmitting(false);
                //------------------------------------------------------------------------------------
            }}

            validationSchema={Yup.object().shape({
                proctoringType: Yup.string().required("Proctoring Type is Required"),
                videoAudio: Yup.string().when('proctoringType', {
                    is: (proctoringType) => proctoringType === "V" || proctoringType === "A",
                    then: Yup.string().required("Specification of Capturing is Required")
                }).nullable(),
                resolution: Yup.string().when('proctoringType', {
                    is: (proctoringType) => proctoringType === "V",
                    then: Yup.string().required("Please Select Resolution")
                }).nullable(),
                photo_capture: Yup.boolean(),
                capture_interval: Yup.number().when('photo_capture', {
                    is: true,
                    then: Yup.number().required("Capture Interval is Mandatory")
                }),
                negative_marking: Yup.boolean(),
                negative_marks: Yup.number().when('negative_marking', {
                    is: true,
                    then: Yup.number().required("Negative Marks is Mandatory")
                }),
                questwisetimer: Yup.boolean(),
                secperquest: Yup.number().when('questwisetimer', {
                    is: true,
                    then: Yup.number().required("Marks in seconds per question is Mandatory")
                }),
                exam_switch: Yup.boolean(),
                exam_switch_alerts: Yup.number().when('exam_switch', {
                    is: true,
                    then: Yup.number().required("Number of Exam Switch Alerts is Mandatory")
                }),
            })}

        >
            {
                props => {
                    const {
                        values,
                        touched,
                        errors,
                        isSubmitting,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        setFieldValue,
                    } = props;
                    return (
                        <div>
                            <div className="container-fluid">
                                <br/>
                                <ol className="breadcrumb mb-4">
                                    <li className="breadcrumb-item active col-lg-12 row">
                                            <div className="col-lg-3">
                                                <b>Configure Generic Test</b>
                                            </div>
                                            <div className="col-lg-3">
                                                <b>Paper Code: {paperCode}</b>
                                            </div>
                                            <div className="col-lg-3">
                                                <b>Paper Name: {paperName}</b>
                                            </div>
                                            <div className="col-lg-3">
                                                <Link to="addTest" className="btn btn-danger btn-sm" style={{ float: 'right' }}>Go Back</Link>
                                            </div>
                                    </li>
                                </ol>
                                
                                <form id="form-config" method="post" className="form-horizontal" onSubmit={handleSubmit}>
                                    <div className="row col-lg-12 animate__animated animate__pulse animate_slower">
                                        <div className="col-lg-12">
                                            <table className="table table-bordered" style={{ width: "100%" }}>
                                                <thead>
                                                    <tr bgcolor="aqua">
                                                        <th>Description</th>
                                                        <th>Action</th>
                                                        <th>Description</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            Allow Instant Score View
                                                        </td>
                                                        <td><center>
                                                            <label className="switch">
                                                                <input type="checkbox" name="score_view" id="score_view" onChange={() => setFieldValue("score_view", !values.score_view ? true : false)} onBlur={handleBlur} checked={values.score_view ? true : false} />
                                                                <span className="slider round"></span>
                                                            </label></center>
                                                        </td>
                                                        <td>
                                                            Enable Review Questions to Candiate
                                                        </td>
                                                        <td><center>
                                                            <label className="switch">
                                                                <input type="checkbox" name="review_question" id="review_question" onChange={() => setFieldValue("review_question", !values.review_question ? true : false)} onBlur={handleBlur} checked={values.review_question ? true : false} />
                                                                <span className="slider round"></span>
                                                            </label></center>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            Select Proctoring Type
                                                        </td>
                                                        <td><center>
                                                            <select id="proctoringType" name="proctoringType" className="form-control" onChange={(e) => {
                                                                handleChange(e);
                                                                setFieldValue("videoAudio", "");
                                                                setFieldValue("photo_capture", false);
                                                                setFieldValue("proctoring", false);
                                                                setFieldValue("capture_interval", '');
                                                                setFieldValue("resolution", "");
                                                                setFieldValue("flexi_photo_capture",false);
                                                            }} onBlur={handleBlur} value={values.proctoringType}>
                                                                <option value="">Select Type</option>
                                                                <option value="V">Video Proctoring</option>
                                                                <option value="I">Image Proctoring</option>
                                                                <option value="A">Audio Proctoring</option>
                                                            </select>
                                                            {errors.proctoringType && touched.proctoringType && (
                                                                <div className="alert alert-info">{errors.proctoringType}</div>
                                                            )}
                                                            </center>
                                                        </td>
                                                        <td>
                                                            Select Specification of Proctoring
                                                        </td>
                                                        <td> 
                                                            <select id="videoAudio" name="videoAudio" className="form-control" onChange={handleChange} onBlur={handleBlur} value={values.videoAudio} disabled={values.proctoringType === 'V' || values.proctoringType === 'A' ? false : true}>
                                                                <option value="">Select Specification</option>
                                                                <option value="AV">Video and Audio Both</option>
                                                                <option value="V">Only Video</option>
                                                            </select>
                                                            {errors.videoAudio && touched.videoAudio && (
                                                                <div className="alert alert-info">{errors.videoAudio}</div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            Specify Resolution(Height x Width)
                                                        </td>
                                                        <td><center>
                                                            <select id="resolution" name="resolution" className="form-control" onChange={(e) => {
                                                                handleChange(e);
                                                            }} onBlur={handleBlur} value={values.resolution} disabled={values.proctoringType === 'V' ? false : true}>
                                                                <option value="">Select Resolution</option>
                                                                <option value="100x100">100 x 100</option>
                                                                <option value="150x100">100 x 150</option>
                                                                <option value="150x150">150 x 150</option>
                                                                <option value="200x150">150 x 200</option>
                                                                <option value="200x200">200 x 200</option>
                                                                <option value="250x200">200 x 250</option>
                                                                <option value="250x250">250 x 250</option>
                                                                <option value="300x250">250 x 300</option>
                                                                <option value="300x300">300 x 300</option>
                                                            </select>
                                                            {errors.resolution && touched.resolution && (
                                                                <div className="alert alert-info">{errors.resolution}</div>
                                                            )}
                                                            </center>
                                                        </td>
                                                        <td>
                                                            
                                                        </td>
                                                        <td> 
                                                            
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            Enable Candidate Photo Capture
                                                        </td>
                                                        <td><center>
                                                            <label className="switch">
                                                                <input type="checkbox" name="photo_capture" id="photo_capture" onChange={() => {
                                                                    setFieldValue("photo_capture", !values.photo_capture ? true : false);
                                                                    setFieldValue("proctoring", false);
                                                                }} onBlur={handleBlur} checked={(values.proctoringType === 'I') ? values.photo_capture ? true : false : false} 
                                                                
                                                                disabled={(values.proctoringType === 'V' || values.proctoringType === 'A' || values.proctoringType === '' || values.proctoringType === undefined) ? true : false}/>
                                                                <span className="slider round"></span>
                                                            </label></center>
                                                        </td>
                                                        <td>
                                                            Enter Capture Interval in Seconds
                                                        </td>
                                                        <td> <input type="text" className="form-control" id="capture_interval" name="capture_interval" onChange={handleChange} onBlur={handleBlur} value={values.proctoringType === 'I' ? values.photo_capture ? values.capture_interval : values.capture_interval = '': ''} disabled={!values.photo_capture ? true : false} />

                                                            {errors.capture_interval && touched.capture_interval && (
                                                                <div className="alert alert-info">{errors.capture_interval}</div>
                                                            )}

                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            Enable Flexi Photo Capture
                                                        </td>
                                                        <td><center>
                                                            <label className="switch">
                                                                <input type="checkbox" name="flexi_photo_capture" id="flexi_photo_capture" onChange={() => {
                                                                    setFieldValue("flexi_photo_capture", !values.flexi_photo_capture ? true : false);
                                                                }} onBlur={handleBlur} checked={values.proctoringType === 'I' && values.flexi_photo_capture ? true : false} />
                                                                <span className="slider round"></span>
                                                            </label></center>
                                                        </td>
                                                        <td>
                                                            Use Test Code
                                                        </td>
                                                        <td><center>
                                                            <label className="switch">
                                                                <input type="checkbox" name="useTestCode" id="useTestCode" onChange={() => {
                                                                    setFieldValue("useTestCode", !values.useTestCode ? true : false);
                                                                }} onBlur={handleBlur} checked={values.useTestCode ? true : false} />
                                                                <span className="slider round"></span>
                                                            </label></center>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            Enable Student Attendance
                                                        </td>
                                                        <td><center>
                                                            <label className="switch">
                                                                <input type="checkbox" name="student_attendance" id="student_attendance" onChange={() => {
                                                                    setFieldValue("student_attendance", !values.student_attendance ? true : false);
                                                                }} onBlur={handleBlur} checked={values.student_attendance ? true : false} />
                                                                <span className="slider round"></span>
                                                            </label></center>
                                                        </td>
                                                        <td>
                                                           
                                                        </td>
                                                        <td>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            Enable Image Analysis
                                                        </td>
                                                        <td><center>
                                                            <label className="switch">
                                                                <input type="checkbox" name="proctoring" id="proctoring" onChange={() => setFieldValue("proctoring", !values.proctoring ? true : false)} onBlur={handleBlur} checked={values.proctoring ? true : false } disabled={values.proctoringType === 'I' && values.photo_capture === true ? false : true}/>
                                                                <span className="slider round"></span>
                                                            </label></center>
                                                        </td>
                                                        <td>
                                                            Enable Negative Marking
                                                        </td>
                                                        <td><center>
                                                            <label className="switch">
                                                                <input type="checkbox" name="negative_marking" id="negative_marking" onChange={() => setFieldValue("negative_marking", !values.negative_marking ? true : false)} onBlur={handleBlur} checked={values.negative_marking ? true : false} />
                                                                <span className="slider round"></span>
                                                            </label></center>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            Enter Negative Marks as Fraction
                                                        </td>
                                                        <td> <input type="text" className="form-control" id="negative_marks" name="negative_marks" onChange={handleChange} onBlur={handleBlur} value={values.negative_marking ? values.negative_marks : values.negative_marks = ''} disabled={!values.negative_marking ? true : false} />

                                                            {errors.negative_marks && touched.negative_marks && (
                                                                <div className="alert alert-info">{errors.negative_marks}</div>
                                                            )}

                                                        </td>
                                                        <td>
                                                            Time Remaining Reminder
                                                        </td>
                                                        <td> <input type="text" className="form-control" id="time_remaining_reminder" name="time_remaining_reminder" value={values.time_remaining_reminder} onChange={handleChange} onBlur={handleBlur} /></td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            Exam Switching
                                                        </td>
                                                        <td><center>
                                                            <label className="switch">
                                                                <input type="checkbox" name="exam_switch" id="exam_switch" onChange={() => setFieldValue("exam_switch", !values.exam_switch ? true : false)} onBlur={handleBlur} checked={values.exam_switch ? true : false} />
                                                                <span className="slider round"></span>
                                                            </label></center>
                                                        </td>
                                                        <td>
                                                            Exam Switch Alerts
                                                        </td>
                                                        <td> <input type="text" className="form-control" id="exam_switch_alerts" name="exam_switch_alerts" value={values.exam_switch ? values.exam_switch_alerts : values.exam_switch_alerts = ''} disabled={!values.exam_switch ? true : false} onChange={handleChange} onBlur={handleBlur} />

                                                            {errors.exam_switch_alerts && touched.exam_switch_alerts && (
                                                                <div className="alert alert-info">{errors.exam_switch_alerts}</div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            Option Shuffle
                                                        </td>
                                                        <td><center>
                                                            <label className="switch">
                                                                <input type="checkbox" name="option_shuffle" id="option_shuffle" onChange={() => setFieldValue("option_shuffle", !values.option_shuffle ? true : false)} onBlur={handleBlur} checked={values.option_shuffle ? true : false} />
                                                                <span className="slider round"></span>
                                                            </label></center>
                                                        </td>
                                                        <td>
                                                            Show Marks for question in examination
                                                        </td>
                                                        <td><center>
                                                            <label className="switch">
                                                                <input type="checkbox" name="question_marks" id="question_marks" onChange={() => setFieldValue("question_marks", !values.question_marks ? true : false)} onBlur={handleBlur} checked={values.question_marks ? true : false} />
                                                                <span className="slider round"></span>
                                                            </label></center>
                                                        </td>

                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            Enter Extra Time for Physically Handicap Students
                                                        </td>
                                                        <td> <input type="text" className="form-control" id="ph_time" name="ph_time" value={values.ph_time} onChange={handleChange} onBlur={handleBlur} /></td>
                                                        <td>
                                                            Static Exam Assignment
                                                        </td>
                                                        <td><center>
                                                            <label className="switch">
                                                                <input type="checkbox" name="static_assign" id="static_assign" onChange={() => setFieldValue("static_assign", !values.static_assign ? true : false)} onBlur={handleBlur} checked={values.static_assign ? true : false} />
                                                                <span className="slider round"></span>
                                                            </label></center>
                                                        </td>

                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            Enable Timer Per Question
                                                        </td>
                                                        <td><center>
                                                            <label className="switch">
                                                                <input type="checkbox" name="questwisetimer" id="questwisetimer" onChange={() => {
                                                                    setFieldValue("questwisetimer", !values.questwisetimer ? true : false);
                                                                }} onBlur={handleBlur} checked={values.questwisetimer ? true : false} />
                                                                <span className="slider round"></span>
                                                            </label></center>
                                                        </td>
                                                        <td>
                                                            Per Question time in seconds
                                                        </td>
                                                        <td>
                                                            <input type="text" className="form-control" id="secperquest" name="secperquest" value={values.questwisetimer ? values.secperquest : values.secperquest = ''} onChange={handleChange} onBlur={handleBlur} disabled={!values.questwisetimer ? true : false} />

                                                            {errors.secperquest && touched.secperquest && (
                                                                <div className="alert alert-info">{errors.secperquest}</div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            Warning Message Driver
                                                        </td>
                                                        <td>
                                                            <select id="warningDriver" name="warningDriver" className="form-control" onChange={handleChange} onBlur={handleBlur} value={values.warningDriver}>
                                                                <option value="database">Database</option>
                                                                <option value="socketio">Socket.io</option>
                                                                <option value="pusher">Pusher</option>
                                                            </select>
                                                        </td>
                                                        <td>
                                                            Warning Message Type
                                                        </td>
                                                        <td>
                                                            <select id="warningType" name="warningType" className="form-control" onChange={handleChange} onBlur={handleBlur} value={values.warningType}>
                                                                <option value="1">MSBTE Complient</option>
                                                                <option value="0">Normal</option>
                                                            </select>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            Subjective Examination with Single File Upload
                                                        </td>
                                                        <td>
                                                            <select id="singleFileUpload" name="singleFileUpload" className="form-control" onChange={handleChange} onBlur={handleBlur} value={values.singleFileUpload}>
                                                                <option value="1">Yes</option>
                                                                <option value="0">No</option>
                                                            </select>
                                                        </td>
                                                        <td>
                                                            Enable Clear Response
                                                        </td>
                                                        <td><center>
                                                            <label className="switch">
                                                                <input type="checkbox" name="clearResponse" id="clearResponse" onChange={() => {
                                                                    setFieldValue("clearResponse", !values.clearResponse ? true : false);
                                                                }} onBlur={handleBlur} checked={values.clearResponse ? true : false} />
                                                                <span className="slider round"></span>
                                                            </label></center>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            Allow Multi Login to Proctor ?
                                                        </td>
                                                        <td>
                                                        <center>
                                                            <label className="switch">
                                                                <input type="checkbox" name="proctorMultilogin" id="proctorMultilogin" onChange={() => {
                                                                    setFieldValue("proctorMultilogin", !values.proctorMultilogin ? true : false);
                                                                }} onBlur={handleBlur} checked={values.proctorMultilogin ? true : false} />
                                                                <span className="slider round"></span>
                                                            </label></center>
                                                        </td>
                                                        <td>
                                                            Allow Collaborative QB Edit
                                                        </td>
                                                        <td>
                                                        <center>
                                                            <label className="switch">
                                                                <input type="checkbox" name="collaborativeQB" id="collaborativeQB" onChange={() => {
                                                                    setFieldValue("collaborativeQB", !values.collaborativeQB ? true : false);
                                                                }} onBlur={handleBlur} checked={values.collaborativeQB ? true : false} />
                                                                <span className="slider round"></span>
                                                            </label></center>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td colSpan={4} bgcolor="aqua">
                                                            <center>
                                                                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>Submit</button>
                                                            </center>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                            {myMsg !== '' && (
                                                <div className="alert alert-dark animate__animated animate__tada animate_slower">{myMsg}</div>)}

                                            {loading && (
                                                <div className="col-lg-12" style={{ position: "absolute", top: "40%", left: "40%" }}>
                                                    <ClipLoader color={'#ff0000'} loading={loading} size={200} />
                                                </div>)}

                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    );
                }
            }
        </Formik>
            : null
    );
};

async function getSubjectData(setSubjectData, paperName, paperCode) {
    await API.get('/subject/config/generic/', { params: { 'paperName': paperName, 'paperCode': paperCode } })
        .then(function (res) {
            if (res.data.status === 'success') {
                setSubjectData(res.data.data);
            }
            else {
                setSubjectData({});
            }
        })
        .catch(function (error) {
            setSubjectData({});
        });
}

async function saveExamConfig(values, setLoading, setMyMsg, paperCode, setUpdated, updated) {
    setLoading(true);
    await API.put('/subject/config/generic/' + paperCode, { 'score_view': values.score_view, 'review_question': values.review_question, 'proctoring': values.proctoring, 'photo_capture': values.photo_capture, 'capture_interval': values.capture_interval, 'negative_marking': values.negative_marking, 'negative_marks': values.negative_marks, 'time_remaining_reminder': values.time_remaining_reminder, 'exam_switch_alerts': values.exam_switch_alerts, 'option_shuffle': values.option_shuffle, 'question_marks': values.question_marks, 'ph_time': values.ph_time, 'static_assign': values.static_assign, 'questwisetimer': values.questwisetimer, 'secperquest': values.secperquest, 'exam_switch': values.exam_switch,'warningDriver':values.warningDriver,'warningType':values.warningType,'singleFileUpload':values.singleFileUpload,"clearResponse":values.clearResponse,"proctorMultilogin":values.proctorMultilogin,"collaborativeQB":values.collaborativeQB,"proctoringType":values.proctoringType,"videoAudio":values.videoAudio,"resolution":values.resolution,"flexi_photo_capture":values.flexi_photo_capture,"useTestCode":values.useTestCode,"student_attendance":values.student_attendance })
        .then(function (res) {
            setMyMsg(res.data.message);
            if (res.data.status === 'success') {
                setMyMsg(res.data.message);
                setUpdated(!updated);
                setLoading(false);
                setTimeout(() => { setMyMsg('') }, 20000);
            }
            else {
                setLoading(false);
                setMyMsg(res.data.message);
                setTimeout(() => { setMyMsg('') }, 20000);
            }
        })
        .catch(function (error) {
            setLoading(false);
            setMyMsg(error.response.data.message);
            setTimeout(() => { setMyMsg('') }, 20000);
        });
}

export default ConfigureTestGeneric;