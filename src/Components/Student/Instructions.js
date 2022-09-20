import React, { useState, useEffect, useContext } from 'react';
import { useHistory, useLocation, Link } from 'react-router-dom';
import Modal from "react-bootstrap/Modal";
import API from '../../api';
import WebCamCapture from '../Exam/WebCamCapture';
import { UserContext } from '../../App';
import { ShowContext } from '../../App';
import { de } from '../../utils/Helper';
import MalpracticeTable from './MalpracticeTable';
import StudentVideoConnect from '../Exam/StudentVideoConnect';
import StudyMaterial from './StudyMaterial';

function useOptions() {
  let history = useHistory();
  let location = useLocation();
  let [exam, setExam] = useState();
  let myExam = undefined;

  if (location.state && location.state.exam) {
    myExam = location.state.exam;
  }
  useEffect(() => {
    if (myExam !== undefined) {
      setExam(myExam);
    }
    else {
      if (location.state && location.state.role === 'STUDENT') {
        history.replace("/studenthome");
      }
      else {
        history.replace("/adminexamreport");
      }
    }
  }, [myExam, history]);

  return exam;
}


function Instructions(props) {
  const [checked, setChecked] = useState(false);
  const [startexam, setStartexam] = useState(true);
  const [testCode, setTestCode] = useState('');
  let history = useHistory();
  let exam = useOptions();
  let location = useLocation();
  let [myCameraPerm, setMyCameraPerm] = useState(false);
  const { currentUser } = useContext(UserContext);
  const { setShow, setMsg } = useContext(ShowContext);
  const [show, setShow1] = useState(false);
  const handleClose = () => setShow1(false);

  localStorage.setItem("etime", undefined);

  let shuffleOptions = [];
  let innstructions = (exam !== undefined && exam.paper !== undefined) ? exam.paper.instructions : '';

  let BtnLabel = '';
  let negativeMarks = '';
  let flexi_photo_capture = '';
  if (exam) {
    if (exam.paper !== undefined) {
      flexi_photo_capture = exam.paper.flexi_photo_capture;
    }

    if (exam.examstatus === 'inprogress') {
      BtnLabel = 'Continue Exam';
    }
    else {
      BtnLabel = 'Start Exam';
    }

    if (location.state.role === 'ADMIN') {
      BtnLabel = 'Preview Exam';
    }

    (exam.paper !== undefined && (exam.paper.negative_marks === 0 || exam.paper.negative_marks === null || exam.paper.negative_marks === '')) ? negativeMarks = 'No' : negativeMarks = 'Yes';

    if (exam.paper !== undefined) {
      for (let i = 0; i < exam.paper.questions; i++) {
        shuffleOptions.push(shuffleArray(['optiona', 'optionb', 'optionc', 'optiond']));
      }
    }
  }

  return (
    exam && exam.paper !== undefined && currentUser ?
      <div className="animate__animated animate__flash animate_slower">
        <div className="container-fluid col-lg-12 row">
          <div className='col-lg-6'>
            <div className="card" style={{ "marginTop": "30px" }}>
              <div className="card-header bg-primary" style={{ color: "white" }}>
                <div className='col-lg-12'><h5><center><b>Instructions</b></center></h5></div>
              </div>
              <div className="card-body">
                <div className="col-lg-8">
                  <h6><b>{currentUser.username}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{exam.paper.paper_name}</b></h6>
                  <ol>
                    <li> Welcome to Online Exam for {exam.paper.paper_name}</li>
                    {
                      innstructions !== null && innstructions ?
                        innstructions.split(',').map((instruction, index) => {
                          return <li key={index}><b>{instruction}</b></li>
                        })
                        : null
                    }
                    <li> Exam has total {exam.paper.questions} Questions</li>
                    <li> Physical Handicap Status: <b>{currentUser.ph === 'PH' ? 'Yes' : 'No'}</b></li>
                    <li> Total time for Exam is {currentUser.ph === 'PH' ? exam.paper.duration + exam.paper.ph_time : exam.paper.duration} Mins</li>
                    {/*<li> Negative Marking Exam: <b>{negativeMarks}</b></li>*/}
                    <li> Close all other windows/apps</li>
                    <li> Do not close browser/app before logging out</li>
                  </ol>
                </div>
                <div className="col-lg-12 row">
                  {
                    exam.paper.useTestCode ?
                      <>
                        <div className="col-lg-2" style={{ "marginBottom": "20px" }}><b>Enter Test Code</b></div>
                        <div className="col-lg-4" style={{ "marginBottom": "20px" }}>
                          <input type="text" className='form-control' placeholder='Enter Test Code' onChange={(e) => {
                            setTestCode(e.target.value);
                          }} value={testCode} />
                        </div>
                      </>
                      : null
                  }
                </div>
                <div className="col-lg-12">
                  <center><h5><i>Best of Luck for your Exam</i></h5></center>
                </div>
                <div className="col-lg-12">
                  {
                    exam.paper.proctoringType === 'I' && exam.paper.photo_capture === 1 ?
                      <WebCamCapture exam={location.state.exam.id} setMyCameraPerm={setMyCameraPerm} show={'no'} CaptureTime={location.state.exam.paper.capture_interval} isProctored={location.state.exam.paper.proctoring} capture="no" flexiPhotoCapture={flexi_photo_capture} />
                      :
                      exam.paper.proctoringType === 'V' ?
                        <StudentVideoConnect examid={location.state.exam.id} show={'yes'} setMyCameraPerm={setMyCameraPerm} audio={exam.paper.videoAudio} status={location.state.exam.status} resolution={location.state.exam.paper.resolution} />
                        : null
                  }
                </div>
              </div>
              <div className="card-footer">
                <center>
                  <input type="checkbox" id="read" name="read" defaultChecked={checked} onChange={() => setChecked(!checked)} /> &nbsp;&nbsp; I Agree / मला मान्य आहे <br /><br />
                  {BtnLabel !== 'Preview Exam' ?
                    exam.paper.proctoringType === 'I' && exam.paper.photo_capture === 1 ?
                      <button disabled={flexi_photo_capture === 1 ? (!checked) : (!checked || !myCameraPerm)}
                        onClick={() => {
                          if (BtnLabel === 'Continue Exam') {
                            if (exam.paper.useTestCode === 1) {
                              if (testCode !== '') {
                                if (testCodeMatched(testCode, exam.testCode)) { setShow1(true); } else { setShow1(false); setShow(true); setMsg('Invalid Test Code Entered.'); }
                              }
                              else {
                                setShow(true);
                                setMsg('Please Enter Test Code for Starting Examination.');
                                return false;
                              }
                            }
                            else {
                              setShow1(true);
                            }
                          }
                          else {
                            if (exam.paper.useTestCode === 1) {
                              if (testCode !== '') {
                                if (testCodeMatched(testCode, exam.testCode)) { ExamStart(history, exam, setStartexam, location, setShow, setMsg); } else { setShow1(false); setShow(true); setMsg('Invalid Test Code Entered.'); }
                              }
                              else {
                                setShow(true);
                                setMsg('Please Enter Test Code for Starting Examination.');
                                return false;
                              }
                            }
                            else {
                              ExamStart(history, exam, setStartexam, location, setShow, setMsg);
                            }
                          }
                        }}
                        className="btn btn-sm btn-success">{BtnLabel}</button>
                      :
                      exam.paper.proctoringType === 'V' ?
                        <button disabled={(!checked || !myCameraPerm)}
                          onClick={() => {
                            if (BtnLabel === 'Continue Exam') {
                              if (exam.paper.useTestCode === 1) {
                                if (testCode !== '') {
                                  if (testCodeMatched(testCode, exam.testCode)) { setShow1(true); } else { setShow1(false); setShow(true); setMsg('Invalid Test Code Entered.'); }
                                }
                                else {
                                  setShow(true);
                                  setMsg('Please Enter Test Code for Starting Examination.');
                                  return false;
                                }
                              }
                              else {
                                setShow1(true);
                              }
                            }
                            else {
                              if (exam.paper.useTestCode === 1) {
                                if (testCode !== '') {
                                  if (testCodeMatched(testCode, exam.testCode)) { ExamStart(history, exam, setStartexam, location, setShow, setMsg); } else { setShow1(false); setShow(true); setMsg('Invalid Test Code Entered.'); }
                                }
                                else {
                                  setShow(true);
                                  setMsg('Please Enter Test Code for Starting Examination.');
                                  return false;
                                }
                              }
                              else {
                                ExamStart(history, exam, setStartexam, location, setShow, setMsg);
                              }
                            }
                          }}
                          className="btn btn-sm btn-success">{BtnLabel}</button>
                        :
                        <button disabled={(!checked)}
                          onClick={() => {
                            if (BtnLabel === 'Continue Exam') {
                              if (exam.paper.useTestCode === 1) {
                                if (testCode !== '') {
                                  if (testCodeMatched(testCode, exam.testCode)) { setShow1(true); } else { setShow1(false); setShow(true); setMsg('Invalid Test Code Entered.'); }
                                }
                                else {
                                  setShow(true);
                                  setMsg('Please Enter Test Code for Starting Examination.');
                                  return false;
                                }
                              }
                              else {
                                setShow1(true);
                              }
                            }
                            else {
                              if (exam.paper.useTestCode === 1) {
                                if (testCode !== '') {
                                  if (testCodeMatched(testCode, exam.testCode)) { ExamStart(history, exam, setStartexam, location, setShow, setMsg); } else { setShow1(false); setShow(true); setMsg('Invalid Test Code Entered.'); }
                                }
                                else {
                                  setShow(true);
                                  setMsg('Please Enter Test Code for Starting Examination.');
                                  return false;
                                }
                              }
                              else {
                                ExamStart(history, exam, setStartexam, location, setShow, setMsg);
                              }
                            }
                          }}
                          className="btn btn-sm btn-success">{BtnLabel}</button>
                    :
                    exam.paper.proctoringType === 'I' && exam.paper.photo_capture === 1 ?
                      <button disabled={flexi_photo_capture === 1 ? (!checked) : (!checked || !myCameraPerm)}
                        onClick={() => { ExamPreview(history, exam, setStartexam, location, setShow, setMsg); }}
                        className="btn btn-sm btn-success">{BtnLabel}
                      </button>
                      :
                      exam.paper.proctoringType === 'V' ?
                        <button disabled={(!checked || !myCameraPerm)}
                          onClick={() => { ExamPreview(history, exam, setStartexam, location, setShow, setMsg); }}
                          className="btn btn-sm btn-success">{BtnLabel}
                        </button>
                        :
                        <button disabled={(!checked)}
                          onClick={() => { ExamPreview(history, exam, setStartexam, location, setShow, setMsg); }}
                          className="btn btn-sm btn-success">{BtnLabel}
                        </button>
                  }
                </center>
              </div>
            </div>
            <br />
            <div>{!startexam && (
              <div className="alert alert-info">Problem Starting Examination</div>
            )}</div>
          </div>
          <StudyMaterial />
        </div>

        <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
          <Modal.Header style={{ backgroundColor: "OliveDrab", color: "white", zIndex: "99999" }}>
            <Modal.Title><center>Warning/Alert</center></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Do not Logout/Exit the Examination page during the Test. <b>You have left the examination {exam.continueexam} times. This event is recorded</b>.
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-warning" onClick={() => {
              setShow1(false);
            }}>Close</button> &nbsp;&nbsp;&nbsp;&nbsp;
            <button className="btn btn-success" onClick={() => {
              ExamStart(history, exam, setStartexam, location, setShow, setMsg);
            }}>Okay Noted</button>
          </Modal.Footer>
        </Modal>

      </div>
      : ''
  );
}

function testCodeMatched(origTestCode, dbTestCode) {
  if (origTestCode === de(dbTestCode)) { return true; } else { return false; }
}

async function ExamPreview(history, exam, setStartexam, location, setShow, setMsg) {
  let examDetails = {}
  //------------------Start Exam------------------------------------------------
  if (location.state.role !== 'STUDENT') {
    const myQuestions = await getPreviewQuestions(exam);
    if (myQuestions.length > 0) {
      examDetails = {
        preview: true,
        exam: exam,
        questions: myQuestions,
        currentQuestionIndex: 0,
        solvedQuestionIndexes: [],
        unsolvedQuestionIndexes: [],
        markedSolvedIndexes: [],
        markedUnsolvedIndexes: [],
      }
      setStartexam(true);
      history.replace("/startexam", examDetails);
    }
    else {
      setShow(true);
      setMsg('No Questions Found for this Subject...');
    }
  }
  else {
    setStartexam(false);
  }
}


async function ExamStart(history, exam, setStartexam, location, setShow, setMsg) {
  let examDetails = {}
  //------------------Start Exam------------------------------------------------
  if (location.state.role === 'STUDENT') {
    if (await startMyExam(exam)) {
      const myQuestions = await getQuestions(exam);
      if (myQuestions.length > 0) {
        examDetails = {
          preview: false,
          exam: exam,
          questions: myQuestions,
          currentQuestionIndex: exam.paper.questwisetimer ? parseInt(exam.curQuestion) : 0,
          solvedQuestionIndexes: getIndexes(myQuestions, 'answered'),
          unsolvedQuestionIndexes: getIndexes(myQuestions, 'unanswered'),
          markedSolvedIndexes: getIndexes(myQuestions, 'answeredandreview'),
          markedUnsolvedIndexes: getIndexes(myQuestions, 'unansweredandreview'),
        }
        setStartexam(true);
        history.replace("/startexam", examDetails);
      }
      else {
        setShow(true);
        setMsg('No Questions Found for this Subject...');
      }
    }
    else {
      setStartexam(false);
    }
  }
  //----------------------------------------------------------------------------
}

async function startMyExam(exam) {
  const ExamId = exam.id;
  const res = await API.put('/exam/' + ExamId, { "status": "start" });

  if (res.data.status === 'success') {
    return 1;
  }
  else {
    return 0;
  }
}


async function getQuestions(exam) {
  const ExamId = exam.id;
  const res = await API.get('/answer', { params: { "exam_id": ExamId } });
  if (res.data.status === 'success') {
    let data = JSON.parse(de(res.data.data));
    return data;
  }
  else {
    return null;
  }
}

async function getPreviewQuestions(exam) {
  const PaperId = exam.paper.id;
  const res = await API.get('/questions/' + PaperId, { params: { "type": "preview" } });
  if (res.data.status === 'success') {
    return res.data.data;
  }
  else {
    return null;
  }
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

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export default Instructions;
