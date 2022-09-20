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

function MyExamDashboard(props) {
  const [dateList, setDateList] = useState();
  const day = props.history.location.state ? props.history.location.state.day : '';
  const slot = props.history.location.state ? props.history.location.state.slot : '';
  const myInitialValues = { date: day, slot: slot };
  const { setShow, setMsg } = useContext(ShowContext);
  const { currentUser } = useContext(UserContext);
  const [reportData, setReportData] = useState();

  useEffect(() => {
    getExamDates(setDateList, setShow, setMsg);
  }, []);

  useEffect(() => {
    if(props.history.location.state)
    {
      getReport(day,slot, setReportData, setShow, setMsg);
    }
  },[props.history.location.state]);

  const header = getHeader();
  let data = null;
  if (reportData !== undefined) {
    data = getData(reportData);
  }

  return dateList !== undefined ? (
    <Formik
      initialValues={myInitialValues}
      onSubmit={async (values, actions) => {
        getReport(values.date,values.slot, setReportData, setShow, setMsg);
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
              <div className="mt-4"></div>
              <ol className="breadcrumb mb-4">
                  <li className="breadcrumb-item active">Exam Dashboard</li>
              </ol>
              <div
                className="col-lg-12 animate__animated animate__fadeInDown animate_slower"
                style={{ overflow: "auto" }}
              >
                <div className="card mb-4">
                  <div className="card-header">
                    <i className="fas fa-address-card mr-1" />
                    <b>Filter for Exam Dashboard</b>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="card-body row">
                      <div className="form-group col-lg-6">
                        <div className="col-lg-12 row">
                          <div className="col-lg-4">
                            <b>Date</b>
                          </div>
                          <div className="col-lg-8">
                            <select
                              id="date"
                              name="date"
                              className="form-control"
                              onChange={(e) => {
                                handleChange(e);
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
                      <div className="form-group col-lg-6">
                        <div className="col-lg-12 row">
                          <div className="col-lg-4">
                            <b>Slot</b>
                          </div>
                          <div className="col-lg-8">
                            <select
                              id="slot"
                              name="slot"
                              className="form-control"
                              onChange={(e) => {
                                handleChange(e);
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

function getData(datas) 
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
        totalInprogress += parseInt(data.inprogressStudents);
        totalOver += parseInt(data.overStudents);
        totalNotStarted += parseInt(data.notStarted);

        myData.push({
        srno: i++,
        instCode: data.username,
        instName: data.college_name,
        totStud: <Link to={{ pathname: "/mySubjectWiseDashboard", state: {'data':data,'day':data.day,'slot':data.slot,'inst':data.username,'uid':data.uid}}}>{data.totalStudents}</Link>,
        inprogress:data.inprogressStudents,
        over:data.overStudents,
        notStarted:<Link>{data.notStarted}</Link>
        });
  });

  myData.push({
    srno: 'Total Count',
    instCode: '',
    instName: '',
    totStud: totalStud,
    inprogress:totalInprogress,
    over:totalOver,
    notStarted:totalNotStarted
    });

  return myData;
}

function getHeader() {
  let myHeader = [
    { text: "Sr No", dataField: "srno" },
    { text: "Institute Code ", dataField: "instCode", filter: textFilter()  },
    { text: "Institute Name", dataField: "instName" },
    { text: "Total Students", dataField: "totStud" },
    { text: "Inprogress Students", dataField: "inprogress", style: { backgroundColor: 'yellow' }},
    { text: "Total Exam End", dataField: "over",style: { backgroundColor: '#90ee90' }},
    { text: "Total Not Started", dataField: "notStarted",style: { backgroundColor: 'red' } },
  ];
  return myHeader;
}

function getReport(date,slot, setReportData, setShow, setMsg) {
  API.get("/report/getDashBoardReport", {
    params: { day: date, slot: slot },
  })
    .then(function (res) {
      setReportData(res.data.data);
    })
    .catch(function (error) {
      setShow(true);
      setMsg("Problem Gettting Report Data");
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

export default MyExamDashboard;
