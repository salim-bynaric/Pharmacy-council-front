import React, { useState, useEffect, useContext } from 'react';
import API from '../../api';
import {ShowContext} from '../../App';
import { Formik } from 'formik';
import DateTimePicker from 'react-datetime-picker';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

function AutoEndExamNext(props)
{
    const [examDate, onExamDateChange]              =   useState(new Date());
    const {setShow,setMsg}                          =   useContext(ShowContext);
    const myInitialValues                           =   { examDate: examDate, slot:'', paperId: '',type1:''};
    const [subjects,setSubjects]                    =   useState();
    const instId                                    =   props.instId;
    const [examCount,setExamCount]                  =   useState();
    const [show, setShow1]                          =   useState(false);
    const handleClose                               =   ()    => setShow1(false);
    
    useEffect(() => 
    {
        getSubjects(setSubjects,examDate,setShow,setMsg,instId);
    },[examDate,instId]);

    return (
        <Formik 
        initialValues= {myInitialValues}
        onSubmit= {async (values,actions) => 
        { 
            const date          = examDate;
            const slot          = values.slot;
            const paperId       = values.paperId;
            const type          = values.type1;
            if(type === '' || type === undefined || type === null)
            {
                setShow(true);
                setMsg('Please Select Student Type...');
                return false;
            }
            getAutoEndExamCount(setExamCount,date,slot,paperId,setShow,setMsg,instId,type);
            setShow1(true);

        }}
        >
        {
            props => {
                const {
                    values,
                    isSubmitting,
                    handleChange,
                    handleBlur,
                    handleSubmit
                } = props;

                return (
                        <div><br/><br/>
                            <div className="container-fluid" style={{"marginTop":"10px"}}>
                                <div className="col-lg-12 animate__animated animate__fadeInDown animate_slower">
                                <div className="card mb-4">
                                    <div className="card-header">
                                        <i className="fas fa-hourglass-end mr-1"/>
                                            Auto End Filter
                                    </div>
                                    <form onSubmit={handleSubmit}>
                                    <div className="card-body row">
                                        <div className="form-group col-lg-6">
                                            <div className="col-lg-12 row">
                                                <div className="col-lg-4">
                                                    Date
                                                </div>
                                                <div className="col-lg-8">
                                                    <DateTimePicker onChange={onExamDateChange} value={examDate} id="examDate" name="examDate" className="form-control" format="yyyy-MM-dd"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group col-lg-6">
                                            <div className="col-lg-12 row">
                                                <div className="col-lg-4">
                                                    Slot
                                                </div>
                                                <div className="col-lg-8">
                                                    <select id="slot" name="slot" className="form-control" onChange={handleChange} onBlur={handleBlur} value={values.slot}>
                                                        <option value="all">Select Slot</option>
                                                        <option value="1">Slot 1</option>
                                                        <option value="2">Slot 2</option>
                                                        <option value="3">Slot 3</option>
                                                        <option value="4">Slot 4</option>
                                                        <option value="5">Slot 5</option>
                                                        <option value="6">Slot 6</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group col-lg-6">
                                            <div className="col-lg-12 row">
                                                <div className="col-lg-4">
                                                    Subject
                                                </div>
                                                <div className="col-lg-8">
                                                    <select id="paperId" name="paperId" className="form-control" onChange={handleChange} onBlur={handleBlur} value={values.paperId}>
                                                        <option value="">Select Subject</option>
                                                        { subjects ?
                                                        subjects.map(subject => 
                                                        (
                                                            <option key={subject.id} value={subject.id}>
                                                                ({subject.paper_code}) {subject.paper_name}
                                                            </option>
                                                        ))
                                                        :null}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group col-lg-6">
                                            <div className="col-lg-12 row">
                                                <div className="col-lg-4">
                                                    Student Type
                                                </div>
                                                <div className="col-lg-8">
                                                    <select id="type1" name="type1" className="form-control" onChange={handleChange} onBlur={handleBlur} value={values.type1}>
                                                        <option value="">Select Student Type</option>
                                                        <option value="nonph">Non-PH</option>
                                                        <option value="ph">PH</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-footer">
                                        <center>
                                            <button className="btn btn-sm btn-primary" type="submit" id="submit" disabled={isSubmitting}>Auto End Exam</button>
                                        </center>
                                    </div>
                                    </form>
                                </div>
                                </div>
                            </div>
                            <Modal show={show} onHide={handleClose} size="lg" backdrop="static">
                                <Modal.Header style={{backgroundColor:"OliveDrab",color:"white"}}>
                                    <Modal.Title><center>Auto End Examination Confirmation</center></Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    {
                                    examCount == 0 || examCount == null ?
                                        'With current filter No in Progress Examinations will be Auto End. Do you really want to Auto End Examination?' 
                                    :
                                        'With current filter total '+examCount+' in Progress Examinations will be Auto End. Do you really want to Auto End Examination?' 
                                    }
                                </Modal.Body>

                                <Modal.Footer>
                                    <Button variant="warning" onClick={() => {autoEndExam(values,examDate,setShow,setMsg,instId,setShow1)}} disabled={!examCount}>Yes</Button>
                                    <Button variant="danger" onClick={() => {setShow1(false);}}>No</Button>
                                </Modal.Footer>
                            </Modal>
                        </div>
                );
            }
        }
        </Formik>
    );
}

async function autoEndExam(values,examDate,setShow,setMsg,instId,setShow1)
{
    const date          = examDate;
    let date1           = date ? date.toISOString().slice(0, 10) : '';
    const slot          = values.slot;
    const paperId       = values.paperId;
    const type          = values.type1;

    //alert(date1+':'+slot+':'+paperId+':'+instId);

    await API.put('/exam/autoEnd/'+date1,{"slot":slot,"paperId":paperId,"instId":instId,"type":type})
    .then((res) => 
    {
        if(res.data.status === 'success')
        {
            setShow1(false);
            setShow(true);
            setMsg('Successfully Auto End Examination...');
        }
        else
        {
            setShow(true);
            setMsg('Problem Auto Ending Examination...');
        }
    });
}

async function getSubjects(setSubjects,date,setShow,setMsg,instId)
{
    let date1 = date ? date.toISOString().slice(0, 10) : '';
    await API.get('/subject/byDateInst/'+date1+'/'+instId)
    .then((res) => 
    {
        if(res.data.status === 'success')
        {
          setSubjects(res.data.data);
        }
        else
        {
          setShow(true);
          setMsg('Problem Fetching Data from Server for Date: '+date1);
        }
    });   
}

async function getAutoEndExamCount(setExamCount,date,slot,paperId,setShow,setMsg,instId,type)
{
    let date1 = date ? date.toISOString().slice(0, 10) : '';

    await API.get('/exam/autoEnd/count/',{params:{"date":date1,"slot":slot,"paperId":paperId,"instId":instId,'type':type}})
    .then((res) => 
    {
        if(res.data.status === 'success')
        {
          setExamCount(res.data.cnt);
        }
        else
        {
            setShow(true);
            setMsg('Problem Fetching Data from Server...');
        }
    });   
}

export default AutoEndExamNext;
