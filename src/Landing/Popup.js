import React from 'react';
import Modal from "react-bootstrap/Modal";

const Popup = ({ show, handleClose, showHeader = true, children }) => {
    let name = process.env.REACT_APP_CLIENT_TEXT;
    return (
        <>
            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
                <Modal.Body>
                    <div className="popup-header">
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true" onClick={() => {
                            handleClose();
                        }}>x</button>

                        <div className="pop-img">
                            <img src="assets\images\Landing\logos.png" height="100" width="50"></img>
                        </div>
                        {
                            showHeader ?
                                <>
                                    <h6 className='text-center'> Get Started with <b>{name}</b></h6>
                                    <p className='text-center'>Refresh your Skills with us</p>
                                </>
                                : null
                        }
                    </div>
                    {children}
                    <br />
                </Modal.Body>
            </Modal>
        </>
    );
};

export default Popup;