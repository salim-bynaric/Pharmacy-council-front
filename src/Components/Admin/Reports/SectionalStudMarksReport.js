import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import API from '../../../api';
import Moment from 'react-moment';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import {ShowContext,UserContext,userContext} from '../../../App';
import { Formik } from 'formik';
import DateTimePicker from 'react-datetime-picker';
import { Markup } from 'interweave';


const rowStyle = (row, rowIndex) => 
{
    if(row.srno === '')
    {
        return { backgroundColor: 'aqua'};
    }
};

function SectionalStudMarksReport(props)
{
    const ref                                       =   React.useRef();
    const [examDate, onExamDateChange]              =   useState(props.location !== undefined && props.location.state !== undefined && props.location.state !== null ? new Date(props.location.state.date):new Date());
    const {setShow,setMsg}                          =   useContext(ShowContext);
    const {currentUser}                             =   useContext(UserContext);
    const [allData, setAllData]                     =   useState([]);
    let [loading, setLoading]                       =   useState(true);
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
        getSubjects(setSubjects,examDate,setShow,setMsg,props);
    },[examDate,props.instId]);

    let header = null;
    let data = null;

    if(allData !== undefined)
    {
        header = getHeader();
        data = getData(allData);
    }

    return (
        <Formik 
        initialValues= {myInitialValues}
        onSubmit= {async (values,actions) => 
        { 
            getExamResult(values,examDate,setAllData,setShow,setMsg,currentUser);
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
                                {
                                    allData !== undefined ?
                                        <BootstrapTable keyField='srno' data={ data } columns={ header } filter={ filterFactory() } pagination={ paginationFactory(options) }/>
                                    :null
                                }
                                </div>
                            </div>
                        </div>
                );
            }
        }
        </Formik>
    );
}

function getData(allData)
{
    let myData = [];
    let i = 1;

    allData.map((data, index) => 
    {
        myData.push({
            srno                    : i++,
            enrollno                : data.enrollno,
            studname                : data.name,
            marks                   : <Markup content={data.marks} />
        });
    })

    return myData;
}

function getHeader()
{
    let myHeader = [
        { text: 'Sr No', dataField: 'srno'},
        { text: 'Enroll No', dataField: 'enrollno'},
        { text: 'Student Name', dataField: 'studname'},
        { text: 'Marks', dataField: 'marks'},
    ];
    return myHeader;
}

async function getExamResult(values,date,setAllData,setShow,setMsg,currentUser)
{
    let date1 = date ? date.toISOString().slice(0, 10) : '';
    let slot = values.slot;
    let paperId = values.paperId;
    let instId = currentUser.inst_id;

    await API.get('/subject/result/'+date1+'/'+paperId+'/'+instId)
        .then((res) => 
        {
            if(res.data.status === 'success')
            {
                setAllData(getDataInFormat(res.data.data,res.data.type));
            }
        })
        .catch((error) => {
            setShow(true);
            setMsg('Problem Fetching Data from Server');
        });
}

function getDataInFormat(data,type)
{
    let myData = [];
    let i = 1;

    data.map((dat, index) => 
    {
        myData.push({
            srno                    : i++,
            enrollno                : dat.student.username,
            name                    : dat.student.name,
            type                    : type,
            marks                   : getMarksList(dat.answers,type),
        });
    });

    return myData;
}

function getMarksList(answers,type)
{
    if(type === 'sectional')
    {
        let sections = [];
        let sectionMarks = [];
        let totalMarks = 0;
        //---------------------Get distinct sections----------------------------------------------
        answers.forEach((data) => {
            sections.push(data.section);
        });
        sections = [...new Set(sections)];
        //----------------------------------------------------------------------------------------
        //--------------------------Get Marks Section Wise----------------------------------------
        sections.forEach((section) => {
            sectionMarks.push(getSectionWiseMarks(section,answers));
        })
        //-----------------------------------------------------------------------------------------
        //--------------------------Get Marks Section Wise----------------------------------------
        answers.forEach((row) => {
            if(row.stdanswer == row.cans)
            {
                totalMarks = totalMarks + row.marks;
            }
        })
        //-----------------------------------------------------------------------------------------
        return sectionMarks.toString().replace(/,/g, '<br/>')+'<br/><b>TotalMarks:</b> '+totalMarks;

    }
    else
    {
        let totalMarks = 0;
        //--------------------------Get Total Marks----------------------------------------
        answers.forEach((row) => {
            if(row.stdanswer == row.cans)
            {
                totalMarks = totalMarks + row.marks;
            }
        });
        //----------------------------------------------------------------------------------
        return ''+totalMarks+'';
    }
}

function getSectionWiseMarks(section,answers)
{
    let marks = 0;
    let totMarks = 0;
    answers.forEach((row) => {
        if(row.section == section)
        {
            if(row.stdanswer === row.cans)
            {
                marks = marks + row.marks;
            }
        }
    });

    return '<b>'+section+':</b> '+marks;
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


export default SectionalStudMarksReport;
