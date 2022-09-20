import React, {useState,useEffect,useContext} from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import API from '../../../api';
import {ShowContext} from '../../../App';
import DateTimePicker from 'react-datetime-picker';
import Modal from "react-bootstrap/Modal";

const EditTest = (props) => {
    const handleClose                           = () => props.setEdit(false);
    const [subjects,setSubjects]                = useState([]);
    const {setShow,setMsg}                      = useContext(ShowContext);
    const myFlag                                = useFlag();

    const openEdit                              = props.edit;
    const setEdit                               = props.setEdit;
    const setMyList                             = props.setMyList;
    const myList                                = props.myList;
    const instUid                               = props.editData.institute.uid;
    const instCode                              = props.editData.institute.username;
    const instName                              = props.editData.institute.college_name;
    const examName                              = props.editData.exam_name;
    const subjectMarks                          = props.editData.marks;   
    const subjectQuestions                      = props.editData.questions;
    const subjectDuration                       = props.editData.durations;
    const subjectSlot                           = props.editData.slot;
    const subjectId                             = props.editData.id;
    const price                                 = props.editData.price;
    const examAfter                             = props.editData.examAfter;

    const myInitialValues                       = { flag:myFlag, instId: instUid,paperId: subjectId, examName:examName,marks:subjectMarks,questions:subjectQuestions,durations:subjectDuration,slot:subjectSlot,examAfter:examAfter,price:price};
    
    useEffect(() => {
        if(myFlag !== undefined)
        {
            getSubjects(setSubjects,instUid,setShow,setMsg);
        }
    },[setShow,setMsg,myFlag]);

    let content = [];
    for (let i=1;i<=90;i++) 
    {
      content.push(<option key={i}>{i}</option>);
    }
        
    return (
        subjects!== undefined && myFlag !== undefined ? <Formik 
        initialValues= {myInitialValues}
        onSubmit= {async (values,actions) => 
        {
            updateTest(values,setMyList,myList,setEdit,setShow,setMsg);
        }}
        validationSchema = {Yup.object({
            flag: Yup.number(),
            instId: Yup.string().when('flag', {
                is:0,
                then: Yup.string().required("Inst ID is Required")
            }),
            paperId: Yup.string()
            .required("Subject is Required"),
            examName: Yup.string()
            .required("Exam Name is Required."),
            marks: Yup.number()
            .required("Marks is Required."),
            questions: Yup.number()
            .required("Total Number of Questions is Required."),
            durations: Yup.number()
            .required("Total Duration in Minutes is Required."),
            slot: Yup.number()
            .required("Slot is Required."),
            examAfter: Yup.number()
            .required("Exam Start days are required."),
            price: Yup.number()
                .required("Price is Required."),
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
                        <Modal.Title>Edit Test</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="col-xl-12">
                            <form id="form-Prog" method="post" className="form-horizontal" onSubmit={handleSubmit}>
                                <div className="card mb-4">
                                    <div className="card-header">
                                        <i className="fas fa-address-card mr-1"/>
                                        Edit Test Form
                                    </div>
                                    <div className="card-body">
                                        {myFlag === 0 && (
                                            <div className="form-group">
                                                <div className="col-lg-12 row">
                                                    <div className="col-lg-4">
                                                        Select Institute
                                                    </div>
                                                    <div className="col-lg-8">
                                                    <select id="instId" name="instId" className="form-control" onChange={(e) => {
                                                        handleChange(e);
                                                       
                                                    }} onBlur={handleBlur} value={values.instId}>
                                                        <option key={instUid} value={instUid}>
                                                            ({instCode}) {instName}
                                                        </option>
                                                    </select>

                                                    {errors.instId ? <div className="alert alert-info">{errors.instId}</div> : null}
                                                    </div>
                                                </div>
                                        </div>)}
                                        <div className="form-group">
                                            <div className="col-lg-12 row">
                                                <div className="col-lg-4">
                                                    Select Subject
                                                </div>
                                                <div className="col-lg-8">
                                                    <select id="paperId" name="paperId" className="form-control" onChange={handleChange} onBlur={handleBlur} value={values.paperId} disabled={true}>
                                                        <option value="">Select Subject</option>
                                                        {
                                                        subjects.map(subject => 
                                                        (
                                                            <option key={subject.id} value={subject.id}>
                                                            ({subject.paper_code}) {subject.paper_name}
                                                            </option>
                                                        ))
                                                        }
                                                    </select>

                                                    {errors.paperId ? <div className="alert alert-info">{errors.paperId}</div> : null}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <div className="col-lg-12 row">
                                                <div className="col-lg-4">
                                                    Enter Exam Name
                                                </div>
                                                <div className="col-lg-8">
                                                    <input type="text" id="examName" name="examName" onChange={handleChange} value={values.examName} onBlur={handleBlur} className="form-control" placeholder="Enter Exam Name..." />

                                                    {errors.examName ? <div className="alert alert-info">{errors.examName}</div> : null}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="col-lg-12 row">
                                                <div className="col-lg-4">
                                                    Total Marks
                                                </div>
                                                <div className="col-lg-8">
                                                    <input type="text" id="marks" name="marks" onChange={handleChange} value={values.marks} onBlur={handleBlur} className="form-control" placeholder="Enter Total Marks..." />

                                                    {errors.marks ? <div className="alert alert-info">{errors.marks}</div> : null}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="col-lg-12 row">
                                                <div className="col-lg-4">
                                                    Total Questions
                                                </div>
                                                <div className="col-lg-8">
                                                    <input type="text" id="questions" name="questions" onChange={handleChange} value={values.questions} onBlur={handleBlur} className="form-control" placeholder="Enter Total Questions..." />

                                                    {errors.questions ? <div className="alert alert-info">{errors.questions}</div> : null}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <div className="col-lg-12 row">
                                                <div className="col-lg-4">
                                                    Exam Duration
                                                </div>
                                                <div className="col-lg-8">
                                                    <input type="text" id="durations" name="durations" onChange={handleChange} value={values.durations} onBlur={handleBlur} className="form-control" placeholder="Enter Total Duration in Minutes..." />

                                                    {errors.durations ? <div className="alert alert-info">{errors.durations}</div> : null}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <div className="col-lg-12 row">
                                                <div className="col-lg-4">
                                                    Select Slot
                                                </div>
                                                <div className="col-lg-8">
                                                <select id="slot" name="slot" className="form-control" onChange={handleChange} onBlur={handleBlur} value={values.slot}>
                                                    <option value="">Select Slot</option>
                                                    <option value="1">Slot 1</option>
                                                    <option value="2">Slot 2</option>
                                                    <option value="3">Slot 3</option>
                                                    <option value="4">Slot 4</option>
                                                    <option value="5">Slot 5</option>
                                                    <option value="6">Slot 6</option>
                                                </select>

                                                {errors.slot ? <div className="alert alert-info">{errors.slot}</div> : null}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <div className="col-lg-12 row">
                                                <div className="col-lg-4">
                                                    Days for Exam Conduction
                                                </div>
                                                <div className="col-lg-8">
                                                    <input type="text" id="examAfter"  name="examAfter" onChange={handleChange} onBlur={handleBlur} className="form-control" placeholder="Enter Value in form of number of days..." value={values.examAfter}></input>

                                                    {errors.examAfter ? <div className="alert alert-info">{errors.examAfter}</div> : null}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <div className="col-lg-12 row">
                                                <div className="col-lg-4">
                                                    Price
                                                </div>
                                                <div className="col-lg-8">
                                                    <input type="text" id="price" name="price" onChange={handleChange} value={values.price} onBlur={handleBlur} className="form-control" placeholder="Enter Price..." />

                                                    {errors.price ? <div className="alert alert-info">{errors.price}</div> : null}
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
                    </Modal.Body>
                </Modal>
                );
            }
        }
        </Formik>
        :null
    );
};

async function updateTest(values,setMyList,myList,setEdit,setShow,setMsg)
{
    let instId      = values.instId;
    let paperId     = values.paperId;
    let examName    = values.examName;
    let marks       = values.marks;
    let questions   = values.questions;
    let durations   = values.durations;
    let slot        = values.slot;
    let price       = values.price;
    let examAfter   = values.examAfter;

    await API.put('/subject/'+paperId,{'type':'test','instId':instId,'exam_name':examName,'marks':marks,'questions':questions,'durations':durations,'examAfter':examAfter,'slot':slot,'price':price})
        .then((res) => 
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
        .catch(function (error) {
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

async function getSubjects(setSubjects,instUid,setShow,setMsg)
{
    await API.get('/subject',{params: {"type":"byInstUid","instUid":instUid}})
        .then((res) => 
        {
            if(res.data.status === 'success')
            {
                setSubjects(res.data.data);
            }
            else
            {
                setShow(true);
                setMsg('Problem Fetching Data from Server');
            }
        });
}



export default EditTest;