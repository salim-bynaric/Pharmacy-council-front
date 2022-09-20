import React, { useState, useEffect, useContext } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import API from '../../../api';
import { ShowContext } from '../../../App';
import { UserContext } from '../../../App';
import CustomSelect from '../../../CustomSelect';

const TestMasterForm = (props) => {
    const [myMsg, setMyMsg] = useState('');
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const { setShow, setMsg } = useContext(ShowContext);
    const { currentUser } = useContext(UserContext);
    const [insts, setInsts] = useState([]);
    const myFlag = useFlag(setLoading);

    const myInitialValues = { flag: myFlag, instId: '', paperId: '', examName: '', marks: '', questions: '', durations: '', slot: '', examAfter:'',price:''};

    useEffect(() => {
        if (myFlag !== undefined) {
            getInsts(setInsts, setShow, setMsg, currentUser);
        }
    }, [setShow, setMsg, myFlag]);

    let content = [];
    for (let i=1;i<=90;i++) 
    {
      content.push(<option key={i}>{i}</option>);
    }

    return (
        !loading && subjects !== undefined && myFlag !== undefined && insts.length > 0 ? <Formik
            initialValues={myInitialValues}
            onSubmit={async (values, actions) => {
                setMyMsg('');

                saveTest(values, setLoading, setShow, setMsg, setMyMsg, props.setMyList, props.myList);
                actions.setSubmitting(false);
                actions.resetForm({
                    values: {
                        flag: myFlag, instId: '', paperId: '', examName: '', marks: '', questions: '', durations: '', slot: '', examAfter:'', testMode: '',price:''
                    },
                });
            }}
            validationSchema={Yup.object({
                flag: Yup.number(),
                instId: Yup.string().when('flag', {
                    is: 0,
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
                        handleSubmit,
                        setFieldValue
                    } = props;
                    return (
                        <div className="col-xl-8">
                            <form id="form-Prog" method="post" className="form-horizontal" onSubmit={handleSubmit}>
                                <div className="card mb-4">
                                    <div className="card-header">
                                        <i className="fas fa-address-card mr-1" />
                                        Add Test Form
                                    </div>
                                    <div className="card-body">
                                        {myFlag !== undefined && insts.length > 0 && (
                                            <div className="form-group">
                                                <div className="col-lg-12 row">
                                                    <div className="col-lg-4">
                                                        Select Institute
                                                    </div>
                                                    <div className="col-lg-8">
                                                        <select id="instId" name="instId" className="form-control" onChange={(e) => {
                                                            setLoading(true);
                                                            handleChange(e);
                                                            getSubjects1(setSubjects, e.target.value, setShow, setMsg);
                                                            setLoading(false);
                                                        }} onBlur={handleBlur} value={values.instId}>
                                                            <option value="">Select Institute</option>
                                                            {
                                                                insts.map(inst =>
                                                                (
                                                                    <option key={inst.uid} value={inst.uid}>
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
                                                    Select Subject
                                                </div>
                                                <div className="col-lg-8">
                                                    <CustomSelect options = {subjects}
                                                    value = {values.paperId}
                                                    onChange={(value) => 
                                                    {
                                                        setFieldValue('paperId',value.value);
                                                        setFieldValue('examName',value.label);
                                                    }}
                                                    />
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

                                        {myMsg !== '' && (
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
            : null
    );
};

async function getInsts(setInsts, setShow, setMsg, currentUser) {
    let params = {};
    if (currentUser && currentUser.role === 'ADMIN') {
        params = { "role": "EADMIN" };
    }
    else if (currentUser && currentUser.role === 'EADMIN') {
        params = { "role": "EADMIN", 'instUid': currentUser.uid };
    }

    await API.get('/user', { params: params })
        .then((res) => {
            if (res.data.status === 'success') {
                setInsts(res.data.data);
            }
            else {
                setShow(true);
                setMsg('Problem Fetching Data from Server');
            }
        });
}

function useFlag(setLoading) {
    const [flag, setFlag] = useState();

    useEffect(() => { updateFlag(); }, []);

    async function updateFlag() {
        setLoading(true);
        const res = await API.get('/settings', { params: { "type": "login" } });
        if (res.data.status === 'success') {
            setFlag(res.data.flag);
            setLoading(false);
        }
    }

    return flag;
}

async function getSubjects1(setSubjects, instUid, setShow, setMsg) {
    await API.get('/subject', { params: { "type": "byInstUidNotInTest", "instUid": instUid } })
        .then((res) => 
        {
            let subjectData = [];
            if (res.data.status === 'success') 
            {
                res.data.data.map((subject) => {
                    subjectData.push({value:subject.id,label:subject.paper_code+' - '+subject.paper_name})
                })
                setSubjects(subjectData);
            }
            else {
                setShow(true);
                setMsg('Problem Fetching Data from Server');
            }
        });
}

async function saveTest(values, setLoading, setShow, setMsg, setMyMsg, setMyList, myList) {
    setLoading(true);
    let instId = values.instId;
    let paperId = values.paperId;
    let examName = values.examName;
    let marks = values.marks;
    let questions = values.questions;
    let durations = values.durations;
    let slot = values.slot;
    let day = values.day;
    let price = values.price;
    let examAfter = values.examAfter;
    
    await API.put('/subject/' + paperId, { 'type': 'test', 'instId': instId, 'exam_name': examName, 'marks': marks, 'questions': questions, 'durations': durations, 'slot': slot,'day':day,'price':price,"examAfter":examAfter})
        .then((res) => {
            if (res.data.status === 'success') {
                setMyMsg(res.data.message);
                setLoading(false);
                setMyList(!myList);
            }
            else {
                setMyMsg(res.data.message);
                setLoading(false);
            }
        })
        .catch(function (error) {
            setMyMsg(error.response.data.message);
            setLoading(false);
        });

}

export default TestMasterForm;