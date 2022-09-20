import React from 'react';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import API from './api';
import { Markup } from 'interweave';

function WarningsModal(props) {
    const handleClose = () => props.setPopupShow(false);

    const warningId = props.warningId;
    const examId = props.examId;
    const warningHeader = props.warningHeader;

    let popupMsg = props.popupMsg;

    return (
        (props.popupShow && props.popupMsg !== undefined && props.popupMsg !== undefined && props.popupMsg !== null && warningId !== undefined && props.popupMsg.length > 0) ?
            <Modal show={props.setPopupShow} onHide={handleClose} backdrop="static" size="lg" keyboard={false}>
                <Modal.Header style={{ backgroundColor: "red", color: "white" }}>
                    <Modal.Title>{warningHeader}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="col-lg-12">
                        <h6>
                            {
                                popupMsg.map((value, index) => {
                                    if (index === 0 || index === '0') {
                                        return <div className="alert alert-danger" key={index} style={{ margin: "5px", color: "blue" }}>
                                            <Markup content={value} />
                                        </div>
                                    }
                                    else {
                                        return <div className="alert alert-danger" key={index} style={{ margin: "5px", color: "red" }}>
                                            <Markup content={value} />
                                        </div>
                                    }
                                })
                            }
                        </h6>
                    </div>
                    <hr />
                    <div className="col-lg-12">
                        {
                            warningId !== 'disconnection' ?
                                <Button variant="danger" onClick={(e) => {
                                    noted(examId);
                                    handleClose(e);
                                }} style={{ float: "right" }}>Okay Noted</Button>
                                :
                                <Button variant="warning" onClick={(e) => {
                                    handleClose(e);
                                }} style={{ float: "right" }}>Close</Button>
                        }
                    </div>
                </Modal.Body>
            </Modal>
            : null
    );
}

async function noted(examId) {
    await API.put('/proctor/notedWarning/' + examId)
        .then((res) => {
            if (res.data.status === 'success') {

            }
            else {

            }
        })
        .catch(function (error) {

        });
}

export default WarningsModal;
