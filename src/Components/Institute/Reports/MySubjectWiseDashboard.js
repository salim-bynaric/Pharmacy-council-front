import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import API from "../../../api";
import Moment from "react-moment";
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import paginationFactory from "react-bootstrap-table2-paginator";
import { ShowContext, UserContext } from "../../../App";
import { Formik } from "formik";
import DateTimePicker from "react-datetime-picker";
import jsPDF from 'jspdf'
import 'jspdf-autotable'

function MySubjectWiseDashboard(props) {
  const [dateList, setDateList] = useState();
  const [subjects,setSubjects] = useState();
  const [studList,setStudList] = useState();
  const instName= props.history.location.state.data.college_name;
  const instCode = props.history.location.state.data.username;
  const day = props.history.location.state.data.day;
  const slot = props.history.location.state.data.slot;

  const myInitialValues = { date: day, slot: slot ,paperId:''};
  const { setShow, setMsg } = useContext(ShowContext);
  const { currentUser } = useContext(UserContext);
  const [reportData, setReportData] = useState();

  useEffect(() => {
    getExamDates(setDateList, setShow, setMsg);
  }, []);

  useEffect(async () => {
    if((day !== undefined || slot !== undefined) && currentUser)
    {
      await getSubjects(day,slot,setShow,setMsg,currentUser,setSubjects);
      await getStudentsSubjectWise(day,slot,'',setMsg,setShow,currentUser,setReportData);
    }
  },[day,slot,currentUser])

  const header = getHeader();
  let data = null;
  if (reportData !== undefined) 
  {
    data = getData(reportData,setStudList,setShow,setMsg);
  }
  
  return dateList !== undefined ? (
    <Formik
        initialValues={myInitialValues}
        onSubmit={async (values, actions) => 
        {
        await getStudentsSubjectWise(values.date,values.slot,values.paperId,setMsg,setShow,currentUser,setReportData);
        }}
    >
      {(props) => {
        const {
          values,
          touched,
          errors,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit,
        } = props;

        return (
          <div>
            <div className="container-fluid" style={{ marginTop: "10px" }}>
              <div
                className="col-lg-12 animate__animated animate__fadeInDown animate_slower"
                style={{ overflow: "auto" }}
              >
                <div className="card mb-4">
                  <div className="card-header">
                    <div className="col-lg-12 row">
                      <div className="col-lg-10">
                        <i className="fas fa-address-card mr-1" />
                        <b>Exam Dashboard with Subject List</b>
                      </div>
                      <div className="col-lg-2" style={{"float":"right","right":0}}>
                        <Link className="btn btn-sm btn-primary" to={{ pathname: "/myExamDashboard", state: {'day':day,'slot':slot}}}>Go Back</Link>
                      </div>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="card-body row">
                      <div className="form-group col-lg-4">
                        <div className="col-lg-12 column">
                          <div className="col-lg-12">
                            <b>Date</b>
                          </div>
                          <div className="col-lg-12">
                            <select
                              id="date"
                              name="date"
                              className="form-control"
                              onChange={async (e) => {
                                handleChange(e);
                                await getSubjects(e.target.value,values.slot,setShow,setMsg,currentUser,setSubjects);
                                handleSubmit(e);
                              }}
                              value={values.date}
                            >
                              <option value="">Select Date</option>
                              {dateList.map((date, index) => {
                                return (
                                  <option value={date.day} key={index}>
                                    {date.date}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="form-group col-lg-4">
                        <div className="col-lg-12 column">
                          <div className="col-lg-12">
                            <b>Slot</b>
                          </div>
                          <div className="col-lg-12">
                            <select
                              id="slot"
                              name="slot"
                              className="form-control"
                              onChange={async (e) => {
                                handleChange(e);
                                await getSubjects(values.date,e.target.value,setShow,setMsg,currentUser,setSubjects);
                                handleSubmit(e);
                              }}
                              onBlur={handleBlur}
                              value={values.slot}
                            >
                              <option value="all">Select Slot</option>
                              <option value="1">Slot 1</option>
                              <option value="2">Slot 2</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="form-group col-lg-4">
                        <div className="col-lg-12 column">
                          <div className="col-lg-12">
                            <b>Subject</b>
                          </div>
                          <div className="col-lg-12">
                            <select
                              id="paperId"
                              name="paperId"
                              className="form-control"
                              onChange={(e) => {
                                handleChange(e);
                                handleSubmit(e);
                              }}
                              onBlur={handleBlur}
                              value={values.paperId}
                            >
                              <option value="">Select Subject</option>
                              {subjects && subjects.map((subject, index) => {
                                return (
                                  <option value={subject.id} key={index}>
                                    {subject.paper_code}-{subject.paper_name}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="card mb-4">
                            <div className="card-body row">
                                {
                                    reportData !== undefined ?
                                    <div className="fixTableHead scroll1" style={{ maxHeight: "600px", overflow: "auto"}}>
                                        <BootstrapTable keyField='srno' data={ data } columns={ header } filter={ filterFactory()}/>
                                    </div>
                                    :null
                                }
                            </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        );
      }}
    </Formik>
  ) : null;
}


function getData(datas,setStudList,setShow,setMsg) 
{
  let myData = [];
  let i = 1;
  let totalStud = 0;
  let totalInprogress = 0;
  let totalOver = 0;
  let totalNotStarted = 0;

  datas.map((data, index) => 
  {
        totalStud += parseInt(data.totalStudents);
        totalInprogress += parseInt(data.inprogress);
        totalOver += parseInt(data.over);
        totalNotStarted += parseInt(data.notStarted);

        myData.push({
        srno        : i++,
        instCode    : data.inst.username,
        instName    : data.inst.college_name,
        paperCode   : data.subject.paper_code,
        paperName   : data.subject.paper_name,
        totStud     : <Link onClick={() => {
          printPdf(data.day,data.slot,data.subject.id,setStudList,setShow,setMsg);
        }}>{data.totalStudents}</Link>,
        inprogress  : data.inprogress,
        over        : data.over,
        notStarted  : data.notStarted
        });
  });

  myData.push({
    srno        : 'Total Count',
    instCode    : '',
    instName    : '',
    paperCode   : '',
    paperName   : '',
    totStud     : totalStud,
    inprogress  : totalInprogress,
    over        : totalOver,
    notStarted  : totalNotStarted
  });

  return myData;
}

async function printPdf(day,slot,paperId,setStudList,setShow,setMsg)
{
  API.get("/report/getSubjectWiseStudentsDetails",{params:{'day':day,'slot':slot,'paperId':paperId}})
    .then(function (res) 
    {
      if(res.data.status === 'success')
      {
        let instName = '';
        setStudList(res.data.data);
        
        if(res.data.data.length > 0)
        {
          let myData = [];
          let i = 1;
          res.data.data.map((data, index) => 
          {
            instName = data.inst.college_name;
            let startedon = (data.entry_on !== '' && data.entry_on !== undefined && data.entry_on !== null) ? new Date(data.entry_on).toLocaleDateString()+' '+new Date(data.entry_on).toLocaleTimeString() : '';
        
            let endon = (data.end_on !== '' && data.end_on !== undefined && data.end_on !== null) ? new Date(data.end_on).toLocaleDateString()+' '+new Date(data.end_on).toLocaleTimeString() : '';

            myData.push(
              [i++,data.student.username,data.student.name,data.inst.username,data.inst.college_name,data.subject.paper_code,data.subject.paper_name,data.status,data.examip,startedon,endon]
            );
          });

          const doc = new jsPDF('landscape','mm','a4');
          let pageHeight= doc.internal.pageSize.height;
          doc.text("Subject Wise Exam Student List", 120, 7);
          doc.setFontSize(9);
          doc.text('Institute: '+instName, 15, 17);
          doc.autoTable({
              head: [['Sr.No.', 'Enrollment No', 'Student Name','Inst Code','Inst Name','Subject Code','Subject Name','Exam Status','IP','Exam Start','Exam End']],
              body: myData,
              startY : 20,
          });

          let finalY = doc.lastAutoTable.finalY+50;
          if (finalY >= pageHeight)
          {
              doc.addPage();
              finalY = 30;
          }
          doc.setFontSize(12);
          doc.text(10, finalY, 'Date: '+new Date().toLocaleString());
          doc.text(150, finalY, 'Signature of Authority');
            
          doc.save('Subject Wise Exam Student List.pdf');
        }
      }
    })
    .catch(function (error) 
    {
      setShow(true);
      setMsg('Error Fetching Student Data...');
    });
}



function getHeader() {
  let myHeader = [
    { text: "Sr No", dataField: "srno" },
    { text: "Institute Code ", dataField: "instCode", filter: textFilter()},
    { text: "Institute Name", dataField: "instName" },
    { text: "Paper Code", dataField: "paperCode" },
    { text: "Paper Name", dataField: "paperName" },
    { text: "Total Students", dataField: "totStud" },
    { text: "Inprogress Students", dataField: "inprogress", style: { backgroundColor: 'yellow' }},
    { text: "Total Exam End", dataField: "over",style: { backgroundColor: '#90ee90' }},
    { text: "Total Not Started", dataField: "notStarted",style: { backgroundColor: 'red' } },
  ];
  return myHeader;
}

async function getStudentsSubjectWise(day,slot,paperId,setMsg,setShow,currentUser,setReportData)
{
    API.get("/report/getSubjectWiseStudents",{params:{'day':day,'slot':slot,'paperId':paperId}})
    .then(function (res) {
      setReportData(res.data.data);
    })
    .catch(function (error) {
      setReportData(error.response.data.data);
    });
}

async function getSubjects(day,slot,setShow,setMsg,currentUser,setSubjects)
{
    API.get("/subject",{params:{'type':'byDaySlot','day':day,'slot':slot,'instId':currentUser.inst_id}})
    .then(function (res) {
      setSubjects(res.data.data);
    })
    .catch(function (error) {
      setShow(true);
      setMsg("Problem Gettting Exam Dates");
    });
}

function getExamDates(setDateList, setShow, setMsg) {
  API.get("/report/getExamDates")
    .then(function (res) {
      setDateList(res.data.data);
    })
    .catch(function (error) {
      setShow(true);
      setMsg("Problem Gettting Exam Dates");
    });
}

export default MySubjectWiseDashboard;
