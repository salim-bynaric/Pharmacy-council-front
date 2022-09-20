import React from 'react';
import StudentProctorLog from '../Institute/Reports/StudentProctorLog';
import Modal from "react-bootstrap/Modal";

const ReportModal = ({ show, handleClose, log, loadReport }) => {
    return (
        <div>
            <Modal show={show} onHide={handleClose} size="lg">
                <Modal.Header closeButton style={{ backgroundColor: "OliveDrab", color: "white", zIndex: "99999" }}>
                    <Modal.Title><center>User Snapshot Report</center></Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ minHeight: "300px" }}>
                    {
                        !loadReport ?
                            log ?
                                <StudentProctorLog log={log} />
                                : null
                            : <div className="custom-loader"></div>
                    }
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ReportModal;