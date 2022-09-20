import React, {useState,useEffect,useContext} from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import API from '../../../api';
import {ShowContext} from '../../../App';
import {UserContext} from '../../../App';
import CustomSelect from '../../../CustomSelect';

const StudSubjectAllocForm = (props) => {
    const [myMsg, setMyMsg]         = useState('');
    const [loading, setLoading]     = useState(false);
    const myFlag                    = useFlag(setLoading);
    const myInitialValues           = { instId: '', enrollno: '', flag:myFlag , paperId:''};
    const {setShow,setMsg}          = useContext(ShowContext);
    const [insts,setInsts]          = useState([]);
    const {currentUser }            = useContext(UserContext);
    const [subjects,setSubjects]    = useState([]);

    useEffect(() => {
        if(myFlag !== undefined)
        {
            getInsts(setInsts,setShow,setMsg,currentUser);
            getSubjects1(setSubjects,currentUser.uid,setShow,setMsg);
        }
    },[myFlag,setShow,setMsg]);

    return (
        !loading && myFlag !== undefined ? <Formik 
        initialValues= {myInitialValues}
        onSubmit= {async (values,actions) => 
        {
            setMyMsg('');
            await studSubjectAllocation(values,setShow,setMsg,setMyMsg,props.setMyList,props.myList);
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
                    handleSubmit,
                    setFieldValue
                } = props;
                return (
                <div className="col-xl-12">
                    <form id="form-Prog" method="post" className="form-horizontal" onSubmit={handleSubmit}>
                        <div className="card mb-4">
                            <div className="card-header">
                                <i className="fas fa-address-card mr-1"/>
                                Student Subject Allocation Form
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
                                                <input type="text" id="enrollno" name="enrollno" onChange={handleChange} value={values.enrollno} onBlur={handleBlur} className="form-control" placeholder="Enter Student Enrollment No..." />

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
                                            <CustomSelect options = {subjects}
                                            value = {values.paperId}
                                            onChange={value=>setFieldValue('paperId',value.value)}/>

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

async function studSubjectAllocation(values,setShow,setMsg,setMyMsg,setMyList,myList)
{
    await API.post('/exam',{"enrollno":values.enrollno,"paperId":values.paperId,"instId":values.instId})
    .then((res) => {
    if(res.data.status === 'success')
    {
        setShow(true);
        setMsg('Student Allocated Successfully...');
        setMyList(!myList);
    }
    else
    {
      setShow(true);
      setMsg('Problem Fetching Data from Server');
    }
  })
  .catch(error => {
        setShow(true);
        setMsg(error.response.data.message);
  });
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

async function getSubjects1(setSubjects,instUid,setShow,setMsg)
{
    await API.get('/subject',{params: {"type":"byInstUid","instUid":instUid}})
        .then((res) => 
        {
            let subjectData = [];
            if(res.data.status === 'success')
            {
                res.data.data.map((subject,index) => {
                    subjectData.push({value:subject.id,label:subject.paper_code+' - '+subject.paper_name})
                })
                setSubjects(subjectData);
            }
            else
            {
                setShow(true);
                setMsg('Problem Fetching Data from Server');
            }
        });
}

export default StudSubjectAllocForm;