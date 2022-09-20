import React, {useState,useEffect,useContext} from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import API from '../../../api';
import {ShowContext} from '../../../App';
import {UserContext} from '../../../App';
import ExamDashboard from './ExamDashboard';
import DateTimePicker from 'react-datetime-picker';

const ExamDashboardReport = (props) => {

    const [examDate, onExamDateChange]          = useState(new Date());
    const [myMsg, setMyMsg]                     = useState('');
    const [log,setLog]                          = useState(false);
    const [subjects,setSubjects]                = useState();
    const [loading, setLoading]                 = useState(false);
    const myInitialValues                       = { examDate: examDate, paperId: ''};
    const {setShow,setMsg}                      = useContext(ShowContext);
    const {currentUser }                        = useContext(UserContext);

    useEffect(()=>{
        getSubjects(setSubjects,examDate,setShow,setMsg);
    },[examDate]);

    return (
        currentUser ? <Formik 
        initialValues= {myInitialValues}
        onSubmit= {async (values,actions) => 
        {
            setLoading(true);
            await getDashboard(values,setLog,setShow,setMsg);
            setLoading(false);
        }}
        validationSchema = {Yup.object({
            examDate: Yup.string()
            .required("Examination Date is Required"),
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
                            <li className="breadcrumb-item active">Exam Dashboard</li>
                        </ol>
                        <div className="row animate__animated animate__pulse animate_slower">
                            <div className="col-lg-4">
                                <form id="studExamLogFRM" method="post" className="form-horizontal" onSubmit={handleSubmit}>
                                    <div className="card mb-4">
                                        <div className="card-header">
                                            <i className="fas fa-address-card mr-1"/>
                                            Examination Dashboard Report
                                        </div>
                                        <div className="card-body">
                                                <div className="form-group">
                                                    <div className="col-lg-12 row">
                                                        <div className="col-lg-4">
                                                            Date
                                                        </div>
                                                        <div className="col-lg-8">
                                                            <DateTimePicker onChange={onExamDateChange} value={examDate} id="examDate" name="examDate" className="form-control" format="yyyy-MM-dd"/>

                                                            {errors.examDate ? <div className="alert alert-info">{errors.examDate}</div> : null}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <div className="col-lg-12 row">
                                                        <div className="col-lg-4">
                                                            Subject
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
                            {
                            log.length > 0 ?
                            <ExamDashboard log={log}/> 
                            :
                            <div className="alert alert-danger col-lg-12">
                                No Data Found for given Filter...
                            </div>}
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

async function getDashboard(values,setLog,setShow,setMsg)
{
    let date    = values.examDate.toISOString().slice(0, 10);
    let subject = values.paperId;

    await API.get('/exam/report/countByDate',{params:{date:date,subject:subject}})
    .then((res) => 
    {
        if(res.data.status === 'success')
        {
            setLog(res.data.data);
        }
        else
        {
          setShow(true);
          setMsg('Problem Fetching Data from Server');
        }
    });   
}


async function getSubjects(setSubjects,date,setShow,setMsg)
{
    let date1 = date.toISOString().slice(0, 10);
    await API.get('/subject/byDate/'+date1)
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

export default ExamDashboardReport;