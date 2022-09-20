import React from 'react';
import API from '../api';
import { en, de } from '../utils/Helper';

const OTPComponent = ({otpSend,handleClose,userExist,mobile,setOtp1,setOtp2,setOtp3,setOtp4,inputfocus,setShow,setMsg,setOtpValidated, setOtpSent, history, setCurrentUser, browser,Popup,otp1,otp2,otp3,otp4,type,myEmail,myPassword}) => {
    return (
        <>
            <Popup show={otpSend} handleClose={handleClose}>
                <br />
                <center>
                    <h5>Enter {userExist ? 'Password' : 'OTP'}</h5>
                    {
                        !userExist ?
                            'Please enter the OTP sent to ' + mobile
                            :
                            'Your Registration OTP is your Password.'
                    }
                    <br /><br />
                    <form>
                        <input
                            name="otp1"
                            type="text"
                            autoComplete="off"
                            className="otpInput"
                            value={otp1}
                            onChange={e => setOtp1(e.target.value)}
                            tabIndex="1" maxLength="1"
                            onKeyUp={e => inputfocus(e)}
                        />
                        <input
                            name="otp2"
                            type="text"
                            autoComplete="off"
                            className="otpInput"
                            value={otp2}
                            onChange={e => setOtp2(e.target.value)}
                            tabIndex="2" maxLength="1"
                            onKeyUp={e => inputfocus(e)}
                        />
                        <input
                            name="otp3"
                            type="text"
                            autoComplete="off"
                            className="otpInput"
                            value={otp3}
                            onChange={e => setOtp3(e.target.value)}
                            tabIndex="3" maxLength="1"
                            onKeyUp={e => inputfocus(e)}
                        />
                        <input
                            name="otp4"
                            type="text"
                            autoComplete="off"
                            className="otpInput"
                            value={otp4}
                            onChange={e => setOtp4(e.target.value)}
                            tabIndex="4" maxLength="1"
                            onKeyUp={e => inputfocus(e)}
                        />
                        <br /><br />
                    </form>
                    <div className="container-login100-form-btn p-t-25">
                        <button className="login100-form-btn" onClick={() => {
                            validateOTP(otp1 + '' + otp2 + '' + otp3 + '' + otp4, mobile, setShow, setMsg, setOtpValidated, setOtpSent, history, setCurrentUser, browser, userExist,type,myEmail,myPassword)
                        }}> Submit {userExist ? 'Password' : 'OTP'} </button>
                    </div>

                </center>
            </Popup>
        </>
    );
};

async function validateOTP(otp, mobile, setShow, setMsg, setOtpValidated, setOtpSent, history, setCurrentUser, browser, userExist, type, myEmail, myPassword) {
    await API.post('/OTP/verify', { "otp": otp, "mobile": mobile, "password": myPassword, "type": type })
        .then(res => {
            if (res.data.status === 'success') {
                setOtpSent(false);
                if (res.data.isRegistered == 0) {
                    setOtpValidated(true);
                }
                else {
                    if (type == 'mobile') {
                        checkLogin(mobile, otp, '1000', '0', setShow, setMsg, history, setCurrentUser, browser);
                    }
                }
            }
        })
        .catch(function (error) {
            setShow(true);
            if (userExist) {
                setMsg('Please Enter Valid Password...');
            }
            else {
                setMsg('Please Enter Valid OTP...');
            }
            setOtpSent(true);
            setOtpValidated(false);
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



export default OTPComponent;