import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Formik } from 'formik';
import * as Yup from 'yup';
import API from '../../../api';
import ClipLoader from "react-spinners/ClipLoader";

function ConfigureFooter(props) 
{
    const [footerData ,setFooterData]   =   useState(false);
    const [msg ,setMsg]                 =   useState('');
    let [loading, setLoading]           =   useState(false);
    const [databaseFooter,setDatabaseFooter] = useState('');
    const [instList, setInstList]       = useState();

    useEffect(() => {
        getUsers('EADMIN', setInstList, setLoading);
    },[]);
    
    return(
        instList !== undefined ?
        <>
            <Formik
            initialValues={{ instId:'',orgName: databaseFooter }}
            onSubmit={async (values,actions) =>
            {
                await updateFooterData(values.instId,values.orgName,setFooterData,setMsg,setLoading);
                actions.setSubmitting(false);
                actions.resetForm({
                        values: {
                        instId: '',
                        orgName: ''
                        },
                });
            }}
            validationSchema={Yup.object().shape({
                instId:Yup.string()
                .required("Institute is Required for Configuring Footer Text."),
                orgName:Yup.string()
                .required("Organization Name is Required for Configuring Footer Text.")
            })}
            >
            {
                props => 
                {
                    const {
                        values,
                        touched,
                        errors,
                        isSubmitting,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        setFieldValue
                    } = props;

                    return (
                        <div>
                            <div className="container-fluid">
                                <br/>
                                <ol className="breadcrumb mb-4">
                                    <li className="breadcrumb-item active">Configure Footer</li>
                                </ol>
                                <div className="col-lg-12 animate__animated animate__pulse animate_slower">
                                    <Form className="col-lg-12 row" onSubmit={handleSubmit}>
                                        <Form.Group className="col-lg-6">
                                            <select id="instId" name="instId" className="form-control" onChange={async (e) => {
                                                handleChange(e);
                                                await getFooterData(setFieldValue,e.target.value);

                                            }} onBlur={handleBlur} value={values.instId}>
                                                <option value="">Select Institute</option>
                                                {
                                                    instList.map((inst) => {
                                                        return <option key={inst.uid} value={inst.username}>{inst.uid+'-'+inst.name}</option>
                                                    })
                                                }
                                            </select>
                                            {errors.instId ? <div className="alert alert-info">{errors.instId}</div> : null}
                                        </Form.Group>
                                        <Form.Group className="col-lg-6 row">
                                            <Form.Control 
                                                type="text" 
                                                id="orgName" 
                                                placeholder="Enter Organization Name" 
                                                className="col-lg-12"
                                                value ={values.orgName}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                            />
                                            {errors.orgName && touched.orgName && (
                                                <div className="alert alert-info col-lg-12">{errors.orgName}</div>
                                            )}
                                        </Form.Group>
                                        <div className="col-lg-2">
                                            <center><Button variant="primary" type="submit" disabled={isSubmitting}>Submit</Button></center>
                                        </div>
                                    </Form>
                                </div>
                            </div>
                        </div>
                    );
                }
            }
            </Formik>
            <div className="col-lg-12" style={{marginTop:"20px"}}>
                {footerData && !loading ? 
                <div className="alert alert-danger animate__animated animate__tada animate_slower" role="alert">
                    {msg}
                </div>
                : 
                <div className="col-lg-12" style={{position:"absolute",top:"40%",left:"40%"}}>
                    <ClipLoader color={'#ff0000'} loading={loading} size={200} />
                </div>
                }
            </div>
        </>
        :null
    );
}

async function getFooterData(setFieldValue,instId)
{
    let id = '';
    if(instId ==='')
    {
        id='0000';
    }
    else
    {
        id=instId;
    }

    await API.get('/configurations/'+id)
    .then(function (res) 
    {
        if(res.data.status === 'success')
        {
            setFieldValue('orgName',res.data.footer);
        }
        else
        {
            setFieldValue('orgName','Bynaric Exams');
        }
    })
    .catch(function (error) 
    {
        setFieldValue('orgName','Bynaric Exams');
    });
}

async function getUsers(role, setInstList, setLoading) 
{
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

async function updateFooterData(instId,orgName,setFooterData,setMsg,setLoading)
{
    setLoading(true);
    const res = await API.put('/configurations',{"orgName" : orgName,"type":"footerconfig","instId":instId});
    if(res.data.status === 'success')
    {
        setFooterData(true);
        setTimeout(() => {
            setFooterData(false);
        }, 10000);
    }
    else
    {
        setFooterData(false);
    }
    setLoading(false);
    setMsg(res.data.message);
}

export default ConfigureFooter;