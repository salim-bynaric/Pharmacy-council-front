import React, { useState, useEffect, useContext } from 'react';
import { ShowContext } from '../../../App';
import { UserContext } from '../../../App';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Formik } from 'formik';
import * as Yup from 'yup';
import API from '../../../api';
import axios from 'axios';
import StudCheckerAllocList from './StudCheckerAllocList';
import CustomSelect from '../../../CustomSelect';

const StudCheckerAlloc = () => {
    const [myList, setMyList] = useState(true);
    const [subjects, setSubjects] = useState();
    const [students, setStudents] = useState();
    const [checkers, setCheckers] = useState();
    const [show1, setShow1] = useState(false);
    const handleClose = () => setShow1(false);

    const { setShow, setMsg } = useContext(ShowContext);
    const { currentUser } = useContext(UserContext);
    const myInitialValues = { paperId: '', type: '' };
    let studMessage = null;
    let checkerMessage = null;

    useEffect(() => {
        if (currentUser !== undefined && currentUser !== null && currentUser.role === 'EADMIN') {
            getSubjects1(setSubjects, currentUser.uid, setShow, setMsg, setStudents, setCheckers);
        }
    }, [currentUser]);

    if (checkers !== undefined) {
        checkerMessage = 'There are total ' + checkers.length + ' Checkers available for allocation with Students';
    }

    if (students !== undefined) {
        studMessage = 'There are total ' + students.length + ' students available for allocation with Checker';
    }

    return (
        subjects !== undefined && subjects.length > 0 && (currentUser !== undefined && currentUser !== null) ? <Formik
            initialValues={myInitialValues}
            onSubmit={async (values, actions) => 
            {
                await getStatistics(currentUser, values, setShow, setMsg, setStudents, setCheckers);
                actions.setSubmitting(false);
            }}
            validationSchema={Yup.object({
                paperId: Yup.string()
                    .required("Subject is Required."),
            })}
        >
            {
                props => {
                    const {
                        values,
                        errors,
                        submitForm,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        setFieldValue
                    } = props;

                    return (
                        subjects !== undefined && (currentUser !== undefined && currentUser !== null) ?
                            <div>
                                <div className="container-fluid">
                                    <br />
                                    <ol className="breadcrumb mb-4">
                                        <li className="breadcrumb-item active">Student Checker Allocation</li>
                                    </ol>
                                    <div className="col-lg-12 row">
                                        <div className="col-lg-12">
                                            <form id="form-checker-alloc" method="post" className="form-horizontal" onSubmit={handleSubmit}>
                                                <div className='card'>
                                                    <div className="card-header">
                                                        <b>Select Subject for Allocation</b>
                                                    </div>
                                                    <div className="card-body col-lg-12 row">
                                                        <div className="card-body col-lg-3">
                                                            <CustomSelect options={subjects}
                                                                value={values.paperId}
                                                                onChange={value =>setFieldValue('paperId', value.value)} />

                                                            {errors.paperId ? <div className="alert alert-info">{errors.paperId}</div> : null}
                                                        </div>
                                                        <div className="card-body col-lg-3">
                                                            <select id="type" name="type" className="form-control" onChange={async (e) => {
                                                                await handleChange(e);
                                                                submitForm();
                                                            }} onBlur={handleBlur} value={values.type}>
                                                                <option value="">Select Checker Type</option>
                                                                <option value="QPC">Question Paper Checker</option>
                                                                <option value="QPM">Question Paper Moderator</option>
                                                            </select>

                                                            {errors.type ? <div className="alert alert-info">{errors.type}</div> : null}
                                                        </div>
                                                        <div className="col-lg-6 row">
                                                            <div className="card-body col-lg-6">
                                                                {
                                                                    (students !== undefined) ?
                                                                        <div className="alert alert-dark" role="alert">
                                                                            {studMessage}
                                                                        </div>
                                                                        : null
                                                                }
                                                            </div>
                                                            <div className="card-body col-lg-6">
                                                                {
                                                                    (checkers !== undefined) ?
                                                                        <div className="alert alert-dark" role="alert">
                                                                            {checkerMessage}
                                                                        </div>
                                                                        : null
                                                                }
                                                            </div>
                                                            <div className="col-lg-12">
                                                                <center>
                                                                    {(checkers !== undefined) && (students !== undefined) ?
                                                                        <button type="button" className="btn btn-primary" id="distribute" onClick={async () => {
                                                                            distribute(students, checkers, setShow1, setShow, setMsg);
                                                                        }}>Automatic Allocation</button>
                                                                        : null}
                                                                </center>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <StudCheckerAllocList myList={myList} setMyList={setMyList} paperId={values.paperId} type={values.type} />
                                    </div>

                                    <Modal show={show1} onHide={handleClose} size="lg">
                                        <Modal.Header closeButton style={{ backgroundColor: "OliveDrab", color: "white", zIndex: "99999" }}>
                                            <Modal.Title><center>Automatic Student Checkers Allocation!!!</center></Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>

                                            {
                                                (checkers !== undefined) && (students !== undefined) ?
                                                    <>
                                                        <div className="alert alert-info">
                                                            <font size={4}>There are total {students.length} students</font>
                                                        </div>

                                                        <div className="alert alert-info">
                                                            <font size={4}>There are total {checkers.length} checkers</font>
                                                        </div>
                                                        {
                                                            (students.length % checkers.length === 0) ?
                                                                <div className="alert alert-info">
                                                                    <font size={4}>Every Checker will be allocated with {(students.length / checkers.length)} students.</font>
                                                                </div>
                                                                :
                                                                (students.length > checkers.length) ?
                                                                    <div className="alert alert-info">
                                                                        <font size={4}>
                                                                            {checkers.length - (students.length % checkers.length)} Checker/s will be allocated with {Math.floor(students.length / checkers.length)} student/s. {checkers.length - (checkers.length - (students.length % checkers.length))} checker/s will be allocated with {Math.floor((students.length / checkers.length) + (Math.ceil((students.length % checkers.length) / checkers.length)))} student/s.
                                                                        </font>
                                                                    </div>
                                                                    :
                                                                    (students.length === checkers.length) ?
                                                                        <div className="alert alert-info"><font size={4}>Every Checkere will be allocated with 1 student.</font></div>
                                                                        :
                                                                        <div className="alert alert-info"><font size={4}>{students.length} checkers will be allocated with 1 student. Remaining will not be allocated.</font></div>
                                                        }
                                                    </>
                                                    :
                                                    null
                                            }

                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button variant="success" onClick={async () => {
                                                await allocate(students, checkers, values.paperId, setShow, setMsg, setShow1, setMyList, myList, currentUser, setStudents, setCheckers, values.type);
                                            }} style={{ float: "right" }}>Allocate</Button>
                                            <Button variant="danger" onClick={handleClose} style={{ float: "right" }}>Close</Button>
                                        </Modal.Footer>
                                    </Modal>

                                </div>
                            </div>
                            : null
                    );
                }
            }
        </Formik>
            :
            subjects && subjects.length === 0 ?
                <>
                    <br />
                    <div className="alert alert-danger">
                        No Subjective Subjects Added for Allocation...
                    </div>
                </>
                :
                null
    );
};

function distribute(students, checkers, setShow1, setShow, setMsg) 
{
    if (students.length > 0 && checkers.length > 0) {
        setShow1(true);
    }
    else {
        setShow(true);
        setMsg('Number of Students and Checkers should not be zero for allocation to be successfull...');
    }
}

async function allocate(students, checkers, paperId, setShow, setMsg, setShow1, setMyList, myList, currentUser, setStudents, setCheckers, type) {
    let checker = [];
    let student = [];
    let params = null;

    if (students.length === 0 || checkers.length === 0) {
        setShow(true);
        setMsg('Number of Students and Checkers should not be zero for allocation to be successfull...');
        return false;
    }

    for (let i = 0; i < students.length; i++) {
        student[i] = students[i].stdid.uid;
    }

    for (let i = 0; i < checkers.length; i++) {
        checker[i] = checkers[i].stdid.uid;
    }

    if (currentUser.role === 'EADMIN') {
        params = { 'paperId': paperId, 'students': student, 'checkers': checker, 'inst': currentUser.username, 'type': type }
    }

    await API.post('/checker/allocate', { ...params })
        .then((res) => {
            if (res.data.status === 'success') {
                setShow(true);
                setMsg(res.data.message);
                setShow1(false);
                setMyList(!myList);
                setStudents(undefined);
                setCheckers(undefined);
            }
            else {
                setShow(true);
                setMsg('Problem Allocating Checkers with Students...');
            }
        })
        .catch(function (error) {
            setShow(true);
            setMsg('Problem Allocating Checkers with Students...');
        });
}


async function getStatistics(currentUser, values, setShow, setMsg, setStudents, setCheckers) {
    if (values.type === '' || values.type === null || values.type === undefined) {
        setShow(true);
        setMsg('Please Select Type of Question Checker...');
        setCheckers(undefined);
        setStudents(undefined);
        return false;
    }

    await axios.all([API.get('subject/getStudList/' + values.paperId, { params: { 'type': values.type } })
        , API.get('subject/getCheckerList/' + values.paperId, { params: { 'type': values.type } })])
        .then(axios.spread((...res) => {
            if (res[0].data.data === undefined || res[0].data.data === null) {
                setStudents([]);
            }
            else {

                let Students = [];
                for (let i = 0; i < res[0].data.data.length; i++) {
                    if (res[0].data.data[i].examstatus === 'over') {
                        Students.push(res[0].data.data[i]);
                    }
                }
                setStudents(Students);
            }
            setCheckers(res[1].data.data);
        }))
        .catch(errors => {
            setCheckers([]);
            setStudents([]);
            setShow(true);
            setMsg('Data Not Found ...');
        });
}

async function getSubjects1(setSubjects, instUid, setShow, setMsg) {
    let subjectData = [];
    await API.get('/subject', { params: { "type": "byInstUid", "instUid": instUid, "mode": "subjective" } })
        .then((res) => {
            if (res.data.status === 'success') {
                res.data.data.map((subject, index) => {
                    subjectData.push({ value: subject.id, label: subject.paper_code + ' - ' + subject.paper_name })
                })
                setSubjects(subjectData);
            }
            else {
                setShow(true);
                setMsg('Problem Fetching Data from Server');
            }
        });
}


export default StudCheckerAlloc;