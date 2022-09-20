import React ,{useContext} from 'react';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import PdfViewer from './Student/PdfViewer';

function MyPdfModal({setPopupShow,popupShow,path,heading}) 
{
    const handleClose                               =   () => setPopupShow(false);
    
    return (
        (popupShow) ?
            <Modal show={popupShow} onHide={() => {handleClose()}} backdrop="static" size="lg">
                <Modal.Header closeButton style={{ backgroundColor: "OliveDrab", color: "white" }}>
                    <Modal.Title>View your Document</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="col-lg-12">
                        <PdfViewer path={path} answerFile={heading}/>
                    </div>
                    <hr />
                    <div className="col-lg-12">
                        <Button variant="danger" onClick={() => {handleClose();}} style={{ float: "right" }}>Close</Button>
                    </div>
                </Modal.Body>
            </Modal>
        : null
    );
}
export default MyPdfModal;
