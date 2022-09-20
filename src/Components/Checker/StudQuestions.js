import React, { useState, useContext, useEffect } from 'react';
import { Markup } from 'interweave';
import { ExamFolderContext } from '../../App';
import MathJax from 'react-mathjax-preview';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import API from '../../api';

const StudQuestions = (props) => {

    const { examFolder } = useContext(ExamFolderContext);
    const header = getHeader();
    const examId = props.match.params.examId;
    const [data, setData] = useState();
    const [questions, setQuestions] = useState();

    const options = {
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

    useEffect(() => {
        getQuestions(examId, setQuestions)
    }, []);

    useEffect(() => {
        if (questions !== undefined && examFolder !== undefined) {
            getData(questions, examFolder ,setData);
        }
    }, [questions,examFolder])

    return (
        questions !== undefined && data !== undefined ?
            <div>
                <div className="container-fluid">
                    <h1 className="mt-4">Student Questions</h1>
                    <ol className="breadcrumb mb-4">
                        <li className="breadcrumb-item active">All Questions At a Glance</li>
                    </ol>
                    <div className="row col-lg-12">
                        <BootstrapTable keyField='srno' data={data} columns={header} filter={filterFactory()} pagination={paginationFactory(options)} />
                    </div>

                </div>
            </div>
        : null
    );
};

async function getQuestions(ExamId, setQuestions) {
    const res = await API.get('/answer', { params: { "exam_id": ExamId } });
    if (res.data.status === 'success') {
        setQuestions(res.data.data);
    }
    else {
        setQuestions(undefined);
    }
}

function getData(questions, examFolder, setData) {
    const dataFolder = examFolder;
    const Path = process.env.REACT_APP_PROJPATH + 'data/' + dataFolder + '/files/';

    let myData = [];
    let i = 1;
    questions.map((data, index) => {
        let qMathIndexes = data.question !== null ? getMathIndexes(data.question.question) : '';
        let qTextIndexes = getTextIndexes(qMathIndexes, data.question.question !== null ? data.question.question : '');
        let questArray = mergeTwoArr(qTextIndexes, qMathIndexes, data.question.question !== null ? data.question.question : '');
        let question = data.question.question !== undefined && data.question.question !== null ?
            questArray.map((data, index) => {
                if (index % 2 === 0) {
                    return <Markup content={questArray[index]} />
                }
                else {
                    return <MathJax math={questArray[index]} />
                }
            })
            : null;

        myData.push({
            srno: i++ /*+'('+data.question.qnid+')'*/,
            co:data.question.topic,
            question: question,
            qimage: data.question.qu_fig ? <img src={Path + '' + data.question.qu_fig + '?i=' + Date.now()} alt="" height={100} width={100} onDragStart={(e) => {e.preventDefault();}}/> : null,
            marks: data.marks
        });
    })

    setData(myData);
}

function getHeader() {
    let myHeader = [
        { text: 'Sr No', dataField: 'srno' },
        { text: 'Topic/CO', dataField: 'co' ,filter: textFilter()},
        { text: 'Question', dataField: 'question', style: { "overflow": "auto" }, classes: 'scroll1' },
        { text: 'Question Image', dataField: 'qimage', style: { "overflow": "auto" }, classes: 'scroll1' },
        { text: 'Marks', dataField: 'marks' ,filter: textFilter()},
    ];
    return myHeader;
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

export default StudQuestions;