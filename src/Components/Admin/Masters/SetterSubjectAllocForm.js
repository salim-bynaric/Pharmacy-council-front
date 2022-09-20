import React, { useState, useEffect, useContext, createRef } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import API from '../../../api';
import { ShowContext } from '../../../App';
import { UserContext } from '../../../App';

const SetterSubjectAllocForm = ({ data,setMyList,myList }) => {
    const [myMsg, setMyMsg] = useState('');
    const { setShow, setMsg } = useContext(ShowContext);
    const [subjects, setSubjects] = useState([]);
    const { currentUser } = useContext(UserContext);
    const myInitialValues = { setterUid: '', paperId: '', setterType: '' };

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
                await allocatePaperSetterSubject(values,currentUser,setShow,setMsg,setMyList,myList);

                actions.setSubmitting(false);
                actions.resetForm({
                values: {
                            setterUid: '', paperId: '', setterType: ''
                        },
                });
            }}
            validationSchema={Yup.object({
                setterUid: Yup.number()
                    .required("Paper Setter is Required"),
                paperId: Yup.number()
                    .required("Subject is Required"),
                setterType: Yup.string()
                    .required("Paper Setting Type is Required."),
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
                                        Paper Setter Subject Allocation Form
                                    </div>
                                    <div className="card-body">
                                        <div className="form-group">
                                            <div className="col-lg-12 row">
                                                <div className="col-lg-4">
                                                    Select Paper Setter
                                                </div>
                                                <div className="col-lg-8">
                                                    <select id="setterUid" name="setterUid" className="form-control" onChange={handleChange} onBlur={handleBlur} value={values.setterUid}>
                                                        <option value="">Select Paper Setter</option>
                                                        <option value={data.uid}>{data.email}-{data.name}</option>
                                                    </select>

                                                    {errors.setterUid ? <div className="alert alert-info">{errors.setterUid}</div> : null}
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
                                                    Select Paper Setter Type
                                                </div>
                                                <div className="col-lg-8">
                                                    <select id="setterType" name="setterType" className="form-control" onChange={handleChange} onBlur={handleBlur} value={values.setterType}>
                                                        <option value="">Select Paper Setter Type</option>
                                                        <option value='PS'>Paper Setter</option>
                                                        <option value='PM'>Paper Moderator</option>
                                                        <option value='PSM'>Paper Setter & Moderator</option>
                                                    </select>

                                                    {errors.setterType ? <div className="alert alert-info">{errors.setterType}</div> : null}
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

async function allocatePaperSetterSubject(values,currentUser,setShow,setMsg,setMyList,myList)
{
    let instId = '';
    if(currentUser.role === 'EADMIN')
    {
        instId = currentUser.uid;
    }

    API.post('/subject/setterAllocation',{uid:values.setterUid,paperId:values.paperId,type:values.setterType,instId:instId})
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
    await API.get('/subject', { params: { "type": "byInstUid", "instUid": instUid } })
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



export default SetterSubjectAllocForm;