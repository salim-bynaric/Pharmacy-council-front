import React, {useState,useEffect,useContext} from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import API from '../../api';
import {ShowContext} from '../../App';
import {UserContext} from '../../App';
import PreviewQuestionList from './PreviewQuestionList';

const ExamListView = () => {
    let [data,setData]                          =   useState();
    const [subjects,setSubjects]                = useState();
    const [loading, setLoading]                 = useState(false);
    const myInitialValues                       = { paperId: ''};
    const {setShow,setMsg}                      = useContext(ShowContext);
    const {currentUser}                         = useContext(UserContext);
    const [subjectDetails,setSubjectDetails]    = useState();
    
    useEffect(()=>
    {
        if(currentUser)
        {
            getSubjects(currentUser,setShow,setMsg,setSubjects);
        }
    },[currentUser]);

    return (
        !loading ? <Formik 
        initialValues= {myInitialValues}
        onSubmit= {async (values,actions) => 
        {
            if(currentUser)
            {
                getQuestions(values.paperId,setShow,setMsg,setData,setSubjectDetails);
            }
        }}
        validationSchema = {Yup.object({
            paperId: Yup.string()
            .required("Subject is Required."),
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
                <div>
                    <div className="container-fluid">
                        <br/>
                        <ol className="breadcrumb mb-4">
                            Examination List View
                        </ol>
                        <div className="row animate__animated animate__pulse animate_slower">
                            <div className="col-lg-12">
                                <form id="studExamLogFRM" method="post" className="form-horizontal" onSubmit={handleSubmit}>
                                    <div className="card mb-4">
                                        <div className="card-header">
                                            <i className="fas fa-address-card mr-1"/>
                                            Report Filter
                                        </div>
                                        <div className="card-body">
                                                <div className="form-group">
                                                    <div className="col-lg-12 row">
                                                        <div className="col-lg-4">
                                                            Select Subject
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
                                                                :null
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

                                            {loading && (
                                                <div className="custom-loader"></div>
                                            )}
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="col-lg-12">
                                {
                                    data !== undefined ?
                                        <PreviewQuestionList questions={data} paper={subjectDetails}/>
                                    :null
                                }
                            </div>
                        </div>
                    </div>
                </div>
                );
            }
        }
        </Formik>
        :<div className="custom-loader"></div>
    );
};

async function getQuestions(paperId,setShow,setMsg,setQuestions,setSubjectDetails)
{
    await API.get('/myQuestions/byPaperId',{params:{"paperId":paperId}})
        .then((res) =>
        {
            if(res.data.status === 'success')
            {
                setQuestions(res.data.data);
                setSubjectDetails(res.data.paper);
            }
        }).catch((err) =>{
          
        });
}

async function getSubjects(currentUser, setShow, setMsg, setSubjectData)
{
    let params = {};
    if (currentUser.role === 'EADMIN') {
        params = { params: { "type": "byInstId", "instId": currentUser.username, "mode": '' } };
    }
    else if (currentUser.role === 'ADMIN' && currentUser.username !== 'admin') {
        params = { params: { "type": "byInstId", "instId": currentUser.inst_id, "mode": '' } };
    }
    else if (currentUser.role === 'ADMIN' && currentUser.username === 'admin') {
        params = { params: { "type": "all", "mode": '' } };
    }


    await API.get('/subject', params)
        .then((res) => {
            if (res.data.status === 'success') {
                setSubjectData(res.data.data);
            }
            else {
                setShow(true);
                setMsg('Problem Fetching Data from Server');
            }
        });
}
export default ExamListView;