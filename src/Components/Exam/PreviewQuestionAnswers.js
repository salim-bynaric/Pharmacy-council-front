import React, {useState,useContext} from 'react';
import MathJax from 'react-mathjax-preview';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import {ExamFolderContext} from '../../App';
import { Markup } from 'interweave';
import PreviewOptions from '../Institute/PreviewOptions';
import PreViewSubjectiveAnswer from '../Institute/PreViewSubjectiveAnswer';

const PreviewQuestionAnswers = ({ questions, myIndex }) => 
{
    const { examFolder }        = useContext(ExamFolderContext);
    const [isOpen, setIsOpen]   = useState(false);
    //------------------------------Question Variables----------------------------
    let  question       =   '';
    const projpath      =   process.env.REACT_APP_PROJPATH;
    let question_path   =  '';
    const dataFolder    =   examFolder;
    //----------------------------------------------------------------------------

    let opta= null,optb=null,optc=null,optd=null;
    let optimga=null,optimgb=null,optimgc=null,optimgd=null,quest=null;

    opta = questions[myIndex] !== undefined ? questions[myIndex].optiona :'';
    optimga = questions[myIndex] !== undefined ? questions[myIndex].a1 :'';

    optb = questions[myIndex] !== undefined ? questions[myIndex].optionb :'';
    optimgb = questions[myIndex] !== undefined ? questions[myIndex].a2 :'';

    optc = questions[myIndex] !== undefined ? questions[myIndex].optionc :'';
    optimgc = questions[myIndex] !== undefined ? questions[myIndex].a3 :'';

    optd = questions[myIndex] !== undefined ? questions[myIndex].optiond : '';
    optimgd = questions[myIndex] !== undefined ? questions[myIndex].a4 :'';


    if(questions[myIndex] && !questions[myIndex].qu_fig)
    {
        question = questions[myIndex].question;
    }
    else
    {
        if(questions[myIndex])
        {
            question = questions[myIndex].question;
            question_path = projpath+"data/"+dataFolder+"/files/"+questions[myIndex].qu_fig;
        }
    }

    let mathIndexes = getMathIndexes(question);
    let textIndexes = getTextIndexes(mathIndexes,question);
    let questArray = mergeTwoArr(textIndexes,mathIndexes,question);
    let i = 0;

    return (
        questions[myIndex] ?
            <div className="col-lg-12 row">
                {questions[myIndex].quest_type !== 'S' ?
                    ((questions[myIndex].qu_fig !== undefined || questions[myIndex].a1 !== undefined || questions[myIndex].a2 !== undefined || questions[myIndex].a3 !== undefined || questions[myIndex].a4 !== undefined) && (questions[myIndex].qu_fig !== null || questions[myIndex].a1 !== null || questions[myIndex].a2 !== null || questions[myIndex].a3 !== null || questions[myIndex].a4 !== null) && (questions[myIndex].qu_fig !== '' || questions[myIndex].a1 !== '' || questions[myIndex].a2 !== '' || questions[myIndex].a3 !== '' || questions[myIndex].a4 !== '')) ?
                        <div className="alert alert-success col-lg-12" role="alert">
                            Click on Image to Magnify...
                        </div>
                        :
                        null
                    :
                    ((questions[myIndex].qu_fig !== undefined && questions[myIndex].qu_fig !== null && questions[myIndex].qu_fig !== '')) ?
                        <div className="alert alert-success col-lg-12" role="alert">
                            Click on Image to Magnify...
                        </div>
                        : null
                }

                <div className="col-lg-12">
                    <b>Question Id: {questions[myIndex].qnid}:</b>
                    <span style={{ float: "right" }}>
                        <div style={{ float: 'right' }}><b>{'Marks: ' + questions[myIndex].marks}</b></div>
                    </span>
                </div>

                <div className="col-lg-12 scroll1" style={{ height: "150px", overflow: "auto", "WebkitOverflowScrolling": "touch" }}>
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
                    <br />
                    {isOpen && (<Lightbox
                        mainSrc={question_path}
                        onCloseRequest={() => setIsOpen(false)}
                    />
                    )}
                    <img src={question_path} alt="" onClick={() => setIsOpen(true)} title="Click on Image to Enlarge" style={{"borderRadius":"5px"}} onDragStart={(e) => {e.preventDefault();}}/>
                </div>

                <div className="col-lg-12">
                    <hr />
                </div>

                <div className="col-lg-12 scroll1" style={{height:"255px", overflowY:"scroll"}}>
              
                {(questions[myIndex].quest_type === 'O' || questions[myIndex].quest_type === '' || questions[myIndex].quest_type === null || questions[myIndex].quest_type === undefined) ?
                <>
                    <PreviewOptions id="optiona" opt={opta} optimage={optimga} questions={questions} myIndex={myIndex}/>
                    <hr/>
                    <PreviewOptions id="optionb" opt={optb} optimage={optimgb} questions={questions} myIndex={myIndex}/>
                    <hr/>
                    <PreviewOptions id="optionc" opt={optc} optimage={optimgc} questions={questions} myIndex={myIndex}/>
                    <hr/>
                    <PreviewOptions id="optiond" opt={optd} optimage={optimgd} questions={questions} myIndex={myIndex}/>    
                </>      
                :
                  <PreViewSubjectiveAnswer questions={questions} myIndex={myIndex}/>
                }
                </div>
            </div>
            : null
    );
};

function mergeTwoArr(textIndexes,mathIndexes,question)
{
  let arr = [];
  let val = [];
  let t=0,m=0;
  for(let i=0;i<(textIndexes.length+mathIndexes.length);i++)
  {
    if(i%2 === 0)
    {
      arr.push(textIndexes[t++]);
    }
    else
    {
      arr.push(mathIndexes[m++]);
    }
  }

  for(let i=0;i<arr.length;i++)
  {
    let first = arr[i].split('-')[0];
    let second = arr[i].split('-')[1];

    val[i] = question.substring(first,second);
  }
  return val;
}

function getTextIndexes(mathIndexes,question)
{
  let textIndexes = [];
  let latstMathEnd = 0;
  let mathStart = 0;
  let mathEnd = 0;
  if(question !== null && question !== undefined)
  {
    if(mathIndexes.length > 0)
    {
      for(let i=0;i<mathIndexes.length;i++)
      {
        let start = 0;let end = 0;

        if(i===0)
        {
          mathStart = parseInt(mathIndexes[i].split('-')[0]);
          mathEnd = parseInt(mathIndexes[i].split('-')[1]);
          if(mathStart > 0)
          {
            textIndexes.push('0-'+(mathStart));
          }
          else
          {
            textIndexes.push('0-0');
          }
          latstMathEnd = mathEnd;
        }
        else
        {
          mathStart = parseInt(mathIndexes[i].split('-')[0]);
          mathEnd = parseInt(mathIndexes[i].split('-')[1]);

          textIndexes.push((latstMathEnd)+'-'+(mathStart));
          latstMathEnd = mathEnd;
        }
      }
      textIndexes.push((latstMathEnd)+'-'+(parseInt(question.length)));
    }
    else
    {
      textIndexes.push((0+'-'+question.length));
    }
  }
  return textIndexes;
}

function getMathIndexes(question)
{
  let count = 0;
  let mathIndex = [];
  if(question !== null && question !== undefined)
  {
    let totalLength = question.length;
    //-------------------Find number of <math> Tags--------------------------------------------------
    if(question.match(/<math/g)!==null)
    {
      count = question.match(/<math/g).length;
    }
    //-----------------------------------------------------------------------------------------------

    //-------------------Find indexes of <math> and </math> for each math tag and store in array-----
    let lastEnd = 0;
    for(let i=0;i<count;i++)
    {
      let start = question.indexOf('<math');
      let end = question.indexOf('</math>')+7;
    
      if(i === 0)
      {
        mathIndex.push((lastEnd+start)+'-'+(lastEnd+end));
        lastEnd = lastEnd+end;
      }
      else
      {
        mathIndex.push((lastEnd+start)+'-'+(lastEnd+end));
        lastEnd = lastEnd+end;
      }
      question = question.substr(end,question.length);
    }
    //-----------------------------------------------------------------------------------------------
  }
  return mathIndex;
}

export default PreviewQuestionAnswers;