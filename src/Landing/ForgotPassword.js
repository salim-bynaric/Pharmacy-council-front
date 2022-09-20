import React, { useState, useContext } from 'react';
import { ShowContext, UserContext } from '../App';
import API from '../api';

const ForgotPassword = ({ Popup, forgotPassword, setForgotPassword, handleClose, type,size }) => {
    const { setShow, setMsg } = useContext(ShowContext);
    const { setCurrentUser } = useContext(UserContext);
    const [username, setUsername] = useState();

    return (
        <>
            <Popup show={forgotPassword} handleClose={handleClose} size={size}>
                <br />
                <center>
                    <form>
                        <div className="form-group">
                            <div className='col-lg-12'>
                                <input
                                    name="username"
                                    type="text"
                                    autoComplete="off"
                                    className="form-control"
                                    placeholder='Please Enter your Username'
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    maxLength={20}
                                />
                            </div>
                        </div>
                    </form>
                    <div className="container-login100-form-btn p-t-25">
                        <button className="login100-form-btn" onClick={() => {
                            sendPasswordToEmail(username, setShow, setMsg,handleClose,setUsername);
                        }}> Send Password to Email </button>
                    </div>
                </center>
            </Popup>
        </>
    );
};

async function sendPasswordToEmail(username, setShow, setMsg, handleClose,setUsername) {
    await API.post('/password/sendEmail', { "username": username })
        .then(res => {
            if (res.data.status === 'success') {
                setUsername(undefined);
                setShow(true);
                setMsg(res.data.message);
                handleClose();
            }
        })
        .catch(function (error) {
            setShow(true);
            setMsg('Problem Sending Email...');
        });
}

export default ForgotPassword;