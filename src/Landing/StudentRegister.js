import React, { useState, useContext } from 'react';
import { ShowContext, UserContext } from '../App';
import API from '../api';
import OTPComponent from './OTPComponent';
import { useHistory } from 'react-router-dom';
import { en, de } from '../utils/Helper';
import ProfilePopup from './ProfilePopup';
import EmailLoginPopup from './EmailLoginPopup';
import ForgotPassword from './ForgotPassword';


const StudentRegister = ({ Popup, studentRegister, setStudentRegister, handleClose3, forgotPassword, setForgotPassword }) => {
    let history = useHistory();
    const { setCurrentUser } = useContext(UserContext);
    const { setShow, setMsg } = useContext(ShowContext);
    const [registrationNo, setRegistrationNo] = useState('');
    const [showProfilePopup, setShowProfilePopup] = useState(false);
    const handleClose = () => setShowProfilePopup(false);
    const [registrationDetails, setRegistrationDetails] = useState();
    const [isRegistered, setIsRegistered] = useState(false);
    const handleClose1 = () => setIsRegistered(false);
    const [pass, setPass] = useState('');
    const { detect } = require('detect-browser');
    const browser = detect();
    let name = process.env.REACT_APP_CLIENT_TEXT;

    return (
        <>
            <Popup show={studentRegister} handleClose={handleClose3}>
                <div className="wrap-input100 validate-input m-b-16" data-validate="Phone is required">
                    <input className="input100" type="registrationNo" name="registrationNo" placeholder="Registration Number..." value={registrationNo} maxLength={20} onChange={(e) => { setRegistrationNo(e.target.value) }} /></div>
                <div className="container-login100-form-btn p-t-25">
                    <button className="login100-form-btn" onClick={async () => {
                        checkRegistered();
                    }}> Continue </button>
                </div>
            </Popup>

            {
                registrationDetails !== undefined && registrationDetails !== null ?
                    <ProfilePopup show={showProfilePopup} handleClose={handleClose} details={registrationDetails} registrationNo={registrationNo} />
                    : null
            }

            <Popup show={isRegistered} handleClose={handleClose1} >
                <div className="wrap-input100 validate-input m-b-16" data-validate="Password is Required">
                    <input className="input100" type="password" name="password" placeholder="Enter Password..." value={pass} maxLength={20} onChange={(e) => { setPass(e.target.value) }} />
                </div>
                <div className="container-login100-form-btn p-t-25">
                    <button className="login100-form-btn" onClick={async () => {
                        checkLogin(registrationNo, pass, '1000', '0', setShow, setMsg, history, setCurrentUser, browser)
                    }}> Continue </button>
                </div>
            </Popup>
        </>
    );

    async function checkRegistered() {
        await API.get('checkRegistered', { params: { "registrationNo": registrationNo } })
            .then(res => {
                if (res.data.status === 'failure') {
                    setIsRegistered(false);
                    getRegistraionDetails(registrationNo, setShow, setMsg, setShowProfilePopup, setRegistrationDetails);
                }
                else {
                    setIsRegistered(true);
                }
            })
            .catch(function (error) {
                return 0;
            });
    }

};

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
                else {
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



async function getRegistraionDetails(registrationNo, setShow, setMsg, setShowProfilePopup, setRegistrationDetails) {
    await API.get('registrationDetails', { "registrationNo": registrationNo })
        .then(res => {
            if (res.data.status === 'success') {
                setRegistrationDetails(res.data.data);
                setShowProfilePopup(true);
            }
        })
        .catch(function (error) {
            setShow(true);
            setMsg(error.toString());
        });
}

export default StudentRegister;