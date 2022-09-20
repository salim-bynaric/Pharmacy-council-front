import React, { useState, useEffect, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Moment from 'react-moment';
import CountDownButton from './CountDownButton';
import API from '../../api';
import Axios from 'axios';
import { PopupContext, ShowContext, UserContext } from '../../App';
import { en, de } from '../../utils/Helper';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import StudentExamLog from '../Institute/Reports/StudentExamLog';
import Popup from '../../Landing/Popup';


function ExamCard(props) {
  let currentUser = props.currentUser;
  const { setPopupShow, setPopupMsg } = useContext(PopupContext);
  const [linkOpen, setLinkOpen] = useState(true);
  const [examEndTime, setExamEndTime] = useState();
  const [examMaxAllowedTime, setMaxAllowedTime] = useState();
  const [popupShow, setPopupShow1] = useState(false);
  const handleClose = () => setPopupShow1(false);
  const [log, setLog] = useState();
  const { setShow, setMsg } = useContext(ShowContext);
  const [retake, setRetake] = useState();
  const [promptShow, setPromptShow] = useState(false);
  const handleClose1 = () => setPromptShow(false);

  let history = useHistory();
  let BtnCaption = '';
  let StartTime = '';
  let EndTime = '';
  let TotalQuestions = 0;
  let ExamDuration = 0;
  let Theme = '';
  let BtnTheme = '';
  let myLink = '';
  let Now = '';
  let status = '';
  let phTime = '';
  let scoreView = null;
  let marksObt = 0;
  let examMode = '';
  let RemainingTime = 0;
  if (props.exam.paper !== null && props.exam.paper !== undefined) {
    StartTime = props.exam.starttime;
    EndTime = props.exam.endtime;
    phTime = props.exam.paper.ph_time;
    scoreView = props.exam.paper.score_view;
    examMode = props.exam.paper.exam_mode;
  }
  Now = props.exam.now;


  if (scoreView !== undefined && scoreView !== null && scoreView !== '') {
    marksObt = props.exam.marksobt;
  }



  //----------------------Dynamic status------------------------------------------
  if (EndTime < Now) {
      status = 'expired';
  }
  else if (props.exam.examstatus === 'inprogress') {
    status = 'inprogress';
  }

  console.log(status);
  //------------------------------------------------------------------------------
  if (props.exam.examstatus === 'over') {
    status = props.exam.examstatus;
  }
  const PaperName = props.exam.paper !== null ? props.exam.paper.paper_name : '';
  const PaperCode = props.exam.paper !== null ? props.exam.paper.paper_code : '';
  TotalQuestions = props.exam.paper !== null ? props.exam.paper.questions : '';
  ExamDuration = props.exam.paper !== null ? props.exam.paper.duration : '';


  //---------------------Status according to database-------------------------

  if (status === 'over' || status === 'expired') {
    if (status === 'over') {
      BtnCaption = 'Completed';
      Theme = 'text-white bg-warning'
      BtnTheme = 'btn btn-sm btn-warning';
    }
    else {
      BtnCaption = 'Expired';
      Theme = 'bg-danger';
      BtnTheme = 'btn btn-sm btn-danger';
    }
    myLink = <button className={BtnTheme} disabled={true}>{BtnCaption}</button>
  }
  else if (status === '' || status === 'inprogress') {
    if (status === '') {
      BtnCaption = 'Proceed';
      Theme = 'text-white bg-success';
      BtnTheme = 'btn btn-sm btn-success';
      if (StartTime > Now) {
        BtnCaption = 'Coming Soon';
        Theme = 'bg-warning';
        BtnTheme = 'btn btn-sm btn-warning';

        myLink = <CountDownButton StartTime={StartTime} Now={Now} exam={props.exam} role='STUDENT' />
      }
      else {
        myLink = <Link to={'#'} onClick={(e) => {
          getParallelData(props.exam.paper.id, setPopupShow, setPopupMsg, history, props);
          e.preventDefault();
        }} className={BtnTheme}><i className="fas fa-play"></i>&nbsp;&nbsp;{BtnCaption}</Link>;
      }
    }
    else {
      let elapsedTime = parseInt(props.exam.elapsed);
      let totalTime = parseInt(props.exam.paper.duration) * 60;
      let myPhTime = props.currentUser.ph === 'PH' ? parseInt(props.exam.paper.ph_time) * 60 : 0;
      RemainingTime = (totalTime + myPhTime) - elapsedTime;

      RemainingTime = secondsToHMS(RemainingTime);

      BtnCaption = 'Continue Exam';
      Theme = 'text-white bg-primary';
      BtnTheme = 'btn btn-sm btn-primary';
      myLink = <Link to={{ pathname: '/instructions', state: { exam: props.exam, role: 'STUDENT' } }} className={BtnTheme}><i className="fas fa-play-circle"></i> {BtnCaption}</Link>;
    }
  }

  useEffect(() => {
    if ((examMode === 'subjective' || examMode === 'both') && (status === 'over') && props.exam.paper.singleFileUpload && props.exam !== null && props.exam !== undefined && linkOpen) {
      getCurrentTime(setLinkOpen, props.exam, linkOpen, setExamEndTime, setMaxAllowedTime);
      let myInterval = setInterval(() => { getCurrentTime(setLinkOpen, props.exam, linkOpen, setExamEndTime, setMaxAllowedTime); }, 30000);
      //------------------Cleanup-----------------------------------------
      return () => {
        clearInterval(myInterval);
      }
    }
  }, [props.exam.paper.singleFileUpload, examMode, status, linkOpen])

  

  //------------------------------------------------------------------------------
  const userRequest = { btnCaption: BtnCaption, paperName: PaperName, startTime: StartTime, endTime: EndTime, totQuestions: TotalQuestions, examDuration: ExamDuration, theme: Theme, btnTheme: BtnTheme, paperCode: PaperCode, remainingTime: RemainingTime }

  return (
    currentUser && props.exam.paper !== null ?
      <div className="col-lg-3 col-sm-6 col-xl-3 slider-cart" id='exam-cards'>
        <div className='card' style={{ minHeight: "380px", margin: "10px" }}>
          <div className={"card-header " + userRequest.theme}>
            <b>{userRequest.paperCode}-{userRequest.paperName}</b>
          </div>
          <div className="card-body">

            <ul className="newListStyle">
              <li>{/*<i className="fas fa-play"></i>&nbsp;&nbsp;*/}<b>Start Time:</b> <Moment format="MMMM Do YYYY, H:mm A">{userRequest.startTime}</Moment></li>
              <li>{/*<i className="fab fa-expeditedssl"></i>&nbsp;&nbsp;*/}<b>End Time:</b> <Moment format="MMMM Do YYYY, H:mm A">{userRequest.endTime}</Moment></li>
              <li>{/*<i className="fas fa-hourglass"></i>&nbsp;&nbsp;*/}<b>Time Zone:</b> {getTimezoneName()} ({Intl.DateTimeFormat().resolvedOptions().timeZone})</li>
              <li>{/*<i className="fas fa-question-circle"></i>&nbsp;*/}<b>No of Questions :</b> {userRequest.totQuestions}</li>
              <li>{/*<i className="far fa-clock"></i>&nbsp;*/}<b>Test Duration   :</b> {currentUser.ph === 'PH' ? userRequest.examDuration + phTime : userRequest.examDuration} Mins</li>
              {
                status === 'over' && scoreView === 1 ?
                  <li><b>Marks Obtained :</b> {marksObt}</li>
                  : null
              }
              {
                userRequest.btnCaption === 'Continue Exam' ?
                  <li>{/*<i className="fas fa-hourglass-start"></i>&nbsp;&nbsp;*/}<b>Time Remaining : </b>{userRequest.remainingTime}</li>
                  : null
              }
            </ul>
            <div className="col-lg-12">
              {
                props.exam.paper.singleFileUpload && linkOpen ?
                  ((examMode === 'subjective' || examMode === 'both') && status === 'over') ?
                    <center><br />
                      {props.exam.answerFile === undefined || props.exam.answerFile === null || props.exam.answerFile === '' ?
                        <font size="5" color="red">File Upload Pending</font>
                        : null}
                      <Link to={{ pathname: "/uploadSubjectiveAnswer", state: { 'examId': props.exam.id, 'enrollno': props.currentUser.username, 'paperCode': props.exam.paper.paper_code, 'examEndTime': examEndTime, 'examMaxAllowedTime': examMaxAllowedTime, 'answerFile': props.exam.answerFile } }}><h4>Upload Answer Pdf</h4></Link>
                    </center>
                    : null
                  : null
              }
            </div>
          </div>

          <div className="card-footer">
            <center>
              {myLink} &nbsp; &nbsp;
              {
                status === 'over' ?
                  <><button className='btn btn-success btn-sm' onClick={() => {
                    getStudentExamLog(props, setLog, setShow, setMsg, setPopupShow1)
                  }}>Exam Log</button> &nbsp;&nbsp;&nbsp;
                  </>
                  :
                  null
              }
            </center>
          </div>

          <Modal show={popupShow} onHide={handleClose} backdrop="static" size="xl" dialogClassName="modal-90w">
            <Modal.Header closeButton style={{ backgroundColor: "OliveDrab", color: "white" }}>
              <Modal.Title>Student Exam Log Report</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="col-lg-12">
                {
                  log ?
                    <StudentExamLog log={log} />
                    : <div className="custom-loader"></div>
                }
              </div>
              <hr />
              <div className="col-lg-12">
                <Button variant="danger" onClick={handleClose} style={{ float: "right" }}>Close</Button>
              </div>
            </Modal.Body>
          </Modal>
        </div>
      </div>
      :
      null
  );
}


async function getStudentExamLog(props, setLog, setShow, setMsg, setPopupShow1) {
  let enrollno = props.currentUser.username;
  let paperId = props.exam.paper.id;
  let instId = props.currentUser.inst_id;

  await API.get('/exam/log/' + enrollno + '/' + paperId, { params: { "instId": instId } })
    .then((res) => {
      if (res.data.status === 'success') {
        if (res.data.data !== null && res.data.data !== undefined && res.data.data.length === 0) {
          setShow(true);
          setMsg('No Exam Log for this student found. Probably Exam Allocation is Dynamic and exam is yet to be conducted');
          return false;
        }
        setPopupShow1(true);
        setLog(res.data.data);
      }
      else {
        setPopupShow1(false);
        setShow(true);
        setMsg('Problem Fetching Data from Server');
      }
    });
}

async function getCurrentTime(setLinkOpen, exam, linkOpen, setExamEndTime, setMaxAllowedTime) {
  if (linkOpen) {
    let endTime = exam.endon;
    let uploadTime = 30 * 60000;
    setExamEndTime(endTime);
    let maxAllowedTime = 0;
    let currentTime = 0;

    if (endTime !== undefined && endTime !== null && endTime !== '') {
      maxAllowedTime = parseInt(endTime) + (uploadTime);
      setMaxAllowedTime(maxAllowedTime);

      await API.get('/time')
        .then(function (res) {
          currentTime = parseInt(res.data.time);
          if (currentTime >= parseInt(endTime) && currentTime <= maxAllowedTime) {
            setLinkOpen(true);
          }
          else {
            setLinkOpen(false);
          }
        })
        .catch(function (error) {
          setLinkOpen(false);
        })
    }
    else {
      setLinkOpen(false);
    }
  }
  else {
    setLinkOpen(false);
  }
}

function secondsToHMS(duration) {
  // Hours, minutes and seconds
  var hrs = ~~(duration / 3600);
  var mins = ~~((duration % 3600) / 60);
  var secs = ~~duration % 60;

  var ret = "";

  if (hrs > 0) {
    ret += "" + hrs + " Hrs :" + (mins < 10 ? "0" : "");
  }

  ret += "" + mins + " Mins :" + (secs < 10 ? "0" : "");
  ret += "" + secs + ' Secs';
  return ret;
}

async function getParallelData(paperId, setPopupShow, setPopupMsg, history, props) {
  let subjectData = null;
  let topicData = null;
  let TotalMarks = 0;
  let TotalQuest = 0;
  let TopicSumMarks = 0;
  let TopicSumQuest = 0;

  //--------------Get Topic Data---------------------------------------------------
  await Axios.all([
    API.get('/paper/' + paperId),
    API.get('/subject/topic', { params: { 'type': 'single', 'paperId': en('' + paperId + '') } })
  ])
    .then(responseArr => {
      if (responseArr[0].data.status === 'success') {
        subjectData = JSON.parse(de(responseArr[0].data.data));

        if (subjectData) {
          TotalMarks = subjectData.marks;
          TotalQuest = subjectData.questions;
        }
      }

      if (responseArr[1].data.status === 'success') {
        topicData = JSON.parse(de(responseArr[1].data.data));
        if (topicData) {
          topicData.forEach(record => {
            TopicSumMarks = TopicSumMarks + record.questions * record.marks;
            TopicSumQuest = TopicSumQuest + record.questions;
          });
        }
      }

      if ((TotalMarks !== TopicSumMarks)) {
        setPopupShow(true);
        setPopupMsg('Total Marks for Subject not matching with Topic wise Total Marks. Can not start Examination.');
      }
      if (TotalMarks === 0) {
        setPopupShow(true);
        setPopupMsg('Total Marks for this Subject not yet set. Can not start Examination.');
      }
      if (TopicSumMarks === 0) {
        setPopupShow(true);
        setPopupMsg('Topic Entry for this subject not yet done. Can not start Examination.');
      }

      if ((TotalQuest !== TopicSumQuest)) {
        setPopupShow(true);
        setPopupMsg('Total Questions for Subject not matching with Topic wise Total Questions. Can not start Examination.');
      }
      if (TotalQuest === 0) {
        setPopupShow(true);
        setPopupMsg('Total Questions for this Subject not yet set. Can not start Examination.');
      }
      if (TopicSumQuest === 0) {
        setPopupShow(true);
        setPopupMsg('Topic Entry for this subject not yet done. Can not start Examination.');
      }

      if ((TotalMarks === TopicSumMarks) && (TotalQuest === TopicSumQuest)) {
        history.push({ pathname: '/instructions', state: { exam: props.exam, role: 'STUDENT' } });
      }
    });
}
function getTimezoneName() {
  const today = new Date();
  const short = today.toLocaleDateString(undefined);
  const full = today.toLocaleDateString(undefined, { timeZoneName: 'long' });
  const shortIndex = full.indexOf(short);
  if (shortIndex >= 0) {
    const trimmed = full.substring(0, shortIndex) + full.substring(shortIndex + short.length);
    return trimmed.replace(/^[\s,.\-:;]+|[\s,.\-:;]+$/g, '');
  }
  else {
    return full;
  }
}

export default ExamCard;
