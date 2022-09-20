import React, { useState, useContext, useEffect } from 'react';
import {ShowContext} from '../../App';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Formik } from 'formik';
import * as Yup from 'yup';
import API from '../../api';
import {UserContext} from '../../App';
import ClearSessionUserInfo from './ClearSessionUserInfo';


function ClearSession(props)
{
    const {setShow,setMsg}                          =   useContext(ShowContext);
    const [fetchedUserData, setUserData]            =   useState();
    const [flag, setFlag]                           =   useState();
    let [loading, setLoading]                       =   useState(false);
    const [insts,setInsts]                          =   useState([]);
    const { currentUser }                           =   useContext(UserContext);

    useEffect(() => {
        if(currentUser !== undefined && currentUser !== null)
        {
            getInsts(setInsts,setShow,setMsg,currentUser);
        }
    },[currentUser])

    useEffect(() => {updateFlag(setFlag);}, []);

    if(flag !== undefined)
    {
    return (
        currentUser ?
        <>
            <Formik
                initialValues={{ enrollNo: "",flag:flag ,instId:"" }}
                onSubmit={async (values,actions) =>
                {
                    await fetchUserData(values.enrollNo,setUserData,setShow,setMsg,setLoading,flag,values.instId,currentUser);
                    actions.setSubmitting(false);
                    actions.resetForm({
                        values: {
                        enrollNo: '',
                        flag: flag,
                        instId:''
                        },
                    });
                }}
                validationSchema={Yup.object().shape({
                    enrollNo:Yup.string()
                    .required("Username is Required."),
                    flag: Yup.number(),
                    instId: Yup.string().when('flag', {
                        is:0,
                        then: Yup.string().required("Inst ID is Required")
                      })
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
                        handleSubmit
                    } = props;
                
                    return (
                        insts && insts !== undefined && insts.length > 0 ?
                        <div>
                            <div className="container-fluid">
                                <br/>
                                <ol className="breadcrumb mb-4">
                                    <li className="breadcrumb-item active">Fill Form to Clear the Session</li>
                                </ol>
                                <div className="col-lg-12 animate__animated animate__fadeInDown animate_slower">
                                    <Form className="row" onSubmit={handleSubmit}>
                                        <Form.Group className="col-lg-12">
                                            <Form.Control 
                                                type="text" 
                                                placeholder="Enter User Name" 
                                                id="enrollNo"
                                                value ={values.enrollNo}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                            />
                                            {errors.enrollNo && touched.enrollNo && (
                                                <div className="alert alert-info">{errors.enrollNo}</div>
                                            )}
                                        </Form.Group>
                                        {(flag === 0 || currentUser.role !=='EADMIN') && (<div className="form-group col-lg-12">
                                           {insts !== undefined ? 
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
                                            :null}
                                            {errors.instId && touched.instId && (
                                                    <div className="alert alert-info">{errors.instId}</div>
                                            )}
                                        </div>)}

                                        <div className="col-lg-12">
                                            <center><Button variant="primary" type="submit" disabled={isSubmitting}>
                                                Submit
                                            </Button></center>
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
            <div className="col-lg-12" style={{marginTop:"20px"}}>
                {fetchedUserData !== undefined && !loading ?
                    <ClearSessionUserInfo userData={fetchedUserData} setUserData={setUserData}/>
                :
                null
                }
            </div>
        </>
        :null
    );
    }
    else
    {
        return <div className="custom-loader"></div>;
    }
}

async function getInsts(setInsts,setShow,setMsg,currentUser)
{
    let params = {};
    if(currentUser && currentUser.role === 'ADMIN')
    {
      params = {"role":"EADMIN"};
    }
    else if(currentUser && currentUser.role === 'EADMIN')
    {
      params = {"role":"EADMIN",'instUid':currentUser.uid};
    }
  
    await API.get('/user',{params: params})
  .then((res) => {
    if(res.data.status === 'success')
    {
      setInsts(res.data.data);
    }
    else
    {
      setShow(true);
      setMsg('Problem Fetching Data from Server');
    }
  });
}

async function fetchUserData(enrollNo,setUserData,setShow,setMsg,setLoading,flag='1',instId='0000',currentUser)
{
    setLoading(true);

    if(currentUser.role === 'EADMIN')
    {
        instId = currentUser.username;
    }
    
    await API.get('/user/'+enrollNo ,{params: {"instId" : instId, "flag" : flag}})
    .then(res =>
    {
        if(res.data.status === 'success')
        {
            setUserData(res.data);
            setLoading(false);
        }
        else
        {
            setLoading(false);
            setUserData(undefined);
            setShow(true);
            setMsg('Unable to fetch Data of specified user. Invalid User Details Provided.');
        }
    })
    .catch((error) =>
    {
        setLoading(false);
        setUserData(undefined);
        setShow(true);
        setMsg('Unable to fetch Data of specified user.Invalid User Details Provided.');
    });
}

async function updateFlag(setFlag)
{
  const res = await API.get('/settings',{params: {"type":"login"}});
  if(res.data.status==='success')
  {
      setFlag(res.data.flag);
  }
}

export default ClearSession;
