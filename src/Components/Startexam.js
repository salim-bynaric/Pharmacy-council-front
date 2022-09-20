import React, { useState, useEffect, useContext, useRef } from 'react';
import QuestionAnswer from "./Exam/QuestionAnswer";
import QuestionButtons from "./Exam/QuestionButtons";
import NextSaveButton from "./Exam/NextSaveButton";
import NextButton from "./Exam/NextButton";
import EndExamButton from "./Exam/EndExamButton";
import EndPreviewButton from "./Exam/EndPreviewButton";
import PreviousButton from "./Exam/PreviousButton";
import OverallSummery from "./Exam/OverallSummery";
import ReviewLater from "./Exam/ReviewLater";
import MyTimer from "./Exam/MyTimer.js";
import { useHistory } from 'react-router-dom';
import API from '../api';
import { ShowContext } from '../App';
import { PopupContext } from '../App';
import { QuestModeContext } from '../App';
import WebCamCapture from './Exam/WebCamCapture';
import QuestWiseTimer from './Exam/QuestWiseTimer';
import ClearResponse from './Exam/ClearResponse';
import { UserContext, BrowserContext } from '../App';
import NextSaveSubjective from './Exam/NextSaveSubjective';
import { MaskContext } from '../App';
import { MaskSwitchContext } from '../App';
import NewWindow from 'react-new-window';
import io from 'socket.io-client';
import WarningsModal from '../WarningsModal';
import Pusher from 'pusher-js';
import QuestionsAtAGlance from './Exam/QuestionsAtAGlance';
import { en,de } from '../utils/Helper';
import StudentVideoConnect from './Exam/StudentVideoConnect';


let socket;
const CONNECTION_PORT = process.env.REACT_APP_PROCTOR_SERVER;
let webSwitch = 0;

//-----------While unloading page this hook will be invoked to store state of user and examination------------------
const useUnload = fn => {
  const cb = React.useRef(fn);
  React.useEffect(() => 
  {
    const onUnload = cb.current;
    window.addEventListener('beforeunload', onUnload);
    return () => {
      window.removeEventListener('beforeunload', onUnload);
    };
  }, [cb]);
};
//------------------------------------------------------------------------------------------------------------------


function Startexam(props) {
  const { setShow, setMsg } = useContext(ShowContext);
  const { setPopupShow, setPopupMsg } = useContext(PopupContext);
  const { questionMode } = useContext(QuestModeContext);
  let history = useHistory();
  let [myOption, setMyOption] = useState();
  let [myPhotoCapture, setMyPhotoCapture] = useState(false);
  let [myVideoCapture, setMyVideoCapture] = useState(false);
  let [myCameraPerm, setMyCameraPerm] = useState(props.location.state && props.location.state.exam.paper.flexi_photo_capture === 1 ?true:false);
  const [qwtExaust, setQWTExaust] = useState(false);
  const [disableBtn, setDisableBtn] = useState(false);
  const { currentUser,setCurrentUser } = useContext(UserContext);
  const { browserName, setCameraReff } = useContext(BrowserContext);
  const [subjectiveAnswer, setSubjectiveAnswer] = useState();
  const [questArray, setQuestArray] = useState([]);
  const { mask, setMask } = useContext(MaskContext);
  const { setMaskSwitchContext } = useContext(MaskSwitchContext);

  const [warningShow, setWarningShow] = useState(false);
  const [warningMsg, setWarningMsg] = useState();
  const [warningHeader, setWarningHeader] = useState('Warning/Alert');
  const [warningId, setWarningId] = useState();
  const camRefOuter = useRef();
  const [atAGlance, setAtAGlance] = useState(false);

  if (props.location.state) {
    var originalSelectedOptions = getSelectedOptions(props.location.state.questions);
    var questionIndex = props.location.state.currentQuestionIndex;
    var myReviewArray = getReviewOptions(props.location.state.questions);
    var maxQuestions = props.location.state.questions.length;
    var room = props.location.state.exam.id;
    var warningDriver = props.location.state.exam.paper.warningDriver;
  }
  let [selectedOptions, setSelectedOptions] = useState(originalSelectedOptions);

  //------------------------------------Unloading of Window Handling----------------------------------
  useEffect((e) => {
    if(props.location.state)
    {
      localStorage.setItem("UserState", undefined);
      localStorage.setItem("UserState", JSON.stringify(currentUser));
      localStorage.setItem("ExamState", undefined);
      localStorage.setItem("ExamState", JSON.stringify(props.location.state));
    }
  },[props.location.state]);
  useUnload(e => {
    e.preventDefault();
  });
  //--------------------------------------------------------------------------------------------------

  //-----------------------Using Pusher for getting Warning Messages----------------------------------
  useEffect(() => {
    if (props.location.state && props.location.state.exam.id !== null && props.location.state.exam.id !== undefined && props.location.state.exam.paper.warningDriver === 'pusher') {
      let warnings = [];
      const pusher = new Pusher('fb027f5a97144a25d7b6', {
        cluster: 'ap2'
      });

      const channel = pusher.subscribe('' + props.location.state.exam.id + '');
      channel.bind('my-event', function (data) {
        setWarningShow(false);
        setWarningMsg(undefined);

        setWarningId(de(data.warningId));
        if (de(data.warningId) !== 'disconnection') {
          warnings.reverse();
          warnings.push('<b>Proctor:</b> <font color=blue>' + de(data.message) + '</font>');
          warnings.reverse();
          //warnings.unshift('<b>Proctor:</b> <font color=blue>' + de(data.message) + '</font>');
          //alert(JSON.stringify(warnings));
          setWarningHeader('Warning Issued by Invigilator')
          setWarningShow(true);
          setWarningMsg(warnings);
        }
      });
    }
  }, [props.location.state && props.location.state.exam.id]);
  //-------------------------------Pusher Warning Messages End-------------------------------------------

  //------------------------Using Socket.io for receiving Warning messages-------------------------------
  useEffect(() => {
    if (props.location.state && props.location.state.exam.id !== null && props.location.state.exam.id !== undefined && props.location.state.exam.paper.warningDriver === 'socketio') {
      socket = io(CONNECTION_PORT, { transports: ['websocket'] });
      socket.emit('join_room', room);
    }
    return () => {
      if (socket !== undefined) {
        socket.close();
      }
    };
  }, [props.location.state]);



  useEffect(() => {
    if (socket && props.location.state && props.location.state.exam.paper.warningDriver === 'socketio') {
      socket.on('receive_message', (data) => {
        let warnings = [];
        setWarningId(data[0].id);
        data.map((value) => {
          const d = new Date(value.created_at).toLocaleDateString() + ' ' + new Date(value.created_at).toLocaleTimeString();
          warnings.push('<b>Proctor:</b> <font color=blue>' + value.warning + '</font><br/><b>Time:' + d + '</b>');
        })
        setWarningShow(true);
        setWarningMsg(warnings);
      })
    }
  }, [socket]);

  //-------------------------------Socket Io warning message end------------------



  //----------------------Catching Opening of other window------------------------

  useEffect(() => {
    if (browserName === 'chromium-webview') {
      setCameraReff(camRefOuter);
      if (props.location.state && !props.location.state.preview && props.location.state.exam.paper.exam_switch) {
        const visibleCallback = () => onBlurWebView(props, setPopupShow, setPopupMsg, history, mask, setMask, setMaskSwitchContext, webSwitch)
        window.addEventListener('visibilitychange', visibleCallback);

        return () => {
          window.removeEventListener('visibilitychange', visibleCallback);
        };
      }
    }
  }, [props.location, mask, browserName, camRefOuter]);



  useEffect(() => {
    if (browserName !== 'chromium-webview') {
      setCameraReff(camRefOuter);

      if (props.location.state && !props.location.state.preview && props.location.state.exam.paper.exam_switch) {
        const onBlurCallback = () => onBlur(props, setPopupShow, setPopupMsg, history, mask, setMask, setMaskSwitchContext);
        window.addEventListener('blur', onBlurCallback);

        return () => {
          window.removeEventListener('blur', onBlurCallback);
        };
      }
    }
  }, [props.location, mask, browserName, camRefOuter]);


  useEffect(() => {
    if (props.location.state && !props.location.state.preview && props.location.state.exam.paper.exam_switch) {
      const onFocusCallback = () => onFocus(camRefOuter,props);
      window.addEventListener('focus', onFocusCallback);

      return () => {
        window.removeEventListener('focus', onFocusCallback);
      };
    }
  }, [props.location]);
  //------------------------------------------------------------------------------

  //------------------------------------------------------------------------------
  useEffect(() => {
    if (props.location.state === undefined) {
      props.location.state = JSON.parse(localStorage.getItem("ExamState"));
      setCurrentUser(localStorage.getItem("UserState"));
      
      if(localStorage.getItem("ExamState") === undefined || localStorage.getItem("UserState") === undefined)
      {
        setShow(true);
        setMsg('You are redirected because you have refreshed the examination page forcefully');
        if (currentUser && currentUser.role === 'STUDENT') {
          history.replace('/studenthome');
        }
        else if (currentUser && currentUser.role === 'ADMIN') {
          history.replace('/adminhome');
        }
        else if (currentUser && currentUser.role === 'EADMIN') {
          history.replace('/insthome');
        }
      }
    }
  }, [props.location,currentUser])


  useEffect(() => {
    if (myOption) {
      setSelectedOptions(prev => {
        return { ...prev, [questionIndex]: myOption.trim() }
      });
    }
  }, [myOption]);



  //------------------------Restraining back button of browser--------------------
  useEffect(() => {
    window.history.pushState(props.location.state, '', '/startexam');
  }, [props.location]);
  //------------------------------------------------------------------------------



  //------------------------Image Proctoring -------------------------------------------
  useEffect(() => {
    if (props.location.state) {
      if (props.location.state.exam.paper.proctoringType === 'I' && props.location.state.exam.paper.photo_capture) {
        setMyPhotoCapture(true);
      }
      else {
        setMyCameraPerm(true);
      }
    }
  }, [props.location]);
  //------------------------------------------------------------------------------------


  //-------------------------Video Proctoring--------------------------------------------
  useEffect(() => {
    if (props.location.state) {
      if (props.location.state.exam.paper.proctoringType === 'V') {
        setMyVideoCapture(true);
      }
      else {
        setMyCameraPerm(true);
      }
    }
  }, [props.location]);
  //-------------------------------------------------------------------------------------

  useEffect(() => {
    for (let i = 0; i < maxQuestions; i++) {
      questArray[i] = 0;
    }
    setQuestArray(questArray);
  }, []);



  const features = { height: 1080, width: 2000 };

  return (
    /*<NewWindow onUnload={() =>{history.push('/studenthome');}} title='Examination Window' features={features} onBlock={() =>{
      alert('Popups are not enabled in your browser. Please Enable them to Start Examination.');
    }}>*/
    props.location.state && camRefOuter !== undefined ?
      <div className="row animate__animated animate__backInDown animate__slow" id="myExamm" onContextMenu={(e) => { e.preventDefault(); }} style={{ "width": "100%", "margin": "0px", "padding": "0px" }}>
        <div className='card col-lg-12'>
          <div className="card-header bg-primary row align-items-center" style={{ color: "white" }}>
            <div className="col-lg-5 col-md-5">
              <h6><b>Subject: {props.location.state.exam.paper.paper_code}-{props.location.state.exam.paper.paper_name} </b></h6>
            </div>
            <div className="col-lg-5 col-md-5 text-left ">
              {props.location.state.exam.paper.photo_capture === 1 ?
                <h6 className="blink_me"><b>You are Proctored by Invigilator</b></h6>
                : null}
            </div>
            <div className="col-lg-2 col-md-2 text-left">
              <ul className='exam-timer'>
            <li><i className="fas fa-clock fa-lg"></i></li>
            <li> {myCameraPerm && !props.location.state.preview && (
                <MyTimer data={props} setQWTExaust={setQWTExaust} warningDriver={warningDriver} />)}</li>
                </ul>
            </div>
          </div>
        </div>
        <div className="card col-lg-10">
          <div className="card-body">
            <div className="col-lg-12">
             
              {
                props.location.state.exam.paper.exam_mode === 'subjective' && props.location.state.exam.paper.singleFileUpload===1 ?
                  <span style={{ "float": "right" }}><button type="button" className="btn btn-link" onClick={() => {
                    setAtAGlance(true);
                  }}>All Questions</button></span>
                  : null
              }
            </div>
            <QuestionsAtAGlance exam={props.location.state.questions} atAGlance={atAGlance} setAtAGlance={setAtAGlance} examId={props.location.state.exam.id} />
            <WarningsModal setPopupShow={setWarningShow} popupShow={warningShow} popupMsg={warningMsg} warningId={warningId} examId={props.location.state.exam.id} warningHeader={warningHeader} />
            {myCameraPerm && (<QuestionAnswer questions={props} myOption={myOption} setMyOption={setMyOption} selectedOptions={selectedOptions} setDisableBtn={setDisableBtn} setSubjectiveAnswer={setSubjectiveAnswer} subjectiveAnswer={subjectiveAnswer} />)}
            <hr />
            <div className="col-lg-12 row">
              <span>
                {myCameraPerm && !props.location.state.exam.paper.questwisetimer && (<PreviousButton data={props} setMyOption={setMyOption} setSelectedOptions={setSelectedOptions} qwtExaust={qwtExaust} questArray={questArray} />)}
              </span>

              {questionMode === 'O' || questionMode === '' || questionMode === null ?
                <span style={{ "marginLeft": "10px" }}>
                  {myCameraPerm && !props.location.state.preview && !props.location.state.exam.paper.questwisetimer && (<NextSaveButton data={props} myOption={myOption} setMyOption={setMyOption} setSelectedOptions={setSelectedOptions} disableBtn={disableBtn} setDisableBtn={setDisableBtn} qwtExaust={qwtExaust} questArray={questArray} />)}
                </span>
                :
                <span style={{ "marginLeft": "10px" }}>
                  {myCameraPerm && !props.location.state.preview && !props.location.state.exam.paper.questwisetimer && (<NextSaveSubjective data={props} myOption={myOption} setMyOption={setMyOption} setSelectedOptions={setSelectedOptions} disableBtn={disableBtn} setDisableBtn={setDisableBtn} setSubjectiveAnswer={setSubjectiveAnswer} subjectiveAnswer={subjectiveAnswer} qwtExaust={qwtExaust} questArray={questArray} />)}
                </span>
              }

              <span style={{ "marginLeft": "10px" }}>
                {myCameraPerm && props.location.state.preview && (<NextButton data={props} myOption={myOption} setMyOption={setMyOption} setSelectedOptions={setSelectedOptions} />)}
              </span>
              <span style={{ "marginLeft": "10px" }}>
                {myCameraPerm && props.location.state.preview && (<EndPreviewButton index={questionIndex} length={props.location.state.questions.length} data={props} />)}
              </span>
              <span style={{ "marginLeft": "10px" }}>
                {parseInt(props.location.state.exam.paper.review_question) ? myCameraPerm && !props.location.state.preview && (<ReviewLater data={props} myReviewQuestions={myReviewArray} index={questionIndex} disableBtn={disableBtn} setDisableBtn={setDisableBtn} />) : null}
              </span>
              <span style={{ "marginLeft": "auto", "display": "flex", "justifyContent": "right" }}>
                {myCameraPerm && !props.location.state.preview && (<EndExamButton index={questionIndex} length={props.location.state.questions.length} data={props} myOption={myOption} setMyOption={setMyOption} setSelectedOptions={setSelectedOptions} disableBtn={disableBtn} setDisableBtn={setDisableBtn} setSubjectiveAnswer={setSubjectiveAnswer} subjectiveAnswer={subjectiveAnswer} camRefOuter={camRefOuter}/>)}
              </span>
            </div>
            {questionIndex !== props.location.state.questions.length - 1 ?
              <div>
                <center><font color="red"><b>End Exam Button Available on Last Question</b></font></center>
              </div>
              : null}
            {questionMode === 'O' || questionMode === '' || questionMode === null ?
              <div className="col-lg-12">
                {myCameraPerm && (<ClearResponse data={props} myOption={myOption} setMyOption={setMyOption} setSelectedOptions={setSelectedOptions} />)}
              </div>
              : null}


          </div>
        </div>
        <div className="col-lg-2" style={{ "padding": "0px" }}>
            <center><font size="4"><b>{currentUser.username}</b></font></center>
          {myCameraPerm && !props.location.state.exam.paper.questwisetimer && (<QuestionButtons qas={props} setSelectedOptions={setSelectedOptions} setMyOption={setMyOption} myOption={myOption} disableBtn={disableBtn} qwtExaust={qwtExaust} questArray={questArray} setQuestArray={setQuestArray} />)}

          {props.location.state.exam.paper.questwisetimer ?
            myCameraPerm && props.location.state.exam.paper.questwisetimer && (<QuestWiseTimer data={props} setSelectedOptions={setSelectedOptions} setMyOption={setMyOption} qwtExaust={qwtExaust} myOption={myOption} setSubjectiveAnswer={setSubjectiveAnswer} subjectiveAnswer={subjectiveAnswer} />)
            : null}

          {myCameraPerm && (<OverallSummery data={props} />)}
        </div>

        <div className="col-lg-12">
          <center>
            {myPhotoCapture && (<WebCamCapture exam={props.location.state.exam.id} examType={props.location.state.exam.paper.exam_mode} setMyCameraPerm={setMyCameraPerm} CaptureTime={props.location.state.exam.paper.capture_interval} isProctored={props.location.state.exam.paper.proctoring} myCameraPerm={myCameraPerm} ref={camRefOuter} examData={props.location.state.exam} flexiPhotoCapture={props.location.state.exam.paper.flexi_photo_capture}/>)}
          </center>
          <center><br/>
            {
              myVideoCapture && (<StudentVideoConnect examid={props.location.state.exam.id} show={'yes'} setMyCameraPerm={setMyCameraPerm} audio={props.location.state.exam.paper.videoAudio} status={props.location.state.exam.status} resolution={props.location.state.exam.paper.resolution}/>)
            }
          </center>
        </div>

      </div> : null
    /*</NewWindow>*/
  );
}


async function onFocus(camRefOuter,props) {
  if (props.location.state && props.location.state.exam.paper.proctoringType === 'I')
  {
    camRefOuter.current.start();
  }
};

async function onBlurWebView(props, setPopupShow, setPopupMsg, history, mask, setMask, setMaskSwitchContext, webSwitch) {
  webSwitch++;
  const exam = props.location.state.exam;
  const total_allowable_alerts = props.location.state.exam.paper.exam_switch_alerts;
  const ExamId = exam.id;

  if (!mask) {
    if (webSwitch % 2 !== 0) {
      await API.put('/exam/' + ExamId, { "status": "windowswitch" })
        .then(async (res) => {
          if (res.data.status === 'success') {
            setMask(true);
            if (parseInt(res.data.switchedcount) === parseInt(total_allowable_alerts)) {
              //---------------end Examination-----------------------------------
              await handleEndExam(exam, history, setPopupShow, setPopupMsg, res.data.switchedcount);
              //-----------------------------------------------------------------
            }
            else if (parseInt(res.data.switchedcount) + 5 === parseInt(total_allowable_alerts)) {
              setPopupShow(true);
              setPopupMsg('Your Window switching limit is about to expire. Continuing switching window now will end your Examination abruptly.');
            }
            else {
              setPopupShow(true);
              setPopupMsg('Please do not switch window while test is in progress. Doing so multiple times will terminate the test.');
            }
          }
        })
        .catch((error) => {
          setPopupShow(true);
          setPopupMsg('Please do not switch window while test is in progress. Doing so multiple times will terminate the test.');
        });
    }
  }
};


async function onBlur(props, setPopupShow, setPopupMsg, history, mask, setMask, setMaskSwitchContext) {
  const exam = props.location.state.exam;
  const total_allowable_alerts = props.location.state.exam.paper.exam_switch_alerts;
  const ExamId = exam.id;

  if (!mask) {
    await API.put('/exam/' + ExamId, { "status": "windowswitch" })
      .then(async (res) => {
        if (res.data.status === 'success') {
          setMask(true);
          if (parseInt(res.data.switchedcount) === parseInt(total_allowable_alerts)) {
            //---------------end Examination-----------------------------------
            await handleEndExam(exam, history, setPopupShow, setPopupMsg, res.data.switchedcount);
            //-----------------------------------------------------------------
          }
          else if (parseInt(res.data.switchedcount) + 5 === parseInt(total_allowable_alerts)) {
            setPopupShow(true);
            setPopupMsg('Your Window switching limit is about to expire. Continuing switching window now will end your Examination abruptly.');
          }
          else {
            setPopupShow(true);
            setPopupMsg('Please do not switch window while test is in progress. Doing so multiple times will terminate the test.');
          }
        }
      })
      .catch((error) => {
        setPopupShow(true);
        setPopupMsg('Please do not switch window while test is in progress. Doing so multiple times will terminate the test.');
      });
  }
};

async function handleEndExam(exam, history, setPopupShow, setPopupMsg, cnt) {
  const ExamId = exam.id;
  const negative_marking = exam.paper.negative_marking;
  const negative_marks = exam.paper.negative_marks;

  const res = await API.put('/exam/'+ExamId,{"status": "end","negativeMarking":negative_marking,"negativeMarks":negative_marks})
    .then((res) => {
      if (res.data.status === 'success') {
        setPopupShow(true);
        setPopupMsg('Your Examination is Ended abruptly because you switched window ' + cnt + ' times.');
        localStorage.setItem("UserState", undefined);
        localStorage.setItem("ExamState", undefined);
        history.replace("/studenthome");
      }
    })
    .catch((error) => {
      setPopupShow(true);
      setPopupMsg('Please do not switch window while test is in progress. Doing so multiple times will terminate the test.');
    });
}


function getSelectedOptions(questions) {
  let originalSelectedOptions = {};
  questions.map((question, index) => {
    if (question.stdanswer) {
      originalSelectedOptions[index] = question.stdanswer.trim();
    }
    else {
      originalSelectedOptions[index] = question.stdanswer;
    }
  });
  return originalSelectedOptions;
}

function getReviewOptions(questions) {
  let array = [];
  questions.map((question, index) => {
    if (question.answered.indexOf('review') >= 0) {
      array[index] = true;
    }
    else {
      array[index] = false;
    }
  });
  return array;
}

export default Startexam;
