import React, { useState, useEffect, useContext } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import API from '../../../api';
import { ShowContext } from '../../../App';
import { UserContext } from '../../../App';
import StudentProctorLog from './StudentProctorLog';

const StudentProctoringReport = (props) => {
    const [myMsg, setMyMsg] = useState('');
    const [log, setLog] = useState();
    const [subjects, setSubjects] = useState();
    const [loading, setLoading] = useState(false);
    const myInitialValues = { enrollno: '', paperId: '',instId:'' };
    const { setShow, setMsg } = useContext(ShowContext);
    const { currentUser } = useContext(UserContext);
    const [insts, setInsts] = useState([]);
    const [dataFolder,setDataFolder] = useState();

    useEffect(() => {
        if (currentUser !== undefined && currentUser.role !== 'EADMIN') {
            getInsts(setInsts, setShow, setMsg, currentUser);
        }
    }, [currentUser]);

    return (
        currentUser ? <Formik
            initialValues={myInitialValues}
            onSubmit={async (values, actions) => {
                if(currentUser.role === 'EADMIN')
                {
                    values.instId = currentUser.username;
                }
                if(values.instId === undefined || values.instId === null || values.instId === '')
                {
                    setShow(true);
                    setMsg('Please Provide Institute...');return false;
                }
                setLoading(true);
                await getStudentProctorLog(values, setLog, setMyMsg, setShow, setMsg,setDataFolder);
                setLoading(false);
            }}
            validationSchema={Yup.object({
                enrollno: Yup.string()
                    .required("Enrollment Number is Required"),
                paperId: Yup.string()
                    .required("Subject is Required."),
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
                        <div>
                            <div className="container-fluid">
                                <br/>
                                <ol className="breadcrumb mb-4">
                                    <li className="breadcrumb-item active">Student Proctoring Report</li>
                                </ol>
                                <div className="row animate__animated animate__pulse animate_slower">
                                    <div className="col-xl-12">
                                        <form id="studExamLogFRM" method="post" className="form-horizontal" onSubmit={handleSubmit}>
                                            <div className="card mb-4">
                                                <div className="card-header">
                                                    <i className="fas fa-address-card mr-1" />
                                                    Student Proctoring Report
                                                </div>
                                                <div className="card-body">
                                                    {(currentUser.role !== 'EADMIN') && (
                                                        <div className="form-group">
                                                            <div className="col-lg-12 row">
                                                                <div className="col-lg-4">
                                                                    Enter Inst Id
                                                                </div>
                                                                <div className="col-lg-8">
                                                                    <select id="instId" name="instId" className="form-control" onChange={handleChange} onBlur={handleBlur} value={values.instId}>
                                                                        <option value="">Select Institute</option>
                                                                        {
                                                                            insts.map(inst =>
                                                                            (
                                                                                <option key={inst.uid} value={inst.username}>
                                                                                    ({inst.username}) {inst.college_name}
                                                                                </option>
                                                                            ))
                                                                        }
                                                                    </select>

                                                                    {errors.instId ? <div className="alert alert-info">{errors.instId}</div> : null}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div className="form-group">
                                                        <div className="col-lg-12 row">
                                                            <div className="col-lg-4">
                                                                Enter Enrollment Number
                                                            </div>
                                                            <div className="col-lg-8">
                                                                <input type="text" id="enrollno" name="enrollno" onChange={(e) => {
                                                                    handleChange(e);
                                                                }} value={values.enrollno} onBlur={(e) => {
                                                                    handleBlur(e);
                                                                    setLoading(true);
                                                                    getSubjects(setSubjects, e.target.value, setShow, setMsg,currentUser,values);
                                                                    setLoading(false);
                                                                }} className="form-control" placeholder="Enter Enrollment No..." />

                                                                {errors.enrollno ? <div className="alert alert-info">{errors.enrollno}</div> : null}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="form-group">
                                                        <div className="col-lg-12 row">
                                                            <div className="col-lg-4">
                                                                Select Subject
                                                            </div>
                                                            <div className="col-lg-8">
                                                                <select id="paperId" name="paperId" className="form-control" onChange={handleChange} onBlur={handleBlur} value={values.paperId}>
                                                                    <option value="">Select Subject</option>
                                                                    {subjects ?
                                                                        subjects.map(subject =>
                                                                        (
                                                                            <option key={subject.paper.id} value={subject.paper.id}>
                                                                                ({subject.paper.paper_code}) {subject.paper.paper_name}
                                                                            </option>
                                                                        ))
                                                                        : null
                                                                    }
                                                                </select>

                                                                {errors.paperId ? <div className="alert alert-info">{errors.paperId}</div> : null}
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

                                                    {loading && (
                                                        <div className="custom-loader"></div>
                                                    )}
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    {
                                        log ?
                                            <StudentProctorLog log={log} dataFolder={dataFolder}/>
                                            : null
                                    }
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

async function getInsts(setInsts, setShow, setMsg, currentUser) {
    let params = {};
    if (currentUser && currentUser.role === 'ADMIN') {
        params = { "role": "EADMIN" };
    }
    else if (currentUser && (currentUser.role === 'EADMIN')) {
        params = { "role": "EADMIN", 'instUid': currentUser.uid };
    }
    else if (currentUser && (currentUser.role === 'SUBADMIN')) {
        params = { "role": "EADMIN", 'instId': currentUser.inst_id };
    }

    await API.get('/user', { params: params })
        .then((res) => {
            if (res.data.status === 'success') {
                setInsts(res.data.data);
            }
            else {
                setShow(true);
                setMsg('Problem Fetching Data from Server');
            }
        });
}

async function getStudentProctorLog(values, setLog, setMyMsg, setShow, setMsg,setDataFolder) {
    await API.get('/proctor/' + values.enrollno + '/' + values.paperId,{params:{"instId":values.instId}})
        .then((res) => {
            if (res.data.status === 'success') {
                setLog(res.data.data);
                setDataFolder(res.data.folder);
            }
            else {
                setShow(true);
                setMsg('Problem Fetching Data from Server');
            }
        });
}

async function getSubjects(setSubjects, enrollno, setShow, setMsg,currentUser,values) {
    let instId = null;
    if(currentUser.role === 'EADMIN')
    {
        instId = currentUser.username;
    }
    else
    {
        instId = values.instId;
    }

    await API.get('/exam', { params: { "type": "byEnrollno", "enrollno": enrollno, "instId": instId } })
        .then((res) => {
            if (res.data.status === 'success') {
                setSubjects(res.data.data);
            }
            else {
                setShow(true);
                setMsg('Problem Fetching Data from Server');
            }
        });

}

export default StudentProctoringReport;