import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../App";
import { ShowContext } from "../../../App";
import API from "../../../api";
import ProctoringSummary from "./ProctoringSummary";

const ProctoringSummaryReport = () => {
  const [proctorList, setProctorList] = useState([]);
  const [proctor, setProctor] = useState();
  const { currentUser } = useContext(UserContext);
  const { setShow, setMsg } = useContext(ShowContext);
  const [dateSlot, setDateSlot] = useState([]);
  const [myDateSlot, setMyDateSlot] = useState();
  const [proctorData, setProctorData] = useState();
  let [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser && currentUser.role !== "PROCTOR") {
      getProctors(setProctorList, currentUser, setShow, setMsg);
    } else if (currentUser && currentUser.role === "PROCTOR") {
      setProctorList([{ ...currentUser }]);
      setProctor(currentUser.username);
      getProctorDateSlot(setDateSlot, currentUser.username, setShow, setMsg);
    }
  }, [currentUser]);
  return currentUser ? (
    <>
      <div className="col-lg-12">
        <div className="container-fluid">
          <br />
          <ol className="breadcrumb mb-4">
            <li className="breadcrumb-item active">
              Proctoring Summary Report
            </li>
          </ol>
          <div className="col-lg-12">
            <div className="card mb-4">
              <div className="card-header">
                <i className="fas fa-address-card mr-1" />
                Select Proctor
              </div>
              <div className="card-body">
                <div className="form-group">
                  <div className="col-lg-12 row">
                    {currentUser.role !== "PROCTOR" ? (
                      <>
                        <div className="col-lg-4">Select Proctor</div>
                        <div className="col-lg-8">
                          <select
                            id="proctor"
                            name="proctor"
                            className="form-control"
                            onChange={(e) => {
                              setProctor(e.target.value);
                              getProctorDateSlot(
                                setDateSlot,
                                e.target.value,
                                setShow,
                                setMsg
                              );
                            }}
                          >
                            <option value="">Select Proctor</option>
                            {proctorList.map((proctor) => (
                              <option
                                key={proctor.uid}
                                value={proctor.username}
                              >
                                ({proctor.inst_id}) {proctor.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </>
                    ) : null}
                  </div>
                </div>
                <div className="form-group">
                  <div className="col-lg-12 row">
                    <div className="col-lg-4">Select Date Slot</div>
                    <div className="col-lg-8">
                      <select
                        id="paperId"
                        name="paperId"
                        className="form-control"
                        onChange={(e) => {
                          setMyDateSlot(e.target.value);
                        }}
                      >
                        <option value="">Select Date Slot</option>
                        {dateSlot.map((dateSlot, index) => {
                          return (
                            <option
                              key={index}
                              value={dateSlot.date + ":$:" + dateSlot.slot}
                            >
                              {"Date:" +
                                dateSlot.date +
                                "-Slot:" +
                                dateSlot.slot}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-footer">
                <center>
                  <button
                    onClick={async () => {
                      setLoading(true);
                      await getProctorSummaryReport(
                        currentUser,
                        proctor,
                        myDateSlot,
                        setShow,
                        setMsg,
                        setProctorData
                      );
                      setLoading(false);
                    }}
                    className="btn btn-info"
                  >
                    {" "}
                    Submit{" "}
                  </button>
                </center>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-12">
        {loading ? <div className="custom-loader"></div> : null}
      </div>
      <div className="col-lg-12">
        {proctorData !== undefined && proctorData.length > 0 ? (
          <ProctoringSummary data={proctorData} dateSlot={myDateSlot} />
        ) : null}
      </div>
    </>
  ) : null;
};

async function findUniqueData(data, list) {
  let examid = null;
  let proctor = null;
  let student = null;
  let Arr = [];
  let EnrollArr = [];

  list.map((row, index) => {
    EnrollArr.push(row.student.username);
  });

  EnrollArr = [...new Set(EnrollArr)];

  if (list.length > 0) {
    EnrollArr.map((row, index) => {
      Arr.push(getCount(row, data, list));
    });
  }
  return Arr;
}

function getCount(enrollno, data, list) {
  let enroll = "";
  let name = "";
  let subject = "";
  let examStart = "";
  let examEnd = "";
  let proctorName = "";
  let warningType = "";
  let one = 0;
  let two = 0;
  let three = 0;
  let four = 0;
  let five = 0;
  let six = 0;
  let seven = 0;
  let eight = 0;
  let nine = 0;
  let ten = 0;
  let eleven = 0;
  let Arr = [];

  if (data.length > 0) 
  {
    data.map((row, index) => 
    {
      if (row.exam) 
      {
        if (enrollno === row.student.username) 
        {
          enroll = row.student.username;
          name = row.student.name;
          subject = row.subject.paper_code + "-" + row.subject.paper_name;
          examStart = row.exam.startedon;
          examEnd = row.exam.endon;
          proctorName = row.proctor.name;
          warningType = row.subject.warningType;

          if (parseInt(row.warningNo) === 1) {
            one++;
          } else if (parseInt(row.warningNo) === 2) {
            two++;
          } else if (parseInt(row.warningNo) === 3) {
            three++;
          } else if (parseInt(row.warningNo) === 4) {
            four++;
          } else if (parseInt(row.warningNo) === 5) {
            five++;
          } else if (parseInt(row.warningNo) === 6) {
            six++;
          } else if (parseInt(row.warningNo) === 7) {
            seven++;
          } else if (parseInt(row.warningNo) === 8) {
            eight++;
          } else if (parseInt(row.warningNo) === 9) {
            nine++;
          } else if (parseInt(row.warningNo) === 10) {
            ten++;
          } else if (parseInt(row.warningNo) === 11) {
            eleven++;
          }
        } 
        else 
        {
          list.map((row1, index1) => 
          {
            if (enrollno === row1.student.username) {
              enroll = row1.student.username;
              name = row1.student.name;
              subject = row1.subject.paper_code + "-" + row1.subject.paper_name;
              examStart = row1.exam.startedon;
              examEnd = row1.exam.endon;
              proctorName = row1.proctor.name;
              warningType = row1.subject.warningType;
            }
          });
        }
      }
    });
  } 
  else 
  {
    list.map((row1, index1) => 
    {
      if (enrollno === row1.student.username) 
      {
        enroll = row1.student.username;
        name = row1.student.name;
        subject = row1.subject.paper_code + "-" + row1.subject.paper_name;
        examStart = row1.exam.startedon;
        examEnd = row1.exam.endon;
        proctorName = row1.proctor.name;
        warningType = row1.subject.warningType;
      }
    });
  }

  Arr.push({
    enroll: enroll,
    name: name,
    subject: subject,
    examstart: examStart,
    examend: examEnd,
    one: one,
    two: two,
    three: three,
    four: four,
    five: five,
    six: six,
    seven: seven,
    eight: eight,
    nine: nine,
    ten: ten,
    eleven: eleven,
    proctorName: proctorName,
    warningType: warningType,
  });

  return Arr;
}

async function getProctorSummaryReport(
  currentUser,
  proctor,
  myDateSlot,
  setShow,
  setMsg,
  setProctorData
) {
  await API.get("/proctor/summary", {
    params: { proctor: proctor, dateSlot: myDateSlot },
  })
    .then(async (res) => {
      if (res.data.status === "success") {
        let dat = await findUniqueData(res.data.data, res.data.list);
        if (dat.length === 0) {
          setShow(true);
          setMsg("No Proctoring Data found for this Invigilator.");
        }
        setProctorData(dat);
      }
    })
    .catch(function (error) {
      setShow(true);
      setMsg("Problem Fetching Proctor Data from Server");
    });
}

async function getProctorDateSlot(setDateSlot, proctorId, setShow, setMsg) {
  await API.get("/proctor/dateSlots", {
    params: { type: "byProctorId", proctorId: proctorId },
  }).then((res) => {
    if (res.data.status === "success") {
      setDateSlot(res.data.data);
    } else {
      setShow(true);
      setMsg("Problem Fetching Data from Server");
    }
  });
}

async function getProctors(setProctorList, currentUser, setShow, setMsg) {
  let params = null;
  if (currentUser.role === "ADMIN") {
    params = { params: { role: currentUser.role } };
  } else if (currentUser.role === "EADMIN") {
    params = {
      params: { instId: currentUser.username, role: currentUser.role },
    };
  } else if (currentUser.role === "SUBADMIN") {
    params = {
      params: { instId: currentUser.inst_id, role: currentUser.role },
    };
  }
  await API.get("/proctor", params)
    .then(function (res) {
      if (res.data.status === "success") {
        setProctorList(res.data.data);
      } else {
        setShow(true);
        setMsg("Problem Fetching Proctor Data from Server");
      }
    })
    .catch(function (error) {
      setShow(true);
      setMsg("Problem Fetching Proctor Data from Server");
    });
}

export default ProctoringSummaryReport;
