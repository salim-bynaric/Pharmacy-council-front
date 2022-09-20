import React, {useState,useEffect,useContext} from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import API from '../../api';
import {ShowContext} from '../../App';
import {UserContext} from '../../App';

const ResetExamForm = (props) => {
    const [myMsg, setMyMsg]         = useState('');
    const [loading, setLoading]     = useState(false);
    const myFlag                    = useFlag(setLoading);
    const myInitialValues           = { instId: '', enrollno: '', flag:myFlag , paperId:''};
    const {setShow,setMsg}          = useContext(ShowContext);
    const [insts,setInsts]          = useState([]);
    const [value, setValue]         = useState();
    const {currentUser }            = useContext(UserContext);
    const [subjects,setSubjects]    = useState([]);

    useEffect(() => {
        if(myFlag !== undefined && currentUser)
        {
            getInsts(setInsts,setShow,setMsg,currentUser);
        }
    },[myFlag,setShow,setMsg,currentUser]);

    return (
        !loading && myFlag !== undefined ? <Formik 
        initialValues= {myInitialValues}
        onSubmit= {async (values,actions) => 
        {
            setMyMsg('');
            await resetExam(values,setShow,setMsg,currentUser,props.setMyList,props.myList);
            actions.setSubmitting(false);
            actions.resetForm({
            values: {
                        instId: '', enrollno: '', flag:myFlag , paperId:''
                    },
            });
        }}
        validationSchema = {Yup.object({
            enrollno: Yup.string()
            .required("Student Enrollment Number is Required"),
            paperId: Yup.string()
            .required("Subject is Required."),
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
                    touched,
                    errors,
                    isSubmitting,
                    handleChange,
                    handleBlur,
                    handleSubmit
                } = props;
                return (
                <div className="col-xl-12">
                    <form id="form-Prog" method="post" className="form-horizontal" onSubmit={handleSubmit}>
                        <div className="card mb-4">
                            <div className="card-header">
                                <i className="fas fa-address-card mr-1"/>
                                Reset Candidate Examination Form
                            </div>
                            <div className="card-body">
                                    {myFlag === 0 && insts.length > 0 && (
                                    <div className="form-group">
                                        <div className="col-lg-12 row">
                                            <div className="col-lg-4">
                                                Select Institute
                                            </div>
                                            <div className="col-lg-8">
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

                                            {errors.instId ? <div className="alert alert-info">{errors.instId}</div> : null}
                                            </div>
                                        </div>
                                    </div>)}
                                    <div className="form-group">
                                        <div className="col-lg-12 row">
                                            <div className="col-lg-4">
                                                Enrollment No
                                            </div>
                                            <div className="col-lg-8">
                                                <input type="text" id="enrollno" name="enrollno" onChange={(e) => { handleChange(e); getStudentSubjects(e.target.value,currentUser.username,setSubjects,setShow,setMsg)}} value={values.enrollno} onBlur={handleBlur} className="form-control" placeholder="Enter Student Enrollment No..." />

                                                {errors.enrollno ? <div className="alert alert-info">{errors.enrollno}</div> : null}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="col-lg-12 row">
                                            <div className="col-lg-4">
                                                Select Subject
                                            </div>
                                            <div className="col-lg-8">
                                            <select id="paperId" name="paperId" className="form-control" onChange={handleChange} onBlur={handleBlur} value={values.paperId}>
                                                <option value="">Select Subject</option>
                                                {
                                                subjects.map(subject => 
                                                (
                                                    <option key={subject.paper.id} value={subject.paper.id}>
                                                    {subject.paper.paper_code} - {subject.paper.paper_name}
                                                    </option>
                                                ))
                                                }
                                            </select>

                                            {errors.paperId ? <div className="alert alert-info">{errors.paperId}</div> : null}
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

async function resetExam(values,setShow,setMsg,currentUser,setMyList,myList)
{
    let instId= null;
    if(currentUser.role === 'EADMIN')
    {
        instId = currentUser.username;
    }
    else
    {
        instId = values.instId;
    }

    await API.put('/examReset',{"status":"reset","stdid":[values.enrollno],"paperId":values.paperId,"instId":instId})
    .then((res) => {
        if(res.data.status === 'success')
        {
            setShow(true);
            setMsg('Student Examination Reset Successfully...');
            setMyList(!myList);
        }
    })
    .catch(function (error) {
        setShow(true);
        setMsg(error.response.data.message);
    })
    
}

function useFlag(setLoading)
{
    const [flag, setFlag]   =    useState();
    useEffect(() => {updateFlag();}, []);
    async function updateFlag()
    {
        setLoading(true);
        const res = await API.get('/settings',{params: {"type":"login"}});
        if(res.data.status==='success')
        {
            setFlag(res.data.flag);
            setLoading(false);
        }
    }
    return flag;
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

async function getStudentSubjects(enrollno,instId,setSubjects,setShow,setMsg)
{
    await API.get('/subject',{params: {"type":"byEnrollno","instId":instId,"enrollno":enrollno}})
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

export default ResetExamForm;