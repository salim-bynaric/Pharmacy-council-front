import React, {useState} from 'react';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Markup } from 'interweave';

const UploadWarningModal = ({errorMsg,header,setErrorMsg,setPopupShow,popupShow}) => 
{
    const handleClose = () => {setPopupShow(false);setErrorMsg(undefined);}
    return (
            <Modal show={popupShow} onHide={handleClose} backdrop="static" size="lg" keyboard={false}>
                <Modal.Header style={{ backgroundColor: "red", color: "white" }}>
                    <Modal.Title>{header}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="col-lg-12">
                        <div className="alert alert-dark">
                            <Markup content={errorMsg} />
                        </div>
                    </div>
                    <hr />
                    <div className="col-lg-12">
                        <Button variant="warning" onClick={(e) => {
                                    handleClose(e);
                        }} style={{ float: "right" }}>Close</Button>
                    </div>
                </Modal.Body>
            </Modal>
    );
};

export default UploadWarningModal;