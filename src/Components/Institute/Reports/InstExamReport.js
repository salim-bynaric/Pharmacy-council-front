import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import API from '../../../api';
import Moment from 'react-moment';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import {ShowContext} from '../../../App';
import { Formik } from 'formik';
import DateTimePicker from 'react-datetime-picker';


const rowStyle = (row, rowIndex) => 
{
    if(row.srno === '')
    {
        return { backgroundColor: 'aqua'};
    }
};

function InstExamReport(props)
{
    const ref                           =   React.useRef();
    const [examDate, onExamDateChange]              =   useState(props.location !== undefined && props.location.state !== undefined && props.location.state !== null ? new Date(props.location.state.date):new Date());
    const {setShow,setMsg}                          =   useContext(ShowContext);
    const [allData, setAllData]                     =   useState([]);
    let [loading, setLoading]                       =   useState(true);
    const header                                    =   getHeader();
    const data                                      =   getData(allData,props);
    const myInitialValues                           =   { examDate: examDate, slot:'', paperId: ''};
    const [subjects,setSubjects]                    =   useState();

    const options = {
        sizePerPageList: [
            {
                text: '50', value: 50
            },
            {
                text: '500', value: 500
            }, 
            {
                text: '1000', value: 1000
            }, 
            {
                text: '10000', value: 10000
            }
        ]
    };
   
    useEffect(() => 
    {
        getExamData(setAllData,setLoading,setShow,setMsg,props);
        getSubjects(setSubjects,examDate,setShow,setMsg,props);
    },[examDate,props.instId]);

    useEffect(() => {
        // if user is comming from dashboard report then automatic clicking of submit button----------
        if(props.location !== undefined && props.location.state !== undefined && props.location.state !== null)
        {
            ref.current.click();
        }
    },[props.location])

    return (
        <Formik 
        initialValues= {myInitialValues}
        onSubmit= {async (values,actions) => 
        { 
            getExamDatewise(values,setAllData,setLoading,setShow,setMsg,props,examDate);
        }}
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
                            <div className="container-fluid" style={{"marginTop":"10px"}}>
                                {(props.role==='' || props.role===undefined) &&(<ol className="breadcrumb mb-4">
                                    <li className="breadcrumb-item active">Institute Examination Report</li>
                                </ol>)}<br/>
                                <div className="col-lg-12 animate__animated animate__fadeInDown animate_slower" style={{overflow:"auto"}}>
                                <div className="card mb-4">
                                    <div className="card-header">
                                        <i className="fas fa-address-card mr-1"/>
                                            Filter for Exam Dashboard
                                    </div>
                                    <form onSubmit={handleSubmit}>
                                    <div className="card-body row">
                                        <div className="form-group col-lg-4">
                                            <div className="col-lg-12 row">
                                                <div className="col-lg-4">
                                                    Date
                                                </div>
                                                <div className="col-lg-8">
                                                    <DateTimePicker onChange={onExamDateChange} value={examDate} id="examDate" name="examDate" className="form-control" format="yyyy-MM-dd"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group col-lg-4">
                                            <div className="col-lg-12 row">
                                                <div className="col-lg-4">
                                                    Slot
                                                </div>
                                                <div className="col-lg-8">
                                                    <select id="slot" name="slot" className="form-control" onChange={handleChange} onBlur={handleBlur} value={values.slot}>
                                                        <option value="all">Select Slot</option>
                                                        <option value="1">Slot 1</option>
                                                        <option value="2">Slot 2</option>
                                                        <option value="3">Slot 3</option>
                                                        <option value="4">Slot 4</option>
                                                        <option value="5">Slot 5</option>
                                                        <option value="6">Slot 6</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group col-lg-4">
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
                                                        :null}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-footer">
                                        <center>
                                            <button className="btn btn-sm btn-primary" type="submit" id="submit" disabled={isSubmitting} ref={ref}>Submit</button>
                                        </center>
                                    </div>
                                    </form>
                                </div>
                                {allData && allData.length > 0 ?
                                <BootstrapTable keyField='srno' data={ data } columns={ header } filter={ filterFactory() } pagination={ paginationFactory(options) } rowStyle={ rowStyle }/>
                                :
                                <div className="alert alert-danger">
                                    No Data Found for your Applied Filter.
                                </div>}
                                </div>
                            </div>
                        </div>
                );
            }
        }
        </Formik>
    );
}

function getHeader()
{
    let myHeader = [
        { text: 'Sr No', dataField: 'srno'},
        { text: 'Date & Start Time', dataField: 'datenstarttime'},
        { text: 'Code', dataField: 'code',filter: textFilter()},
        { text: 'Subject Name', dataField: 'subjectname'},
        { text: 'Marks', dataField: 'marks'},
        { text: 'Total Q\'s', dataField: 'totquestions'},
        { text: 'Duration', dataField: 'duration'},
        { text: 'Total Students', dataField: 'totstud'},
        { text: 'Total End', dataField: 'totend'},
        { text: 'Total Inprogress', dataField: 'totinprogress'},
        { text: 'Total Not Attend', dataField: 'totnotattend',filter: textFilter(),sort:true},
        { text: 'View Not Attend', dataField: 'viewnotattend'},
    ];
    return myHeader;
}

function getData(allData,props)
{
    let myData              = [];
    let i                   = 1;
    let paper_name          = '';
    let totalStud           = 0;
    let totalEnd            = 0;
    let totalInProgress     = 0;
    let totalNotAttend      = 0;

        allData.map((data, index) => 
        {
            totalStud           =   totalStud + data.allStudents;
            totalEnd            =   totalEnd + data.overStudents;
            totalInProgress     =   totalInProgress + data.inprogressStudents;
            totalNotAttend      =   totalNotAttend + data.unattendStudents;


            if(allData[index] && Object.keys(allData[index]).length === 0 && allData[index].constructor === Object)
            {
                paper_name = data.paper_name;
            }
            else
            {
                //paper_name = data.paper_name;
                paper_name= <Link to={{pathname: '/instructions',state: {exam:data.exam,role:'ADMIN'}}}>{data.paper_name}</Link> ;
            }
            myData.push({
                srno                    : i++,
                datenstarttime          : <Moment format="YYYY-MM-DD H:mm:ss">{data.from_date}</Moment>,
                code                    : data.paper_code,
                subjectname             : paper_name,
                marks                   : data.marks,
                totquestions            : data.questions,
                duration                : data.duration,
                totstud                 : <Link to={{pathname: "/instexamstudentreport", state:{data:allData,paper_id:data.id,type:'all',paper_code:data.paper_code,instId:props.instId}}}>{data.allStudents}</Link>,

                totend                  : <>
                                            <Link to={{pathname: "/instexamstudentreport", state:{data:allData,paper_id:data.id,type:'over',paper_code:data.paper_code}}}>{data.overStudents}</Link>
                                            <br/>
                                            {data.exam.paper !==  undefined && data.exam.paper.singleFileUpload !== null && data.singleFile!== null && data.singleFile !== 0 ?
                                                <div className="alert alert-primary" role="alert">Answer Upload Count:{data.singleFile}</div>
                                            :null}
                                        </>,

                totinprogress           : <Link to={{pathname: "/instexamstudentreport", state:{data:allData,paper_id:data.id,type:'inprogress',paper_code:data.paper_code}}}> {data.inprogressStudents}</Link>,
                totnotattend            : data.unattendStudents,
                viewnotattend           : <Link to={{pathname: "/instexamstudentreport", state:{data:allData,paper_id:data.id,type:'notattend',paper_code:data.paper_code}}}>{data.unattendStudents}</Link>
            })   
        });

        myData.push({
            srno                    : 'Total',
            datenstarttime          : '',
            code                    : '',
            subjectname             : '',
            marks                   : '',
            totquestions            : '',
            duration                : '',
            totstud                 : totalStud,
            totend                  : totalEnd,
            totinprogress           : totalInProgress,
            totnotattend            : totalNotAttend,
            viewnotattend           : totalNotAttend
        });

    return myData;
}

async function getExamDatewise(values,setAllData,setLoading,setShow,setMsg,props,examDate)
{
    let res         = [];
    examDate        = (examDate !== '' && examDate) ? examDate.toISOString().slice(0, 10) : 'all';
    let slot        = values.slot ? values.slot : 'all';
    let paperId     = values.paperId !== '' ? values.paperId : 'all';

    let instId = props.location !== undefined && props.location.state !== undefined && props.location.state !== null ? props.location.state.instId : props.instId;

    let role = props.location !== undefined && props.location.state !== undefined && props.location.state !== null ? props.location.state.role : props.role;

    if(role==='ADMIN')
    {
        if(instId === '')
        {
            setMsg('Please Select Institute to get its report...');
            setShow(true);
            setAllData([]);
        }
        //----------fetch exam report from institute id----------------------------------------
        res = await API.get('exam/report/countDatewise/'+examDate+'/'+paperId+'/'+slot,{params:{"instId":instId}});
        //----------------------------------------------------------------------------------
    }
    else
    {
        res = await API.get('exam/report/countDatewise/'+examDate+'/'+paperId+'/'+slot);
    }
        if(res.data.status==='success')
        {
            if(res.data.data !== undefined)
            {
                setAllData(res.data.data);
                setLoading(false);
            }
            else
            {
                setAllData([]);
                setShow(true);
                setMsg('No Program Data found for this Institute.Please Add data or Configure it Properly...');
                setLoading(false);
            }
        }
        else
        {
            setAllData([]);
            setShow(true);
            setMsg('Problem fetching data from Server...');
            setLoading(false);
        }
        setLoading(false);
}

async function getExamData(setAllData,setLoading,setShow,setMsg,props)
{
    let res         = []; 
    let instId = props.location !== undefined && props.location.state !== undefined && props.location.state !== null ? props.location.state.instId : props.instId;
    let role = props.location !== undefined && props.location.state !== undefined && props.location.state !== null ? props.location.state.role : props.role;

    if(role==='ADMIN')
    {
        if(instId === '')
        {
            setMsg('Please Select Institute to get its report...');
            setShow(true);
            setAllData([]);
        }
        //----------fetch exam report from institute id-------------------------------------
        res = await API.get('exam/report/count',{params:{"type":"instwise",instId:instId}});
        //----------------------------------------------------------------------------------
    }
    else
    {
        res = await API.get('exam/report/count');
    }
        if(res.data.status==='success')
        {
            if(res.data.data !== undefined)
            {
                setAllData(res.data.data);
                setLoading(false);
            }
            else
            {
                setAllData([]);
                setShow(true);
                setMsg('No Program Data found for this Institute.Please Add data or Configure it Properly...');
                setLoading(false);
            }
        }
        else
        {
            setAllData([]);
            setShow(true);
            setMsg('Problem fetching data from Server...');
            setLoading(false);
        }
        setLoading(false);
}

async function getSubjects(setSubjects,date,setShow,setMsg,props)
{
    let date1 = date ? date.toISOString().slice(0, 10) : '';
    let instId = props.location !== undefined && props.location.state !== undefined && props.location.state !== null ? props.location.state.instId : props.instId;
    let role = props.location !== undefined && props.location.state !== undefined && props.location.state !== null ? props.location.state.role : props.role;

    if(role==='ADMIN')
    {
        await API.get('/subject/byDateInst/'+date1+'/'+instId)
        .then((res) => 
        {
            if(res.data.status === 'success')
            {
            setSubjects(res.data.data);
            }
            else
            {
            
            }
        });   
    }
    else
    {
        await API.get('/subject/byDate/'+date1)
        .then((res) => 
        {
            if(res.data.status === 'success')
            {
            setSubjects(res.data.data);
            }
            else
            {
            
            }
        });   
    }
}


export default InstExamReport;
