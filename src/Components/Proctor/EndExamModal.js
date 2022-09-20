import React, { useState } from 'react';
import Modal from "react-bootstrap/Modal";
import API from '../../api';

const EndExamModal = ({ show, handleClose, examid ,setShow, setMsg,setShowEndExam}) => {
    const [reason, setReason] = useState();
    return (
        <div>
            <Modal show={show} onHide={handleClose} size="lg">
                <Modal.Header closeButton style={{ backgroundColor: "OliveDrab", color: "white", zIndex: "99999" }}>
                    <Modal.Title><center>Enter End Exam Reason</center></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='card'>
                        <div className="card-header">
                            <i className="fa fa-exclamation-triangle fa-sm"></i> <b>Enter End Exam Reason</b>
                        </div>
                        <div className="card-body col-lg-12 row">
                            <div className="col-lg-8">
                                <input type="text" id="reason" name="reason" className="form-control" placeholder="Enter Reason for Ending Examination" onChange={(e) => {
                                    setReason(e.target.value);
                                }}/>
                            </div>
                            <div className="col-lg-4">
                                <button className="btn btn-info" onClick={() => {
                                    endStudExam(examid,setShow, setMsg,reason,setShowEndExam);
                                }}>End Examination</button>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

async function endStudExam(examid,setShow, setMsg,reason,setShowEndExam)
{
    await API.put('/exam/' + examid,{'status': 'endExamProctor','reason':reason})
        .then(function (res) {
            if(res.data.status === 'success')
            {
                setShow(true);
                setMsg('Exam End Successfully...');
                setShowEndExam(false);
            }
            else
            {
                setShow(true);
                setMsg('Problem Ending Examination...');
            }
        })
        .catch(function (error) {
            setShow(true);
            setMsg('Problem Ending Examination...');
        })
}

export default EndExamModal;