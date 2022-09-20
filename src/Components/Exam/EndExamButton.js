import React, { useState, useEffect,useContext } from 'react';

import { useHistory } from 'react-router-dom';
import API from '../../api';
import {ShowContext} from '../../App';
import EndExamModal from './EndExamModal';
import {en} from '../../utils/Helper';


function EndExamButton(props) 
{
  const {setShow,setMsg}                  = useContext(ShowContext);
  const [show, setShow1]                  = useState(false);
  const [showEnd,setShowEnd]              = useState(false);
  let history                             = useHistory();
  const handleClose = ()                  => setShow1(false);
  const handleShow = ()                   => setShow1(true);
  const index                             = parseInt(props.index);
  const length                            = parseInt(props.length);
  let isLast                              = useLast(index,length);
  const maxQuestions                      = parseInt(props.data.location.state.questions.length);
  const questions                         = props.data.location.state.questions;
  const exam                              = props.data.location.state.exam;
  const answer                            = props.subjectiveAnswer;

  
        return (
          isLast ?
          <>
            <div>
              <button className="btn btn-danger btn-sm ans-btns-mg-btm" onClick={async () => {
                props.setDisableBtn(true);
                if(questions[index].questMode !== 'S')
                {
                  await saveAndChangeIndex(props,(index+1),history,maxQuestions,props.myOption,setShow,setMsg);
                }
                else
                {
                  await saveSubjectiveAnswer(exam,questions,answer,index,setShow,setMsg,history,maxQuestions,props);
                }

                props.setDisableBtn(false);
                handleShow();
              }} disabled={props.disableBtn}>End Exam</button>
            </div>
            
            <EndExamModal show={show} setShow1={setShow1} showEnd={showEnd} setShowEnd={setShowEnd} handleClose={handleClose} data={props.data} handleEndExam={handleEndExam} camRefOuter={props.camRefOuter}/>
            
          </>
            : null
        );
}

async function saveSubjectiveAnswer(exam,questions,answer,myIndex,setShow,setMsg,history,maxQuestions,props)
{
    let myQuestions             = questions;
    const answerId              = myQuestions[myIndex].id;
    const curOptionStatus       = myQuestions[myIndex].answered;
    let newOptionStatus         = '';
    let ExamId                  = exam.id;

    if(questions[myIndex].question.allowImageUpload === '' || questions[myIndex].question.allowImageUpload === null || questions[myIndex].question.allowImageUpload === undefined || questions[myIndex].question.allowImageUpload === 'N')
    {
        if(answer === '' || answer === null || answer === undefined)
        {
            if(myIndex < maxQuestions-1)
            {
                const examDetailsButtons = {
                exam                               :  props.data.location.state.exam,
                questions                          :  props.data.location.state.questions,
                currentQuestionIndex               :  myIndex+1,
                solvedQuestionIndexes              :  props.data.location.state.solvedQuestionIndexes, unsolvedQuestionIndexes            :  props.data.location.state.unsolvedQuestionIndexes,
                markedSolvedIndexes                :  props.data.location.state.markedSolvedIndexes,
                markedUnsolvedIndexes              :  props.data.location.state.markedUnsolvedIndexes,
                }
                props.setMyOption(undefined);
                history.replace("/startexam", examDetailsButtons) ;
            }
            return false;
        }
    }

    let myUnsolvedQuestionIndexes   =  props.data.location.state.unsolvedQuestionIndexes;
    let mySolvedQuestionIndexes     =  props.data.location.state.solvedQuestionIndexes;
    let myMarkedUnsolvedIndexes     =  props.data.location.state.markedUnsolvedIndexes;
    let myMarkedSolvedIndexes       =  props.data.location.state.markedSolvedIndexes;
    let allowImgUp                  = questions[myIndex].question.allowImageUpload;


    //-----------------------Find new option status2---------------------------
    if(curOptionStatus === 'unanswered')
    {
        newOptionStatus = 'answered';
    }
    else if(curOptionStatus === 'unansweredandreview')
    {
        newOptionStatus = 'answeredandreview';
    }
    else 
    {
        newOptionStatus = curOptionStatus;
    }
    
    //-----------------------------------------------------------------
    if(answer !== undefined && answer !== null)
    {
        await API.put('/answer/'+answerId,{"type":"savesubjectiveanswer","answered": en(newOptionStatus), "stdanswer": en(answer), "answer_by": en(ExamId),"curQuestion":en(''+myIndex+''),"allowImgUp":en(allowImgUp)})
        .then(async (res) =>
        {
            if(res.data.status === 'success')
            {
              props.setSubjectiveAnswer(undefined);
                //-----------------------Save Data to Local Array---------------------------
                if(curOptionStatus === 'unanswered')
                {
                    newOptionStatus                = 'answered';
                    myQuestions[myIndex].answered  = newOptionStatus;
                    myQuestions[myIndex].stdanswer = answer;
                    myUnsolvedQuestionIndexes      = myUnsolvedQuestionIndexes.filter(item => item !== myIndex);

                    mySolvedQuestionIndexes.push(myIndex);
                    myUnsolvedQuestionIndexes.sort();
                    mySolvedQuestionIndexes.sort();
                }
                else if(curOptionStatus === 'unansweredandreview')
                {
                    newOptionStatus                = 'answeredandreview';
                    myQuestions[myIndex].answered  = newOptionStatus;
                    myQuestions[myIndex].stdanswer = answer;
                    myMarkedUnsolvedIndexes        = myMarkedUnsolvedIndexes.filter(item => item !== myIndex);

                    myMarkedSolvedIndexes.push(myIndex);
                    myMarkedUnsolvedIndexes.sort();
                    myMarkedSolvedIndexes.sort();
                }
                else 
                {
                    newOptionStatus                = curOptionStatus;
                    myQuestions[myIndex].answered  = newOptionStatus;
                    myQuestions[myIndex].stdanswer = answer;
                }
                //-----------------------------------------------------------------
                

                mySolvedQuestionIndexes      = [...new Set(mySolvedQuestionIndexes)];
                myUnsolvedQuestionIndexes    = [...new Set(myUnsolvedQuestionIndexes)];
                myMarkedSolvedIndexes        = [...new Set(myMarkedSolvedIndexes)];
                myMarkedUnsolvedIndexes      = [...new Set(myMarkedUnsolvedIndexes)];

            //---------------Count mismatch handling----------by api call-------------------             

                if((mySolvedQuestionIndexes.length + myUnsolvedQuestionIndexes.length + myMarkedSolvedIndexes.length + myMarkedUnsolvedIndexes.length) !== maxQuestions)
                {
                    await API.get('/answer',{params:{"exam_id":ExamId}})
                    .then(res1 =>
                    {
                        myQuestions = res1.data;
                    });

                    mySolvedQuestionIndexes               =   getIndexes(myQuestions,'answered'); myUnsolvedQuestionIndexes             =   getIndexes(myQuestions,'unanswered');
                    myMarkedSolvedIndexes                 =   getIndexes(myQuestions,'answeredandreview');
                    myMarkedUnsolvedIndexes               =   getIndexes(myQuestions,'unansweredandreview');
                }

                let mergedArray = [...mySolvedQuestionIndexes,...myUnsolvedQuestionIndexes,...myMarkedSolvedIndexes,...myMarkedUnsolvedIndexes];

                //mergedArray      = [...new Set(mergedArray)];

                if(mergedArray.length !== maxQuestions)
                {
                    await API.get('/answer',{params:{"exam_id":ExamId}})
                    .then(res1 =>
                    {
                    myQuestions = res1.data;
                    });

                    mySolvedQuestionIndexes               =   getIndexes(myQuestions,'answered'); myUnsolvedQuestionIndexes             =   getIndexes(myQuestions,'unanswered');
                    myMarkedSolvedIndexes                 =   getIndexes(myQuestions,'answeredandreview');
                    myMarkedUnsolvedIndexes               =   getIndexes(myQuestions,'unansweredandreview');
                }
               

                if(myIndex < maxQuestions-1)
                {
                    const examDetailsButtons = {
                    exam                               :  props.data.location.state.exam,
                    questions                          :  myQuestions,
                    currentQuestionIndex               :  myIndex+1,
                    solvedQuestionIndexes              :  mySolvedQuestionIndexes, unsolvedQuestionIndexes            :  myUnsolvedQuestionIndexes,
                    markedSolvedIndexes                :  myMarkedSolvedIndexes,
                    markedUnsolvedIndexes              :  myMarkedUnsolvedIndexes
                    }
                    props.setMyOption(undefined);
                    history.replace("/startexam", examDetailsButtons) ;
                }

                if(myIndex === maxQuestions-1)
                {
                    const examDetailsButtons = {
                    exam                               :  props.data.location.state.exam,
                    questions                          :  myQuestions,
                    currentQuestionIndex               :  myIndex,
                    solvedQuestionIndexes              :  mySolvedQuestionIndexes, unsolvedQuestionIndexes            :  myUnsolvedQuestionIndexes,
                    markedSolvedIndexes                :  myMarkedSolvedIndexes,
                    markedUnsolvedIndexes              :  myMarkedUnsolvedIndexes
                    }
                    props.setMyOption(undefined);
                    history.replace("/startexam", examDetailsButtons) ;
                }
            }
            else
            {
              props.setSubjectiveAnswer(undefined);
              if(myIndex < maxQuestions-1)
                {
                    const examDetailsButtons = {
                    exam                               :  props.data.location.state.exam,
                    questions                          :  props.data.location.state.questions,
                    currentQuestionIndex               :  myIndex+1,
                    solvedQuestionIndexes              :  props.data.location.state.solvedQuestionIndexes, unsolvedQuestionIndexes            :  props.data.location.state.unsolvedQuestionIndexes,
                    markedSolvedIndexes                :  props.data.location.state.markedSolvedIndexes,
                    markedUnsolvedIndexes              :  props.data.location.state.markedUnsolvedIndexes,
                    }
                    props.setMyOption(undefined);
                    history.replace("/startexam", examDetailsButtons) ;
                }
                else
                {
                  props.setSubjectiveAnswer(undefined);
                    const examDetailsButtons = {
                        exam                               :  props.data.location.state.exam,
                        questions                          :  props.data.location.state.questions,
                        currentQuestionIndex               :  myIndex,
                        solvedQuestionIndexes              :  props.data.location.state.solvedQuestionIndexes, 
                        unsolvedQuestionIndexes            :  props.data.location.state.unsolvedQuestionIndexes,
                        markedSolvedIndexes                :  props.data.location.state.markedSolvedIndexes,
                        markedUnsolvedIndexes              :  props.data.location.state.markedUnsolvedIndexes,
                        }
                        props.setMyOption(undefined);
                        history.replace("/startexam", examDetailsButtons) ;
                }
            }
        })
        .catch(error =>
        {
          props.setSubjectiveAnswer(undefined);
            setShow(true);
            setMsg('Problem Capturing your Response. Please Try Again...');
            if(myIndex < maxQuestions-1)
            {
                const examDetailsButtons = {
                exam                               :  props.data.location.state.exam,
                questions                          :  props.data.location.state.questions,
                currentQuestionIndex               :  myIndex,
                solvedQuestionIndexes              :  props.data.location.state.solvedQuestionIndexes, unsolvedQuestionIndexes            :  props.data.location.state.unsolvedQuestionIndexes,
                markedSolvedIndexes                :  props.data.location.state.markedSolvedIndexes,
                markedUnsolvedIndexes              :  props.data.location.state.markedUnsolvedIndexes,
                }
                props.setMyOption(undefined);
                history.replace("/startexam", examDetailsButtons) ;
            }
        });
    }
    else
    {
        if(myIndex < maxQuestions-1)
        {
        const examDetailsButtons = {
        exam                               :  props.data.location.state.exam,
        questions                          :  props.data.location.state.questions,
        currentQuestionIndex               :  myIndex+1,
        solvedQuestionIndexes              :  props.data.location.state.solvedQuestionIndexes, unsolvedQuestionIndexes            :  props.data.location.state.unsolvedQuestionIndexes,
        markedSolvedIndexes                :  props.data.location.state.markedSolvedIndexes,
        markedUnsolvedIndexes              :  props.data.location.state.markedUnsolvedIndexes,
        }
        props.setMyOption(undefined);
        history.replace("/startexam", examDetailsButtons) ;
        }
    }
}


function useLast(index,length)
{
  const [isLast, setIsLast]               = useState(false);

  useEffect(() => {
    index === length-1 ? setIsLast(true):  setIsLast(false);
  },[index,length]);

  return isLast;
}

async function handleEndExam(props,history)
{
  const exam      = props.data.location.state.exam;
  const ExamId    = exam.id;
  const negative_marking = exam.paper.negative_marking;
  const negative_marks = exam.paper.negative_marks;

  const res = await API.put('/exam/'+ExamId,{"status": "end","negativeMarking":negative_marking,"negativeMarks":negative_marks});
  if(res.data.status === 'success')
  {
    localStorage.setItem("UserState", undefined);
    localStorage.setItem("ExamState", undefined);
    history.replace({pathname:"studenthome",state:{"end":'success'}});
  }
}

async function saveAndChangeIndex(props,index,history,maxQuestions,myOption,setShow,setMsg)
{
  let myQuestions           = props.data.location.state.questions;
  const myIndex             = (index-1);
  const curOptionStatus     = myQuestions[myIndex].answered;
  const answerId            = myQuestions[myIndex].id;
  let newOptionStatus       = '';

  let questWiseTimer = props.data.location.state.exam.paper.questwisetimer;

  let myUnsolvedQuestionIndexes   =  props.data.location.state.unsolvedQuestionIndexes;
  let mySolvedQuestionIndexes     =  props.data.location.state.solvedQuestionIndexes;
  let myMarkedUnsolvedIndexes     =  props.data.location.state.markedUnsolvedIndexes;
  let myMarkedSolvedIndexes       =  props.data.location.state.markedSolvedIndexes;

  //-----------------------Find new option status2---------------------------
    if(curOptionStatus === 'unanswered'){
      newOptionStatus = 'answered';
    }
    else if(curOptionStatus === 'unansweredandreview'){
      newOptionStatus = 'answeredandreview';
    }
    else {
      newOptionStatus = curOptionStatus;
    }
    //-----------------------------------------------------------------
  if(myOption !== undefined && myOption !== null)
  {
    //-----------------------Send Data to Server--------------------------------
    const ExamId = props.data.location.state.exam.id;
    
    await API.put('/answer/'+answerId,{"type":"saveanswer","answered": en(newOptionStatus), "stdanswer": en(myOption), "answer_by": en(''+ExamId+''),"curQuestion":en(''+myIndex+''),"questWiseTimer" : en(''+questWiseTimer+'') })
    .then(async (res) =>
     {
         if(res.data.status === 'success')
         {
            //let myQuestions = res.data.questions;
            //-----------------------Save Data to Local Array---------------------------
            if(curOptionStatus === 'unanswered')
            {
              newOptionStatus                = 'answered';
              myQuestions[myIndex].answered  = newOptionStatus;
              myQuestions[myIndex].stdanswer = myOption;
              myUnsolvedQuestionIndexes      = myUnsolvedQuestionIndexes.filter(item => item !== myIndex);

              mySolvedQuestionIndexes.push(myIndex);
              myUnsolvedQuestionIndexes.sort();
              mySolvedQuestionIndexes.sort();
            }
            else if(curOptionStatus === 'unansweredandreview')
            {
              newOptionStatus                = 'answeredandreview';
              myQuestions[myIndex].answered  = newOptionStatus;
              myQuestions[myIndex].stdanswer = myOption;
              myMarkedUnsolvedIndexes        = myMarkedUnsolvedIndexes.filter(item => item !== myIndex);

              myMarkedSolvedIndexes.push(myIndex);
              myMarkedUnsolvedIndexes.sort();
              myMarkedSolvedIndexes.sort();
            }
            else 
            {
              newOptionStatus                = curOptionStatus;
              myQuestions[myIndex].answered  = newOptionStatus;
              myQuestions[myIndex].stdanswer = myOption;
            }
            //-----------------------------------------------------------------
            

            mySolvedQuestionIndexes      = [...new Set(mySolvedQuestionIndexes)];
            myUnsolvedQuestionIndexes    = [...new Set(myUnsolvedQuestionIndexes)];
            myMarkedSolvedIndexes        = [...new Set(myMarkedSolvedIndexes)];
            myMarkedUnsolvedIndexes      = [...new Set(myMarkedUnsolvedIndexes)];

       //---------------Count mismatch handling----------by api call-------------------             

           if((mySolvedQuestionIndexes.length + myUnsolvedQuestionIndexes.length + myMarkedSolvedIndexes.length + myMarkedUnsolvedIndexes.length) !== maxQuestions)
            {
               
               await API.get('/answer',{params:{"exam_id":ExamId}})
               .then(res1 =>
               {
                 myQuestions = res1.data;
               });

               mySolvedQuestionIndexes               =   getIndexes(myQuestions,'answered'); myUnsolvedQuestionIndexes             =   getIndexes(myQuestions,'unanswered');
               myMarkedSolvedIndexes                 =   getIndexes(myQuestions,'answeredandreview');
               myMarkedUnsolvedIndexes               =   getIndexes(myQuestions,'unansweredandreview');
            }

            let mergedArray = [...mySolvedQuestionIndexes,...myUnsolvedQuestionIndexes,...myMarkedSolvedIndexes,...myMarkedUnsolvedIndexes];

            //mergedArray      = [...new Set(mergedArray)];

            if(mergedArray.length !== maxQuestions)
            {
               await API.get('/answer',{params:{"exam_id":ExamId}})
               .then(res1 =>
               {
                 myQuestions = res1.data;
               });

               mySolvedQuestionIndexes               =   getIndexes(myQuestions,'answered'); myUnsolvedQuestionIndexes             =   getIndexes(myQuestions,'unanswered');
               myMarkedSolvedIndexes                 =   getIndexes(myQuestions,'answeredandreview');
               myMarkedUnsolvedIndexes               =   getIndexes(myQuestions,'unansweredandreview');
            }
      //-----------------------------------------------------------------------------------------
             var originalSelectedOptions             = getSelectedOptions(myQuestions);         
            

             if(index < maxQuestions)
             {
               const examDetailsButtons = {
                 exam                               :  props.data.location.state.exam,
                 questions                          :  myQuestions,
                 currentQuestionIndex               :  myIndex+1,
                 solvedQuestionIndexes              :  mySolvedQuestionIndexes, unsolvedQuestionIndexes            :  myUnsolvedQuestionIndexes,
                 markedSolvedIndexes                :  myMarkedSolvedIndexes,
                 markedUnsolvedIndexes              :  myMarkedUnsolvedIndexes
               }
               props.setMyOption(undefined);
               history.replace("/startexam", examDetailsButtons) ;
             }
             if(index === maxQuestions)
             {
               const examDetailsButtons = {
                 exam                               :  props.data.location.state.exam,
                 questions                          :  myQuestions,
                 currentQuestionIndex               :  myIndex,
                 solvedQuestionIndexes              :  mySolvedQuestionIndexes, unsolvedQuestionIndexes            :  myUnsolvedQuestionIndexes,
                 markedSolvedIndexes                :  myMarkedSolvedIndexes,
                 markedUnsolvedIndexes              :  myMarkedUnsolvedIndexes
               }
               props.setSelectedOptions(originalSelectedOptions);
               props.setMyOption(undefined);
               history.replace("/startexam", examDetailsButtons) ;
             }
         }
     })
    .catch(error =>
     {
       
           setShow(true);
           setMsg('Problem Capturing your Response. Please Try Again...');
           if(index < maxQuestions)
           {
             const examDetailsButtons = {
             exam                               :  props.data.location.state.exam,
             questions                          :  props.data.location.state.questions,
             currentQuestionIndex               :  myIndex,
             solvedQuestionIndexes              :  props.data.location.state.solvedQuestionIndexes, unsolvedQuestionIndexes            :  props.data.location.state.unsolvedQuestionIndexes,
             markedSolvedIndexes                :  props.data.location.state.markedSolvedIndexes,
             markedUnsolvedIndexes              :  props.data.location.state.markedUnsolvedIndexes,
             }
             props.setMyOption(undefined);
             history.replace("/startexam", examDetailsButtons) ;
           }
      
     });
    //--------------------------------------------------------------------------
  }
  else
  {
    if(index < maxQuestions)
    {
      const examDetailsButtons = {
      exam                               :  props.data.location.state.exam,
      questions                          :  props.data.location.state.questions,
      currentQuestionIndex               :  myIndex+1,
      solvedQuestionIndexes              :  props.data.location.state.solvedQuestionIndexes, unsolvedQuestionIndexes            :  props.data.location.state.unsolvedQuestionIndexes,
      markedSolvedIndexes                :  props.data.location.state.markedSolvedIndexes,
      markedUnsolvedIndexes              :  props.data.location.state.markedUnsolvedIndexes,
      }
      props.setMyOption(undefined);
      history.replace("/startexam", examDetailsButtons) ;
    }
  }
}

function getSelectedOptions(questions)
{
  let originalSelectedOptions = {};
  originalSelectedOptions = questions.map((question,index) =>
  {
    return question.stdanswer
  });
  return originalSelectedOptions;
}


function getIndexes(myQuestions,searchString)
{
  let arr     = [];
  myQuestions.forEach(function(question,index){
    if(question.answered === searchString)
    {
      arr.push(index);
    }
  });
  return arr;
}


export default EndExamButton;
