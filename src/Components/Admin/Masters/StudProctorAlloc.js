import React, { useState, useEffect, useContext } from "react";
import { ShowContext } from "../../../App";
import { UserContext } from "../../../App";
import { Formik } from "formik";
import API from "../../../api";
import StudProctorAllocList from "./StudProctorAllocList";
import StudProctorAllocList2 from "./StudentProctorAllocList2";
import { Markup } from 'interweave';

const StudProctorAlloc = () => {
  const [myList,setMyList] = useState(false);
  const [dateList, setDateList] = useState();
  const [allocationStr, setAllocationStr] = useState();
  const [allocList, setAllocList] = useState();
  const { setShow, setMsg } = useContext(ShowContext);
  const { currentUser } = useContext(UserContext);
  const myInitialValues = { date: "all", slot: "all" };
  const [loading,setLoading] = useState(false);
  
  useEffect(() => {
    getExamDates(setDateList, setShow, setMsg);
  }, []);

  useEffect(() => {
    if (currentUser) {
      getAllocatableStatistics(
        setAllocationStr,
        setShow,
        setMsg,
        currentUser,
        setAllocList
      );
    }
  }, [currentUser,myList]);

  return currentUser !== undefined && currentUser !== null ? (
    <Formik
      initialValues={myInitialValues}
      onSubmit={async (values, actions) => {}}
    >
      {(props) => {
        const {
          values,
          errors,
          isSubmitting,
          submitForm,
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
        } = props;

        return currentUser !== undefined && currentUser !== null ? (
          <div>
            <div className="container-fluid">
              <br/>
              <ol className="breadcrumb mb-4">
                <li className="breadcrumb-item active">Student Proctor Allocation</li>
              </ol>
              <div className="col-lg-12 row">
                <div className="col-lg-12">
                  <form
                    id="form-checker-alloc"
                    method="post"
                    className="form-horizontal"
                    onSubmit={handleSubmit}
                  >
                    <div className="card">
                      <div className="card-header">
                        <b>Select Day and Slot for Allocation</b>
                      </div>
                      <div className="col-lg-12">
                        <div className="alert alert-danger">
                          <b><Markup content={allocationStr}/></b>
                        </div>
                      </div>
                      <div className="card-body col-lg-12 row">
                        <div className="col-lg-12 row">
                          <div className="col-lg-6 row">
                            <div className="form-group col-lg-6">
                              <div className="col-lg-12 column">
                                <div className="col-lg-12">
                                  <b>Date</b>
                                </div>
                                <div className="col-lg-12">
                                  <select
                                    id="date"
                                    name="date"
                                    className="form-control"
                                    onChange={(e) => {
                                      handleChange(e);
                                    }}
                                    value={values.date}
                                  >
                                    <option value="all">All</option>
                                    {dateList !== undefined && dateList.map((date, index) => {
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
                              <div className="col-lg-12 column">
                                <div className="col-lg-12">
                                  <b>Slot</b>
                                </div>
                                <div className="col-lg-12">
                                  <select
                                    id="slot"
                                    name="slot"
                                    className="form-control"
                                    onChange={(e) => {
                                      handleChange(e);
                                    }}
                                    onBlur={handleBlur}
                                    value={values.slot}
                                  >
                                    <option value="all">All</option>
                                    <option value="1">Slot 1</option>
                                    <option value="2">Slot 2</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-12">
                              <center>
                                <button
                                  type="submit"
                                  className="btn btn-sm btn-primary"
                                  onClick={async () =>{
                                      setLoading(true);
                                      await automaticAllocation(values.date,values.slot,setMsg,setShow,currentUser,setMyList,myList);
                                      setLoading(false);
                                  }}
                                >
                                  Start Automatic Allocation
                                </button>
                              </center>
                            </div>
                          </div>
                          <div
                            className="col-lg-6 fixTableHead scroll1"
                            style={{ maxHeight: "300px" }}
                          >
                            <table className="table table-bordered">
                              <thead>
                                <tr style={{ backgroundColor: "aqua" }}>
                                  <th>Date</th>
                                  <th>Day</th>
                                  <th>Slot</th>
                                  <th>Total Exams</th>
                                  <th>Proctor Allocated Exams</th>
                                </tr>
                              </thead>
                              <tbody>
                                {
                                    allocList !== undefined ? 
                                        allocList.map((data, index) => 
                                        {
                                            return (
                                                <tr key={index}>
                                                <td><center>{data.date}</center></td>
                                                <td><center>{data.day}</center></td>
                                                <td><center>{data.slot}</center></td>
                                                <td><center>{data.count}({Math.ceil(data.count/30)})</center></td>
                                                <td><center>{data.allocCount}</center></td>
                                                </tr>
                                            );
                                            })
                                    : null
                                }
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div className="col-lg-12">
                  {
                      loading ?
                        <div className="custom-loader"></div>
                      :null
                  }
              </div>
              <div className="col-lg-12 row">
                <div className="col-lg-8" style={{"overflow":"auto"}}>
                    <StudProctorAllocList myList={myList} setMyList={setMyList} bulkDelete={true}/>
                </div>
                <div className="col-lg-4" style={{"overflow":"auto"}}>
                    <StudProctorAllocList2 myList={myList} setMyList={setMyList} bulkDelete={true}/>
                </div>
              </div>
            </div>
          </div>
        ) : null;
      }}
    </Formik>
  ) : null;
};

async function automaticAllocation(date,slot,setMsg,setShow,currentUser,setMyList,myList)
{
    await API.post("/proctorAllocate",{'date':date,'slot':slot,'instId':currentUser.inst_id})
    .then(function (res) {
      if(res.data.status === 'success')
      {
        setMyList(!myList);
        setShow(true);
        setMsg("Student Proctor Allocation is Successfully Completed...");
      }
    })
    .catch(function (error) {
      setShow(true);
      setMsg("Problem Gettting Exam Dates");
    });
}

async function getExamDates(setDateList, setShow, setMsg) {
  await API.get("/report/getExamDates")
    .then(function (res) {
      setDateList(res.data.data);
    })
    .catch(function (error) {
      setShow(true);
      setMsg("Problem Gettting Exam Dates");
    });
}

async function getAllocatableStatistics(
  setAllocationStr,
  setShow,
  setMsg,
  currentUser,
  setAllocList
) {
  await API.get("/report/getStudProctorAllocStatistics", {
    params: { instCode: currentUser.inst_id },
  })
    .then(function (res) {
      if (res.data.status === "success") {
        setAllocationStr(res.data.message);
        setAllocList(res.data.data);
      }
    })
    .catch(function (error) {
      setShow(true);
      setMsg("Problem Gettting Student Proctor Allocation Statistics");
    });
}

export default StudProctorAlloc;
