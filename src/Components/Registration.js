import React, { useState, createRef } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import API from '../api';
import ClientCaptcha from "react-client-captcha";
import { Link } from 'react-router-dom';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

window.recaptchaOptions = {
    useRecaptchaNet: true,
};

export default function Registration() {
    const [sentOTP, setSentOTP] = useState(false);
    const [resentOTP, setReSentOTP] = useState(false);
    const [sentOTPSuccess, setSentOTPSuccess] = useState(false);
    const [OTPValidated, setOTPValidated] = useState(false);
    const [OTPerror, setOTPError] = useState('');
    const [otp, setOTP] = useState('');
    const [myRecaptcha, setMyRecaptcha] = useState();
    const [myMsg, setMyMsg] = useState();
    const siteKey = process.env.REACT_APP_CAPTCHA_SITE_KEY;

    const handleClose = () => setSentOTP(false);
    const [btnLabel, setBtnLabel] = useState('Register');

    const onChange = (event) => {
        setOTP(event.target.value);
    };

    return (
        <Formik
            initialValues={{ regType: "", controllerName: "", orgName: "", email: "", mobile: "", password: "", captcha: "" }}
            onSubmit={async (values, actions) => {
                if (values.captcha !== undefined && values.captcha !== '' && values.captcha !== null) {
                    if (myRecaptcha === values.captcha) {
                        setBtnLabel('Please Wait');
                        await registerUser(values, setMyMsg);
                        actions.setSubmitting(false);
                        actions.resetForm({
                            values: {
                                regType: "", controllerName: "", orgName: "", email: "", mobile: "", password: "", captcha: ""
                            },
                        });
                        setBtnLabel('Register');
                    }
                    else {
                        setMyMsg('Invalid Captcha Entered...');
                    }
                }
                else {
                    setMyMsg('Please Use Recaptcha For Login...');
                    setBtnLabel('Register');
                }
            }}
            validationSchema={Yup.object().shape({
                regType: Yup.string()
                    .required("Registration Type is  Required"),
                controllerName: Yup.string()
                    .required("Controller Name is Required"),
                orgName: Yup.string()
                    .required("Organization Name is Required"),
                email: Yup.string()
                    .required("email is Required"),
                mobile: Yup.number()
                    .required("Mobile Number is Required"),
                password: Yup.string()
                    .required("Password is Required"),
            })}
        >
            {
                props => {
                    const {
                        values,
                        touched,
                        errors,
                        isSubmitting,
                        handleChange,
                        handleBlur,
                        handleSubmit
                    } = props;
                    return (

                        <div style={{ background: "#32ADB6", paddingTop: "60px", paddingBottom: `40px` }}>
                            <div className="container">
                                <div className="row justify-content-center">
                                    <div className="col-lg-8">
                                        <div className="card shadow-lg border-0 rounded-lg mt-10 animate__animated animate__backInDown animate__slow">
                                            <div className="card-header"><h3 className="text-center font-weight-light my-4"><b>Registration</b></h3></div>
                                            <div className="card-body" >
                                                <form onSubmit={handleSubmit}>
                                                    <div className='row'>
                                                        <div className="form-group col-lg-6">
                                                            <select id="regType" name="regType" className="form-control" onChange={handleChange} value={values.regType}>
                                                                <option value="">Registration Type</option>
                                                                <option value="INSTITUTE">Institute</option>
                                                                <option value="TUTOR">Tutor</option>
                                                                <option value="FACULTY">Individual Faculty</option>
                                                                <option value="COACHING">Coaching Classes</option>
                                                                <option value="STUDENT">Student</option>
                                                                <option value="GlobalController">GlobalController</option>
                                                                <option value="ClusterController">ClusterController</option>
                                                            </select>
                                                            {errors.regType && touched.regType && (
                                                                <div className="alert alert-info">{errors.regType}</div>
                                                            )}
                                                        </div>
                                                        <div className="form-group col-lg-6">
                                                            <input className="form-control py-4" id="controllerName" type="text"
                                                                name="controllerName"
                                                                value={values.controllerName}
                                                                placeholder="Name of Controller"
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                            />
                                                            {errors.controllerName && touched.controllerName && (
                                                                <div className="alert alert-info">{errors.controllerName}</div>
                                                            )}
                                                        </div>
                                                        <div className="form-group col-lg-6">
                                                            <input className="form-control py-4" id="orgName" type="text"
                                                                name="orgName"
                                                                value={values.orgName}
                                                                placeholder="Name of Organization"
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                            />
                                                            {errors.orgName && touched.orgName && (
                                                                <div className="alert alert-info">{errors.orgName}</div>
                                                            )}
                                                        </div>
                                                        <div className="form-group col-lg-6">
                                                            <input className="form-control py-4" id="email" type="text"
                                                                name="email"
                                                                value={values.email}
                                                                placeholder="Email"
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                            />
                                                            {errors.email && touched.email && (
                                                                <div className="alert alert-info">{errors.email}</div>
                                                            )}
                                                        </div>
                                                        <div className="form-group col-lg-6">
                                                            <input className="form-control py-4" id="mobile" type="text"
                                                                name="mobile"
                                                                value={values.mobile}
                                                                placeholder="Mobile Number"
                                                                onChange={handleChange}
                                                                onBlur={() => {
                                                                    OTPsend(values.mobile, setSentOTP, setSentOTPSuccess, setMyMsg, setOTPError, setOTP);
                                                                }}
                                                                maxlength="10"
                                                            />
                                                            {errors.mobile && touched.mobile && (
                                                                <div className="alert alert-info">{errors.mobile}</div>
                                                            )}
                                                        </div>
                                                        <div className="form-group col-lg-6">
                                                            <input className="form-control py-4" id="password" type="password"
                                                                name="password"
                                                                value={values.password}
                                                                placeholder="Password"
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                disabled={!OTPValidated}
                                                            />
                                                            {errors.password && touched.password && (
                                                                <div className="alert alert-info">{errors.password}</div>
                                                            )}
                                                        </div>

                                                        <div className="form-group col-lg-4">
                                                            <ClientCaptcha captchaCode={code => setMyRecaptcha(code)} chars="abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ123456789" fontColor="blue" backgroundColor="pink" fontSize={24} />
                                                        </div>
                                                        
                                                        <div className="form-group col-lg-8">
                                                            <input className="form-control" id="captcha" name="captcha"
                                                                type="text"
                                                                value={values.captcha}
                                                                placeholder="Captcha Code"
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                            />

                                                            {errors.captcha && touched.captcha && (
                                                                <div className="alert alert-warning">{errors.captcha}</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="form-group d-flex align-items-center justify-content-between mt-4 mb-0">
                                                        <button className="btn btn-primary" type="submit" id="submit" disabled={isSubmitting}>{btnLabel}</button>
                                                    </div><br />

                                                    {myMsg !== undefined && (
                                                        <div className="alert alert-success animate__animated animate__bounceIn animate_slow">{myMsg}</div>
                                                    )}

                                                    {OTPValidated && (
                                                        <div className="alert alert-success animate__animated animate__bounceIn animate_slow">OTP Validated Successfully...</div>
                                                    )}

                                                </form>
                                            </div>
                                            <div className="card-footer text-center">
                                                <div className="row">
                                                    <div className='col-lg-6'>
                                                        <Link className="nav-link" to={{ pathname: "/login" }}>
                                                            Student Login
                                                        </Link> 
                                                    </div>
                                                    <div className='col-lg-6'>
                                                        <Link className="nav-link" to={{ pathname: "/adminLogin" }}>
                                                            Admin Login
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Modal show={sentOTP} onHide={handleClose} backdrop="static" size="lg">
                                <Modal.Header closeButton style={{ backgroundColor: "OliveDrab", color: "white" }}>
                                    <Modal.Title>OTP Verify</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <div className="col-lg-12">
                                        <div className="form-group">
                                            <input className="form-control py-4" id="otp" type="text"
                                                name="otp"
                                                value={otp}
                                                placeholder="Enter OTP"
                                                onChange={onChange}
                                            />

                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        {resentOTP ?
                                            <div className="alert alert-success animate__animated animate__bounceIn animate_slow">OTP Resent Successfully...</div>
                                            : null
                                        }

                                        {OTPerror !== '' ?
                                            <div className="alert alert-success animate__animated animate__bounceIn animate_slow">{OTPerror}</div>
                                            : null
                                        }
                                    </div>
                                    <hr />
                                    <div className="col-lg-12">
                                        <span>
                                            <Button variant="info" onClick={() => { validateOTP(otp, values.mobile, setSentOTP, setOTPValidated, setOTPError) }}>Validate OTP</Button>
                                        </span>
                                        <span style={{ "margin-left": "10px" }}>
                                            <Button variant="info" onClick={() => { OTPResend(values.mobile, setSentOTP, setSentOTPSuccess, setReSentOTP) }} >Resend OTP</Button>
                                        </span>
                                        <span style={{ "margin-left": "10px" }}>
                                            <Button variant="danger" onClick={handleClose} style={{ float: "right" }}>Close</Button>
                                        </span>
                                    </div>"
                                </Modal.Body>
                            </Modal>
                        </div>
                    );
                }
            }
        </Formik>

    );
}

async function registerUser(values, setMyMsg) {
    await API.post('register', { "reg_type": values.regType, "name": values.controllerName, "inst_name": values.orgName, "mobile": values.mobile, "email": values.email, "password": values.password })
        .then(res => {
            if (res.data.status === 'success') {
                setMyMsg(res.data.message);
            }
            else {
                setMyMsg(res.data.message);
            }
        })
        .catch(function (error) {

        });
}

async function validateOTP(otp, mobile, setSentOTP, setOTPValidated, setOTPError) {
    await API.post('/OTP/verify', { "otp": otp, "mobile": mobile })
        .then(res => {
            if (res.data.status === 'success') {
                setOTPValidated(true);
                setSentOTP(false);
            }
            else {
                setOTPError(res.data.message);
            }
        })
        .catch(function (error) {
            setOTPError(error.response.data.message);
        });
}

async function OTPResend(mobile, setSentOTP, setSentOTPSuccess, setReSentOTP) {
    setSentOTP(true);

    await API.post('/OTP/send', { "mobile": mobile })
        .then(res => {
            if (res.data.status === 'success') {
                setSentOTPSuccess(true);
                setReSentOTP(true);
            }
        })
        .catch(function (error) {

        });

}

async function OTPsend(mobile, setSentOTP, setSentOTPSuccess, setMyMsg, setOTPError, setOTP) {
    if (mobile.trim() === '' || mobile === '' || mobile === undefined) {
        setMyMsg('Mobile Number Can not be Blank for sending OTP.');
    }
    else {
        setOTPError('');
        setOTP('');
        await API.post('/OTP/send', { "mobile": mobile })
            .then(res => {
                if (res.data.status === 'success') {
                    setSentOTP(true);
                    setSentOTPSuccess(true);
                }
                else {
                    setSentOTP(false);
                    setOTPError(res.data.message);
                    setMyMsg(res.data.message);
                }
            })
            .catch(function (error) {
                setSentOTP(false);
                setOTPError(error.response.data.message);
                setMyMsg(error.response.data.message);
            });
    }
}