import React, {useState,useEffect,useContext} from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Modal from "react-bootstrap/Modal";
import API from '../../../api';
import {ShowContext} from '../../../App';

const EditProgram = (props) => {
    const handleClose               = () => props.setEdit(false);
    const myFlag                    = useFlag();
    
    const programId                 = props.editData.id;
    const openEdit                  = props.edit;
    const setEdit                   = props.setEdit;
    const instUid                   = props.editData.inst.uid;
    const instCode                  = props.editData.inst.username;
    const instName                  = props.editData.inst.college_name;
    const setMyList                 = props.setMyList;
    const myList                    = props.myList;

    const myInitialValues           = { progCode: props.editData.program_code, progName:props.editData.program_name, flag:myFlag , instId:props.editData.inst.uid};

    const {setShow,setMsg}          = useContext(ShowContext);
    return (
        myFlag !== undefined ? <Formik 
        initialValues= {myInitialValues}
        onSubmit= {async (values,actions) => 
        {            
            updateProgram(values,setMyList,myList,programId,setEdit,setShow,setMsg);
        }}
        validationSchema = {Yup.object({
            progCode: Yup.string()
            .required("Program Code is Required"),
            progName: Yup.string()
            .required("Program Name is Required."),
            flag: Yup.number(),
            instId: Yup.string().when('flag', {
                is:0,
                then: Yup.string().required("Inst ID is Required")
            })
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
                    <Modal show={openEdit} onHide={handleClose} backdrop="static" size="lg">
                        <Modal.Header closeButton style={{backgroundColor:"OliveDrab",color:"white"}}>
                            <Modal.Title>Edit Program</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="col-lg-12">
                            <form id="edit-form-Prog" method="post" className="form-horizontal" onSubmit={handleSubmit}>
                                    <div className="card mb-4">
                                        <div className="card-header">
                                            <i className="fas fa-address-card mr-1"/>
                                            Edit Program Form
                                        </div>
                                        <div className="card-body">
                                                {myFlag === 0  && (
                                                <div className="form-group">
                                                    <div className="col-lg-12 row">
                                                        <div className="col-lg-4">
                                                            Enter Inst Id
                                                        </div>
                                                        <div className="col-lg-8">
                                                        <select id="instId" name="instId" className="form-control" onChange={handleChange} onBlur={handleBlur} value={values.instId}>
                                                            <option value={instUid}>{instCode}- {instName}</option>
                                                        </select>

                                                        {errors.instId ? <div className="alert alert-info">{errors.instId}</div> : null}
                                                        </div>
                                                    </div>
                                                </div>)}
                                                <div className="form-group">
                                                    <div className="col-lg-12 row">
                                                        <div className="col-lg-4">
                                                            Enter Program Code
                                                        </div>
                                                        <div className="col-lg-8">
                                                            <input type="text" id="progCode" name="progCode" onChange={handleChange} value={values.progCode} onBlur={handleBlur} className="form-control" placeholder="Enter Program Code..." />

                                                            {errors.progCode ? <div className="alert alert-info">{errors.progCode}</div> : null}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <div className="col-lg-12 row">
                                                        <div className="col-lg-4">
                                                            Enter Program Name
                                                        </div>
                                                        <div className="col-lg-8">
                                                            <input type="text" id="progName" name="progName" onChange={handleChange} value={values.progName} onBlur={handleBlur} className="form-control" placeholder="Enter Program Name..." />

                                                            {errors.progName ? <div className="alert alert-info">{errors.progName}</div> : null}
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
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <hr/>
                            <div className="col-lg-12">
                               
                            </div>
                        </Modal.Body>
                    </Modal>
                );
            }
        }
        </Formik>
        :null
    );
};

async function updateProgram(values,setMyList,myList,programId,setEdit,setShow,setMsg)
{
    await API.put('/program/'+programId, {'progCode': values.progCode,'progName': values.progName,'flag':values.flag,'instId':values.instId})
    .then(function (res) 
    {
        if(res.data.status === 'success')
        {
            setMyList(!myList);
            setEdit(false);
            setShow(true);
            setMsg(res.data.message);
        }
        else
        {
            setShow(true);
            setMsg(res.data.message);
        }
    })
    .catch(function (error) 
    {
        setShow(true);
        setMsg(error.response.data.message);
    });   
}

function useFlag()
{
    const [flag, setFlag]   =    useState();

    useEffect(() => {updateFlag();}, []);

    async function updateFlag()
    {
        const res = await API.get('/settings',{params: {"type":"login"}});
        if(res.data.status==='success')
        {
            setFlag(res.data.flag);
        }
    }

    return flag;
}

export default EditProgram;