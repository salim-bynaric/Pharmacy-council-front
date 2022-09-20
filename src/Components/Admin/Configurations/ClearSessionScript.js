import React, { useState, useContext, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Formik } from 'formik';
import * as Yup from 'yup';
import API from '../../../api';
import ClearSessionContinue from './ClearSessionContinue';

function ClearSessionScript() {
    let [loading, setLoading] = useState(false);
    const [instList, setInstList] = useState();
    const [instId,setInstId] = useState();

    useEffect(() => {
        getUsers('EADMIN', setInstList, setLoading);
    }, []);

    return (
        <>
            <Formik
                initialValues={{ instId: '' }}
                onSubmit={async (values, actions) => {
                    setInstId(values.instId);
                }}
                validationSchema={Yup.object().shape({
                    instId: Yup.string()
                        .required("Institute is Required."),
                })}
            >
                {
                    props => {
                        const {
                            values,
                            errors,
                            handleChange,
                            isSubmitting,
                            handleBlur,
                            handleSubmit,
                        } = props;

                        return (
                            instList !== undefined ?
                                <div>
                                    <div className="container-fluid">
                                        <br />
                                        <ol className="breadcrumb mb-4">
                                            <li className="breadcrumb-item active">Clear Session Script</li>
                                        </ol>
                                        <div className="col-lg-12 animate__animated animate__fadeInDown animate_slower">
                                            <Form className="col-lg-12" onSubmit={handleSubmit}>
                                                <div className="card mb-4">
                                                    <div className="card-header">
                                                        <i className="fas fa-address-card mr-1" />
                                                        Clear Session Form
                                                    </div>
                                                    <div className="card-body row">
                                                        <Form.Group className="col-lg-3">
                                                            Select Institute
                                                        </Form.Group>
                                                        <Form.Group className="col-lg-9">
                                                            <select id="instId" name="instId" className="form-control" onChange={handleChange} onBlur={handleBlur} value={values.instId}>
                                                                <option value="">Select Institute</option>
                                                                {
                                                                    instList.map((inst) => {
                                                                        return <option key={inst.uid} value={inst.username}>{inst.username + '-' + inst.name}</option>
                                                                    })
                                                                }
                                                            </select>
                                                            {errors.instId ? <div className="alert alert-info">{errors.instId}</div> : null}
                                                        </Form.Group>
                                                        <div className="col-lg-12">
                                                            <center><Button variant="primary" type="submit" disabled={isSubmitting}>Submit</Button></center>
                                                        </div>
                                                    </div>

                                                </div>
                                                {
                                                    loading ?
                                                        <div className="custom-loader"></div>
                                                    : null
                                                }
                                            </Form>
                                        </div>
                                    </div>
                                    {   
                                        instId !== undefined ?
                                            <ClearSessionContinue instId={values.instId}/>
                                        :null
                                    }
                                </div>
                            : null
                        );
                    }
                }
            </Formik>
        </>
    );
}

async function getUsers(role, setInstList, setLoading) {
    setLoading(true);
    await API.get('/user', { params: { 'role': role } })
        .then(function (res) {
            setInstList(res.data.data);
            setLoading(false);
        })
        .catch(function (error) {
            setInstList(undefined);
            setLoading(false);
        });
}



export default ClearSessionScript;