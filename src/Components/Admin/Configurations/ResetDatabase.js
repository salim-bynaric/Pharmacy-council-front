import React, { useState, useEffect, useContext } from 'react';
import Button from "react-bootstrap/Button";
import { ShowContext, UserContext } from '../../../App';
import API from '../../../api';
import Modal from "react-bootstrap/Modal";

const ResetDatabase = () => {
    const [pass, setPass] = useState();
    const { setShow, setMsg } = useContext(ShowContext);
    const { currentUser } = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const [show1,setShow1] = useState(false);
    const handleClose  =   () => setShow1(false);

    return (

        <>
            <div>
                <div className="container-fluid">
                    <br/>
                    <ol className="breadcrumb mb-4">
                        <li className="breadcrumb-item active">Reset Database</li>
                    </ol>
                    <div className="col-lg-12 animate__animated animate__fadeInDown animate_slower">
                        <div className="card mb-4">
                            <div className="card-header">
                                <i className="fas fa-address-card mr-1" />
                                Enter Details
                            </div>
                            <div className="card-body">
                                <div className="col-lg-12">
                                    <div className="form-group">
                                        <div className="col-lg-12 row">
                                            <div className="col-lg-4">
                                                Enter Password
                                            </div>
                                            <div className="col-lg-8">
                                                <input type="password" id="pass" name="pass" value={pass} onChange={(e) => { setPass(e.target.value) }} className="form-control" placeholder="Enter Your Password..." />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <hr />
                                <div className="col-lg-12">
                                    <Button variant="warning" onClick={() => { setShow1(true); }} style={{ float: "right" }}>Submit</Button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            {loading ?
                <div className="custom-loader"></div>
                : null}

            <Modal show={show1} onHide={() => { handleClose();}}>
                <Modal.Header closeButton style={{ backgroundColor: "OliveDrab", color: "white" }}>
                    <Modal.Title>Reset Database Confirmation !!!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="col-lg-12">
                        Do you really want to reset Database ?
                    </div>
                    <hr />
                    <div className="col-lg-12">
                        <Button variant="warning " onClick={() => { validatePassword(pass, currentUser, setShow, setMsg, setLoading); handleClose();}}>Yes</Button>&nbsp;&nbsp;&nbsp;
                        <Button variant="danger" onClick={() => { handleClose();}}>Close</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

async function validatePassword(pass, currentUser, setShow, setMsg, setLoading) {
    if (pass === undefined || pass === null) {
        setShow(true);
        setMsg('Please Enter Valid Password...');
        return false;
    }
    setLoading(true);
    await API.get('authenticate', { params: { uid: currentUser.uid, pass: pass, username: currentUser.username } })
        .then(async function (res) {
            if (res.data.status === 'success') {
                await resetDatabase(setShow, setMsg, setLoading);
            }
            else {
                setLoading(false);
                setShow(true);
                setMsg('Invalid Password Entered...');
            }
        })
        .catch(function (error) {
            setLoading(false);
            setShow(true);
            setMsg('Invalid Password Entered...');
        });
}

async function resetDatabase(setShow, setMsg, setLoading) {
    await API.get('resetDatabase')
        .then(async function (res) {
            if (res.data.status === 'success') {
                setLoading(false);
                setShow(true);
                setMsg('Database Reset Successfully...');
            }
            else {
                setLoading(false);
                setShow(true);
                setMsg('Problem Resetting Database...');
            }
        })
        .catch(function (error) {
            setLoading(false);
            setShow(true);
            setMsg('Problem Resetting Database...');
        });
}

export default ResetDatabase;