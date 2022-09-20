import React ,{ useState, useEffect, useContext }  from 'react';
import CountdownTimer from "react-component-countdown-timer";
import { useHistory } from 'react-router-dom';
import API from '../../api';
import {UserContext} from '../../App';
import WarningsModal from '../../WarningsModal'; 
import {en,de} from '../../utils/Helper';

const timer_exaust = process.env.REACT_APP_TIMER_EXAUST_ALERT;

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

function MyTimer(props) 
{
        let [timer, setTimer]                 = useState();
        let [changeColor, setChangeColor]     = useState('#ffffff');
        let [blinking, setBlinking]           = useState('');
        const exam                            = props.data.location.state.exam;
        const warningDriver                   = props.warningDriver;
        const examId                          = exam.id;
        let history                           = useHistory();
        const {currentUser }                  = useContext(UserContext);

        const [warningShow, setWarningShow]             =   useState(false);
        const [warningMsg, setWarningMsg]               =   useState();
        const [warningId, setWarningId]                 =   useState();
        const [localTimer,setLocalTimer]                =   useState();

        useEffect(() => 
        {
          if(localStorage.getItem("etime") !== undefined && localStorage.getItem("etime") !== null && localStorage.getItem("etime") !== NaN && localStorage.getItem("etime") !== "undefined" )
          {
            setLocalTimer(parseInt(localStorage.getItem("etime")));
          }
          else if(timer !== undefined)
          {
            setLocalTimer(timer);
          }
        },[timer]);

        useEffect(() => 
        {
          if(localTimer !== undefined && localTimer > 0)
          {
            let timeInterval = setInterval(() => {
              localStorage.setItem("etime", localTimer-1);
              setLocalTimer(localTimer-1);
            }, 1000);

            return () => {
              clearInterval(timeInterval);
            }
          }
        },[localTimer]);

        //------------------------Api call for handling exam time for force refrersh-----------------------------
        useEffect(() => 
        {
          if(props && currentUser)
          {
            let examDuration                    = exam.paper.duration;
            if(currentUser && currentUser.ph === 'PH')
            {
              let extraTime = exam.paper.ph_time;
              examDuration  = examDuration + extraTime;
            } 
            let currentTime = localStorage.getItem("etime");
            if(currentTime !== undefined || currentTime !== null || currentTime !== NaN)
            {
              sessionAfterRefresh(setTimer,examId,examDuration,setChangeColor,setBlinking,props,history,setWarningShow,setWarningMsg,setWarningId,warningDriver,currentTime);
            }
          }
        },[currentUser]);
        //--------------------------------------------------------------------------------------------------------

        useUnload(e => {
          e.preventDefault();
        });

        if(blinking !== '' && props.data.location.state.exam.paper.questwisetimer === 1)
        { //---to disable question wise timer-------------
            props.setQWTExaust(true);
        }

        useEffect(() =>
        {
          let examDuration                    = exam.paper.duration;
          if(currentUser && currentUser.ph === 'PH')
          {
            let extraTime = exam.paper.ph_time;
            examDuration  = examDuration + extraTime;
          }

          getTimer(setTimer,examId,examDuration,setChangeColor,setBlinking,props,history);
          const heartBeatDuration = process.env.REACT_APP_HEART_BEAT_DURATION;

          //------------Elapsed Time Book Keeping-------------------------------
          let myInterval = setInterval(() => 
          {
            manageExamSession(setTimer,examId,examDuration,setChangeColor,setBlinking,props,history,setWarningShow,setWarningMsg,setWarningId,warningDriver);
          }, heartBeatDuration)
          //--------------------------------------------------------------------

          //--------------Cleanup Function--------------------------------------
          return () => {
                    clearInterval(myInterval);
          }
          //--------------------------------------------------------------------
        },[examId,currentUser,exam]);

        return (
            timer && localTimer && localTimer !== NaN && localTimer !== null ? 
            <>
              <CountdownTimer count={localTimer} hideDay size={18} backgroundColor="#007bff" color={changeColor} onEnd={() => {handleEndExam(props,history);}} className={blinking}/>
              
              <WarningsModal setPopupShow={setWarningShow} popupShow={warningShow} popupMsg={warningMsg} warningId={warningId} examId={examId}/>
            </>
            : null
        );
}

async function getTimer(setTimer,examId, examDuration,setChangeColor,setBlinking,props,history)
{
  const duration = examDuration * 60;
  await API.get('/examSession',{params: {"exam_id": examId}})
  .then((res) => {
    const timerData = res.data;  
    if((duration-de(timerData.elapsedTime)) <= timer_exaust)
    {
      setChangeColor('#ff0000');
      setBlinking('blinking');
    }
    setTimer(duration - de(timerData.elapsedTime));

    //--------------------End Exam if Auto End is called------------------------------
    if(de(timerData.examStatus) === 'over')
    {
      handleEndExam(props,history);
    }
    //--------------------------------------------------------------------------------
  })
  .catch((error) =>
  {
    
  });
}

async function sessionAfterRefresh(setTimer,examId,examDuration,setChangeColor,setBlinking,props,history,setWarningShow,setWarningMsg,setWarningId,warningDriver,currentTime)
{
  const duration = examDuration * 60;
  await API.put('/examSession',{"exam_id": en(examId),"currentTime":en(currentTime),"duration":en(duration)})
  .then((res) => 
  {
    const timerData = res.data;
    let elapsedTime = parseInt(de(timerData.elapsedTime));
    let examStatus = de(timerData.examStatus);
  
    if((duration-elapsedTime) <= timer_exaust)
    {
      setChangeColor('#ff0000');
      setBlinking('blinking');
    }
    setTimer(duration - elapsedTime);

    //--------------------End Exam if Auto End is called------------------------------
    if(examStatus === 'over')
    {
      handleEndExam(props,history);
    }
    //--------------------------------------------------------------------------------
  })
}


async function manageExamSession(setTimer,examId, examDuration,setChangeColor,setBlinking,props,history,setWarningShow,setWarningMsg,setWarningId,warningDriver)
{
  const duration = examDuration * 60;
  await API.put('/examSession',{"exam_id": examId})
  .then((res) => 
  {
    const timerData = res.data;
    let elapsedTime = parseInt(de(timerData.elapsedTime));
    let examStatus = de(timerData.examStatus);
  
    if((duration-elapsedTime) <= timer_exaust)
    {
      setChangeColor('#ff0000');
      setBlinking('blinking');
    }
    setTimer(duration - elapsedTime);

    if(timerData.warningId !== '' && timerData.warningId !== undefined && timerData.warningId !== null)
    {
      if(warningDriver ==='database')
      {
        setWarningShow(true);
        setWarningId(timerData.warningId);
        setWarningMsg(timerData.warningMsg);
      }
    }

    //--------------------End Exam if Auto End is called------------------------------
    if(examStatus === 'over')
    {
      handleEndExam(props,history);
    }
    //--------------------------------------------------------------------------------
  })
  
}

async function handleEndExam(props,history)
{
  const exam                = props.data.location.state.exam;
  const ExamId              = exam.id;
  const negative_marking    = exam.paper.negative_marking;
  const negative_marks      = exam.paper.negative_marks;

  const res = await API.put('/exam/'+ExamId,{"status": "end","negativeMarking":negative_marking,"negativeMarks":negative_marks});
  if(res.data.status === 'success')
  {
    localStorage.setItem("UserState", undefined);
    localStorage.setItem("ExamState", undefined);
    history.replace("/studenthome");
  }
}



export default MyTimer;
