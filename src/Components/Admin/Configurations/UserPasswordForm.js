import React, { useState, useEffect, useContext } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import API from '../../../api';
import { ShowContext } from '../../../App';
import { UserContext } from '../../../App';
import {en,de} from '../../../utils/Helper';
import PasswordModal from '../PasswordModal';

const UserPasswordForm = (props) => {
    const myInitialValues = { instId: '', adminType: '', username:'',password: '' };
    const { setShow, setMsg } = useContext(ShowContext);
    const [insts, setInsts] = useState([]);
    const { currentUser } = useContext(UserContext);
    const [popupShow,setPopupShow] = useState(false);
    const [validated,setValidated] = useState(false);

    useEffect(() => {
        if (currentUser) {
            getInsts(setInsts, setShow, setMsg, currentUser);
        }
    }, [setShow, setMsg, currentUser]);

    return (
        currentUser ? <Formik
            initialValues={myInitialValues}
            onSubmit={async (values, actions) => {
                    updatePassword(values,setShow,setMsg,currentUser);
                    actions.setSubmitting(false);
                    setValidated(false);
                    actions.resetForm({
                        values: {
                            instId: '', adminType: '', username:'',password: ''
                        },
                    });
            }}
            validationSchema={Yup.object({
                instId: Yup.string()
                    .required("Institute is Required"),
                adminType: Yup.string()
                    .required("User Type is Required"),
                username: Yup.string()
                    .required("User Type is Required"),
                password: Yup.string()
                    .required("Password is Required"),
            })}
        >
            {
                props => {
                    const {
                        values,
                        errors,
                        isSubmitting,
                        handleChange,
                        handleBlur,
                        handleSubmit
                    } = props;
                    return (
                        <div className="col-xl-12">
                            <form id="form-Prog" method="post" className="form-horizontal" onSubmit={handleSubmit}>
                                <div className="card mb-4">
                                    <div className="card-header">
                                        <i className="fas fa-address-card mr-1" />
                                        User Password Form
                                    </div>
                                    <div className="card-body">
                                        <div className="form-group">
                                            <div className="col-lg-12 row">
                                                <div className="col-lg-4">
                                                    Enter Inst Id
                                                </div>
                                                <div className="col-lg-8">
                                                    <select id="instId" name="instId" className="form-control" onChange={handleChange} onBlur={handleBlur} value={values.instId}>
                                                        <option value="">Select Institute</option>
                                                        {
                                                            insts.map(inst =>
                                                            (
                                                                <option key={inst.uid} value={inst.username}>
                                                                    ({inst.username}) {inst.college_name}
                                                                </option>
                                                            ))
                                                        }
                                                    </select>

                                                    {errors.instId ? <div className="alert alert-info">{errors.instId}</div> : null}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group ">
                                            <div className="col-lg-12 row">
                                                <div className="col-lg-4">
                                                    Select User Type
                                                </div>
                                                <div className="col-lg-8">
                                                    <select id="adminType" name="adminType" className="form-control" onChange={handleChange} value={values.adminType} >
                                                        <option value="">Select User Type</option>
                                                        <option value="ADMIN">ADMIN</option>
                                                        <option value="EADMIN">INSTITUTE</option>
                                                        <option value="CHECKER">CHECKER</option>
                                                        <option value="PROCTOR">PROCTOR</option>
                                                        <option value="PAPERSETTER">PAPER SETTER/EXAMINER</option>
                                                        <option value="STUDENT">STUDENT</option>
                                                    </select>
                                                    {errors.adminType && (
                                                        <div className="alert alert-warning">{errors.adminType}</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="col-lg-12 row">
                                                <div className="col-lg-4">
                                                    Enter User Name
                                                </div>
                                                <div className="col-lg-8">
                                                    <input type="text" id="username" name="username" onChange={handleChange} value={values.username} onBlur={handleBlur} className="form-control" placeholder="Enter User Name" />

                                                    {errors.password ? <div className="alert alert-info">{errors.password}</div> : null}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="col-lg-12 row">
                                                <div className="col-lg-4">
                                                    Enter New Password
                                                </div>
                                                <div className="col-lg-8">
                                                    <input type="password" id="password" name="password" onChange={handleChange} value={values.password} onBlur={handleBlur} className="form-control" placeholder="Enter New Password..." />

                                                    {errors.password ? <div className="alert alert-info">{errors.password}</div> : null}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-footer">
                                        <div className="form-group">
                                            <center>
                                                <button className="btn btn-success" onClick={(e) => {
                                                    setPopupShow(true);e.preventDefault();
                                                }} disabled={validated}>Validate</button>&nbsp;&nbsp;&nbsp;
                                                <button type="submit" className="btn btn-primary" disabled={!validated}>Submit</button>
                                            </center>
                                        </div>
                                    </div>
                                    <PasswordModal popupShow={popupShow} setPopupShow={setPopupShow} setValidated={setValidated} />
                                </div>
                            </form>
                        </div>
                    );
                }
            }
        </Formik>
            : null
    );
};

async function updatePassword(values,setShow,setMsg,currentUser)
{
    let instId = encodeURIComponent(window.btoa(en(values.instId)));
    let userType = encodeURIComponent(window.btoa(en(values.adminType)));
    let username = encodeURIComponent(window.btoa(en(values.username)));
    let password = encodeURIComponent(window.btoa(en(values.password)));
    
    await API.get('/userByInstId/'+instId+'/'+userType , {params:{'username':username,'pass':password}})
    .then((res) => 
    {
        if(res.data.status === 'success')
        {
           setShow(true);
           setMsg('Password Updated Successfully...');
        }
    })
    .catch(function (error) 
    {
        setShow(true);
        setMsg(error.response.data.message);
    });
}

async function getInsts(setInsts, setShow, setMsg, currentUser) {
    let params = {};
    if (currentUser && currentUser.role === 'ADMIN') {
        params = { "role": "EADMIN" };
    }
    else if (currentUser && currentUser.role === 'EADMIN') {
        params = { "role": "EADMIN", 'instUid': currentUser.uid };
    }

    await API.get('/user', { params: params })
        .then((res) => {
            if (res.data.status === 'success') {
                setInsts(res.data.data);
            }
            else {
                setShow(true);
                setMsg('Problem Fetching Data from Server');
            }
        });
}

export default UserPasswordForm;