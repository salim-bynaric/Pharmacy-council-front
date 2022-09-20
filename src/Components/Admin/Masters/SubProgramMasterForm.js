import React, { useState, useEffect, useContext } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import API from '../../../api';
import { ShowContext } from '../../../App';
import { UserContext } from '../../../App';

const SubProgramMasterForm = (props) => {
    const [myMsg, setMyMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const myInitialValues = { progCode: '', progName: '', logo:'' };
    const { setShow, setMsg } = useContext(ShowContext);
    const { currentUser } = useContext(UserContext);
    const ref = React.useRef();

    return (
        !loading && currentUser ? <Formik
            initialValues={myInitialValues}
            onSubmit={async (values, actions) => {
                setMyMsg('');

                registerSubProgram(values.progCode, values.progName,values.logo, setLoading, setMyMsg, props.setMyList, props.myList,currentUser);
                actions.setSubmitting(false);

                actions.resetForm({
                    values: {
                        progCode: '', progName: '', logo:''
                    },
                });
            }}
            validationSchema={Yup.object({
                progCode: Yup.string()
                    .required("Program Code is Required"),
                progName: Yup.string()
                    .required("Program Name is Required."),
                logo: Yup.mixed()
                    .required("Logo is Required."),
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
                        handleSubmit,
                        setFieldValue
                    } = props;
                    return (
                        <div className="col-lg-12">
                            <form id="form-Prog" method="post" className="form-horizontal" onSubmit={handleSubmit}>
                                <div className="card mb-4">
                                    <div className="card-header">
                                        <i className="fas fa-address-card mr-1" />
                                        Add Sub-Program Form
                                    </div>
                                    <div className="card-body">
                                        <div className="form-group">
                                            <div className="col-lg-12 row">
                                                <div className="col-lg-4">
                                                    Enter Sub-Program Code
                                                </div>
                                                <div className="col-lg-8">
                                                    <input type="text" id="progCode" name="progCode" onChange={handleChange} value={values.progCode} onBlur={handleBlur} className="form-control" placeholder="Sub-Program Code..." />

                                                    {errors.progCode ? <div className="alert alert-info">{errors.progCode}</div> : null}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="col-lg-12 row">
                                                <div className="col-lg-4">
                                                    Enter Sub-Program Name
                                                </div>
                                                <div className="col-lg-8">
                                                    <input type="text" id="progName" name="progName" onChange={handleChange} value={values.progName} onBlur={handleBlur} className="form-control" placeholder="Sub-Program Name..." />

                                                    {errors.progName ? <div className="alert alert-info">{errors.progName}</div> : null}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="col-lg-12 row">
                                                <div className="col-lg-4">
                                                    Select Logo
                                                </div>
                                                <div className="col-lg-8">
                                                    <input
                                                        id="logo"
                                                        name="logo"
                                                        type="file"
                                                        ref={ref}
                                                        onChange={(event) => {
                                                            setFieldValue("logo", event.currentTarget.files[0]);
                                                        }}
                                                        onBlur={handleBlur}
                                                        className="form-control"
                                                    />
                                                    {errors.logo ? <div className="alert alert-info">{errors.logo}</div> : null}
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

async function registerSubProgram(progCode, progName,logo, setLoading, setMyMsg, setMyList, myList) 
{
    let fd = new FormData();
    setLoading(true);
    fd.append("subProgCode", progCode);
    fd.append("subProgName", progName);
    fd.append("logo", logo);

    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    }

    await API.post('/subprogram',fd,config)
        .then(function (res) {
            setLoading(false);
            setMyMsg(res.data.message);
            setMyList(!myList);
            setTimeout(() => { setMyMsg('') }, 10000);
        })
        .catch(function (error) {
            setLoading(false);
            setMyMsg(error.response.data.message);
            setTimeout(() => { setMyMsg('') }, 10000);
        });
}

export default SubProgramMasterForm;