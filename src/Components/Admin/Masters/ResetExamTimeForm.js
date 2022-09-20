import React, { useState, useEffect, useContext } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import API from '../../../api';
import { ShowContext } from '../../../App';
import { UserContext } from '../../../App';
import ResetExamTimeFinal from './ResetExamTimeFinal';
import { de } from '../../../utils/Helper';

const ResetExamTimeForm = (props) => {
    const [myMsg, setMyMsg] = useState('');
    const [subjects, setSubjects] = useState();
    const myInitialValues = { enrollno: '', examid: '' };
    const { setShow, setMsg } = useContext(ShowContext);
    const { currentUser } = useContext(UserContext);
    const [elapsedTime, setElapseTime] = useState();
    const [examStatus, setExamStatus] = useState();
    const [loading, setLoading] = useState(false);

    return (
        currentUser ?
            <Formik
                initialValues={myInitialValues}
                onSubmit={async (values, actions) => {
                    setLoading(true);
                    await getElapsedTime(values.examid, setShow, setMsg, setElapseTime, setExamStatus);
                    setLoading(false);
                }}
                validationSchema={Yup.object({
                    enrollno: Yup.string()
                        .required("Student Enrollment Number is Required"),
                    examid: Yup.string()
                        .required("Subject is Required"),
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
                            handleSubmit
                        } = props;
                        return (
                            <div className="col-xl-12">
                                <form id="form-Prog" method="post" className="form-horizontal" onSubmit={handleSubmit}>
                                    <div className="card mb-4">
                                        <div className="card-header">
                                            <i className="fas fa-address-card mr-1" />
                                            Reset Exam Time Form
                                        </div>
                                        <div className="card-body">
                                            <div className="form-group">
                                                <div className="col-lg-12 row">
                                                    <div className="col-lg-4">
                                                        Enter Enrollment No
                                                    </div>
                                                    <div className="col-lg-8">
                                                        <input type="text" id="enrollno" name="enrollno" onChange={handleChange} value={values.enrollno} onBlur={(e) => {
                                                            handleBlur(e);
                                                            getSubjects(e.target.value, setShow, setMsg, setSubjects);
                                                        }} className="form-control" placeholder="Enter Enrollment  Number..." />

                                                        {errors.enrollno ? <div className="alert alert-info">{errors.enrollno}</div> : null}
                                                    </div>
                                                </div>
                                            </div>
                                            {

                                                <div className="form-group">
                                                    <div className="col-lg-12 row">
                                                        <div className="col-lg-4">
                                                            Select Subject
                                                        </div>
                                                        <div className="col-lg-8">
                                                            <select id="examid" name="examid" className="form-control" onChange={handleChange} onBlur={handleBlur} value={values.examid}>
                                                                <option value="">Select Subject</option>
                                                                {
                                                                    subjects !== undefined ?
                                                                        subjects.map(subject =>
                                                                        (
                                                                            <option key={subject.examid} value={subject.examid}>
                                                                                {subject.subject}
                                                                            </option>
                                                                        ))
                                                                        : null
                                                                }
                                                            </select>

                                                            {errors.examid ? <div className="alert alert-info">{errors.examid}</div> : null}
                                                        </div>
                                                    </div>
                                                </div>

                                            }
                                        </div>
                                        <div className="card-footer">
                                            <div className="form-group">
                                                <center>
                                                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>Submit</button>
                                                </center>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                                <div className="col-lg-12">
                                    {
                                        elapsedTime !== undefined && examStatus !== undefined ?
                                            <ResetExamTimeFinal examid={values.examid} elapsedTime={elapsedTime} examStatus={examStatus} setElapseTime={setElapseTime} setExamStatus={setExamStatus} setShow={setShow} setMsg={setMsg} setLoading={setLoading}/>
                                            : null
                                    }
                                </div>
                                {
                                    loading ?
                                        <div className="custom-loader"></div>
                                        : null
                                }
                            </div>
                        );
                    }
                }
            </Formik>
            : null
    );
};

async function getElapsedTime(examid, setShow, setMsg, setElapseTime, setExamStatus) {
    await API.get('/examSession', { params: { 'exam_id': examid } })
        .then(function (res) {
            if (res.data.status === 'success') {
                setElapseTime(de(res.data.elapsedTime));
                setExamStatus(de(res.data.examStatus));
            }
        })
        .catch(function (error) {
            setShow(true);
            setMsg('Problem Fetching Exam Session Data from Server');
        })
}

async function getSubjects(enrollno, setShow, setMsg, setSubjects) {
    let mySubjects = [];
    if (enrollno === '') {
        setShow(true);
        setMsg('Enter Proper Student Enrollment Number...');
        return false;
    }

    await API.get('/exam', { params: { 'type': 'byEnrollno', 'enrollno': enrollno } })
        .then(function (res) {
            if (res.data.status === 'success') {
                res.data.data.map((data, index) => {
                    mySubjects.push({ 'examid': data.id, 'subject': data.paper.paper_code + '-' + data.paper.paper_name });
                });

                setSubjects(mySubjects);
            }
        })
        .catch(function (error) {
            setShow(true);
            setMsg('Problem Fetching Subjects Data from Server');
        })
}

export default ResetExamTimeForm;