import React, { useState, useContext } from 'react';
import { ShowContext } from '../../App';
import { UserContext } from '../../App';
import API from '../../api';
import Modal from "react-bootstrap/Modal";
import ProctorSnapshot from './ProctorSnapshot';

const StudWiseProctor = ({ subjects }) => {
    const { setShow, setMsg } = useContext(ShowContext);
    const { currentUser } = useContext(UserContext);
    const [students, setStudents] = useState();
    const [instId, setInstId] = useState();
    const [paperId, setPaperId] = useState();
    const [show, setShow1] = useState(false);
    const handleClose = () => setShow1(false);
    const [proctorData, setProctorData] = useState([]);

    return (
        currentUser ?
            <div>
                <div className="card">
                    <div className="card-header">
                        <i className="fas fa-users mr-1" />
                        <b>Student Wise Proctoring</b>
                    </div>
                    <div><br />
                        <div className="form-group">
                            <div className="col-lg-12 row">
                                <div className="col-lg-4">
                                    Select Subject
                                </div>
                                <div className="col-lg-8">
                                    <select id="paperId" name="paperId" className="form-control"
                                        onChange={e => getStudents(e, currentUser, setShow, setMsg, setStudents, setInstId, setPaperId)}>
                                        <option value="">Select Subject</option>
                                        {
                                            subjects.map(subject =>
                                                {
                                                   if(subject.subject !== null)
                                                   {
                                                        return  <option key={subject.subject.id} value={subject.subject.id}>
                                                        {subject.subject.paper_code}-{subject.subject.paper_name}
                                                        </option>
                                                   }
                                                })
                                        }
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="col-lg-12 row">
                                <div className="col-lg-4">
                                    Select Student
                                </div>
                                <div className="col-lg-8">
                                    <select id="studid" name="studid" className="form-control" onChange={(e) => {
                                        findStudent(e, students, setProctorData, setShow1)
                                    }}>
                                        <option value="">Select Student</option>
                                        {students !== undefined && students.length > 0 ?

                                            students.map(student =>
                                            (
                                                <option key={student.student.uid} value={student.student.uid}>
                                                    {student.student.username}-{student.student.name}
                                                </option>
                                            ))

                                            : null}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Modal show={show} onHide={handleClose} size="lg" backdrop="static">
                    <Modal.Header closeButton style={{ backgroundColor: "OliveDrab", color: "white", zIndex: "99999" }}>
                        <Modal.Title><center>Individual Student Proctoring</center></Modal.Title>
                    </Modal.Header>
                    <Modal.Body><center>
                        <div className="col-lg-6 card" style={{ margin: "15px", height: "110px", borderColor: "orange" }}>
                            <center>
                                <ProctorSnapshot data={proctorData} instId={instId} paperId={paperId} height={100} />
                            </center>
                        </div>
                    </center></Modal.Body>
                </Modal>
            </div>
            : null
    );
};

async function findStudent(e, students, setProctorData, setShow1) {
    let flag = 0;
    for (let i = 0; i < students.length; i++) {
        if (students[i].student.uid === parseInt(e.target.value)) {
            flag = 1;
            setProctorData(students[i]);
            setShow1(true);
            break;
        }
    }

    if (flag === 0) {
        setProctorData([]);
    }
}


async function getStudents(e, currentUser, setShow, setMsg, setStudents, setInstId, setPaperId) {
    let paperId = e.target.value;
    let instId = currentUser.inst_id;
    let uid = currentUser.uid;

    setInstId(instId);
    setPaperId(paperId);

    await API.get('/proctorAllocation', { params: { "type": "byPaperId", "paperId": paperId, "proctorUid": uid, "instId": instId } })
        .then((res) => {
            if (res.data.status === 'success') {
                setStudents(res.data.data)
            }
            else {
                setShow(true);
                setMsg('Problem Fetching Data from Server');
            }
        });
}

export default StudWiseProctor;