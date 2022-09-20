import React from 'react';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import OverallSummery from "./OverallSummery";
import { useHistory } from 'react-router-dom';

const EndExamModal = (props) => {
    let history                             = useHistory();
    
    return (
      props ?
            <>
            <Modal show={props.show} onHide={props.handleClose}>
                <Modal.Header style={{backgroundColor:"blue",color:"white",zIndex:"99999"}}>
                    <Modal.Title><center>Online Exam Summary</center></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {
                    props.data.location.state.exam.paper.singleFileUpload != '1' ?
                      <OverallSummery data={props.data}/>
                    :null
                  }
                    <center>
                      <h5>Are you sure to End the Exam?</h5>
                      <Button variant="success" onClick={() => {
                        props.setShow1(false);
                      }}>Go Back to Exam</Button> &nbsp;&nbsp;
                      <Button variant="danger" onClick={async () => {
                         await props.setShowEnd(true);
                         props.setShow1(false);
                      }}>End Exam</Button>
                      
                    </center>
                </Modal.Body>
            </Modal>


            <Modal show={props.showEnd} onHide={props.handleClose}>
                <Modal.Header style={{backgroundColor:"blue",color:"white"}}>
                    <Modal.Title><center>Confirm End Exam</center></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <center>
                      <h5><font color="red">Do you really want to end Exam?</font></h5>
                      <button className="btn btn-danger" onClick={async () => {
                        if(props.camRefOuter.current !== undefined)
                        {
                          props.camRefOuter.current.stopCam();
                        }
                        props.handleEndExam(props,history);
                      }}>Yes</button> &nbsp;&nbsp;
                      <button className="btn btn-success" onClick={() => {
                        props.setShowEnd(false);
                      }}>No</button>
                    </center>
                </Modal.Body>
            </Modal>
            </>
      :null
    )
};

export default EndExamModal;