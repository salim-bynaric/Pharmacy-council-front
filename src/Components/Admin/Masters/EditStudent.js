import React, {useState,useEffect,useContext} from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import API from '../../../api';
import {ShowContext} from '../../../App';
import {UserContext} from '../../../App';
import Modal from "react-bootstrap/Modal";

const EditStudent = (props) => {
    const handleClose               = () => props.setEdit(false);
    const openEdit                  = props.edit;
    const setEdit                   = props.setEdit;
    const setMyList                 = props.setMyList;
    const myList                    = props.myList;

    const studUid                   = props.editData.uid;
    const enrollno                  = props.editData.username;
    const studName                  = props.editData.name; 
    const semester                  = props.editData.semester;
    const mobile                    = props.editData.mobile;
    const email                     = props.editData.email;
    const ph                        = props.editData.ph === 'PH' ? 'PH': 'NA' ;
    const instID                    = props.editData.inst_id;
    const programCode               = props.editData.course_code;
    const password                  = props.editData.origpass;

    const myInitialValues           = { enrollno: enrollno, name: studName ,instId: instID, programId:programCode, semester:semester,mobile:mobile,email:email,ph:ph};
    const {setShow,setMsg}          = useContext(ShowContext);
    const [insts,setInsts]          = useState([]);
    const [programs,setPrograms]    = useState([]);
    const {currentUser }            = useContext(UserContext);

    useEffect(() => {
        getInsts(setInsts,setShow,setMsg,currentUser);
        getPrograms(setPrograms,setShow,setMsg);
    },[]);

    return (
        <Formik 
        initialValues= {myInitialValues}
        onSubmit= {async (values,actions) => 
        {
           updateStudent(values,studUid,setShow,setMsg,setMyList,setEdit,myList);
        }}
        validationSchema = {Yup.object({
            enrollno: Yup.string()
            .required("Students Enrollment Number is Required"),
            name: Yup.string()
            .required("Students Name is Required"),
            instId: Yup.string()
            .required("Inst ID is Required"),
            programId: Yup.string()
            .required("Program is Required"),
            semester: Yup.number()
            .required('Semester is Required'),
            mobile: Yup.number()
            .required("Mobile Number is Required"),
            email: Yup.string()
            .required("Email is Required"),
            ph: Yup.string()
            .required('Physically Handicap Status is required'),
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
                        <Modal.Title>Edit Student</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="col-xl-12">
                            <form id="form-Prog" method="post" className="form-horizontal" onSubmit={handleSubmit}>
                                <div className="card mb-4">
                                    <div className="card-header">
                                        <i className="fas fa-address-card mr-1"/>
                                        Edit Student Form
                                    </div>
                                    <div className="card-body">
                                            <div className="form-group">
                                                <div className="col-lg-12 row">
                                                    <div className="col-lg-4">
                                                        Enter Enrollment No
                                                    </div>
                                                    <div className="col-lg-8">
                                                        <input type="text" id="enrollno" name="enrollno" onChange={handleChange} value={values.enrollno} onBlur={handleBlur} className="form-control" placeholder="Enter Enrollment No..." />

                                                        {errors.enrollno ? <div className="alert alert-info">{errors.enrollno}</div> : null}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <div className="col-lg-12 row">
                                                    <div className="col-lg-4">
                                                        Enter Student Name
                                                    </div>
                                                    <div className="col-lg-8">
                                                        <input type="text" id="name" name="name" onChange={handleChange} value={values.name} onBlur={handleBlur} className="form-control" placeholder="Enter Name..." />

                                                        {errors.name ? <div className="alert alert-info">{errors.name}</div> : null}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <div className="col-lg-12 row">
                                                    <div className="col-lg-4">
                                                        Select Inst Id
                                                    </div>
                                                    <div className="col-lg-8">
                                                    <select id="instId" name="instId" className="form-control" onChange={(e) => {
                                                        handleChange(e);
                                                        
                                                    }} onBlur={handleBlur} value={values.instId}>
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

                                            <div className="form-group">
                                                <div className="col-lg-12 row">
                                                    <div className="col-lg-4">
                                                        Select Program
                                                    </div>
                                                    <div className="col-lg-8">
                                                    <select id="programId" name="programId" className="form-control" onChange={handleChange} onBlur={handleBlur} value={values.programId}>
                                                        <option value="">Select Program</option>
                                                        {
                                                        programs.map(program => 
                                                        (
                                                            <option key={program.id} value={program.program_code}>
                                                            ({program.program_code}) {program.program_name}
                                                            </option>
                                                        ))
                                                        }
                                                    </select>

                                                    {errors.programId ? <div className="alert alert-info">{errors.programId}</div> : null}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <div className="col-lg-12 row">
                                                    <div className="col-lg-4">
                                                        Select Semester
                                                    </div>
                                                    <div className="col-lg-8">
                                                    <select id="semester" name="semester" className="form-control" onChange={handleChange} onBlur={handleBlur} value={values.semester}>
                                                        <option value="">Select Semester</option>
                                                        <option value="1">1</option>
                                                        <option value="2">2</option>
                                                        <option value="3">3</option>
                                                        <option value="4">4</option>
                                                        <option value="5">5</option>
                                                        <option value="6">6</option>
                                                        <option value="7">7</option>
                                                        <option value="8">8</option>
                                                    </select>

                                                    {errors.semester ? <div className="alert alert-info">{errors.semester}</div> : null}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <div className="col-lg-12 row">
                                                    <div className="col-lg-4">
                                                        Enter Mobile No
                                                    </div>
                                                    <div className="col-lg-8">
                                                        <input type="text" id="mobile" name="mobile" onChange={handleChange} value={values.mobile} onBlur={handleBlur} className="form-control" placeholder="Enter Mobile No..." />

                                                        {errors.mobile ? <div className="alert alert-info">{errors.mobile}</div> : null}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <div className="col-lg-12 row">
                                                    <div className="col-lg-4">
                                                        Enter Email
                                                    </div>
                                                    <div className="col-lg-8">
                                                        <input type="text" id="email" name="email" onChange={handleChange} value={values.email} onBlur={handleBlur} className="form-control" placeholder="Enter Email..." />

                                                        {errors.email ? <div className="alert alert-info">{errors.email}</div> : null}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <div className="col-lg-12 row">
                                                    <div className="col-lg-4">
                                                        Select Physical Handicap
                                                    </div>
                                                    <div className="col-lg-8">
                                                    <select id="ph" name="ph" className="form-control" onChange={handleChange} onBlur={handleBlur} value={values.ph}>
                                                        <option value="">Select Physical Handicap</option>
                                                        <option value="PH">Yes</option>
                                                        <option value="NA">NO</option>
                                                    </select>

                                                    {errors.ph ? <div className="alert alert-info">{errors.ph}</div> : null}
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
    );
};

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

async function getPrograms(setPrograms,setShow,setMsg)
{
    await API.get('/program',{params: {"type":"all"}})
        .then((res) => 
        {
            if(res.data.status === 'success')
            {
                setPrograms(res.data.data);
            }
            else
            {
                setShow(true);
                setMsg('Problem Fetching Data from Server');
            }
        });
}


async function updateStudent(values,studUid,setShow,setMsg,setMyList,setEdit,myList)
{
    let enrollno        = values.enrollno;
    let name            = values.name;
    let instId          = values.instId;
    let programId       = values.programId;
    let semester        = values.semester;
    let mobile          = values.mobile;
    let email           = values.email;
    let ph              = values.ph;    

    await API.put('/user/'+studUid,{'username':enrollno,'name':name,'inst_id':instId,'course_code':programId,'semester':semester,'mobile':mobile,'email':email,'ph':ph})
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



export default EditStudent;