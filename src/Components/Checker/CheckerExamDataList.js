import React, { useState, useContext, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { selectFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import API from '../../api';
import { ShowContext } from '../../App';
import {ExamFolderContext} from '../../App';
import Moment from 'react-moment';

const CheckerExamDataList = ({ examData, checkerType }) => {
    const [questions, setQuestions] = useState();
    let history = useHistory();
    const { setShow, setMsg } = useContext(ShowContext);
    const { examFolder }      = useContext(ExamFolderContext);

    const selectOptions = {
        Incompleate: 'Incomplete',
        Completed: 'Completed',
      };
    
    const header = getHeader(examData,checkerType,selectOptions);
    let data = getData(examData, setQuestions, setShow, setMsg, questions, history,checkerType,examFolder);

    const options =
    {
        sizePerPageList: [
            {
                text: '50', value: 50
            },
            {
                text: '500', value: 500
            },
            {
                text: '1000', value: 1000
            },
            {
                text: '10000', value: 10000
            }
        ]
    };

    return (
        <div>
            {examData.length > 0 ?
            <BootstrapTable keyField='srno' data={data} columns={header} filter={filterFactory()} pagination={paginationFactory(options)} />
            :
            <div className="alert alert-dark">
                No Student is allocated to you for Paper Checking...
            </div>
            }
        </div>
    );
};

function getData(examData, setQuestions, setShow, setMsg, questions, history,checkerType,examFolder) {
    let i = 1;
    let myData = [];
    const serverPath = process.env.REACT_APP_PROJPATH;
    if (examData[0].paper.exam_mode === 'subjective') 
    {
        if(checkerType === 'QPC')
        {
            examData.map((data, index) => {
                let score = (data.result !== null && data.result !== undefined) ? data.result : 0;
                myData.push({
                    srno: i++,
                    examid: data.id,
                    score:score,
                    status: <Link onClick={async () => { await goToChecking(data, setShow, setMsg, setQuestions, questions, history,checkerType); }} >{data.paper_checking_status === 0 ? 'incomplete' : 'completed'}</Link>,
                    resultstatus: data.result === 0 ? 'Result Pending' : 'Result Declared',
                    answerFile: data.answerFile !== undefined && data.answerFile !== null ? <a href={serverPath+'data/'+examFolder+'/answers/'+data.answerFile} target="_blank">Click To Download</a> : '',
                    ansUploadTime: data.answerUploadTime !== '' &&  data.answerUploadTime !== undefined ?<Moment format="MMMM Do YYYY, H:mm:ss A">{data.answerUploadTime}</Moment> : ''
                });
            })
        }
        else if(checkerType === 'QPM')
        {
            examData.map((data, index) => {
                let score = (data.result1 !== null && data.result1 !== undefined) ? data.result1 : 0;
                myData.push({
                    srno: i++,
                    examid: data.id,
                    score:score,
                    status: <Link onClick={async () => { await goToChecking(data, setShow, setMsg, setQuestions, questions, history,checkerType); }} >{data.paper_moderation_status === 0 ? 'incomplete' : 'completed'}</Link>,
                    resultstatus: data.result1 === 0 ? 'Result Pending' : 'Result Declared',
                    answerFile: data.answerFile !== undefined && data.answerFile !== null ? <a href={serverPath+'data/'+examFolder+'/answers/'+data.answerFile} target="_blank">Click To Download</a> : '',
                    ansUploadTime: data.answerUploadTime !== '' &&  data.answerUploadTime !== undefined ?<Moment format="MMMM Do YYYY, H:mm:ss A">{data.answerUploadTime}</Moment> : ''
                });
            })
        }
    }
    else if (examData[0].paper.exam_mode === 'both') 
    {
        if(checkerType === 'QPC')
        {
            examData.map((data, index) => {
                let objectiveScore = (data.marksobt !== null && data.marksobt !== undefined) ? data.marksobt : 0;
                let total = (data.result !== null && data.result !== undefined) ? data.result : 0;
                let subjectiveScore = (total - objectiveScore) < 0 ? 0 : (total - objectiveScore);

                myData.push({
                    srno: i++,
                    examid: data.id,
                    score: objectiveScore,
                    scores: subjectiveScore,
                    scoret: total,
                    status: data.paper_checking_status === 0 ? 'Incomplete' : 'Completed',
                    status1: <Link onClick={async () => { await goToChecking(data, setShow, setMsg, setQuestions, questions, history,checkerType); }} >{data.paper_checking_status === 0 ? 'Click to Check' : 'Click to Re-Check'}</Link>,
                    resultstatus: data.result === 0 ? 'Result Pending' : 'Result Declared',
                    answerFile: data.answerFile !== undefined && data.answerFile !== null ? <a href={serverPath+'data/'+examFolder+'/answers/'+data.answerFile} target="_blank">Click To Download</a> : '',
                    ansUploadTime: data.answerUploadTime !== '' &&  data.answerUploadTime !== undefined ?<Moment format="MMMM Do YYYY, H:mm:ss A">{data.answerUploadTime}</Moment> : ''
                });
            })
        }
        else if(checkerType === 'QPM')
        {
            examData.map((data, index) => {
                let objectiveScore = (data.marksobt !== null && data.marksobt !== undefined) ? data.marksobt : 0;
                let total = (data.result1 !== null && data.result1 !== undefined) ? data.result1 : 0;
                let subjectiveScore = (total - objectiveScore) < 0 ? 0 : (total - objectiveScore);
                
                myData.push({
                    srno: i++,
                    examid: data.id,
                    score: objectiveScore,
                    scores: subjectiveScore,
                    scoret: total,
                    status: data.paper_moderation_status === 0 ? 'Incomplete' : 'Completed',
                    status1: <Link onClick={async () => { await goToChecking(data, setShow, setMsg, setQuestions, questions, history,checkerType); }} >{data.paper_moderation_status === 0 ? 'Click to Check' : 'Click to Re-Check'}</Link>,
                    resultstatus: data.result1 === 0 ? 'Result Pending' : 'Result Declared',
                    answerFile: data.answerFile !== undefined && data.answerFile !== null ? <a href={serverPath+'data/'+examFolder+'/answers/'+data.answerFile} target="_blank">Click To Download</a> : '',
                    ansUploadTime: data.answerUploadTime !== '' &&  data.answerUploadTime !== undefined ?<Moment format="MMMM Do YYYY, H:mm:ss A">{data.answerUploadTime}</Moment> : ''
                });
            })
        }
    }
    return myData;
}

async function goToChecking(exam, setShow, setMsg, setQuestions, questions, history,checkerType) {
    let examDetails = null;
    const myQuestions = await getQuestions(exam);

    if (myQuestions) 
    {
        let marksArray = [];
        for (let i = 0; i < myQuestions.length; i++) {
            if(checkerType ==='QPC')
            {
                marksArray.push((myQuestions[i].obtmarks !== null && myQuestions[i].obtmarks !== undefined) ? myQuestions[i].obtmarks : 'NA');
            }
            else if(checkerType === 'QPM')
            {
                marksArray.push((myQuestions[i].obtmarks1 !== null && myQuestions[i].obtmarks1 !== undefined) ? myQuestions[i].obtmarks1 : 'NA');
            }
        }

        examDetails = {
            exam: exam,
            questions: myQuestions,
            currentQuestionIndex: 0,
            marks: marksArray,
            checkerType:checkerType
        }
        history.replace("/paperChecking", examDetails);
    }
    else 
    {
        setShow(true);
        setMsg('Problem Fetching Data from System...');
    }
}

async function getQuestions(exam) {
    const ExamId = exam.id;

    const res = await API.get('/answer', { params: { "exam_id": ExamId, "type":"subjective" } });
    if (res.data.status === 'success') {
        return res.data.data;
    }
    else {
        return null;
    }
}

function getHeader(examData,checkerType,selectOptions) {
    let myHeader = [];
    let headerStr='';
    if(checkerType === 'QPC')
    {
        headerStr = 'Checking Status';
    }
    else if(checkerType === 'QPM')
    {
        headerStr = 'Moderation Status';
    }

    if (examData[0].paper.exam_mode === 'subjective') {
        myHeader = [
            { text: 'Sr No', dataField: 'srno' },
            { text: 'Exam Id', dataField: 'examid'},
            { text: 'Score', dataField: 'score'},
            { text: headerStr, dataField: 'status' },
            { text: 'Answer File', dataField: 'answerFile'},
            { text: 'Answer Upload Time', dataField: 'ansUploadTime'}
        ];
    }
    else if (examData[0].paper.exam_mode === 'both') {
        myHeader = [
            { text: 'Sr No', dataField: 'srno' },
            { text: 'Exam Id', dataField: 'examid'},
            { text: 'Objective Exam Score', dataField: 'score' },
            { text: 'Subjective Exam Score', dataField: 'scores' },
            { text: 'Total Score', dataField: 'scoret' },
            { text: 'Status', dataField: 'status',
            filter: selectFilter({
              options: selectOptions
            }) },
            { text: headerStr, dataField: 'status1' },
            { text: 'Answer File', dataField: 'answerFile'},
            { text: 'Answer Upload Time', dataField: 'ansUploadTime'}
        ];
    }
    return myHeader;
}

export default CheckerExamDataList;