import React, { useState, useContext, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Formik } from 'formik';
import * as Yup from 'yup';
import API from '../../../api';
import {LogoContext} from '../../../App';
import ClipLoader from "react-spinners/ClipLoader";

function ConfigureHeader(props) 
{
    const [headerData ,setHeaderData]   =   useState(false);
    const [msg ,setMsg]                 =   useState('');
    let [loading, setLoading]           =   useState(false);
    const {setLogoVal}                  =   useContext(LogoContext);
    const [logo,setLogo]                =   useState();
    const [instList, setInstList] = useState();

    useEffect(() => {
        getUsers('EADMIN', setInstList, setLoading);
    },[]);
    
    return(
        <>
            <Formik
            initialValues={{ instId:'',orgName: '',file:""}}
            onSubmit={async (values,actions) =>
            {
                await configHeader(values.orgName,values.instId,values.file,setHeaderData,setMsg,setLoading,setLogoVal);
                actions.setSubmitting(false);
                actions.resetForm({
                        values: {
                        instId: '',
                        orgName: '',
                        file: ''
                        },
                });
            }}
            validationSchema={Yup.object().shape({
                instId:Yup.string()
                .required("Institute is Required."),
                orgName:Yup.string()
                .required("Organization Name is Required for Configuring Header Text."),
                file:Yup.string()
                .required("Uploading Organization Logo is Mandatory.")
            })}
            >
            {
                props => 
                {
                    const {
                        values,
                        touched,
                        errors,
                        handleChange,
                        isSubmitting,
                        handleBlur,
                        handleSubmit,
                        setFieldValue
                    } = props;

                    return (
                        instList !== undefined ?
                        <div>
                            <div className="container-fluid">
                                <br/>
                                <ol className="breadcrumb mb-4">
                                    <li className="breadcrumb-item active">Configure Header</li>
                                </ol>
                                <div className="col-lg-12 animate__animated animate__fadeInDown animate_slower">
                                    
                                    <Form className="col-lg-12 row" onSubmit={handleSubmit}>
                                        <Form.Group className="col-lg-3">
                                            <select id="instId" name="instId" className="form-control" onChange={async (e) => {
                                                handleChange(e);
                                                await getHeaderData(setFieldValue,e.target.value,setLogo);

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

                                        <Form.Group className="col-lg-3">
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
                                        
                                        
                                        <Form.Group className="col-lg-5">
                                            <center>
                                            <input 
                                                id="file" 
                                                name="file" 
                                                type="file" 
                                                onChange={(event) => {
                                                    setFieldValue("file", event.currentTarget.files[0]);
                                                }} 
                                                onBlur={handleBlur}
                                                className="form-control" 
                                            />
                                            {errors.file && touched.file && (
                                                <div className="alert alert-info col-lg-12">{errors.file}</div>
                                            )}
                                            </center>
                                        </Form.Group>
                                        
                                        <div className="col-lg-12">
                                            <center><Button variant="primary" type="submit" disabled={isSubmitting}>Submit</Button></center>
                                        </div>
                                    </Form>
                                </div>
                            </div>
                        </div>
                        :null
                    );
                }
            }
            </Formik>
            <div className="col-lg-12" style={{marginTop:"30px"}}>
                {
                    logo !==undefined ?
                        <center><img src={logo} height={100} width={100} style={{borderRadius: "45%"}} onDragStart={(e) => {e.preventDefault();}}/></center>
                    :null
                }
            </div>
            <div className="col-lg-12" style={{marginTop:"20px"}}>
                {headerData && !loading ? 
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
    );
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

async function getHeaderData(setFieldValue,instId,setLogo)
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
            setFieldValue('orgName',res.data.header);
            setLogo(res.data.imgpath);
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

async function configHeader(orgName,instId,file,setHeaderData,setMsg,setLoading,setLogoVal)
{
    setLoading(true);
    let fd = new FormData();
    fd.append("type", 'headerconfig');
    fd.append("instId", instId);
    fd.append("orgName", orgName);
    fd.append("file", file);

    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    }

    await API.post('/configurations',fd,config)
    .then(function (res) 
    {
        if(res.data.status === 'success')
        {
            setHeaderData(true);
            setMsg(res.data.message);
            setLogoVal(Math.random());
            setTimeout(() => {
                setHeaderData(false);
            }, 10000);
        }
        else
        {
            setMsg(res.data.message);
            setHeaderData(true);
        }
        setLoading(false);
    })
    .catch(function (error) 
    {
        setHeaderData(true);
        setLoading(false);
        setMsg(error.response.data.message);
    });
}

export default ConfigureHeader;