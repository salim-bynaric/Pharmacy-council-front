import React, { useState, useEffect, useContext } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import API from '../../api';
import { ShowContext } from '../../App';
import { UserContext } from '../../App';
import CheckerExamDataList from './CheckerExamDataList';
import DownloadAnsPdfModal from './DownloadAnsPdfModal';
import { Link } from 'react-router-dom';

const CheckPaper = (props) => {
    let paperId = (props.location.state && props.location.state.paperId !== null && props.location.state.paperId !== undefined) ? props.location.state.paperId : '';

    const { setShow, setMsg } = useContext(ShowContext);
    const { currentUser } = useContext(UserContext);
    const myInitialValues = { paperId: paperId };
    const [subjects, setSubjects] = useState();
    const [examData, setExamData] = useState();
    const [visible,setVisible] = useState(false);
    const [checkerType,setCheckerType] = useState();

    useEffect(async () => {
        if (currentUser && currentUser !== undefined) {
            getSubjects(setSubjects, currentUser, setShow, setMsg);

            if(paperId !== '' && paperId !== undefined && paperId !== null)
            {
                setExamData(undefined);
                let type = await getCheckerType(paperId, currentUser);
                setCheckerType(type);
                if(type === 'QPC')
                {
                    await getExamList(paperId, currentUser, setShow, setMsg, setExamData);
                }
                else if(type === 'QPM')
                {
                    await getCheckedExamList(paperId, currentUser, setShow, setMsg, setExamData);
                }
            }

        }
    }, [currentUser,paperId]);

    return (
        <Formik
            initialValues={myInitialValues}
            onSubmit={async (values, actions) => {
                setExamData(undefined);
                let type = await getCheckerType(values.paperId, currentUser);
                setCheckerType(type);
                if(type === 'QPC')
                {
                    await getExamList(values.paperId, currentUser, setShow, setMsg, setExamData);
                }
                else if(type === 'QPM')
                {
                    await getCheckedExamList(values.paperId, currentUser, setShow, setMsg, setExamData);
                }
                actions.setSubmitting(false);
            }}
            validationSchema={Yup.object({
                paperId: Yup.string()
                    .required("Subject is Required")
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
                        submitForm
                    } = props;
                    return (
                        subjects !== undefined && currentUser  ?
                            <div className="container-fluid">
                                <h1 className="mt-4">Check Paper Home</h1>
                                <div className="breadcrumb col-lg-12 row">
                                    <div className="breadcrumb-item col-lg-8">Select Subject to Check Paper</div>
                                    
                                    {<div className="col-lg-4"><span style={{'float':'right'}}><Link to={void(0)} onClick={() => {setVisible(true);}}>Download Answer PDF</Link></span></div>}
                                </div>
                                <div className="col-xl-12">
                                    <form id="form-Prog" method="post" className="form-horizontal" onSubmit={handleSubmit}>
                                        <div className="card mb-4">
                                            <div className="card-header">
                                                <i className="fas fa-address-card mr-1" />
                                                Paper Checker Form
                                            </div>
                                            <div className="card-body">

                                                <div className="form-group">
                                                    <div className="col-lg-12 row">
                                                        <div className="col-lg-4">
                                                            Select Subject
                                                        </div>
                                                        <div className="col-lg-8">
                                                            <select id="paperId" name="paperId" className="form-control" onChange={async (e) => { await handleChange(e); submitForm(); }} onBlur={handleBlur} value={values.paperId}>
                                                                <option value="">Select Subject</option>
                                                                {
                                                                    subjects.map(subject =>
                                                                    (
                                                                        <option key={subject.subject.id} value={subject.subject.id}>
                                                                            {subject.subject.paper_code}-{subject.subject.paper_name}
                                                                        </option>
                                                                    ))
                                                                }
                                                            </select>

                                                            {errors.paperId ? <div className="alert alert-info">{errors.paperId}</div> : null}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div className="col-lg-12">
                                    {examData !== undefined  && checkerType !== undefined ?
                                        <CheckerExamDataList examData={examData} checkerType={checkerType}/>
                                        :
                                        null}
                                </div>
                                <div className="col-lg-12">
                                    <DownloadAnsPdfModal visible={visible} setVisible={setVisible} subjects={subjects} currentUser={currentUser} setShow={setShow} setMsg={setMsg} />
                                </div>
                            </div>
                            : null
                    );
                }
            }
        </Formik>
        
    );
};

async function getCheckedExamList(paperId, currentUser, setShow, setMsg, setExamData)
{
    let checkeruid = currentUser.uid;

    await API.get('/checker/student/checkedExams/', { params: { 'paperId': paperId, 'checkeruid': checkeruid } })
        .then(function (res) {
            setExamData(res.data.data);
            if (res.data.status === 'failure') {
                setShow(true);
                setMsg(res.data.message);
            }
        })
        .catch(function (error) {

        });
}

async function getCheckerType(paperId, currentUser)
{
    let uid = currentUser.uid;
    let instId = currentUser.inst_id;
    let type = undefined
    
    await API.get('/checker/type', { params: { 'paperId': paperId, 'checkeruid': uid, 'instId': instId } })
    .then(function (res) {
        if(res.data.status === 'success')
        {
            type = res.data.data.type;
        }
    });

    return type;
}

async function getExamList(paperId, currentUser, setShow, setMsg, setExamData) {
    let checkeruid = currentUser.uid;

    await API.get('/checker/student/exams/', { params: { 'paperId': paperId, 'checkeruid': checkeruid } })
        .then(function (res) {
            setExamData(res.data.data);
            if (res.data.status === 'failure') {
                setShow(true);
                setMsg(res.data.message);
            }
        })
        .catch(function (error) {

        });
}
async function getSubjects(setSubjects, currentUser, setShow, setMsg) {
    if (currentUser && currentUser !== undefined && currentUser !== null) {
        await API.get('/subject/byChecker/' + currentUser.uid)
            .then(function (res) {
                setSubjects(res.data.data);
            })
            .catch(function (error) {

            });
    }
}

export default CheckPaper;