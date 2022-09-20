import React, { useState, useContext } from 'react';
import MathJax from 'react-mathjax-preview';
import 'react-image-lightbox/style.css';
import Moment from 'react-moment';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { ExamFolderContext } from '../../../App';
import { Markup } from 'interweave';
import MyPdfModal from '../../MyPdfModal';

const StudentExamLog = (props) => {
    let log = props.log;
    let totQuestions = 0;
    let solvedQuestions = 0;
    let correctQuestions = 0;
    const { examFolder } = useContext(ExamFolderContext);
    let base_url = process.env.REACT_APP_PROJPATH;
    const dataFolder = examFolder;

    if (log) {
        log.forEach(que => {
            totQuestions = totQuestions + 1;
            if (que.answered !== 'unanswered' && que.answered !== 'unansweredandreview') {
                solvedQuestions = solvedQuestions + 1;
            }
            if (que.cans === que.stdanswer) {
                correctQuestions = correctQuestions + 1;
            }
        });
    }

    const projpath = process.env.REACT_APP_PROJPATH;
    let question_path = '';
    let optiona_path = '';
    let optionb_path = '';
    let optionc_path = '';
    let optiond_path = '';
    let singleFilePath = '';
    const [isOpen, setIsOpen] = useState(false);
    const [isOpena, setIsOpena] = useState(false);
    const [isOpenb, setIsOpenb] = useState(false);
    const [isOpenc, setIsOpenc] = useState(false);
    const [isOpend, setIsOpend] = useState(false);
    const [counts, setCounts] = useState(false);
    const [answerSummary, setAnswerSummary] = useState([]);
    const [show, setShow1] = useState(false);
    const handleClose = () => setShow1(false);
    let reviewed = 0;
    const [show2,setShow2] = useState();
    const [path,setPath] = useState();
    const [pdfString,setPdfString] = useState();

    return (
        log ?
            <div className="col-lg-12" style={{ "overflow": "auto" }}>
                <table className="table table-bordered">
                    <thead>
                        <tr style={{ "backgroundColor": "#e9ecef" }}>
                            <th colSpan={11}>Student Name: {log[0].student.name} <span style={{ "float": "right" }}>Enrollment No: {log[0].student.username}</span></th>
                        </tr>
                        <tr style={{ "backgroundColor": "#e9ecef" }}>
                            <th colSpan={11}>Institute Name: {log[0].institute.college_name} <span style={{ "float": "right" }}>Inst Code : {log[0].institute.username}</span></th>
                        </tr>
                        <tr style={{ "backgroundColor": "#e9ecef" }}>
                            <th colSpan={11}>Exam Name: {log[0].subject.paper_name} <span style={{ "float": "right" }}>Exam Code : {log[0].subject.paper_code}</span></th>
                        </tr>
                        <tr style={{ "backgroundColor": "#e9ecef" }}>
                            <th colSpan={11}>
                                Exam Started On: {log[0].examData.startedon ? <Moment format="MMMM Do YYYY, H:mm:ss A">{log[0].examData.startedon}</Moment> : ''}
                                <span style={{ "float": "right" }}>Exam End On : {log[0].examData.endon ? <Moment format="MMMM Do YYYY, H:mm:ss A">{log[0].examData.endon}</Moment> : ''}
                                </span></th>
                        </tr>
                        {

                            log[0].subject.singleFileUpload == '1' ?
                                <tr>
                                    <td colSpan={11} style={{ "backgroundColor": "#e9ecef" }}>
                                        {log[0].examData.answerFile !== '' && log[0].examData.answerFile !== null && log[0].examData.answerFile !== undefined ?
                                        <>
                                            <center><a href="/# " 
                                            onClick={() =>{setShow2(true);setPath(projpath + "data/" + dataFolder + "/answers/" + log[0].examData.answerFile);setPdfString('Answer Pdf');}} 
                                            >Click To View Answer File</a></center>

                                            <MyPdfModal setPopupShow={setShow2} popupShow={show2} path={path} heading={pdfString}/>
                                        </>
                                        :
                                            <center><div className="alert alert-warning" role="alert">
                                                Answer File not yet uploaded...
                                            </div></center>}
                                    </td>
                                </tr>
                                : null
                        }
                        <tr style={{ "backgroundColor": "#e9ecef" }}>
                            <th>Sr No</th>
                            <th>Question</th>
                            <th>Option A</th>
                            <th>Option B</th>
                            <th>Option C</th>
                            <th>Option D</th>
                            <th>Correct Ans</th>
                            <th>Student Ans</th>
                            <th>Answer Files</th>
                            <th>Answered On</th>
                            <th>IP</th>
                        </tr>
                    </thead>
                    <tbody>
                        {log.map((que, index) => {
                            let quest, opta, optb, optc, optd;

                            let mathIndexes = que.question.question !== null ? getMathIndexes(que.question.question) : '';
                            let textIndexes = que.question.question !== null ? getTextIndexes(mathIndexes, que.question.question) : '';
                            let questArray = que.question.question !== null ? mergeTwoArr(textIndexes, mathIndexes, que.question.question) : '';
                            quest = que.question.question !== undefined && que.question.question !== null ?
                                questArray.map((data, index) => {
                                    if (index % 2 === 0) {
                                        return <Markup content={questArray[index]} />
                                    }
                                    else {
                                        return <MathJax math={questArray[index]} />
                                    }
                                })
                                : null
                            if (que.question.quest_type === 'O') 
                            {
                                let optaMathIndexes = que.question.optiona !== null ? getMathIndexes(que.question.optiona.split(':$:')[0]) : '';
                                let optaTextIndexes = que.question.optiona !== null ? getTextIndexes(optaMathIndexes, que.question.optiona.split(':$:')[0]) : '';
                                let optaArray = que.question.optiona !== null ? mergeTwoArr(optaTextIndexes, optaMathIndexes, que.question.optiona.split(':$:')[0]) : '';

                                opta = que.question.optiona !== null ? que.question.optiona.split(':$:')[0] !== undefined && que.question.optiona.split(':$:')[0] !== null ?
                                    optaArray.map((data, index) => {
                                        if (index % 2 === 0) {
                                            return <Markup content={optaArray[index]} />
                                        }
                                        else {
                                            return <MathJax math={optaArray[index]} />
                                        }
                                    })
                                    : null : '';

                                let optbMathIndexes = que.question.optionb !== null ? getMathIndexes(que.question.optionb.split(':$:')[0]) : '';
                                let optbTextIndexes = que.question.optionb !== null ? getTextIndexes(optbMathIndexes, que.question.optionb.split(':$:')[0]) : '';
                                let optbArray = que.question.optionb !== null ? mergeTwoArr(optbTextIndexes, optbMathIndexes, que.question.optionb.split(':$:')[0]) : '';

                                optb = que.question.optionb !== null ? que.question.optionb.split(':$:')[0] !== undefined && que.question.optionb.split(':$:')[0] !== null ?
                                    optbArray.map((data, index) => {
                                        if (index % 2 === 0) {
                                            return <Markup content={optbArray[index]} />
                                        }
                                        else {
                                            return <MathJax math={optbArray[index]} />
                                        }
                                    })
                                    : null : '';

                                let optcMathIndexes = que.question.optionc !== null ? getMathIndexes(que.question.optionc.split(':$:')[0]) : '';
                                let optcTextIndexes = que.question.optionc !== null ? getTextIndexes(optcMathIndexes, que.question.optionc.split(':$:')[0]) : '';
                                let optcArray = que.question.optionc !== null ? mergeTwoArr(optcTextIndexes, optcMathIndexes, que.question.optionc.split(':$:')[0]) : '';

                                optc = que.question.optionc !== null ? que.question.optionc.split(':$:')[0] !== undefined && que.question.optionc.split(':$:')[0] !== null ?
                                    optcArray.map((data, index) => {
                                        if (index % 2 === 0) {
                                            return <Markup content={optcArray[index]} />
                                        }
                                        else {
                                            return <MathJax math={optcArray[index]} />
                                        }
                                    })
                                    : null : '';

                                let optdMathIndexes = que.question.optiond !== null ? getMathIndexes(que.question.optiond.split(':$:')[0]) : '';
                                let optdTextIndexes = que.question.optiond !== null ? getTextIndexes(optdMathIndexes, que.question.optiond.split(':$:')[0]) : '';
                                let optdArray = que.question.optiond !== null ? mergeTwoArr(optdTextIndexes, optdMathIndexes, que.question.optiond.split(':$:')[0]) : '';

                                optd = que.question.optiond !== null ? que.question.optiond.split(':$:')[0] !== undefined && que.question.optiond.split(':$:')[0] !== null ?
                                    optdArray.map((data, index) => {
                                        if (index % 2 === 0) {
                                            return <Markup content={optdArray[index]} />
                                        }
                                        else {
                                            return <MathJax math={optdArray[index]} />
                                        }
                                    })
                                    : null : '';
                            }

                            return <tr key={index}>
                                <td>{que.qnid_sr}</td>
                                <td>
                                    {quest}

                                    {que.question.qu_fig ?
                                        <img src={projpath + "data/" + dataFolder + "/files/" + que.question.qu_fig} alt="" onClick={() => setIsOpen(true)} title="Click on Image to Enlarge" height="100" width="100" onDragStart={(e) => {e.preventDefault();}}/>
                                        : null}
                                </td>
                                <td>
                                    {opta}

                                    {que.question.a1 ?
                                        <img src={projpath + "data/" + dataFolder + "/files/" + que.question.a1.split(':$:')[0]} alt="" onClick={() => setIsOpena(true)} title="Click on Image to Enlarge" height="100" width="100" onDragStart={(e) => {e.preventDefault();}}/>
                                        : null}
                                </td>
                                <td>
                                    {optb}

                                    {que.question.a2 ?
                                        <img src={projpath + "data/" + dataFolder + "/files/" + que.question.a2.split(':$:')[0]} alt="" onClick={() => setIsOpenb(true)} title="Click on Image to Enlarge" height="100" width="100" onDragStart={(e) => {e.preventDefault();}}/>
                                        : null}
                                </td>
                                <td>
                                    {optc}

                                    {que.question.a3 ?
                                        <img src={projpath + "data/" + dataFolder + "/files/" + que.question.a3.split(':$:')[0]} alt="" onClick={() => setIsOpenc(true)} title="Click on Image to Enlarge" height="100" width="100" onDragStart={(e) => {e.preventDefault();}}/>
                                        : null}
                                </td>
                                <td>
                                    {optd}

                                    {que.question.a4 ?
                                        <img src={projpath + "data/" + dataFolder + "/files/" + que.question.a4.split(':$:')[0]} alt="" onClick={() => setIsOpend(true)} title="Click on Image to Enlarge" height="100" width="100" onDragStart={(e) => {e.preventDefault();}}/>
                                        : null}
                                </td>
                                <td>
                                    {que.cans}
                                </td>
                                <td>
                                    {que.stdanswer}
                                    {
                                        (que.stdanswer !== '' && que.stdanswer !== null && que.stdanswer !== undefined) ?
                                            <><br /><br /><button className="btn btn-sm btn-link" onClick={() => {
                                                setAnswerSummary(que.ansChangeLog);
                                                setShow1(true);
                                            }}>Answer Change Summary</button></>
                                            : null
                                    }
                                </td>
                                <td>
                                    {
                                        que.answerImage !== null && que.answerImage !== undefined && que.answerImage !== '' ?
                                            que.answerImage.split(',').map((path) => {
                                                let str = base_url + '' + path;

                                                if (str.indexOf('.jpg') > 0 || str.indexOf('.jpeg') > 0 || str.indexOf('.JPG') > 0 || str.indexOf('.JPEG') > 0) {
                                                    return <div className="col-lg-2">
                                                        <img src={str} height={50} width={100} style={{ 'borderRadius': "5px", "margin": "10px" }}  onDoubleClick={() => {
                                                            window.open(str, "_blank");
                                                        }} onDragStart={(e) => {e.preventDefault();}}/>
                                                    </div>
                                                }

                                                if (str.indexOf('.pdf') > 0 || str.indexOf('.PDF') > 0) {
                                                    return <div className="col-lg-2">
                                                        <img src={base_url + 'assets/images/pdf.png'} height={50} width={100} style={{ 'borderRadius': "5px", "margin": "10px" }}  onDoubleClick={() => {
                                                            window.open(str, "_blank");
                                                        }} onDragStart={(e) => {e.preventDefault();}}/>
                                                    </div>
                                                }

                                                if (str.indexOf('.doc') > 0 || str.indexOf('.docx') > 0) {
                                                    return <div className="col-lg-2">
                                                        <img src={base_url + 'assets/images/doc.png'} height={50} width={100} style={{ 'borderRadius': "5px", "margin": "10px" }}  onDoubleClick={() => {
                                                            window.open(str, "_blank");
                                                        }} onDragStart={(e) => {e.preventDefault();}}/>
                                                    </div>
                                                }

                                                if (str.indexOf('.xls') > 0 || str.indexOf('.xlsx') > 0) {
                                                    return <div className="col-lg-2">
                                                        <img src={base_url + 'assets/images/xls.png'} height={50} width={100} style={{ 'borderRadius': "5px", "margin": "10px" }}  onDoubleClick={() => {
                                                            window.open(str, "_blank");
                                                        }} onDragStart={(e) => {e.preventDefault();}}/>
                                                    </div>
                                                }

                                                if (str.indexOf('.ppt') > 0 || str.indexOf('.pptx') > 0) {
                                                    return <div className="col-lg-2">
                                                        <img src={base_url + 'assets/images/ppt.png'} height={50} width={100} style={{ 'borderRadius': "5px", "margin": "10px" }}  onDoubleClick={() => {
                                                            window.open(str, "_blank");
                                                        }} onDragStart={(e) => {e.preventDefault();}}/>
                                                    </div>
                                                }
                                            })
                                            : ''
                                    }
                                </td>
                                <td>
                                    {que.answer_on ?
                                        <Moment format="MMMM Do YYYY, H:mm:ss A">{que.answer_on}</Moment>
                                        : null}
                                </td>
                                <td>
                                    {que.ip}
                                </td>
                            </tr>
                        })}
                        <tr style={{ "backgroundColor": "#e9ecef" }}>
                            <th colSpan={11}>Total Questions: {totQuestions} <span>Total Answered: {solvedQuestions}</span> <span>Total Correct: {correctQuestions}</span></th>
                        </tr>
                    </tbody>
                </table>

                <Modal show={show} onHide={handleClose} size="lg" backdrop="static">
                    <Modal.Header style={{ backgroundColor: "OliveDrab", color: "white" }}>
                        <Modal.Title><center>Answer Change Summary</center></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <table className="table table-bordered">
                            <thead>
                                <tr style={{ "backgroundColor": "#e9ecef" }}>
                                    <td>Correct Answer</td>
                                    <td>Student Answer</td>
                                    <td>Answered On</td>
                                    <td>IP</td>
                                </tr>
                                {
                                    answerSummary.map(que => {
                                        let str = '';
                                        if ((que.answered === 'answeredandreview' || que.answered === 'unansweredandreview') && reviewed === 0) {
                                            reviewed = 1;
                                            str = '(Review Added)';
                                        }
                                        else if ((que.answered === 'answered' || que.answered === 'unanswered') && reviewed === 1) {
                                            reviewed = 0;
                                            str = '(Review Removed)';
                                        }


                                        return <tr>
                                            <td>{que.cans}</td>
                                            <td>
                                                {que.stdanswer}

                                                {(que.answered === 'unanswered' && (que.stdanswer === '' || que.stdanswer === undefined || que.stdanswer === null)) ? '(Option Cleared)' : ''}

                                                {str}

                                            </td>
                                            <td>
                                                {que.answer_on ?
                                                    <Moment format="MMMM Do YYYY, H:mm:ss A">{que.answer_on}</Moment>
                                                    : null}
                                            </td>
                                            <td>{que.ip}</td>
                                        </tr>
                                    })}
                            </thead>
                        </table>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={() => {
                            setShow1(false);
                        }}>Close</Button>
                    </Modal.Footer>
                </Modal>

            </div>

            : null
    );
};

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

export default StudentExamLog;