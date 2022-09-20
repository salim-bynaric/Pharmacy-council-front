import React, { useState, useEffect, useContext } from "react";
import API from "../../../api";
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import paginationFactory from "react-bootstrap-table2-paginator";
import { ShowContext } from "../../../App";
import { Formik } from "formik";
import DateTimePicker from "react-datetime-picker";

const rowStyle = (row, rowIndex) => {
  if (row.srno === "") {
    return { backgroundColor: "aqua" };
  }
};

function StudQuestCountMismatchReport(props) {
  const ref = React.useRef();
  const [examDate, onExamDateChange] = useState(
    props.location !== undefined &&
      props.location.state !== undefined &&
      props.location.state !== null
      ? new Date(props.location.state.date)
      : new Date()
  );
  const { setShow, setMsg } = useContext(ShowContext);
  const [allData, setAllData] = useState([]);
  let [loading, setLoading] = useState(true);
  const header = getHeader();
  const data = getData(allData, props);
  const myInitialValues = { examDate: examDate, slot: "" };

  const options = {
    sizePerPageList: [
      {
        text: "50",
        value: 50,
      },
      {
        text: "500",
        value: 500,
      },
      {
        text: "1000",
        value: 1000,
      },
      {
        text: "10000",
        value: 10000,
      },
    ],
  };

  return (
    <Formik
      initialValues={myInitialValues}
      onSubmit={async (values, actions) => {
        getMismatchReport(values, setShow, setMsg, examDate, setAllData);
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
              {(props.role === "" || props.role === undefined) && (
                <ol className="breadcrumb mb-4">
                  <li className="breadcrumb-item active">
                    Student Question Count Mismatch Report
                  </li>
                </ol>
              )}
              <br />
              <div
                className="col-lg-12 animate__animated animate__fadeInDown animate_slower"
                style={{ overflow: "auto" }}
              >
                <div className="card mb-4">
                  <div className="card-header">
                    <i className="fas fa-address-card mr-1" />
                    Select Proper Filter
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="card-body row">
                      <div className="form-group col-lg-6">
                        <div className="col-lg-12 row">
                          <div className="col-lg-4">Date</div>
                          <div className="col-lg-8">
                            <DateTimePicker
                              onChange={onExamDateChange}
                              value={examDate}
                              id="examDate"
                              name="examDate"
                              className="form-control"
                              format="yyyy-MM-dd"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="form-group col-lg-6">
                        <div className="col-lg-12 row">
                          <div className="col-lg-4">Slot</div>
                          <div className="col-lg-8">
                            <select
                              id="slot"
                              name="slot"
                              className="form-control"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.slot}
                            >
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
                    </div>
                    <div className="card-footer">
                      <center>
                        <button
                          className="btn btn-sm btn-primary"
                          type="submit"
                          id="submit"
                          disabled={isSubmitting}
                          ref={ref}
                        >
                          Submit
                        </button>
                      </center>
                    </div>
                  </form>
                </div>
                {allData && allData.length > 0 ? (
                  <BootstrapTable
                    keyField="srno"
                    data={data}
                    columns={header}
                    filter={filterFactory()}
                    pagination={paginationFactory(options)}
                    rowStyle={rowStyle}
                  />
                ) : null}
              </div>
            </div>
          </div>
        );
      }}
    </Formik>
  );
}

async function getMismatchReport(
  values,
  setShow,
  setMsg,
  examDate,
  setAllData
) {
  examDate =
    examDate !== "" && examDate ? examDate.toISOString().slice(0, 10) : "";
  if (examDate === "") {
    setShow(true);
    setMsg("Please Select Date...");
  }

  await API.get("/report/studQuestCountMismatchReport", {
    params: { date: examDate, slot: values.slot },
  })
    .then((res) => {
      if (res.data.status === "success") {
        setAllData(res.data.data);
      }
    })
    .catch(function (error) {
      setShow(true);
      setMsg(error.response.data.message);
    });
}

function getHeader() {
  let myHeader = [
    { text: "Sr No", dataField: "srno" },
    { text: "Student", dataField: "student" },
    { text: "Subject", dataField: "subject" },
    { text: "Total Questions", dataField: "totquest" },
    { text: "Count Mismatch", dataField: "actquest" },
  ];
  return myHeader;
}

function getData(allData, props) 
{
    let myData = [];
    let i = 1;
    if(allData !== undefined && allData.length > 0)
    {
        allData.map((data, index) => 
        {
            myData.push({
            srno: i++,
            student: data.student.username+'-'+data.student.name,
            subject: data.subject.paper_code+'--'+data.subject.paper_name,
            totquest:data.subject.questions,
            actquest: data.count
            });
        });
    }
    return myData;
}

export default StudQuestCountMismatchReport;
