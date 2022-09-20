import React, { useState, useEffect, useContext, createRef } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import API from '../../../api';
import { ShowContext } from '../../../App';
import { UserContext } from '../../../App';

const CheckerSubjectAllocForm = ({ data,setMyList,myList }) => {
    const [myMsg, setMyMsg] = useState('');
    const { setShow, setMsg } = useContext(ShowContext);
    const [subjects, setSubjects] = useState([]);
    const { currentUser } = useContext(UserContext);
    const myInitialValues = { checkerUid: '', paperId: '', checkerType: '' };

    useEffect(() => {
        if (currentUser !== undefined && currentUser !== null) {
            getSubjects(setSubjects, currentUser.uid, setShow, setMsg);
        }
    }, [currentUser]);

    return (
        currentUser ? <Formik
            initialValues={myInitialValues}
            onSubmit={async (values, actions) => 
            {
                await allocatePaperCheckerSubject(values,currentUser,setShow,setMsg,setMyList,myList);

                actions.setSubmitting(false);
                actions.resetForm({
                values: {
                            checkerUid: '', paperId: '', checkerType: ''
                        },
                });
            }}
            validationSchema={Yup.object({
                checkerUid: Yup.number()
                    .required("Paper Checker is Required"),
                paperId: Yup.number()
                    .required("Subject is Required"),
                checkerType: Yup.string()
                    .required("Paper Checkers Type is Required."),
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
                        <div className="col-xl-12">
                            <form id="form-Prog" method="post" className="form-horizontal" onSubmit={handleSubmit}>
                                <div className="card mb-4">
                                    <div className="card-header">
                                        <i className="fas fa-address-card mr-1" />
                                        Paper Checker Subject Allocation Form
                                    </div>
                                    <div className="card-body">
                                        <div className="form-group">
                                            <div className="col-lg-12 row">
                                                <div className="col-lg-4">
                                                    Select Paper Checker
                                                </div>
                                                <div className="col-lg-8">
                                                    <select id="checkerUid" name="checkerUid" className="form-control" onChange={handleChange} onBlur={handleBlur} value={values.checkerUid}>
                                                        <option value="">Select Paper Checker</option>
                                                        <option value={data.uid}>{data.email}-{data.name}</option>
                                                    </select>

                                                    {errors.checkerUid ? <div className="alert alert-info">{errors.checkerUid}</div> : null}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="col-lg-12 row">
                                                <div className="col-lg-4">
                                                    Select Subjects
                                                </div>
                                                <div className="col-lg-8">
                                                    <select id="paperId" name="paperId" className="form-control" onChange={handleChange} onBlur={handleBlur} value={values.paperId}>
                                                        <option value="">Select Subject</option>
                                                        {
                                                            subjects.length > 0 ?
                                                                subjects.map((subject,index) =>{
                                                                    return <option key={index} value={subject.id}>{subject.paper_code+'-'+subject.paper_name}</option>
                                                                })
                                                            :null
                                                        }
                                                    </select>

                                                    {errors.paperId ? <div className="alert alert-info">{errors.paperId}</div> : null}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="col-lg-12 row">
                                                <div className="col-lg-4">
                                                    Select Paper Checker Type
                                                </div>
                                                <div className="col-lg-8">
                                                    <select id="checkerType" name="checkerType" className="form-control" onChange={handleChange} onBlur={handleBlur} value={values.checkerType}>
                                                        <option value="">Select Paper Checker Type</option>
                                                        <option value='QPC'>Paper Checker</option>
                                                        <option value='QPM'>Paper Moderator</option>
                                                    </select>

                                                    {errors.checkerType ? <div className="alert alert-info">{errors.checkerType}</div> : null}
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

                                        {myMsg !== '' && (
                                            <div className="alert alert-dark animate__animated animate__tada animate_slower">{myMsg}</div>)}
                                    </div>
                                </div>
                            </form>
                        </div>
                    );
                }
            }
        </Formik>
            : null
    );
};

async function allocatePaperCheckerSubject(values,currentUser,setShow,setMsg,setMyList,myList)
{
   let inst_id = 0;
   if(currentUser.role === 'EADMIN')
   {
      inst_id = currentUser.uid;
   }

   API.post('/subject/checkerAllocation',{uid:values.checkerUid,paperId:values.paperId,type:values.checkerType,instId:inst_id})
    .then(function (res) 
    {
        if(res.data.status ==='success')
        {
            setShow(true);
            setMsg(res.data.message);
            setMyList(!myList);
        }
    })
    .catch(function (error) {
        setShow(true);
        setMsg(error.response.data.message);
    })
}

async function getSubjects(setSubjects, instUid, setShow, setMsg) {
    let myArray = [];
    await API.get('/subject', { params: { "type": "byInstUid", "instUid": instUid,"mode":"subjective" } })
        .then((res) => 
        {
            if (res.data.status === 'success') {
                setSubjects(res.data.data);
            }
            else {
                setShow(true);
                setMsg('Problem Fetching Data from Server');
            }
        });
}



export default CheckerSubjectAllocForm;