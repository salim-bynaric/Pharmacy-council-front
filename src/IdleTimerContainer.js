import React, { useRef, useContext, useState } from 'react';
import IdleTimer from 'react-idle-timer';
import { UserContext } from './App';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import API from './api';
import { useHistory, useLocation } from 'react-router-dom';

const IdleTimerContainer = () => {
    const idleTimerRef = useRef(null);
    const { currentUser, setCurrentUser } = useContext(UserContext);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    let history = useHistory();
    let location = useLocation();
    const idleDuration = process.env.REACT_APP_IDLE_DURATION;


    async function onIdle() 
    {
        if(currentUser)
        {
            setShow(true);
            let str = '/';
            const res = await API.post('/logout');
            localStorage.removeItem("token");
            if (res.data.status === 'Success') 
            {
                history.push(str);
                setCurrentUser(undefined);
            }
        }
    }

    return (
        <>
            <div>
                {currentUser && location.pathname !== 'clearsessionScript' ?
                    <IdleTimer ref={idleTimerRef} timeout={idleDuration * 60 * 1000} onIdle={onIdle}>

                    </IdleTimer>
                : null}
            </div>
            <Modal show={show} onHide={handleClose} backdrop="static" size="lg">
                <Modal.Header closeButton style={{ backgroundColor: "OliveDrab", color: "white" }}>
                    <Modal.Title>Important Message</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="col-lg-12">
                        <h6>You are Idle for more than {idleDuration} Minutes. Loggining you out of your account.</h6>
                    </div>
                    <hr />
                    <div className="col-lg-12">
                        <Button variant="danger" onClick={handleClose} style={{ float: "right" }}>Close</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default IdleTimerContainer;