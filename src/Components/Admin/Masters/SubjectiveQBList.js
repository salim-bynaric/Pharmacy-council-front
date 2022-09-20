import React, { useState, useEffect, useContext } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import API from '../../../api';
import { ShowContext } from '../../../App';
import { UserContext, ExamFolderContext } from '../../../App';
import MathJax from 'react-mathjax-preview';
import { useHistory } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import CustomSearch from '../../../CustomSearch';
import Modal from "react-bootstrap/Modal";
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import { Markup } from 'interweave';
import ModerateQB from './moderateSubjectiveQB';

const SubjectiveQBList = (props) => {
    let history = useHistory();
    const subjects = props.subjects;
    let subArray = '';
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const header = getHeader();
    const { setShow, setMsg } = useContext(ShowContext);
    const [paperId, setPaperId] = useState(props.paperId);

    const [curPage, setCurPage] = useState(0);
    const [perPage, setPerPage] = useState(0);
    const [total, setTotal] = useState(0);
    const { currentUser } = useContext(UserContext);
    const { examFolder } = useContext(ExamFolderContext);
    const [setterType, setSetterType] = useState();
    const [visible, setVisible] = useState(false);
    const [delQnid, setDelQnid] = useState();
    const handleClose = () => setVisible(false);
    const [visible1, setVisible1] = useState(false);
    const handleClose1 = () => setVisible1(false);
    const [confirm, setConfirm] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [imgPath, setImgPath] = useState();
    const [modConf, setModConf] = useState(false);
    const [visible2, setVisible2] = useState(false);
    const handleClose2 = () => setVisible2(false);
    const [questData, setQuestData] = useState();
    const [loading1, setLoading1] = useState(false);

    const [visible3, setVisible3] = useState(false);
    const handleClose3 = () => setVisible3(false);
    const [quest,setQuest] = useState();
    const [sub,setSub] = useState();
    const [opSuccess,setOpSuccess] = useState(false);
    const [flag,setFlag] = useState();


    const data = getData(questions, props, setShow, setMsg, history, setLoading, curPage, perPage, currentUser, setterType, setVisible, setDelQnid, confirm, setIsOpen, setImgPath, examFolder,setVisible3,setQuest,setSub,setFlag);

    useEffect(async () => {
        if (paperId !== undefined && currentUser && currentUser.role !== 'PAPERSETTER') {
            await getQuestions(paperId, setQuestions, curPage, setCurPage, setPerPage, setTotal, setModConf);
        }
        else if (paperId !== undefined && currentUser && currentUser.role === 'PAPERSETTER') {
            if (setterType === undefined) {
                await getSetterType(currentUser, paperId, setSetterType, setShow, setMsg, setConfirm);
            }
            if (setterType === 'PM') {
                let i = 0;
                let found = 0;

                for (i = 0; i < props.unconfSubList.length; i++) {
                    if (parseInt(props.unconfSubList[i]) === parseInt(paperId)) {
                        found = paperId;
                        break;
                    }
                }

                if (parseInt(found) === parseInt(paperId)) {
                    setShow(true);
                    setMsg('Question Bank of This Subject is not yet Confirmed by Paper Setter...');
                    return false;
                }
                else {
                    await getQuestions(paperId, setQuestions, curPage, setCurPage, setPerPage, setTotal, setModConf);
                }
            }
            else if (setterType === 'PS' || setterType === 'PSM') {
                await getQuestions(paperId, setQuestions, curPage, setCurPage, setPerPage, setTotal, setModConf);
            }
        }
    }, [props.inserted, paperId, currentUser, setterType]);


    useEffect(() => 
    {
        if(opSuccess)
        {
            getQuestions(paperId, setQuestions, curPage, setCurPage, setPerPage, setTotal, setModConf);
            setOpSuccess(false);
        }
    },[opSuccess]);

    return (
        examFolder !== undefined ?
            <>
                <div className="col-lg-6" style={{ "marginTop": "10px", "marginBottom": "20px" }}>
                    <CustomSearch searchParam={['qnid']} searchMethod={searchQuestion} dataSetter={setQuestions} />
                </div>
                <div className="col-lg-6" style={{ "marginTop": "10px", "marginBottom": "20px" }}>
                    <select id="paperId" name="paperId" onChange={(e) => {
                         setSetterType(undefined);
                         setConfirm(undefined);
                         setCurPage(0);
                        setPaperId(e.target.value);
                    }} className="form-control">
                        <option value="">Select Subject</option>
                        {subjects.map((subject, index) => {
                            return <option key={index} value={subject.id}>{subject.paper_code + '-' + subject.paper_name}</option>
                        })}
                    </select>
                </div>
                {!loading ?
                    questions !== undefined && questions.length > 0 ?
                        <>
                            <div className="col-lg-12">
                                <center>
                                    <button type="button" className="btn btn-link" onClick={() => {
                                        setVisible2(true); getQuestionDetails(setQuestData, setShow, setMsg, setLoading1, paperId);
                                    }}>Click To View Question Details</button>
                                </center><br />
                            </div>
                            {currentUser.role === 'PAPERSETTER' && setterType === 'PS' ?
                                <div className="col-lg-12">
                                    <center>
                                        <button className="btn btn-warning" onClick={() => {
                                            setVisible1(true);
                                        }} disabled={confirm}>Confirm Question Set</button>
                                    </center><br />
                                    {
                                        confirm ?
                                            <div className="alert alert-info">
                                                <b>This Question Set is Confirmed by Setter</b>
                                            </div>
                                        : null
                                    }
                                </div>
                                : null}

                            { currentUser.role === 'PAPERSETTER' && setterType !== 'PS' && modConf ?
                                <div className="col-lg-12">
                                    <center>
                                        <button className="btn btn-warning" onClick={async () => {
                                            if (subjects[0].exam_mode === 'both') {
                                                await getSubjectiveStatistics(subjects[0].id, setVisible1, setShow, setMsg);
                                            }
                                            else {
                                                setVisible1(true);
                                            }
                                        }} disabled={confirm}>Confirm Question Set</button>
                                    </center><br />
                                    {
                                        confirm ?
                                            <div className="alert alert-info">
                                                <b>This Question Set is Confirmed by Moderator</b>
                                            </div>
                                        : null
                                    }
                                </div>
                                : null}

                            <div style={{ "overflow": "auto" }}>
                                <BootstrapTable keyField='srno' data={data} columns={header} rowStyle={rowStyle} />

                                <div className="mt-3">
                                    <Pagination
                                        totalItemsCount={total}
                                        activePage={curPage}
                                        itemsCountPerPage={perPage}
                                        onChange={(pageNumber) => {

                                            subjects.map(subject => {
                                                subArray = subArray + '' + subject.id + ',';
                                            });

                                            getQuestions([paperId], setQuestions, pageNumber, setCurPage, setPerPage, setTotal, setModConf);
                                        }}
                                        itemClass="page-item"
                                        linkClass="page-link"
                                        firstPageText="First"
                                        lastPageText="Last"
                                    />
                                </div>
                            </div>
                            <div className="col-lg-12">
                                {isOpen && (<Lightbox
                                    mainSrc={imgPath}
                                    onCloseRequest={() => setIsOpen(false)}
                                />
                                )}
                            </div>
                            <div className="col-lg-12">
                                <Modal show={visible} onHide={handleClose}>
                                    <Modal.Header closeButton style={{ backgroundColor: "OliveDrab", color: "white", zIndex: "99999" }} >
                                        <Modal.Title><center>Question Delete Confirmation</center></Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        Do you really want to delete this Question ?
                                </Modal.Body>
                                    <Modal.Footer>
                                        <button className="btn btn-primary" onClick={async () => {
                                            await deleteRecord(delQnid, props, setShow, setMsg);
                                            setVisible(false);
                                        }}>Yes</button> &nbsp;&nbsp;
                                    <button className="btn btn-success" onClick={() => {
                                            setVisible(false);
                                        }}>No</button>
                                    </Modal.Footer>
                                </Modal>
                            </div>

                            <div className="col-lg-12">
                                <Modal show={visible1} onHide={handleClose1}>
                                    <Modal.Header closeButton style={{ backgroundColor: "OliveDrab", color: "white", zIndex: "99999" }} >
                                        <Modal.Title><center>Question Set Confirmation</center></Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        Do you really want to Confirm The Question Set? Once Confirmed You will not be able to Add/Delete Questions.
                                </Modal.Body>
                                    <Modal.Footer>
                                        <button className="btn btn-primary" onClick={async () => {
                                            await confirmQSet(currentUser.uid, setterType, paperId, currentUser, setShow, setMsg, setConfirm);
                                            setVisible1(false);
                                        }}>Yes</button> &nbsp;&nbsp;
                                    <button className="btn btn-success" onClick={() => {
                                            setVisible1(false);
                                        }}>No</button>
                                    </Modal.Footer>
                                </Modal>
                            </div>
                            <div className="col-lg-12">
                                <Modal show={visible2} onHide={handleClose2} size="lg">
                                    <Modal.Header closeButton style={{ backgroundColor: "OliveDrab", color: "white", zIndex: "99999" }} >
                                        <Modal.Title><center>Question Details</center></Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body style={{ "minHeight": "150px" }}>
                                        {
                                            !loading1 && questData !== undefined ?
                                                <div className="container col-lg-12">
                                                    <table className="table table-bordered">
                                                        <tr style={{"backgroundColor":"aqua"}}>
                                                            <th>Sr No.</th>
                                                            <th>Code</th>
                                                            <th>topic</th>
                                                            <th>Subtopic</th>
                                                            <th>Difficulty Level</th>
                                                            <th>Marks</th>
                                                            <th>Tot Quest</th>
                                                        </tr>
                                                        {
                                                            questData.map((data, index) => {
                                                                return <tr key={index}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{data.paper_id}</td>
                                                                    <td>{data.topic}</td>
                                                                    <td>{data.subtopic}</td>
                                                                    <td>{data.difficulty_level}</td>
                                                                    <td>{data.marks}</td>
                                                                    <td>{data.cnt}</td>
                                                                </tr>
                                                            })
                                                        }
                                                    </table>
                                                </div>
                                                :
                                                <div className="custom-loader"></div>
                                        }
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <button className="btn btn-success" onClick={() => {
                                            setVisible2(false);
                                        }}>Close</button>
                                    </Modal.Footer>
                                </Modal>
                            </div>
                            <div className="col-lg-12">
                                <Modal show={visible3} onHide={handleClose3} size="xl" enforceFocus={false}>
                                    <Modal.Header closeButton style={{ backgroundColor: "OliveDrab", color: "white", zIndex: "1" }} >
                                        <Modal.Title><center>{setterType === 'PS' ? 'Edit Question':'Moderate Question'}</center></Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <ModerateQB question={quest} subject={sub} flag={flag} setVisible3={setVisible3} setOpSuccess={setOpSuccess}/>
                                    </Modal.Body>
                                </Modal>
                            </div>
                        </>
                        : null
                    : <div className="custom-loader"></div>}
            </>
            : null
    );
};

async function getQuestionDetails(setQuestData, setShow, setMsg, setLoading1, paperId) {
    setLoading1(true);
    await API.get('/subject/questionDetails/' + paperId)
        .then((res) => {
            if (res.data.status === 'success') {
                setLoading1(false);
                setQuestData(res.data.data);
            }
        })
        .catch(function (error) {
            setLoading1(false);
            setShow(true);
            setMsg(error.response.data.message);
        });
}

async function getSubjectiveStatistics(paper_id, setVisible1, setShow, setMsg) {
    await API.get('/subject/' + paper_id + '/getSubjectConfInfo')
        .then((res) => {
            if (res.data.status === 'success') {
                let questCount = parseInt(res.data.questCount);
                let modQuestCount = parseInt(res.data.modQuestCount);

                if ((questCount !== 0) && (modQuestCount !== 0) && (questCount === modQuestCount)) {
                    setVisible1(true);
                }
                else {
                    setShow(true);
                    setMsg('Total Question Count and Moderated Question Count in this subject is not matching. Probably All objective type questions of this subject are not yet moderated..');
                }
            }
            else {
                setShow(true);
                setMsg('Total Question Count and Moderated Question Count in this subject is not matching. Probably All objective type questions of this subject are not yet moderated..');
            }
        })
        .catch(function (error) {
            setShow(true);
            setMsg('Problem Fetching Data from Server...');
        });
}

async function confirmQSet(uid, setterType, paperId, currentUser, setShow, setMsg, setConfirm) {
    await API.put('/subject/setterConfirmation/' + uid, { 'paperId': paperId, 'setterType': setterType, 'instId': currentUser.inst_id })
        .then((res) => {
            if (res.data.status === 'success') {
                setConfirm(true);
                setShow(true);
                setMsg('Quetion Set Confirmed Successfully...');
            }
        })
        .catch(function (error) {

        });
}

async function getSetterType(currentUser, paperId, setSetterType, setShow, setMsg, setConfirm) {
    let instId = currentUser.inst_id;
    let uid = currentUser.uid;

    await API.get('/subject/setterAllocation', { params: { 'type': 'searchByPaperId', 'paperId': paperId, 'instId': instId, 'setterId': uid } })
        .then((res) => {
            if (res.data.status === 'success') {
                setSetterType(res.data.data[0].type);
                if (res.data.data[0].conf === 1) {
                    setConfirm(true);
                }
            }
            else {
                setConfirm(false);
            }
        })
        .catch(function (error) {
            setConfirm(false);
        });
}


const rowStyle = (row, rowIndex) => {
    if (row.moderate.props !== undefined && row.moderate.props.children === 'Re Moderate') {
        return { backgroundColor: 'green', color: 'white' };
    }
};

function getHeader() {
    let myHeader = [
        { text: 'Sr No', dataField: 'srno' },
        { text: 'Qnid', dataField: 'qnid' },
        { text: 'Question', dataField: 'question' },
        { text: 'Question Image', dataField: 'qimage' },
        { text: 'Model Answer', dataField: 'modelAnswer' },
        { text: 'Marks', dataField: 'marks' },
        { text: 'Model Answer Image', dataField: 'modelAnswerImage' },
        { text: 'Allow Image Upload', dataField: 'allowImageUpload' },
        { text: 'Moderate', dataField: 'moderate' },
        { text: 'Delete', dataField: 'delete' },
    ];
    return myHeader;
}

function getData(questions, props, setShow, setMsg, history, setLoading, curPage, perPage, currentUser, setterType, setVisible, setDelQnid, confirm, setIsOpen, setImgPath, examFolder,setVisible3,setQuest,setSub,setFlag) {
    let myData = [];
    let i = (curPage - 1) * perPage + 1;
    const dataFolder = examFolder;
    const Path = process.env.REACT_APP_PROJPATH + 'data/' + dataFolder + '/files/';

    if (questions) {
        questions.map((data, index) => {

            let qMathIndexes = data.question !== null ? getMathIndexes(data.question) : '';
            let qTextIndexes = data.question !== null ? getTextIndexes(qMathIndexes, data.question) : '';
            let questArray = mergeTwoArr(qTextIndexes, qMathIndexes, data.question !== null ? data.question : '');
            let question = data.question !== undefined && data.question !== null ?
                questArray.map((data, index) => {
                    if (index % 2 === 0) {
                        return <Markup content={questArray[index]} />
                    }
                    else {
                        return <MathJax math={questArray[index]} />
                    }
                })
                : null;

            let optmodelMathIndexes = data.modelAnswer !== null ? getMathIndexes(data.modelAnswer) : '';
            let optmodelTextIndexes = data.modelAnswer !== null ? getTextIndexes(optmodelMathIndexes, data.modelAnswer) : '';
            let optmodelArray = mergeTwoArr(optmodelTextIndexes, optmodelMathIndexes, data.modelAnswer !== null ? data.modelAnswer : '');

            let modelAnswer = data.modelAnswer !== undefined && data.modelAnswer !== null ?
                optmodelArray.map((data, index) => {
                    if (index % 2 === 0) {
                        return <Markup content={optmodelArray[index]} />
                    }
                    else {
                        return <MathJax math={optmodelArray[index]} />
                    }
                })
                : null;

            let moderation = null;
            if (currentUser !== undefined && currentUser.role === 'PAPERSETTER' && setterType === 'PS') {
                moderation = <button className="btn btn-primary btn-sm" onClick={() => { setQuest(data);setVisible3(true);setSub(data.paper);setFlag('edit') }} disabled={confirm}>Edit</button>;
            }
            else {
                moderation = !data.moderator ? <button className="btn btn-primary btn-sm" onClick={() => { setQuest(data);setVisible3(true);setSub(data.paper);setFlag('moderate') }} disabled={confirm}>Moderate</button> : <button className="btn btn-warning btn-sm" onClick={() => { setQuest(data);setVisible3(true);setSub(data.paper);setFlag('moderate') }} disabled={confirm}>Re Moderate</button>;
            }

            myData.push({
                srno: i++,
                qnid: data.qnid,
                question: question,
                qimage: data.qu_fig ? <img src={Path + '' + data.qu_fig + '?i=' + Date.now()} alt="" height={100} width={100} style={{ 'borderRadius': "5px" }} onClick={() => { setIsOpen(true); setImgPath(Path + '' + data.qu_fig + '?i=' + Date.now()) }} onDragStart={(e) => { e.preventDefault(); }} /> : null,
                modelAnswer: modelAnswer,
                marks: data.marks,
                modelAnswerImage: data.modelAnswerImage ? <img src={Path + '' + data.modelAnswerImage + '?i=' + Date.now()} alt="" height={100} width={100} style={{ 'borderRadius': "5px" }} onClick={() => { setIsOpen(true); setImgPath(Path + '' + data.modelAnswerImage + '?i=' + Date.now()) }} onDragStart={(e) => { e.preventDefault(); }} /> : null,
                allowImageUpload: data.allowImageUpload,
                moderate: moderation,
                delete: <button className="btn btn-danger btn-sm" onClick={() => { setVisible(true); setDelQnid(data.qnid); }} disabled={confirm}>Delete</button>
            });
        })
    }

    return myData;
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

async function editQuestion(qnid, setShow, setMsg, history, setLoading, subject) {
    setLoading(true);
    await API.get('question/' + qnid)
        .then((res) => {
            if (res.data.status === 'success') {
                setLoading(false);
                history.replace("/moderateSubjectiveQB", { question: res.data.data, subject: subject, flag: 'edit', 'ru': '/subjectiveQB' });
            }
            else {
                setLoading(false);
                setShow(true);
                setMsg(res.data.message);
            }
        })
        .catch(function (error) {
            setLoading(false);
            setShow(true);
            setMsg(error.response.data.message);
        });
}

async function moderateQuestion(qnid, setShow, setMsg, history, setLoading, subject) {
    setLoading(true);
    await API.get('question/' + qnid)
        .then((res) => {
            if (res.data.status === 'success') {
                setLoading(false);
                history.replace("/moderateSubjectiveQB", { question: res.data.data, subject: subject, 'ru': '/subjectiveQB' });
            }
            else {
                setLoading(false);
                setShow(true);
                setMsg(res.data.message);
            }
        })
        .catch(function (error) {
            setLoading(false);
            setShow(true);
            setMsg(error.response.data.message);
        });
}

async function deleteRecord(qnid, props, setShow, setMsg) {
    await API.delete('questions/' + qnid)
        .then((res) => {
            if (res.data.status === 'success') {
                props.setInserted(!props.inserted);
                setShow(true);
                setMsg(res.data.message);
            }
            else {
                setShow(true);
                setMsg(res.data.message);
            }
        })
        .catch(function (error) {
            setShow(true);
            setMsg(error.response.data.message);
        });
}

async function getQuestions(subArray, setQuestions, page = 1, setCurPage, setPerPage, setTotal, setModConf) {
    let modQuestCount = 0;
    await API.get('questions/' + subArray, { params: { "type": "getAllQuestionsFromArray", "page": page, "questType": "subjective" } })
        .then((res) => {

            for (let i = 0; i < res.data.data.length; i++) {
                if (res.data.data[i].moderator !== null && res.data.data[i].moderator !== '' && res.data.data[i].moderator !== undefined) {
                    modQuestCount = modQuestCount + 1;
                }
            }

            if (parseInt(modQuestCount) === res.data.data.length) {
                setModConf(true);
            }

            setQuestions(res.data.data);
            setCurPage(res.data.meta.current_page);
            setPerPage(res.data.meta.per_page);
            setTotal(res.data.meta.total);
        })
        .catch(function (error) {
            setQuestions([]);
        });

}


async function searchQuestion(searchValue, setQuestions, setShow, setMsg) {
    await API.get('question/', { params: { "type": "byQnid", "search": searchValue } })
        .then((res) => {
            setQuestions(res.data.data);
        })
        .catch(function (error) {
            setShow(true);
            setMsg('Question Not Found ...');
        });
}

export default SubjectiveQBList;