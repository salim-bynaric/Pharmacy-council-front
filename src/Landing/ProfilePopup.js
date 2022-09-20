import React, { useState, useContext, useEffect } from 'react';
import Popup from './Popup';
import { UserContext, ShowContext } from '../App';
import API from '../api';
import { useHistory } from 'react-router-dom';
import { en, de } from '../utils/Helper';


const ProfilePopup = ({ show, handleClose, details, registrationNo }) => {
    let history = useHistory();
    const { setCurrentUser } = useContext(UserContext);
    const { setShow, setMsg } = useContext(ShowContext);
    const [name, setName] = useState(details ? details.name : '');
    const [mobile, setMobile] = useState(details ? details.mobile :'');
    const [email, setEmail] = useState(details ? details.email :'');
    const [mobileOtpSent, setMobileOtpSend] = useState(false);
    const [emailOtpSent, setEmailOtpSend] = useState(false);

    const [mobileOTP, setMobileOTP] = useState('');
    const [emailOTP, setEmailOTP] = useState('');
    const [otpVerified,setOtpVerified] = useState(false);
    const { detect } = require('detect-browser');
    const browser = detect();

    useEffect(() => {
        if(otpVerified)
        {
            registerUser(registrationNo,name,mobile,email,emailOTP,setShow,setMsg,history,browser,setCurrentUser);
        }
    },[otpVerified]);

    return (
        <>
            <Popup show={show} handleClose={handleClose} showHeader={false}>
                <br />
                <center>
                    <h5>Complete Your Profile</h5>
                    Enter your details to complete your profile<br /><br />
                    <form>
                        <div className="form-group">
                            <div className='col-lg-12'>
                                <input
                                    name="name"
                                    id="name"
                                    type="text"
                                    autoComplete="off"
                                    className="form-control"
                                    placeholder='Name *'
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    disabled={true}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <div className='col-lg-12'>
                                <input
                                    name="mobile"
                                    id="mobile"
                                    type="text"
                                    autoComplete="off"
                                    className="form-control"
                                    placeholder='Mobile *'
                                    value={mobile}
                                    onChange={e => setMobile(e.target.value)}
                                    disabled={true}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <div className='col-lg-12'>
                                <input
                                    name="email"
                                    id="email"
                                    type="text"
                                    autoComplete="off"
                                    className="form-control"
                                    placeholder='Email *'
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    maxLength={100}
                                    disabled={true}
                                />
                            </div>
                        </div>
                    </form>
                    <div className="form-group">
                        <button className="login100-form-btn" onClick={async () => {
                            await sendOTP(mobile, setShow, setMsg, setMobileOtpSend);
                            await sendOTPEmail(email, setShow, setMsg, setEmailOtpSend);
                        }} disabled={mobileOtpSent && emailOtpSent}> Send OTP on Email and Mobile</button>
                    </div>
                    {
                        mobileOtpSent && emailOtpSent ?
                        <>
                            <div className="form-group">
                                <div className='col-lg-12'>
                                    <input
                                        name="mobileOTP"
                                        id="mobileOTP"
                                        type="text"
                                        autoComplete="off"
                                        className="form-control"
                                        placeholder='Enter OTP Sent on Your Mobile Number'
                                        value={mobileOTP}
                                        onChange={e => setMobileOTP(e.target.value)}
                                        maxLength={4}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <div className='col-lg-12'>
                                    <input
                                        name="emailOTP"
                                        id="emailOTP"
                                        type="text"
                                        autoComplete="off"
                                        className="form-control"
                                        placeholder='Enter OTP Sent on Your Email Address'
                                        value={emailOTP}
                                        onChange={e => setEmailOTP(e.target.value)}
                                        maxLength={4}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <button className="login100-form-btn" onClick={async () => {
                                    verifyMobileEmailOTP(mobile,mobileOTP,email,emailOTP,setShow,setMsg,setOtpVerified);
                                }}> Verify Mobile and Email OTP</button>
                            </div>
                        </>
                        :null
                    }
                </center>
            </Popup>
        </>
    );
};

async function registerUser(registrationNo,name,mobile,email,emailOTP,setShow,setMsg,history,browser,setCurrentUser)
{
    await API.post('register', { "reg_type": 'STUDENT', "name": name, "inst_name": '1000', "mobile": mobile, "email": email, "password": emailOTP,"regno":registrationNo })
        .then(res => {
            if (res.data.status === 'success') {
                checkLogin(registrationNo, emailOTP, '1000', '0', setShow, setMsg, history, setCurrentUser, browser);
            }
            else {
                setShow(true);
                setMsg(res.data.message);
            }
        })
        .catch(function (error) {

        });
}

async function verifyMobileEmailOTP(mobile,mobileOTP,email,emailOTP,setShow,setMsg,setOtpVerified) 
{
    await API.post('/OTP/verify/mobile/email', { "mobile":mobile,"mobileOTP": mobileOTP,"email":email,"emailOTP":emailOTP })
        .then(res => {
            if (res.data.status === 'success') {
                setOtpVerified(true);
            }
        })
        .catch(function (error) {
            setShow(true);
            setMsg(error.response.data.message);
            setOtpVerified(false);
        });
}

async function sendOTP(mobile, setShow, setMsg, setOtpSent) {
    if (mobile.trim() === '' || mobile === '' || mobile === undefined) {
        setShow(true);
        setMsg('Please Enter Mobile Number for sending OTP.');
        return false;
    }

    await API.post('/OTP/send', { "mobile": mobile })
        .then(res => {
            if (res.data.status === 'success') {
                setOtpSent(true);
            }
        })
        .catch(function (error) {
            setShow(true);
            setMsg(error.response.data.message);
            setOtpSent(false);
        });
}

async function sendOTPEmail(email, setShow, setMsg, setOtpSent) {
    if (email.trim() === '' || email === '' || email === undefined) {
        setShow(true);
        setMsg('Please Enter Email Address for sending OTP.');
        return false;
    }

    await API.post('/OTP/sendEmail', { "email": email })
        .then(res => {
            if (res.data.status === 'success') {
                if (res.data.count == 0) {
                    setOtpSent(true);
                }
            }
        })
        .catch(function (error) {
            setShow(true);
            setMsg(error.response.data.message);
            setOtpSent(false);
        });
}

async function checkLogin(username, password, instId, flag, setShow, setMsg, history, setCurrentUser, browser) {
    await API.post('/appLogin', { "username": en(username), "password": en(password), "inst_id": en(instId), "flag": en(flag), "myRecaptcha": en(''), "browser": en(browser.name), "os": en(browser.os), "version": en(browser.version) }).then(res => {
        if (res.data.status === 'success') {
            localStorage.setItem("token", JSON.stringify(res.data.token));
            let data = JSON.parse(de(res.data.data));
            if (data.role === 'STUDENT') {
                setCurrentUser(data);
                if (localStorage.getItem('myExamCart') !== undefined && localStorage.getItem('myExamCart') !== 'undefined' && localStorage.getItem('myExamCart') !== null) {
                    history.replace({ pathname: '/cart', state: { currentUser: data } });
                }
                else
                {
                    history.replace({ pathname: '/studenthome', state: { currentUser: data } });
                }
            }
            else if (data.role !== 'STUDENT') {
                setShow(true);
                setMsg('Only Students Can Login from this Page....');
            }
        }
        else {
            setShow(true);
            setMsg(res.data.message);
        }
    })
        .catch(function (error) {
            setShow(true);
            setMsg(error.response.data.message);
        });
}

export default ProfilePopup;