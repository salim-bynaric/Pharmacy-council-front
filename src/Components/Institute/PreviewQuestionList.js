import React,{useContext} from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import MathJax from 'react-mathjax-preview';
import { Markup } from 'interweave';
import { ExamFolderContext,ShowContext } from '../../App';
import { useHistory } from 'react-router-dom';
import API from '../../api';

const PreviewQuestionList = ({questions,paper}) => 
{ 
    const header                    =   getHeader();
    const {setShow,setMsg}          =   useContext(ShowContext);
    let history                     =   useHistory();
    const { examFolder }            =   useContext(ExamFolderContext);
    const data                      =   getData(questions,examFolder,setShow,setMsg,history,paper);
    

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


    return (
        <div style={{"overflow":"auto"}} className="scroll1">
            <BootstrapTable keyField='srno' data={ data } columns={ header } filter={ filterFactory() } pagination={ paginationFactory(options) }/>
        </div>
    );
};

async function editQuestion(qnid, setShow, setMsg, history,subject) 
{
    await API.get('question/' + qnid)
        .then((res) => {

            if (res.data.status === 'success') {
               if(res.data.data.quest_type === 'O')
               {
                    history.replace("/moderateQB", { question: res.data.data, subject: subject, flag:'edit','ru':'/examListView' });
               }
               else
               {
                    history.replace("/moderateSubjectiveQB", { question: res.data.data, subject: subject,flag:'edit' ,'ru':'/examListView'});
               }
            }
            else {
                
                setShow(true);
                setMsg(res.data.message);
            }
        })
        .catch(function (error) {
            
        });
}

function getHeader()
{
    let myHeader = [
        { text: 'Sr No', dataField: 'srno'},
        { text: 'QNID', dataField: 'qnid',filter: textFilter()},
        { text: 'Question', dataField: 'question',style:{'maxWidth' : '100px',"overflow":"auto"},classes: 'scroll1'},
        { text: 'Question Image', dataField: 'qimage',style:{'maxWidth' : '100px',"overflow":"auto"},classes: 'scroll1'},
        { text: 'Option A', dataField: 'optiona',style:{'maxWidth' : '100px',"overflow":"auto"},classes: 'scroll1'},
        { text: 'Option A Img', dataField: 'a1' ,style:{'maxWidth' : '100px',"overflow":"auto"},classes: 'scroll1'},
        { text: 'Option B', dataField: 'optionb',style:{'maxWidth' : '100px',"overflow":"auto"},classes: 'scroll1'},
        { text: 'Option B Img', dataField: 'a2' ,style:{'maxWidth' : '100px',"overflow":"auto"},classes: 'scroll1'},
        { text: 'Option C', dataField: 'optionc',style:{'maxWidth' : '100px',"overflow":"auto"},classes: 'scroll1'},
        { text: 'Option C Img', dataField: 'a3' ,style:{'maxWidth' : '100px',"overflow":"auto"},classes: 'scroll1'},
        { text: 'Option D', dataField: 'optiond',style:{'maxWidth' : '100px',"overflow":"auto"},classes: 'scroll1'},
        { text: 'Option D Img', dataField: 'a4' ,style:{'maxWidth' : '100px',"overflow":"auto"},classes: 'scroll1'},
        { text: 'Model Answer', dataField: 'modelAns' ,style:{'maxWidth' : '100px',"overflow":"auto"},classes: 'scroll1'},
        { text: 'Edit', dataField: 'edit'},
    ];
    return myHeader;
}

function getData(questions,examFolder,setShow,setMsg,history,paper)
{
    const dataFolder = examFolder;
    const Path = process.env.REACT_APP_PROJPATH + 'data/' + dataFolder + '/files/';
   
    let myData = [];
    let i = 1;
    questions.map((data, index) => 
    {
        let qMathIndexes = data.question !== null ? getMathIndexes(data.question) : '';
            let qTextIndexes = getTextIndexes(qMathIndexes, data.question !== null ? data.question :'');
            let questArray = mergeTwoArr(qTextIndexes, qMathIndexes, data.question!==null ? data.question:'');
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

            let optaMathIndexes = data.optiona !== null ? getMathIndexes(data.optiona.split(':$:')[0]):'';
            let optaTextIndexes = getTextIndexes(optaMathIndexes, data.optiona !== null ? data.optiona.split(':$:')[0]:'');
            let optaArray = mergeTwoArr(optaTextIndexes, optaMathIndexes, data.optiona !== null ? data.optiona.split(':$:')[0]:'');
            
            let opta = data.optiona !== null ? data.optiona.split(':$:')[0] !== undefined && data.optiona.split(':$:')[0] !== null ?
                optaArray.map((data, index) => {
                    if (index % 2 === 0) {
                        return <Markup content={optaArray[index]} />
                    }
                    else {
                        return <MathJax math={optaArray[index]} />
                    }
                })
            : null :'';

            let optbMathIndexes = data.optionb !== null ? getMathIndexes(data.optionb.split(':$:')[0]):'';
            let optbTextIndexes = getTextIndexes(optbMathIndexes, data.optionb !== null ? data.optionb.split(':$:')[0]:'');
            let optbArray = mergeTwoArr(optbTextIndexes, optbMathIndexes, data.optionb !== null ? data.optionb.split(':$:')[0]:'');
            
            let optb = data.optionb !== null ? data.optionb.split(':$:')[0] !== undefined && data.optionb.split(':$:')[0] !== null ?
                optbArray.map((data, index) => {
                    if (index % 2 === 0) {
                        return <Markup content={optbArray[index]} />
                    }
                    else {
                        return <MathJax math={optbArray[index]} />
                    }
                })
            : null :'';

            let optcMathIndexes = data.optionc!== null ? getMathIndexes(data.optionc.split(':$:')[0]):'';
            let optcTextIndexes = getTextIndexes(optcMathIndexes, data.optionc !== null ? data.optionc.split(':$:')[0]:'');
            let optcArray = mergeTwoArr(optcTextIndexes, optcMathIndexes, data.optionc !== null ? data.optionc.split(':$:')[0]:'');
            
            let optc = data.optionc !== null ? data.optionc.split(':$:')[0] !== undefined && data.optionc.split(':$:')[0] !== null ?
                optcArray.map((data, index) => {
                    if (index % 2 === 0) {
                        return <Markup content={optcArray[index]} />
                    }
                    else {
                        return <MathJax math={optcArray[index]} />
                    }
                })
            : null :'';

            let optdMathIndexes = data.optiond!== null ? getMathIndexes(data.optiond.split(':$:')[0]):'';
            let optdTextIndexes = getTextIndexes(optdMathIndexes, data.optiond !== null ? data.optiond.split(':$:')[0]:'');
            let optdArray = mergeTwoArr(optdTextIndexes, optdMathIndexes, data.optiond !== null ? data.optiond.split(':$:')[0]:'');
            
            let optd = data.optiond !== null ? data.optiond.split(':$:')[0] !== undefined && data.optiond.split(':$:')[0] !== null ?
                optdArray.map((data, index) => {
                    if (index % 2 === 0) {
                        return <Markup content={optdArray[index]} />
                    }
                    else {
                        return <MathJax math={optdArray[index]} />
                    }
                })
            : null :'';

            let optmodelMathIndexes = data.modelAnswer!== null ? getMathIndexes(data.modelAnswer):'';
            let optmodelTextIndexes = data.modelAnswer!== null ? getTextIndexes(optmodelMathIndexes, data.modelAnswer):'';
            let optmodelArray = mergeTwoArr(optmodelTextIndexes, optmodelMathIndexes, data.modelAnswer!== null ? data.modelAnswer:'');
            
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

        myData.push({
            srno                    : i++,
            qnid                    : data.qnid,
            question                : question,
            qimage                  : data.qu_fig ? <img src={Path + '' + data.qu_fig + '?i=' + Date.now()} alt="" height={100} width={100} onDragStart={(e) => {e.preventDefault();}}/> : null,
            optiona                 : (data.optiona !== null && data.optiona !== '') ? opta : '',
            a1: data.a1 ? <img src={Path + '' + data.a1.split(':$:')[0] + '?i=' + Date.now()} alt="" height={100} width={100} onDragStart={(e) => {e.preventDefault();}}/> : null,
            optionb                 : (data.optionb !== null && data.optionb !== '') ? optb : '',
            a2: data.a2 ? <img src={Path + '' + data.a2.split(':$:')[0] + '?i=' + Date.now()} alt="" height={100} width={100} onDragStart={(e) => {e.preventDefault();}}/> : null,
            optionc                 : (data.optionc !== null && data.optionc !== '') ? optc : '',
            a3: data.a3 ? <img src={Path + '' + data.a3.split(':$:')[0] + '?i=' + Date.now()} alt="" height={100} width={100} onDragStart={(e) => {e.preventDefault();}}/> : null,
            optiond                 : (data.optiond !== null && data.optiond !== '') ? optd : '',
            a4: data.a4 ? <img src={Path + '' + data.a4.split(':$:')[0] + '?i=' + Date.now()} alt="" height={100} width={100} onDragStart={(e) => {e.preventDefault();}}/> : null,
            modelAns                : modelAnswer,
            edit                    : <button className="btn btn-primary btn-sm" onClick={() => { editQuestion(data.qnid, setShow, setMsg, history,paper) }}>Edit</button>
        });
    })
 
    return myData;
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


export default PreviewQuestionList;