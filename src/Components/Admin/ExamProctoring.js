import React, { useState, useEffect, useContext } from "react";
import API from "../../api";
import { useHistory } from "react-router-dom";
import { ShowContext, UserContext, ProctorViewContext } from "../../App";
import { Formik } from "formik";
import * as Yup from "yup";

function ExamProctoring(props) {
  const { currentUser } = useContext(UserContext);
  const { setShow, setMsg } = useContext(ShowContext);
  let myInitialValues = {};
  const [instList, setInstList] = useState();
  const [examDate, setExamDate] = useState();
  const [proctorList, setProctorList] = useState();
  const { setProctorView } = useContext(ProctorViewContext);
  const [proctorData, setProctorData] = useState([]);
  const [dateStr, setDateStr] = useState();

  let history = useHistory();

  useEffect(() => {
    if (currentUser && (currentUser.role === "CADMIN" || currentUser.role === 'ADMIN')) {
      getInstitutes(setInstList, currentUser.uid, currentUser, setShow, setMsg);
    } else if (currentUser && currentUser.role === "EADMIN") {
      setInstList([
        {
          username: currentUser.username,
          college_name: currentUser.college_name,
        },
      ]);
    }
  }, [currentUser]);

  if (currentUser) {
    if (currentUser.role === "EADMIN") {
      myInitialValues = {
        inst: "",
        date: "",
        slot: "",
        proctor: "",
      };
    }
  }

  return currentUser ? (
    <Formik
      initialValues={myInitialValues}
      onSubmit={async (values, actions) => {}}
      validationSchema={Yup.object().shape({
        inst: Yup.string().required("Institute Code is Required..."),
        date: Yup.number().required("Date is Required..."),
        slot: Yup.number().required("Slot is Required..."),
        proctor: Yup.string().required("Proctor is Required..."),
      })}
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

        return currentUser ? (
          <div>
            <div className="container-fluid">
                <br/>
              <ol className="breadcrumb mb-4">
                <li className="breadcrumb-item active">
                  Exam Proctoring
                </li>
              </ol>
              <div className="col-lg-12 animate__animated animate__fadeInDown animate_slower">
                <div className="card mb-4">
                  <div className="card-header">
                    <b>Exam Proctoring</b>
                  </div>
                  <div className="card-body col-lg-12">
                    <div className="col-lg-12">
                      <div className="form-group">
                        <div className="col-lg-12 row">
                          <div className="col-lg-3 column">
                            <div className="col-lg-12">
                              <b>Institute</b>
                            </div>
                            <div className="col-lg-10">
                              <select
                                id="inst"
                                name="inst"
                                className="form-control"
                                onChange={(e) =>{handleChange(e);
                                    getExamDates(setExamDate, setShow, setMsg, e.target.value);
                                }}
                                onBlur={handleBlur}
                                value={values.inst}
                                disabled={
                                  currentUser.role === "INSTITUTE"
                                    ? true
                                    : false
                                }
                              >
                                <option value="">Select Institute</option>
                                {instList &&
                                  instList.map((inst) => (
                                    <option
                                      key={inst.username}
                                      value={inst.username}
                                    >
                                      {inst.username}-{inst.college_name}
                                    </option>
                                  ))}
                              </select>

                              {errors.inst ? (
                                <div className="alert alert-info">
                                  {errors.inst}
                                </div>
                              ) : null}
                            </div>
                          </div>

                          <div className="col-lg-3 column">
                            <div className="col-lg-12">
                              <b>Date</b>
                            </div>
                            <div className="col-lg-10">
                              <select
                                id="date"
                                name="date"
                                className="form-control"
                                onChange={(e) => {
                                  handleChange(e);
                                  setDateStr(
                                    e.target.options[e.target.selectedIndex]
                                      .text
                                  );
                                }}
                                onBlur={handleBlur}
                                value={values.date}
                              >
                                <option value="">Select Date</option>
                                {examDate !== undefined
                                  ? examDate.map((date, index) => {
                                      return (
                                        <option value={date.day} key={index}>
                                          {date.dates}
                                        </option>
                                      );
                                    })
                                  : null}
                              </select>

                              {errors.date ? (
                                <div className="alert alert-info">
                                  {errors.date}
                                </div>
                              ) : null}
                            </div>
                          </div>
                          <div className="col-lg-3 column">
                            <div className="col-lg-12">
                              <b>Date</b>
                            </div>
                            <div className="col-lg-10">
                              <select
                                id="slot"
                                name="slot"
                                className="form-control"
                                onChange={(e) => {
                                  handleChange(e);
                                  getProctorList(
                                    values.inst,
                                    values.date,
                                    e.target.value,
                                    setProctorList,
                                    setShow,
                                    setMsg,
                                    currentUser
                                  );
                                }}
                                onBlur={handleBlur}
                                value={values.slot}
                              >
                                <option value="">Select Slot</option>
                                <option value="1">Slot 1</option>
                                <option value="2">Slot 2</option>
                              </select>

                              {errors.slot ? (
                                <div className="alert alert-info">
                                  {errors.slot}
                                </div>
                              ) : null}
                            </div>
                          </div>

                          <div className="col-lg-3 column">
                            <div className="col-lg-12">
                              <b>Proctor List</b>
                            </div>
                            <div className="col-lg-10">
                              <select
                                id="proctor"
                                name="proctor"
                                className="form-control"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.proctor}
                              >
                                <option value="">Select Proctor</option>
                                {proctorList !== undefined
                                  ? proctorList.map((proctor, index) => {
                                      return (
                                        <option value={proctor.uid} key={index}>
                                          {proctor.username}
                                        </option>
                                      );
                                    })
                                  : null}
                              </select>

                              {errors.proctor ? (
                                <div className="alert alert-info">
                                  {errors.proctor}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-footer">
                    <center>
                      <button
                        onClick={() => {
                          setProctorView("grid");
                          handleOnChange(
                            values.date + ":$:" + values.slot,
                            currentUser,
                            setShow,
                            setMsg,
                            setProctorData,
                            history,
                            values.proctor,
                            values.inst,
                            dateStr
                          );
                        }}
                        className="btn btn-primary btn-sm"
                      >
                        View
                      </button>
                    </center>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null;
      }}
    </Formik>
  ) : null;
}

async function handleOnChange(
  dateSlot,
  currentUser,
  setShow,
  setMsg,
  setProctorData,
  history,
  proctor,
  inst,
  dateStr
) {
  if (dateSlot !== undefined && dateSlot !== "") {
    let date = dateSlot.split(":$:")[0];
    let slot = dateSlot.split(":$:")[1];

    let uid = proctor;

    await API.get("/proctorAllocation", {
      params: {
        type: "byDaySlot",
        dateSlot: dateSlot,
        proctorUid: uid,
        instId: inst,
      },
    }).then((res) => {
      if (res.data.status === "success") {
        setProctorData(res.data.data);
        if (res.data.data.length !== 0) {
          if (res.data.data.length <= 30) {
            history.push("/startProctor", {
              proctorData: res.data.data,
              date: dateStr,
              instId: inst,
              proctorUid: uid,
              slot: slot,
              path: "A",
            });
          } else {
            setShow(true);
            setMsg(
              "You Can not proctor more than 30 Students in Bulk Proctoring..."
            );
          }
        } else {
          setShow(true);
          setMsg("You are not allocated with any student for this subject...");
        }
      } else {
        setShow(true);
        setMsg("Problem Fetching Data from Server");
      }
    });
  }
}

async function getProctorList(
  inst,
  date,
  slot,
  setProctorList,
  setShow,
  setMsg,
  currentUser
) {
  if (
    inst === undefined ||
    inst === "" ||
    date === undefined ||
    date === "" ||
    slot === "" ||
    slot === undefined
  ) {
    setShow(true);
    setMsg("Please Select Institute, Date and Slot ...");
    return false;
  }

  await API.get("/examProctorList", {
    params: { inst: inst, date: date, slot: slot },
  })
    .then((res) => {
      if (res.data.status === "success") {
        setProctorList(res.data.data);
      }
    })
    .catch(function (error) {
      setShow(true);
      setMsg("Problem Fetching Proctor List from server...");
    });
}

async function getExamDates(setExamDate, setShow, setMsg, instId) {
  await API.get("examDates", { params: { instId: instId } }).then(
    (res) => {
      if (res.data.status === "success") {
        setExamDate(res.data.data);
      } else {
        setShow(true);
        setMsg("Data not found...");
      }
    }
  );
}

async function getInstitutes(setInstList,region,currentUser,setShow,setMsg) 
{
    if(currentUser.role === 'CADMIN')
    {
        await API.get("/examInsts/ByRegion", { params: { region: region } })
        .then((res) => {
        if (res.data.status === "success") {
            setInstList(res.data.data);
        }
        })
        .catch(function (error) {
        setShow(true);
        setMsg("Problem Fetching region data from server...");
        });
    }
    else if(currentUser.role === 'ADMIN')
    {
        await API.get("/examInsts")
        .then((res) => {
        if (res.data.status === "success") {
            setInstList(res.data.data);
        }
        })
        .catch(function (error) {
        setShow(true);
        setMsg("Problem Fetching region data from server...");
        });
    }
}

async function getRegion(setRegionList, currentUser, setShow, setMsg) {
  await API.get("/examRegions")
    .then((res) => {
      if (res.data.status === "success") {
        setRegionList(res.data.data);
      }
    })
    .catch(function (error) {
      setShow(true);
      setMsg("Problem Fetching Institutes from server...");
    });
}

export default ExamProctoring;
