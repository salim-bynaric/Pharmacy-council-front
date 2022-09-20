import React, {useState,useContext} from 'react';
import { useHistory } from 'react-router-dom';
import API from '../../api';
import {ShowContext} from '../../App';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const PaperCheckingSummary = ({index,questions,marks,exam, checkerType}) => {
    const {setShow,setMsg}      =   useContext(ShowContext);
    let history                 =   useHistory();
    let objectiveScore          =   0;
    let subjectiveScore         =   0;
    const [visible,setVisible]  = useState(false);
    const handleClose           = () => setVisible(false);

    if(checkerType === 'QPC')
    {
        for(let i=0;i<questions.length;i++)
        {
            subjectiveScore = subjectiveScore + (questions[i].obtmarks !== null ? questions[i].obtmarks : 0);
        }
    }
    else if(checkerType === 'QPM')
    {
        for(let i=0;i<questions.length;i++)
        {
            subjectiveScore = subjectiveScore + (questions[i].obtmarks1 !== null ? questions[i].obtmarks1 : 0);
        }
    }

    objectiveScore = exam.marksobt !== null ? exam.marksobt : 0 ;

    return (
        <div className="col-lg-12">
            <div className='card' style={{ marginTop: "5px" ,marginBottom:"5px"}}>
                <div className={"card-header bg-primary"} style={{color:"white"}}>
                    <b><center>Paper Checking Summary</center></b>
                </div>
                <div className="card-body" style={{overflow: "auto","fontSize":"10px"}}>
                    <div className="alert alert-dark">
                        <b>Total Objective Score : {objectiveScore}</b>
                    </div>
                    <div className="alert alert-dark">
                        <b>Total Subjective Score : {subjectiveScore}</b>
                    </div>
                    <div className="alert alert-success">
                        <b>Total Score : {subjectiveScore + objectiveScore}</b> 
                    </div>
                    <center>
                        <button className="btn btn-sm btn-primary" onClick={() => {
                            setVisible(true);
                        }}>Finish Exam Checking</button>
                    </center>
                </div>
            </div>

            <Modal show={visible} onHide={handleClose} backdrop="static">
                <Modal.Header closeButton style={{ backgroundColor: "OliveDrab", color: "white" }}>
                    <Modal.Title>Finish Paper Checking Confirmation !</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="col-lg-12">
                        <div className="alert alert-dark">
                            <b>Total Objective Score : {objectiveScore}</b>
                        </div>
                        <hr/>
                        <div className="alert alert-dark">
                            <b>Total Subjective Score : {subjectiveScore}</b>
                        </div>
                        <hr/>
                        <div className="alert alert-success">
                            <b>Total Score : {subjectiveScore + objectiveScore}</b> 
                        </div>
                    </div>
                    <hr/>
                    <div className="col-lg-12">
                        <h6>Do you really want to finish the Exam Checking ?</h6>
                    </div>
                    <hr />
                    <div className="col-lg-12">
                        <Button variant="warning" onClick={async ()=>{
                            await finishChecking(exam,history,subjectiveScore,objectiveScore,setShow,setMsg,marks,checkerType);
                            setVisible(false);
                        }} style={{ float: "right", "marginRight":"10px" }}>Yes</Button>
                        <Button variant="danger" onClick={handleClose} style={{ float: "right", "marginRight":"10px" }}>Close</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

async function finishChecking(exam,history,subjectiveScore,objectiveScore,setShow,setMsg,marks,checkerType)
{
    let find = marks.find(element => element === "NA");
    if(find !== undefined)
    {
        setShow(true);
        setMsg('Some Questions are not yet checked by Checker. Please check all questions then Click on Finish Exam Checking...');
        return false;
    }


    let ExamId      = exam.id;
    let totalScore  = (subjectiveScore+objectiveScore);
    await API.put('/checker/student/exams/finishExamChecking/'+ExamId,{'score':totalScore,'checkerType':checkerType})
    .then(res =>
    {
        if(res.data.status === 'success')
        {
            history.replace('checkPaper',{paperId:exam.paper.id});
        }
    })
    .catch(error =>
    {
        setShow(true);
        setMsg('Problem Finishing Exam Checking...');
    });
}

export default PaperCheckingSummary;