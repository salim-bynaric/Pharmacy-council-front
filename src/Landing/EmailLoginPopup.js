import React from 'react';

const EmailLoginPopup = ({ Popup, startEmail, handleClose2, myEmail, setMyEmail, myPassword, setMyPassword, getOTPMail, setShow, setMsg, setCurrentUser, history, browser, setUserExist, setOtpSent, forgotPassword, setForgotPassword, handleClose,type,setType }) => {
    return (
        <>
            <Popup show={startEmail} handleClose={handleClose2}>
                <br />
                <center>
                    <form>
                        <div className="form-group">
                            <div className='col-lg-12'>
                                <input
                                    name="myEmail"
                                    type="text"
                                    autoComplete="off"
                                    className="form-control"
                                    placeholder='Email'
                                    value={myEmail}
                                    onChange={e => setMyEmail(e.target.value)}
                                    maxLength={100}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <div className='col-lg-12'>
                                <input
                                    name="myPassword"
                                    type="password"
                                    autoComplete="off"
                                    className="form-control"
                                    placeholder='Password'
                                    value={myPassword}
                                    onChange={e => setMyPassword(e.target.value)}
                                />
                            </div>
                        </div>
                    </form>
                    <div className="form-group">
                        <button className="login100-form-btn" onClick={() => {
                            getOTPMail(myEmail, myPassword, setShow, setMsg, setCurrentUser, history, browser, setUserExist, setOtpSent);
                        }}> Submit </button>
                    </div>
                    <div style={{ "float": "right" }}>
                        <button className="btn btn-link" onClick={() => {
                            setType(undefined);
                            setType('email');
                            setForgotPassword(true);
                        }} style={{ "fontSize": "11px" }}>Forgot Password</button>
                    </div>
                </center>
            </Popup>
        </>
    );
};

export default EmailLoginPopup;