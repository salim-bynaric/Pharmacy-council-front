import React, { useState, useEffect, useContext } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import API from '../../../api';
import { ShowContext } from '../../../App';
import { UserContext } from '../../../App';

const InstClusterAllocForm = ({instList,clusterList,setInserted,inserted}) => 
{
    const [myMsg, setMyMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const myInitialValues = { instCode: '', clusterCode: '' };
    const { setShow, setMsg } = useContext(ShowContext);
    const { currentUser } = useContext(UserContext);

    return (
        !loading && currentUser ? <Formik
            initialValues={myInitialValues}
            onSubmit={async (values, actions) => 
            {
                await instToClusterAlloc(values,setShow,setMsg,setInserted,inserted);
                actions.setSubmitting(false);
                actions.resetForm({
                    values: {
                        instCode: '', clusterCode: ''
                    },
                });
            }}
            validationSchema={Yup.object({
                instCode: Yup.string()
                    .required("Institute is Required"),
                clusterCode: Yup.string()
                    .required("Cluster Admin is Required.")
            })}
        >
            {
                props => 
                {
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
                                        Institute To Cluster Allocation Form
                                    </div>
                                    <div className="card-body">
                                            <div className="form-group">
                                                <div className="col-lg-12 row">
                                                    <div className="col-lg-4">
                                                        Select Institute
                                                    </div>
                                                    <div className="col-lg-8">
                                                        <select id="instCode" name="instCode" className="form-control" onChange={handleChange} onBlur={handleBlur} value={values.instCode}>
                                                            <option value="">Select Institute</option>
                                                            {
                                                                instList.map(user =>
                                                                (
                                                                    <option key={user.uid} value={user.uid}>
                                                                        ({user.username}) {user.name}
                                                                    </option>
                                                                ))
                                                            }
                                                        </select>

                                                        {errors.instCode ? <div className="alert alert-info">{errors.instCode}</div> : null}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <div className="col-lg-12 row">
                                                    <div className="col-lg-4">
                                                        Select Cluster Admin
                                                    </div>
                                                    <div className="col-lg-8">
                                                        <select id="clusterCode" name="clusterCode" className="form-control" onChange={handleChange} onBlur={handleBlur} value={values.clusterCode}>
                                                            <option value="">Select Cluster Admin</option>
                                                            {
                                                                clusterList.map(user =>
                                                                (
                                                                    <option key={user.uid} value={user.uid}>
                                                                        ({user.username}) {user.name}
                                                                    </option>
                                                                ))
                                                            }
                                                        </select>

                                                        {errors.clusterCode ? <div className="alert alert-info">{errors.clusterCode}</div> : null}
                                                    </div>
                                                </div>
                                            </div>
                                    </div>
                                    <div className="card-footer">
                                        <div className="form-group">
                                            <center>
                                                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>Submit</button>
                                            </center>
                                        </div>

                                        {myMsg !== '' && (
                                            <div className="alert alert-dark animate__animated animate__tada animate_slower">{myMsg}</div>)}

                                        {loading && (
                                            <div className="custom-loader"></div>
                                        )}
                                    </div>
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

async function instToClusterAlloc(values,setShow,setMsg,setInserted,inserted)
{
    let instCode = values.instCode;
    let clusterCode = values.clusterCode;

    await API.put('/user/'+instCode, {'region':clusterCode})
    .then(function (res) 
    {
        if(res.data.status === 'success')
        {
            setShow(true);
            setInserted(!inserted);
            setMsg(res.data.message);
        }   
    })
    .catch(function (error) 
    {
        setShow(true);
        setMsg(error.response.data.message);
    });
}

export default InstClusterAllocForm;