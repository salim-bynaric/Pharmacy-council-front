import React, { useState, useEffect, useContext, createRef } from 'react';
import { Formik, Field } from 'formik';
import *  as Yup from 'yup'
import API from '../api';
import ClientCaptcha from "react-client-captcha";
import { UserContext } from '../App';
import { useHistory, Link, useParams } from 'react-router-dom';
import { Markup } from 'interweave';
import { en, de } from '../utils/Helper';
import Cookies from 'universal-cookie';
import Popup from './Popup';

window.recaptchaOptions = {
    useRecaptchaNet: true,
};

export default function AdminLogin({show,handleClose}) {
    let history = useHistory();
    const { setCurrentUser } = useContext(UserContext);
    const [myMsg, setMyMsg] = useState();
    const [myRecaptcha, setMyRecaptcha] = useState();
    let [idflag, setIdflag] = useState(false);
    const [eyeType, setEyeType] = useState(true);
    let [loading, setLoading] = useState(true);
    const [flag, instId] = useFlag(setLoading);
    const { detect } = require('detect-browser');
    const browser = detect();
    const cookies = new Cookies();

    const siteKey = process.env.REACT_APP_CAPTCHA_SITE_KEY;
    const recaptchaRef = createRef();

    return (
        !loading ?
            flag !== undefined && <Formik
                initialValues={{
                    adminType: '', username: de(cookies.get('Username')),
                    password: de(cookies.get('Password')), flag: flag, instId: instId, captcha: '', rememberMe: cookies.get('RemeberMe')
                }}
                onSubmit={async (values, actions) => {
                    if (values.captcha !== undefined && values.captcha !== '' && values.captcha !== null) {
                        if (myRecaptcha === values.captcha) {
                            await checkLogin(values.username, values.password, values.instId, values.adminType, flag, setMyMsg, history, setCurrentUser, browser, myRecaptcha, recaptchaRef);
                            actions.setSubmitting(false);
                            actions.resetForm({
                                values: {
                                    adminType: '', username: '', password: '', flag: flag, instId: instId, captcha: ''
                                },
                            });

                            if (values.rememberMe === true) {
                                cookies.set('Username', en(values.username), { path: '/' });
                                cookies.set('Password', en(values.password), { path: '/' });
                                cookies.set('RemeberMe', values.rememberMe, { path: '/' });
                            }
                            else {
                                cookies.remove('Username', '', { path: '/' });
                                cookies.remove('Password', '', { path: '/' });
                                cookies.remove('RemeberMe', '', { path: '/' });
                            }
                        }
                        else {
                            setMyMsg('Invalid Captcha Entered...');
                        }
                    }
                    else {
                        setMyMsg('Please Use Captcha For Login...');
                    }
                }}
                validationSchema={
                    Yup.object().shape({
                        adminType: Yup.string().required("Admin type Required"),
                        username: Yup.string().required("Username Required"),
                        password: Yup.string().required("Password Required"),
                        captcha: Yup.string().required("Captcha is Required"),
                        flag: Yup.number(),
                        instId: Yup.string().when('flag', {
                            is: 0,
                            then: Yup.string().required("Inst ID is Required")
                        }),
                    })
                }>
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
                            <>
                                <Popup show={show} handleClose={handleClose} showHeader={false}>
                                    <center>
                                        <h4 className="text-center font-weight-light my-4"><b>Admin Login</b></h4>
                                    </center>
                                    <div className="card-body" >
                                        <form onSubmit={handleSubmit}>
                                            <div className="form-group">
                                                <select id="adminType" name="adminType" className="form-control" onChange={handleChange} value={values.adminType} >
                                                    <option value="">Select Role</option>
                                                    <option value="ADMIN">ADMIN</option>
                                                    <option value="EADMIN">INSTITUTE ADMIN</option>
                                                    <option value="CHECKER">CHECKER</option>
                                                    <option value="PROCTOR">PROCTOR</option>
                                                    <option value="PAPERSETTER">PAPER SETTER/EXAMINER</option>
                                                </select>
                                                {errors.adminType && touched.adminType && (
                                                    <div className="alert alert-warning">{errors.adminType}</div>
                                                )}
                                            </div>
                                            <div className="form-group row">
                                                <div className="form-group col-lg-6">
                                                    <input className="form-control" id="username" type="text"
                                                        name="username"
                                                        value={values.username}
                                                        placeholder="Your Username"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                    />
                                                    {errors.username && touched.username && (
                                                        <div className="alert alert-warning">{errors.username}</div>
                                                    )}

                                                </div>
                                                <div className="form-group col-lg-6">
                                                    <input className="form-control" id="password" name="password"
                                                        type="password"
                                                        value={values.password}
                                                        placeholder="Your Password"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                    />
                                                    <a href="# " onClick={async () => {
                                                        if (eyeType) {
                                                            document.getElementById("eye").classList.remove('fa-eye');
                                                            setEyeType(!eyeType);
                                                            document.getElementById("password").type = "text";
                                                            document.getElementById("eye").classList.add('fa-eye-slash');
                                                        }
                                                        else {
                                                            document.getElementById("eye").classList.remove('fa-eye-slash');
                                                            setEyeType(!eyeType);
                                                            document.getElementById("password").type = "password";
                                                            document.getElementById("eye").classList.add('fa-eye');
                                                        }
                                                    }}>
                                                        <div id="eye" toggle="#password" className="fa fa-fw fa-eye field-icon toggle-password"></div>
                                                    </a>
                                                    {errors.password && touched.password && (
                                                        <div className="alert alert-warning">{errors.password}</div>
                                                    )}
                                                </div>
                                            </div>
                                            {(instId === undefined || instId === null || instId === '') && (
                                                <div className="form-group">
                                                    <input className="form-control" id="instId" name="instId" type="instId"
                                                        value={values.instId}
                                                        placeholder="Institute ID"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        class1name={errors.instId && touched.instId && "error"}
                                                        disabled={idflag}
                                                    />

                                                    {errors.instId && touched.instId && (
                                                        <div className="alert alert-warning">{errors.instId}</div>
                                                    )}
                                                </div>
                                            )}
                                            <div className="form-group row">
                                                <div className="col-lg-4">
                                                    <ClientCaptcha captchaCode={code => setMyRecaptcha(code)} chars="abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ123456789" fontColor="blue" backgroundColor="pink" fontSize={24} />
                                                </div>
                                                <div className='col-lg-8'>
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

                                            <div className='row'>
                                                <div className="col-lg-8">
                                                    <label>
                                                        <Field type="checkbox" onChange={handleChange} name="rememberMe" value={true} checked={values.rememberMe} />{' '} &nbsp;Remember me
                                                    </label>
                                                </div>
                                            </div>

                                            <center><button className="login100-form-btn" type="submit" id="submit" >Login</button></center>
                                            <br />

                                            {myMsg !== undefined && (
                                                <div className="col-lg-12 alert alert-success animate__animated animate__bounceIn animate_slow"><Markup content={myMsg} /></div>
                                            )}
                                        </form>
                                    </div>
                                </Popup>
                            </>

                        );
                    }
                }
            </Formik>
            :
            <div className="custom-loader"></div>
    )
}

async function checkLogin(username, password, instId, role, flag, setMyMsg, history, setCurrentUser, browser, myRecaptcha, recaptchaRef) {
    await API.post('/adminLogin', { "username": en(username), "password": en(password), "inst_id": en(instId), "flag": en(flag), "myRecaptcha": en(''), "browser": en(browser.name), "os": en(browser.os), "version": en(browser.version), "role": en(role) })
        .then(res => {
            if (res.data.status === 'success') {
                localStorage.setItem("token", JSON.stringify(res.data.token));
                let data = JSON.parse(de(res.data.data));
                if (data.role === 'STUDENT') {
                    setMyMsg('Only Admin Users Can log in from this Page...');
                }
                else if (data.role === 'ADMIN') {
                    setCurrentUser(data);
                    history.replace({ pathname: '/adminhome', state: { currentUser: data } });
                }
                else if (data.role === 'EADMIN') {
                    setCurrentUser(data);
                    history.replace({ pathname: '/insthome', state: { currentUser: data } });
                }
                else if (data.role === 'GADMIN') {
                    setCurrentUser(data);
                    history.replace({ pathname: '/gadminhome', state: { currentUser: data } });
                }
                else if (data.role === 'CADMIN') {
                    setCurrentUser(data);
                    history.replace({ pathname: '/cadminhome', state: { currentUser: data } });
                }
                else if (data.role === 'CHECKER') {
                    setCurrentUser(data);
                    history.replace({ pathname: '/checkerHome', state: { currentUser: data } });
                }
                else if (data.role === 'PROCTOR') {
                    setCurrentUser(data);
                    history.replace({ pathname: '/proctorHome', state: { currentUser: data } });
                }
                else if (data.role === 'PAPERSETTER') {
                    setCurrentUser(data);
                    history.replace({ pathname: '/setterHome', state: { currentUser: data } });
                }
                else if (data.role === 'SUBADMIN') {
                    setCurrentUser(data);
                    history.replace({ pathname: '/subAdminHome', state: { currentUser: data } });
                }
            }
            else {
                //recaptchaRef.current.reset();
                setMyMsg(res.data.message);
            }
        })
        .catch(function (error) {
            setMyMsg(error.response.data.message);
        });
}

function useFlag(setLoading) {
    const [flag, setFlag] = useState();
    const [instId1, setInstId] = useState();

    let url = window.location.origin;
    useEffect(() => { updateFlag(); }, []);

    async function updateFlag() {
        setLoading(true);
        API.get('/settings1', { params: { "type": en("login"), "url": en(url) } })
            .then((res) => {
                if (res.data.status === 'success') {
                    setFlag(de(res.data.flag));
                    setInstId(de(res.data.instId));
                    setLoading(false);
                }
                else {
                    setFlag(de(res.data.flag));
                    setInstId(de(res.data.instId));
                    setLoading(false);
                }
            })
            .catch((error) => {
                //setFlag(de(error.response.data.flag));
                //setInstId(de(error.response.data.instId));
                setLoading(false);
            });

    }

    return [flag, instId1];
}
