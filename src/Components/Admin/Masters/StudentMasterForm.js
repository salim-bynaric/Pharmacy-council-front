import React, {useState,useEffect,useContext} from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import API from '../../../api';
import {ShowContext} from '../../../App';
import {UserContext} from '../../../App';

const StudentMasterForm = (props) => {
    const [myMsg, setMyMsg]         = useState('');
    const [loading, setLoading]     = useState(false);
    const myInitialValues           = { enrollno: '', name: '' ,instId: '', programId:'', semester:'',mobile:'',email:'',password:'',ph:''};
    const {setShow,setMsg}          = useContext(ShowContext);
    const [insts,setInsts]          = useState([]);
    const [programs,setPrograms]    = useState([]);
    const {currentUser }            = useContext(UserContext);

    useEffect(() => {
        getInsts(setInsts,setShow,setMsg,currentUser);
    },[setShow,setMsg]);

    return (
        !loading ? <Formik 
        initialValues= {myInitialValues}
        onSubmit= {async (values,actions) => 
        {
            setMyMsg('');
            saveStudent(values,setLoading,setShow,setMsg,setMyMsg,props.setMyList,props.myList);
            actions.setSubmitting(false);
            actions.resetForm({
            values: {
                        enrollno: '', name: '', instId: '', programId:'', semester:'',mobile:'',email:'',password:'',ph:''
                    },
            });
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
            password: Yup.number()
            .required('Password is Required'),
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
                <div className="col-xl-8">
                    <form id="form-Prog" method="post" className="form-horizontal" onSubmit={handleSubmit}>
                        <div className="card mb-4">
                            <div className="card-header">
                                <i className="fas fa-address-card mr-1"/>
                                Add Student Form
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
                                                Enter Inst Id
                                            </div>
                                            <div className="col-lg-8">
                                            <select id="instId" name="instId" className="form-control" onChange={(e) => {
                                                setLoading(true);
                                                handleChange(e);
                                                getPrograms1(setPrograms,e.target.value,setShow,setMsg);
                                                setLoading(false);
                                            }} onBlur={handleBlur} value={values.instId}>
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
                                                Enter Password
                                            </div>
                                            <div className="col-lg-8">
                                                <input type="password" id="password" name="password" onChange={handleChange} value={values.password} onBlur={handleBlur} className="form-control" placeholder="Enter Password..." />

                                                {errors.password ? <div className="alert alert-info">{errors.password}</div> : null}
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
                                
                                {myMsg !== '' &&(
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
        :null
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

async function getPrograms1(setPrograms,instId,setShow,setMsg)
{
    await API.get('/program',{params: {"type":"instId","instId":instId}})
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

async function saveStudent(values,setLoading,setShow,setMsg,setMyMsg,setMyList,myList)
{
    setLoading(true);
    
    let enrollno        = values.enrollno;
    let name            = values.name;
    let instId          = values.instId;
    let programId       = values.programId;
    let semester        = values.semester;
    let mobile          = values.mobile;
    let email           = values.email;
    let password        = values.password;
    let ph              = values.ph;    

    await API.post('/user',{'type':'student','username':enrollno,'name':name,'instId':instId,'programId':programId,'semester':semester,'mobile':mobile,'email':email,'password':password,'ph':ph})
    .then((res) => 
    {
        if(res.data.status === 'success')
        {
            setMyMsg(res.data.message);
            setLoading(false);
            setMyList(!myList);
            setTimeout(()=>{setMyMsg('')}, 10000);
        }
        else
        {
            setMyMsg(res.data.message);
            setLoading(false);
            setTimeout(()=>{setMyMsg('')}, 20000);
        }
    })
    .catch(function (error) {
        setMyMsg(error.response.data.message);
        setLoading(false);
        setTimeout(()=>{setMyMsg('')}, 20000);
    });
}

export default StudentMasterForm;