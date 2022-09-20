import React from 'react';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const DeleteConfirmationPopUp = ({visible,setVisible,popupMsg,deleteRecord,id,setInserted,inserted,setShow,setMsg,setCurPage}) => 
{
    const handleClose = () => setVisible(false);
    return (
        <div>
            <Modal show={visible} onHide={handleClose} backdrop="static">
                <Modal.Header closeButton style={{ backgroundColor: "OliveDrab", color: "white" }}>
                    <Modal.Title>Delete Confirmation !</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="col-lg-12">
                        <h6>{popupMsg}</h6>
                    </div>
                    <hr />
                    <div className="col-lg-12">
                        <Button variant="warning" onClick={async ()=>{
                            await deleteRecord(id,setInserted,inserted,setShow,setMsg,setCurPage);
                            setVisible(false);
                        }} style={{ float: "right", "marginRight":"10px" }}>Delete</Button>
                        <Button variant="danger" onClick={handleClose} style={{ float: "right", "marginRight":"10px" }}>Close</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default DeleteConfirmationPopUp;