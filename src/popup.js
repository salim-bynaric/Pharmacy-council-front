import React ,{useContext} from 'react';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { MaskContext,BrowserContext } from './App';
import {MaskSwitchContext} from './App';

function Popup(props) {
    const handleClose                               =   () => props.setPopupShow(false);
    const { setMask }                               =   useContext(MaskContext);
    const {setMaskSwitchContext}                    =   useContext(MaskSwitchContext);
    const {cameraReff}                              =   useContext(BrowserContext);

    return (
        (props.popupShow && props.popupMsg !== undefined) ?
            <Modal show={props.popupShow} onHide={() => {handleClose();setMask(false);}} backdrop="static" keyboard={false}>
                <Modal.Header closeButton style={{ backgroundColor: "red", color: "white" }}>
                    <Modal.Title>Warning/Alert</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="col-lg-12">
                        <h6>{props.popupMsg}</h6>
                    </div>
                    <hr />
                    <div className="col-lg-12">
                        <Button variant="danger" onClick={() => {handleClose();setMask(false);setMaskSwitchContext(false);restartCamera(cameraReff);}} style={{ float: "right" }}>Close</Button>
                    </div>
                </Modal.Body>
            </Modal>
            : null
    );
}

function restartCamera(cameraReff)
{
    if(cameraReff !== undefined && cameraReff.current !== undefined && cameraReff.current !== null)
    {
        cameraReff.current.start();
    }
}

export default Popup;
