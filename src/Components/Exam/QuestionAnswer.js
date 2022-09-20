import React, { useState, useEffect, useContext } from 'react';
import Options from "./Options";
import MathJax from 'react-mathjax-preview';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import SubjectiveAnswer from './SubjectiveAnswer';
import SubjectiveImageUpload from './SubjectiveImageUpload';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { MaskContext, ExamFolderContext, BrowserContext } from '../../App';
import { Markup } from 'interweave';

function QuestionAnswer(props) {
  const { setMask } = useContext(MaskContext);
  const { examFolder } = useContext(ExamFolderContext);
  const questions = props.questions.location.state.questions;
  const index = props.questions.location.state.currentQuestionIndex;
  const [isOpen, setIsOpen] = useState(false);
  const showMarks = parseInt(props.questions.location.state.exam.paper.question_marks);
  const exam = props.questions.location.state.exam;
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => { setShowModal(false); setMask(false); }

  const [showModal1, setShowModal1] = useState(false);
  const handleClose1 = () => { setShowModal1(false); }


  let preview = props.questions.location.state.preview;
  let option = questions[index].options.split(',');
  let opta = null, optb = null, optc = null, optd = null;
  let optimga = null, optimgb = null, optimgc = null, optimgd = null, quest = null;
  const { browserName, cameraReff } = useContext(BrowserContext);
  //----------------------------Option Shuffling Logic--------------------------
  if (option[0] === 'a') {
    opta = questions[index].question.optiona;
    optimga = questions[index].question.a1;
  }
  else if (option[0] === 'b') {
    opta = questions[index].question.optionb;
    optimga = questions[index].question.a2;
  }
  else if (option[0] === 'c') {
    opta = questions[index].question.optionc;
    optimga = questions[index].question.a3;
  }
  else if (option[0] === 'd') {
    opta = questions[index].question.optiond;
    optimga = questions[index].question.a4;
  }

  if (option[1] === 'a') {
    optb = questions[index].question.optiona;
    optimgb = questions[index].question.a1;
  }
  else if (option[1] === 'b') {
    optb = questions[index].question.optionb;
    optimgb = questions[index].question.a2;
  }
  else if (option[1] === 'c') {
    optb = questions[index].question.optionc;
    optimgb = questions[index].question.a3;
  }
  else if (option[1] === 'd') {
    optb = questions[index].question.optiond;
    optimgb = questions[index].question.a4;
  }

  if (option[2] === 'a') {
    optc = questions[index].question.optiona;
    optimgc = questions[index].question.a1;
  }
  else if (option[2] === 'b') {
    optc = questions[index].question.optionb;
    optimgc = questions[index].question.a2;
  }
  else if (option[2] === 'c') {
    optc = questions[index].question.optionc;
    optimgc = questions[index].question.a3;
  }
  else if (option[2] === 'd') {
    optc = questions[index].question.optiond;
    optimgc = questions[index].question.a4;
  }

  if (option[3] === 'a') {
    optd = questions[index].question.optiona;
    optimgd = questions[index].question.a1;
  }
  else if (option[3] === 'b') {
    optd = questions[index].question.optionb;
    optimgd = questions[index].question.a2;
  }
  else if (option[3] === 'c') {
    optd = questions[index].question.optionc;
    optimgd = questions[index].question.a3;
  }
  else if (option[3] === 'd') {
    optd = questions[index].question.optiond;
    optimgd = questions[index].question.a4;
  }
  //----------------------------------------------------------------------------
  //------------------------------Question Variables----------------------------
  let question = '';
  const projpath = process.env.REACT_APP_PROJPATH;
  let question_path = '';
  const dataFolder = examFolder;
  //----------------------------------------------------------------------------

  if (questions[index] && !questions[index].question.qu_fig) {
    question = questions[index].question.question;
  }
  else {
    if (questions[index]) {
      question = questions[index].question.question;
      question_path = projpath + "data/" + dataFolder + "/files/" + questions[index].question.qu_fig;
    }
  }
  let mathIndexes = getMathIndexes(question);
  let textIndexes = getTextIndexes(mathIndexes, question);
  let questArray = mergeTwoArr(textIndexes, mathIndexes, question);
  let i = 0;
  
  return (
    questions[index] ?
      <div className="col-lg-12 row">
        {questions[index].question.quest_type !== 'S' ?
          ((questions[index].question.qu_fig !== undefined || questions[index].question.a1 !== undefined || questions[index].question.a2 !== undefined || questions[index].question.a3 !== undefined || questions[index].question.a4 !== undefined) && (questions[index].question.qu_fig !== null || questions[index].question.a1 !== null || questions[index].question.a2 !== null || questions[index].question.a3 !== null || questions[index].question.a4 !== null) && (questions[index].question.qu_fig !== '' || questions[index].question.a1 !== '' || questions[index].question.a2 !== '' || questions[index].question.a3 !== '' || questions[index].question.a4 !== '')) ?
            <div className="alert alert-success col-lg-12" role="alert">
              Click on Image to Magnify...
            </div>
            :
            null
          :
          ((questions[index].question.qu_fig !== undefined && questions[index].question.qu_fig !== null && questions[index].question.qu_fig !== '')) ?
            <div className="alert alert-success col-lg-12" role="alert">
              Click on Image to Magnify...
            </div>
            : null
        }
        <div className="col-lg-12">
          <b>Question {questions[index].qnid_sr}: &nbsp;&nbsp;<span className='sub-head'> Section:{questions[index].question.section}</span></b>
          <span style={{ float: "right" }}>
            {showMarks ? <div style={{ float: 'right' }}><b>{'Marks: ' + questions[index].marks}</b></div> : null}
          </span>
        </div>

        {/**********Actual Question Display********************************************/}
        <div className="col-lg-12 scroll1" style={{ height: "120px", overflow: "auto", "WebkitOverflowScrolling": "touch" }}>
          <div onClick={() => { setShowModal1(true); }}>
          {
            question !== undefined && question !== null ?
              questArray.map((data, index) => {
                if (index % 2 === 0) {
                  return <Markup content={questArray[index]} key={i++} />
                }
                else {
                  return <MathJax math={questArray[index]} key={i++} />
                }
              })
              : null
          }
          </div>
          <br />
          {isOpen && (<Lightbox
            mainSrc={question_path}
            onCloseRequest={() => setIsOpen(false)}
          />
          )}
          <img src={question_path} alt="" onClick={() => setIsOpen(true)} title="Click on Image to Enlarge" onDragStart={(e) => { e.preventDefault(); }} />
        </div>
        {/**********Question Display Ends********************************************/}

        

        {/*************************************Question Modal************************/}
        <Modal show={showModal1} onHide={() => { handleClose1(); }} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Question {questions[index].qnid_sr}</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{"minHeight":"150px","maxHeight":"500px","overflow": "auto","marginBottom":"10px","borderRadius":"5px"}} className="scroll1">
            {/**********Actual Question Display********************************************/}
            <div className="col-lg-12 scroll1" style={{ overflow: "auto"}} onClick={() => { setShowModal1(true); }}>
              {
                question !== undefined && question !== null ?
                  questArray.map((data, index) => {
                    if (index % 2 === 0) {
                      return <Markup content={questArray[index]} key={i++} />
                    }
                    else {
                      return <MathJax math={questArray[index]} key={i++} />
                    }
                  })
                  : null
              }
            </div>
            {/**********Question Display Ends********************************************/}
          </Modal.Body>
        </Modal>
        {/*************************************Question Modal Ends*******************/}

        <div className="col-lg-12">
          <hr />
        </div>
        <div className="col-lg-12 scroll1" style={{ height: "255px", overflowY: "scroll" }}>

          {(questions[index].question.quest_type === 'O' || questions[index].question.quest_type === '' || questions[index].question.quest_type === null || questions[index].question.quest_type === undefined) ?
            <>
              <Options id="optiona" opt={opta} optimage={optimga} qu={questions[index]} setMyOption={props.setMyOption} data={props} selectedOptions={props.selectedOptions} myOption={props.myOption} setDisableBtn={props.setDisableBtn} exam={exam}/>
              <hr />
              <Options id="optionb" opt={optb} optimage={optimgb} qu={questions[index]} setMyOption={props.setMyOption} data={props} selectedOptions={props.selectedOptions} myOption={props.myOption} setDisableBtn={props.setDisableBtn} exam={exam}/>
              <hr />
              <Options id="optionc" opt={optc} optimage={optimgc} qu={questions[index]} setMyOption={props.setMyOption} data={props} selectedOptions={props.selectedOptions} myOption={props.myOption} setDisableBtn={props.setDisableBtn} exam={exam}/>
              <hr />
              <Options id="optiond" opt={optd} optimage={optimgd} qu={questions[index]} setMyOption={props.setMyOption} data={props} selectedOptions={props.selectedOptions} myOption={props.myOption} setDisableBtn={props.setDisableBtn} exam={exam}/>
            </>
            :
            questions[index].question.allowImageUpload === 'Y' ?
              <div className="col-lg-12">
                <button className="btn btn-success btn-sm" onClick={() => { setShowModal(true); }} style={{ "margin": "10px" }}>Upload Answer as File</button>

                <SubjectiveAnswer data={props} index={index} questions={questions} allowImageUpload={questions[index].question.allowImageUpload} setSubjectiveAnswer={props.setSubjectiveAnswer} subjectiveAnswer={props.subjectiveAnswer} exam={exam} />
              </div>
              :
              <SubjectiveAnswer data={props} index={index} questions={questions} allowImageUpload={questions[index].question.allowImageUpload} setSubjectiveAnswer={props.setSubjectiveAnswer} subjectiveAnswer={props.subjectiveAnswer} exam={exam} />
          }
        </div>
        {/*-------------------------------------Modal---------------------------------------*/}
        <Modal show={showModal} onHide={handleClose} backdrop="static" size="lg">
          <Modal.Header closeButton style={{ backgroundColor: "OliveDrab", color: "white" }}>
            <Modal.Title>Upload Scanned Answer File</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="col-lg-12">
              <ol>
                <li>Please Upload only jpg,jpeg,ppt,pptx,doc,docx,xls,xlsx,pdf files.</li>
                <li>You can upload multiple files (<b>Maximum 5 Files</b>).</li>
                <li>You can upload file less than 5 MB.</li>
                <li>Upload file from your own computer or mobile device. Uploading file from online drive is not supported.</li>
              </ol>
            </div>
            <hr />
            <div className="col-lg-12">
              <SubjectiveImageUpload data={props} index={index} questions={questions} setMyOption={props.setMyOption} />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={() => {
              handleClose(); setMask(false);
              if (cameraReff !== undefined && cameraReff.current !== undefined) {
                cameraReff.current.start();
              }
            }} style={{ float: "right" }}>Close</Button>
          </Modal.Footer>
        </Modal>
        {/*-------------------------------------Modal End---------------------------------------*/}
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

function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

export default QuestionAnswer;
