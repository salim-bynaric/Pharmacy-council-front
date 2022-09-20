import React, { useState, useContext } from 'react';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { UserContext, ShowContext } from '../../App';
import API from '../../api';

function PasswordModal(props) {
    const [pas, setPas] = useState();
    const handleClose = () => {props.setPopupShow(false);setPas('')}
    const { setShow, setMsg } = useContext(ShowContext);
    const { currentUser } = useContext(UserContext);
    const [loading, setLoading] = useState(false);

    return (
        currentUser ?
            <Modal show={props.popupShow} onHide={() => { handleClose();setPas('');}} backdrop="static" size="lg">
                <Modal.Header closeButton style={{ backgroundColor: "OliveDrab", color: "white" }}>
                    <Modal.Title>Enter Password to Validate !!!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="col-lg-12">
                        <div className="form-group">
                            <div className="col-lg-12 row">
                                <div className="col-lg-4">
                                    Enter Password
                                </div>
                                <div className="col-lg-8">
                                    <input type="password" id="pas" name="pas" onChange={(e) => {
                                        setPas(e.target.value);
                                    }} value={pas} className="form-control" placeholder="Enter Password..." />
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div className="col-lg-12">
                        <div className="col-lg-4" style={{ "float": "right" }}>
                            <Button variant="warning" onClick={() => { validatePassword(currentUser, pas, setShow, setMsg,setLoading,props.setValidated,props.setPopupShow,setPas); }}>Submit</Button>&nbsp;&nbsp;&nbsp;
                            <Button variant="danger" onClick={() => { handleClose(); setPas('')}} >Close</Button>
                        </div>
                    </div>
                    {loading ?
                        <div className="custom-loader"></div>
                    : null}
                </Modal.Body>
            </Modal>
            : null
    );
}

async function validatePassword(currentUser, pass, setShow, setMsg, setLoading,setValidated,setPopupShow,setPas) {
    if (pass === undefined || pass === null) {
        setShow(true);
        setMsg('Please Enter Valid Password...');
        setValidated(false);
        return false;
    }
    setLoading(true);
    await API.get('authenticate', { params: { uid: currentUser.uid, pass: pass, username: currentUser.username } })
        .then(async function (res) {
            if (res.data.status === 'success') {
                setLoading(false)
                setValidated(true);
                setPopupShow(false);
                setPas('');
            }
            else {
                setLoading(false);
                setShow(true);
                setMsg('Invalid Password Entered...');
                setValidated(false);
            }
        })
        .catch(function (error) {
            setLoading(false);
            setShow(true);
            setMsg('Invalid Password Entered...');
            setValidated(false);
        });
}

export default PasswordModal;
