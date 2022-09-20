import React, { useState, useEffect, useContext } from "react";
import API from "../../api";
import { ShowContext, ExamFolderContext, ProctorViewContext,UserContext } from "../../App";
import "react-image-lightbox/style.css";
import ReportModal from "./ReportModal";
import WarningModal from "./WarningModal";
import EndExamModal from "./EndExamModal";
import GalleryModal from "./GalleryModal";
import { rtrim } from "../../utils/Helper";
import { useHistory } from "react-router-dom";

const ProctorSnapshot = ({data,instId,date,slot,height,examid,day,region}) => 
{
  const [snap, setSnap] = useState();
  const [snapTime, setSnapTime] = useState();
  const { examFolder } = useContext(ExamFolderContext);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [log, setLog] = useState();
  const { setShow, setMsg } = useContext(ShowContext);
  const [show, setShow1] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [showEndExam, setShowEndExam] = useState(false);
  const handleClose = () => setShow1(false);
  const handleClose1 = () => setShowWarning(false);
  const handleClose2 = () => setShowEndExam(false);
  const handleClose3 = () => setShowGallery(false);
  const [loadReport, setLoadReport] = useState(false);
  const [status, setStatus] = useState();
  const [expand, setExpand] = useState(false);
  const { proctorView } = useContext(ProctorViewContext);
  const [myProctorView, setMyProctorView] = useState("grid-view-std");
  const { currentUser } = useContext(UserContext);
  const [proctorData, setProctorData] = useState([]);
  let history = useHistory();
  
  let stdid = data.student.uid;
  let paperId = data.subject.id;
  instId = data.student.inst_id;
  let enroll = data.student.username;
  let studname = data.student.name;
  let room = examid;
  let warningDriver = data.subject.warningDriver;
  let warningType = data.subject.warningType;
  let windowSwitch = data.exam.switched;
  let ElapsedTime = data.elapsedTime ? parseInt(data.elapsedTime.elapsed_time)
    : 0;
  let divyang = data.student.ph;
  let totalTime = (divyang=='PH') ? parseInt(data.subject.duration) * 80:parseInt(data.subject.duration) * 60;
  

  let timeRemaining = Math.ceil((totalTime - ElapsedTime) / 60);

  const dataFolder = examFolder;
  const imgPath = rtrim(process.env.REACT_APP_PROJPATH, "/");
  let imgPath1 = process.env.REACT_APP_PROJPATH + "assets/images/blank.jpg";
  let imgPath2 = process.env.REACT_APP_PROJPATH + "assets/images/blank1.png";
  let imgPath3 = process.env.REACT_APP_PROJPATH + "assets/images/illegal.gif";

  const proctorShowTime = process.env.REACT_APP_PROCTOR_SHOW_TIME;

  useEffect(() => {
    setStatus(data.exam.examstatus);
  },[history.location,data.exam.examstatus])

  let statusMsg = "";
  var setClass = "";
  if (status === null || status === undefined) 
  {
    statusMsg = "Exam Not Started";
    setClass = "Exam_Not_start";
  } 
  else if (status === "inprogress") 
  {
    statusMsg = "In Progress";
    setClass = "Exam_progress";
  } 
  else if (status === "over") 
  {
    statusMsg = "Exam Over";
    setClass = "Exam_over";
  }

  useEffect(() => 
  {
    if(status === 'inprogress')
    {
      setSnap(imgPath+data.latestSnapshot);
    }
    else if(status === 'over')
    {
      setSnap(imgPath2);
    }
    else if(status === null || status === undefined)
    {
      setSnap(imgPath1);
    }
  },[data.latestSnapshot,status,history.location,snap]);

  useEffect(() => {
    if (proctorView) {
      if (proctorView === "grid") {
        setMyProctorView("grid-view-std");
      } else {
        setMyProctorView("list-view-std");
      }
    }
  }, [proctorView]);

  return proctorView && currentUser ? (
    <div className="col-lg-12">
      <div className={myProctorView}>
        <>
          {
            <>
             
                <>
                  <>
                      <div
                        className="container"
                        onClick={() => setIsOpen(true)}
                      >
                          <>
                            <img
                              className="newimgstyle proctimgstyle"
                              src={snap+'?'+ Date.now()}
                              onDragStart={(e) => {
                                e.preventDefault();
                              }}
                            />
                            <span id="num-view" className={setClass}>
                              {enroll} &nbsp;&nbsp;<font size="2" color="green"><b>{divyang === 'PH' ? 'Divyang' : null}</b></font>
                            </span>
                          </>
                      </div>
                    {proctorView === "grid" ? (
                      <button
                        type="button"
                        onClick={() => {
                          setExpand(!expand);
                        }}
                      >
                        <i className="fa fa-ellipsis-v"></i>
                      </button>
                    ) : 
                    
                    (
                        <div className="list-icons">
                          <ul>
                            <li>
                              <i className="fas fa-chart-line" title="Exam Status"></i>:{statusMsg}
                            </li>
                            <li>
                              <i className="fas fa-clock" title="Time Reamaining"></i>:{timeRemaining}
                            </li>
                            <li>
                              <i className="fas fa-book" title="No of WindowSwitch"></i>:{windowSwitch}
                            </li>
                            <li className="proctor-info">
                              {" "}
                              <div
                                onClick={async () => {
                                  if (status !== "over" && status !== null && status !== undefined && currentUser.role === 'PROCTOR') {
                                    setShowWarning(true);
                                  } else {
                                    setShowWarning(false);
                                  }
                                }}
                              >
                                <i
                                  className="fas fa-exclamation-triangle"
                                  title="Send Warning to Student"
                                ></i>
                              </div>
                            </li>
                            <li className="proctor-info">
                              {" "}
                              <div
                                onClick={async () => {
                                  if (status !== null && status !== undefined) 
                                  {
                                    await getDetailedReport(enroll,paperId,setLog,setShow,setMsg,setShowGallery,instId,setLoadReport);
                                  }
                                }}
                              >
                                <i
                                  className="fas fa-images"
                                  title="Snapshots Gallery"
                                ></i>
                              </div>
                            </li>
                          </ul>
                        </div>
                      )}
                    {expand ? (
                      <div className="little-list hidden" id="ll">
                        <ul>
                          {/* <li><div className="std-info" style={{display:"inline-block",width:"auto"}} onClick={async () => { await getDetailedReport(enroll, paperId, setLog, setShow, setMsg, setShow1, instId, setLoadReport) }}>
                          <i className="far fa-file-alt" title="Get Detailed Report" ></i>
                          </div></li> */}
                          <li>
                            {" "}
                            <div
                              className="std-info"
                              style={{ display: "inline-block", width: "auto" }}
                              onClick={async () => {
                                if (status !== "over" && status !== null && status !== undefined && currentUser.role === 'PROCTOR') {
                                  setShowWarning(true);
                                } else {
                                  setShowWarning(false);
                                }
                              }}
                            >
                              <i
                                className="fas fa-exclamation-triangle"
                                title="Send Warning to Student"
                              ></i>
                            </div>
                          </li>
                          <li>
                            {" "}
                            <div
                              className="std-info"
                              style={{ display: "inline-block", width: "auto" }}
                              onClick={async () => {
                                if (status !== null && status !== undefined) 
                                {
                                  await getDetailedReport(enroll,paperId,setLog,setShow,setMsg,setShowGallery,instId,setLoadReport);
                                }
                              }}
                            >
                              <i
                                className="fas fa-images"
                                title="Snapshots Gallery"
                              ></i>
                            </div>
                          </li>
                        </ul>
                      </div>
                    ) : null}
                  </>
                  <GalleryModal
                    show={showGallery}
                    handleClose={handleClose3}
                    examid={examid}
                    setShow={setShow}
                    setMsg={setMsg}
                    log={log}
                    loadReport={loadReport}
                  />

                  <EndExamModal
                    show={showEndExam}
                    handleClose={handleClose2}
                    examid={examid}
                    setShow={setShow}
                    setMsg={setMsg}
                    setShowEndExam={setShowEndExam}
                  />

                  <ReportModal
                    show={show}
                    handleClose={handleClose}
                    log={log}
                    loadReport={loadReport}
                  />

                  <WarningModal
                    showWarning={showWarning}
                    handleClose1={handleClose1}
                    enroll={enroll}
                    examid={examid}
                    paperId={paperId}
                    instId={instId}
                    room={room}
                    warningDriver={warningDriver}
                    warningType={warningType}
                    day={day}
                    slot={slot}
                    region={region}
                  />
                </>
              
            </>
          }
        </>
      </div>
    </div>
  ) : null;
};


async function getDetailedReport(enroll,paperId,setLog,setShow,setMsg,setShow1,instId,setLoadReport) 
{
  setShow1(true);
  setLoadReport(true);
  await API.get("/proctor/" + enroll + "/" + paperId, {
    params: { instId: instId },
  }).then((res) => {
    if (res.data.status === "success") {
      setLog(res.data.data);
      setLoadReport(false);
    } else {
      setShow(true);
      setMsg("Problem Fetching Data from Server");
      setLoadReport(false);
    }
  });
}


export default ProctorSnapshot;