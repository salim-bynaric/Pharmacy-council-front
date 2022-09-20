import React, { useState, useContext, useEffect } from 'react';
import MathJax from 'react-mathjax-preview';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import { useHistory } from 'react-router-dom';
import API from '../../api';
import { ShowContext, ExamFolderContext } from '../../App';
import { QuestModeContext } from '../../App';
import { Markup } from 'interweave';
import { en, de } from '../../utils/Helper';

function Options(props) {
  const { setQuestionMode } = useContext(QuestModeContext);
  const [isOpen, setIsOpen] = useState(false);
  const projpath = process.env.REACT_APP_PROJPATH;
  const { examFolder } = useContext(ExamFolderContext);
  const dataFolder = examFolder;
  let opt = '';
  let optType = '';
  let optImg = '';
  let opt_path = '';
  let history = useHistory();
  const maxQuestions = parseInt(props.data.questions.location.state.questions.length);
  const { setShow, setMsg } = useContext(ShowContext);

  const questionIndex = props.data.questions.location.state.currentQuestionIndex;
  let selectedOptions = props.selectedOptions;

  let mathIndexes = []
  let textIndexes = [];
  let optArray = [];

  if (props.opt) {
    opt = props.opt.split(':$:')[0];
    mathIndexes = getMathIndexes(opt);
    textIndexes = getTextIndexes(mathIndexes, opt);
    optArray = mergeTwoArr(textIndexes, mathIndexes, opt);

    optType = props.opt.split(':$:')[1];
  }
  if (props.optimage) {
    optImg = props.optimage.split(':$:')[0];
    optType = props.optimage.split(':$:')[1];
    opt_path = projpath + "data/" + dataFolder + "/files/" + optImg;
  }

  useEffect(() => {
    if(selectedOptions === undefined)
    {
      selectedOptions = props.data.questions.location.state.questions[questionIndex].stdanswer;
      props.setMyOption(selectedOptions);
    }
  },[selectedOptions]);


  useEffect(() => {
    setQuestionMode('O');
  }, []);
  let i = 0;
  return (
    questionIndex !== undefined && questionIndex !== undefined?
      <div style={{ "paddingTop": "10px" }} className="col-lg-12 row" onClick={async () => {
        props.setDisableBtn(true);
        await saveOption(props, questionIndex, history, maxQuestions, optType, setShow, setMsg);
        props.setMyOption(undefined);
        props.setDisableBtn(false);
        props.setMyOption(optType);
      }} style={verifyOption(questionIndex, selectedOptions, optType) ? { "backgroundColor": "#F0F0F0", "borderRadius": "5px" } : { "overflow": "auto" }}
      >
        <span style={{ "marginTop": "15px" }}>
          <input checked={verifyOption(questionIndex, selectedOptions, optType)} type="radio" name="option" value={optType} onChange={() => {
            props.setMyOption(optType);
          }} />
        </span>
        <span style={{ "marginLeft": "10px", "marginTop": "15px" }}>
          {
            opt !== undefined && opt !== null ?
              optArray.map((data, index) => {
                if (index % 2 === 0) {
                  return <Markup content={optArray[index]} key={i++} />
                }
                else {
                  return <MathJax math={optArray[index]} key={i++} />
                }
              })
              : null
          }
        </span>
        {isOpen && (<Lightbox
          mainSrc={opt_path}
          onCloseRequest={() => setIsOpen(false)}
        />
        )}
        <img src={opt_path} alt="" onClick={() => setIsOpen(true)} title="Click on Image to Enlarge" onDragStart={(e) => { e.preventDefault(); }} />
      </div>
      : null
  );
}

function mergeTwoArr(textIndexes, mathIndexes, question) {
  let arr = [];
  let val = [];
  let t = 0, m = 0;
  for (let i = 0; i < (textIndexes.length + mathIndexes.length); i++) {
    if (i % 2 === 0) {
      arr.push(textIndexes[t++]);
    }
    else {
      arr.push(mathIndexes[m++]);
    }
  }

  for (let i = 0; i < arr.length; i++) {
    let first = arr[i].split('-')[0];
    let second = arr[i].split('-')[1];

    val[i] = question.substring(first, second);
  }
  return val;
}

function getTextIndexes(mathIndexes, question) {
  let textIndexes = [];
  let latstMathEnd = 0;
  let mathStart = 0;
  let mathEnd = 0;
  if (question !== null && question !== undefined) {
    if (mathIndexes.length > 0) {
      for (let i = 0; i < mathIndexes.length; i++) {
        let start = 0; let end = 0;

        if (i === 0) {
          mathStart = parseInt(mathIndexes[i].split('-')[0]);
          mathEnd = parseInt(mathIndexes[i].split('-')[1]);
          if (mathStart > 0) {
            textIndexes.push('0-' + (mathStart));
          }
          else {
            textIndexes.push('0-0');
          }
          latstMathEnd = mathEnd;
        }
        else {
          mathStart = parseInt(mathIndexes[i].split('-')[0]);
          mathEnd = parseInt(mathIndexes[i].split('-')[1]);

          textIndexes.push((latstMathEnd) + '-' + (mathStart));
          latstMathEnd = mathEnd;
        }
      }
      textIndexes.push((latstMathEnd) + '-' + (parseInt(question.length)));
    }
    else {
      textIndexes.push((0 + '-' + question.length));
    }
  }
  return textIndexes;
}

function getMathIndexes(question) {
  let count = 0;
  let mathIndex = [];
  if (question !== null && question !== undefined) {
    let totalLength = question.length;
    //-------------------Find number of <math> Tags--------------------------------------------------
    if (question.match(/<math/g) !== null) {
      count = question.match(/<math/g).length;
    }
    //-----------------------------------------------------------------------------------------------

    //-------------------Find indexes of <math> and </math> for each math tag and store in array-----
    let lastEnd = 0;
    for (let i = 0; i < count; i++) {
      let start = question.indexOf('<math');
      let end = question.indexOf('</math>') + 7;

      if (i === 0) {
        mathIndex.push((lastEnd + start) + '-' + (lastEnd + end));
        lastEnd = lastEnd + end;
      }
      else {
        mathIndex.push((lastEnd + start) + '-' + (lastEnd + end));
        lastEnd = lastEnd + end;
      }
      question = question.substr(end, question.length);
    }
    //-----------------------------------------------------------------------------------------------
  }
  return mathIndex;
}

function verifyOption(questionIndex, selectedOptions, optType) {
  if (selectedOptions && selectedOptions[questionIndex]) 
  {
    return selectedOptions[questionIndex].trim() === optType.trim();
  }
  else 
  {
    if(selectedOptions)
    {
      return selectedOptions[questionIndex] === optType;
    }
  }
}

async function saveOption(props, index, history, maxQuestions, myOption, setShow, setMsg) {
  let myQuestions = props.data.questions.location.state.questions;
  const myIndex = index;
  const curOptionStatus = myQuestions[myIndex].answered;
  const answerId = myQuestions[myIndex].id;
  let newOptionStatus = '';

  let questWiseTimer = props.exam.paper.questwisetimer;

  let myUnsolvedQuestionIndexes = props.data.questions.location.state.unsolvedQuestionIndexes;
  let mySolvedQuestionIndexes = props.data.questions.location.state.solvedQuestionIndexes;
  let myMarkedUnsolvedIndexes = props.data.questions.location.state.markedUnsolvedIndexes;
  let myMarkedSolvedIndexes = props.data.questions.location.state.markedSolvedIndexes;

  //-----------------------Find new option status2---------------------------
  if (curOptionStatus === 'unanswered') {
    newOptionStatus = 'answered';
  }
  else if (curOptionStatus === 'unansweredandreview') {
    newOptionStatus = 'answeredandreview';
  }
  else {
    newOptionStatus = curOptionStatus;
  }
  //-----------------------------------------------------------------
  //-----------------------Send Data to Server--------------------------------
  const ExamId = props.data.questions.location.state.exam.id;

  await API.put('/answer/' + answerId, { "type": "saveanswer", "answered": en(newOptionStatus), "stdanswer": en(myOption), "answer_by": en('' + ExamId + ''), "curQuestion": en('' + myIndex + ''),"questWiseTimer" : en(''+questWiseTimer+'') })
    .then(async (res) => {
      if (res.data.status === 'success') {
        //-----------------------Save Data to Local Array---------------------------
        if (curOptionStatus === 'unanswered') {
          newOptionStatus = 'answered';
          myQuestions[myIndex].answered = newOptionStatus;
          myQuestions[myIndex].stdanswer = myOption;
          myUnsolvedQuestionIndexes = myUnsolvedQuestionIndexes.filter(item => item !== myIndex);

          mySolvedQuestionIndexes.push(myIndex);
          myUnsolvedQuestionIndexes.sort();
          mySolvedQuestionIndexes.sort();
        }
        else if (curOptionStatus === 'unansweredandreview') {
          newOptionStatus = 'answeredandreview';
          myQuestions[myIndex].answered = newOptionStatus;
          myQuestions[myIndex].stdanswer = myOption;
          myMarkedUnsolvedIndexes = myMarkedUnsolvedIndexes.filter(item => item !== myIndex);

          myMarkedSolvedIndexes.push(myIndex);
          myMarkedUnsolvedIndexes.sort();
          myMarkedSolvedIndexes.sort();
        }
        else {
          newOptionStatus = curOptionStatus;
          myQuestions[myIndex].answered = newOptionStatus;
          myQuestions[myIndex].stdanswer = myOption;
        }
        //-----------------------------------------------------------------
        mySolvedQuestionIndexes = [...new Set(mySolvedQuestionIndexes)];
        myUnsolvedQuestionIndexes = [...new Set(myUnsolvedQuestionIndexes)];
        myMarkedSolvedIndexes = [...new Set(myMarkedSolvedIndexes)];
        myMarkedUnsolvedIndexes = [...new Set(myMarkedUnsolvedIndexes)];
        //---------------Count mismatch handling----------by api call-------------------   
        let mergedArray = [...mySolvedQuestionIndexes,...myUnsolvedQuestionIndexes,...myMarkedSolvedIndexes,...myMarkedUnsolvedIndexes];

        if(mergedArray.length !== maxQuestions) 
        {
          await API.get('/answer', { params: { "exam_id": ExamId } })
            .then(res1 => 
            {
              myQuestions = JSON.parse(de(res1.data.data));
            });

          mySolvedQuestionIndexes = getIndexes(myQuestions, 'answered'); 
          myUnsolvedQuestionIndexes = getIndexes(myQuestions, 'unanswered');
          myMarkedSolvedIndexes = getIndexes(myQuestions, 'answeredandreview');
          myMarkedUnsolvedIndexes = getIndexes(myQuestions, 'unansweredandreview');
        }

        mergedArray = [...new Set(mergedArray)];

        if(mergedArray.length !== maxQuestions) 
        {
          await API.get('/answer', { params: { "exam_id": ExamId } })
            .then(res1 => 
            {
              myQuestions = JSON.parse(de(res1.data.data));
            });

          mySolvedQuestionIndexes = getIndexes(myQuestions, 'answered'); 
          myUnsolvedQuestionIndexes = getIndexes(myQuestions, 'unanswered');
          myMarkedSolvedIndexes = getIndexes(myQuestions, 'answeredandreview');
          myMarkedUnsolvedIndexes = getIndexes(myQuestions, 'unansweredandreview');
        }

        //------------------------------------------------------------------------------

        const examDetailsButtons = {
          exam: props.data.questions.location.state.exam,
          questions: myQuestions,
          currentQuestionIndex: myIndex,
          solvedQuestionIndexes: mySolvedQuestionIndexes, unsolvedQuestionIndexes: myUnsolvedQuestionIndexes,
          markedSolvedIndexes: myMarkedSolvedIndexes,
          markedUnsolvedIndexes: myMarkedUnsolvedIndexes
        }
        props.setMyOption(myOption);
        history.replace("/startexam", examDetailsButtons);
      }
    })
    .catch(error => {
      setShow(true);
      setMsg('Problem Saving your Response. Please Try Again...');

      const examDetailsButtons = {
        exam: props.data.questions.location.state.exam,
        questions: props.data.questions.location.state.questions,
        currentQuestionIndex: myIndex,
        solvedQuestionIndexes: props.data.questions.location.state.solvedQuestionIndexes, unsolvedQuestionIndexes: props.data.questions.location.state.unsolvedQuestionIndexes,
        markedSolvedIndexes: props.data.questions.location.state.markedSolvedIndexes,
        markedUnsolvedIndexes: props.data.questions.location.state.markedUnsolvedIndexes,
      }
      props.setMyOption(undefined);
      history.replace("/startexam", examDetailsButtons);
    });
  //--------------------------------------------------------------------------
}

function getSelectedOptions(questions) {
  let originalSelectedOptions = {};
  originalSelectedOptions = questions.map((question, index) => {
    return question.stdanswer
  });
  return originalSelectedOptions;
}


function getIndexes(myQuestions, searchString) {
  let arr = [];
  myQuestions.forEach(function (question, index) {
    if (question.answered === searchString) {
      arr.push(index);
    }
  });
  return arr;
}


export default Options;
