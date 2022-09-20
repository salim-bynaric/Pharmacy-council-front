import React, {useState,useEffect,useContext} from 'react';
import { useHistory } from 'react-router-dom';
import {ShowContext} from '../../App';
import API from '../../api';

const QuestWiseTimer = (props) => {
    let currentQuestionIndex    = 0;
    let totalQuestions          = 0;
    let perQuestTime            = 0;
    let history                 = useHistory();
    const maxQuestions          = parseInt(props.data.location.state.questions.length);
    const {setShow,setMsg}      = useContext(ShowContext);
    const questions             = props.data.location.state.questions;
    const exam                  = props.data.location.state.exam;
    const answer                = props.subjectiveAnswer;


    if(props.data.location.state && props.data.location.state.exam.paper.secperquest > 0)
    {
        currentQuestionIndex    =   props.data.location.state.currentQuestionIndex;
        totalQuestions          =   props.data.location.state.questions.length;
        perQuestTime            =   props.data.location.state.exam.paper.secperquest;
    }
  
    const [timer,setTimer]      = useState(perQuestTime);

    useEffect(() =>{
        setTimer(perQuestTime);
    },[currentQuestionIndex])

    useEffect(()=>
    {
        const interval = setInterval(() => {
            
            if(props.qwtExaust)
            {
                props.data.location.state.exam.paper.questwisetimer = 0;
                props.data.location.state.exam.paper.secperquest = 0;

                if(questions[currentQuestionIndex].questMode !== 'S')
                {
                  saveAndChangeIndex(props,(currentQuestionIndex+1),history,maxQuestions,props.myOption,setShow,setMsg);
                }
                else
                {
                  saveSubjectiveAnswer(exam,questions,answer,currentQuestionIndex,setShow,setMsg,history,maxQuestions,props)
                }
            }

            setTimer(timer-1);

            if(currentQuestionIndex ===  totalQuestions)
            {
                clearInterval(interval);
                setTimer(0);
                
            }
            else
            {
                if(timer === 0)
                {
                    setTimer(0);
                    //--------Call function to go to next question-------------------
                    if(totalQuestions-2 >= currentQuestionIndex)
                    {
                      if(questions[currentQuestionIndex].questMode !== 'S')
                      {  
                        saveAndChangeIndex(props,(currentQuestionIndex+1),history,maxQuestions,props.myOption,setShow,setMsg);
                      }
                      else
                      {
                        saveSubjectiveAnswer(exam,questions,answer,currentQuestionIndex,setShow,setMsg,history,maxQuestions,props)
                      }
                    }    
                    //---------------------------------------------------------------
                }
            }
        }, 1000);
        return () => clearInterval(interval);
    },[timer,props.QWTExaust])

    return (
        props.data.location.state && perQuestTime !== 0 ? 
        <div className="col-lg-12">
            <div className='card col-lg-12'>
                <div className="card-header bg-warning row">
                    <div className="col-lg-12">
                      <h6><b><center>Question Wise Timer</center></b></h6>
                    </div>
                </div>
                <div>
                    <center>
                        Time Remaining <h4 id="time-left">{formatSeconds(timer)}</h4>
                    </center>
                </div>
            </div>
        </div>
        :null
    );
};
function formatSeconds(seconds) 
{
    var date = new Date(1970,0,1);
    date.setSeconds(seconds);
    return date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
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
        await API.put('/answer/'+answerId,{"type":"savesubjectiveanswer","answered": newOptionStatus, "stdanswer": answer, "answer_by": ExamId,"curQuestion":myIndex,"allowImgUp":allowImgUp})
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
    }
}

function changeIndex(props,index,history)
{
  var originalSelectedOptions        = getSelectedOptions(props.data.location.state.questions);

  if(index >= 0)
  {
    const examDetailsButtons = {
      preview                            :  props.data.location.state.preview,
      exam                               :  props.data.location.state.exam,
      questions                          :  props.data.location.state.questions,
      currentQuestionIndex               :  index,
      solvedQuestionIndexes              :  props.data.location.state.solvedQuestionIndexes, unsolvedQuestionIndexes            :  props.data.location.state.unsolvedQuestionIndexes,
      markedSolvedIndexes                :  props.data.location.state.markedSolvedIndexes,
      markedUnsolvedIndexes              :  props.data.location.state.markedUnsolvedIndexes
    }
    props.setSelectedOptions(originalSelectedOptions);
    props.setMyOption(undefined);
    history.replace("/startexam", examDetailsButtons) ;
  }
}

async function saveAndChangeIndex(props,index,history,maxQuestions,myOption,setShow,setMsg)
{
  let myQuestions           = props.data.location.state.questions;
  const myIndex             = (index-1);
  const curOptionStatus     = myQuestions[myIndex].answered;
  const answerId            = myQuestions[myIndex].id;
  let newOptionStatus       = '';
  

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
    await API.put('/answer/'+answerId,{"type":"saveanswer","answered": newOptionStatus, "stdanswer": myOption, "answer_by": ExamId,"curQuestion":myIndex})
    .then(async (res) =>
     {
         if(res.data.status === 'success')
         {
           //-----------------------Save Data to Local Array---------------------------
             if(curOptionStatus === 'unanswered'){
               newOptionStatus = 'answered';
               myQuestions[myIndex].answered = newOptionStatus;
               myQuestions[myIndex].stdanswer = myOption;
               myUnsolvedQuestionIndexes = myUnsolvedQuestionIndexes.filter(item => item !== myIndex);
               mySolvedQuestionIndexes.push(myIndex);
               myUnsolvedQuestionIndexes.sort();
               mySolvedQuestionIndexes.sort();
             }
             else if(curOptionStatus === 'unansweredandreview'){
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

             mySolvedQuestionIndexes      = [...new Set(mySolvedQuestionIndexes)];
             myUnsolvedQuestionIndexes    = [...new Set(myUnsolvedQuestionIndexes)];
             myMarkedSolvedIndexes        = [...new Set(myMarkedSolvedIndexes)];
             myMarkedUnsolvedIndexes      = [...new Set(myMarkedUnsolvedIndexes)];

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

            mergedArray      = [...new Set(mergedArray)];

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
            var originalSelectedOptions        = getSelectedOptions(myQuestions);

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
       if(error.response && error.response.status !== 429)
       {
           let examDetails = {};
           const myQuestions = getQuestions(props.data.location.state.exam);
           if(myQuestions)
           {
             examDetails = {
             exam                               :  props.data.location.state.exam,
             questions                          :  myQuestions,
             currentQuestionIndex               :  myIndex,
             solvedQuestionIndexes              :  getIndexes(myQuestions,'answered'), unsolvedQuestionIndexes            :  getIndexes(myQuestions,'unanswered'),
             markedSolvedIndexes                :  getIndexes(myQuestions,'answeredandreview'),
             markedUnsolvedIndexes              :  getIndexes(myQuestions,'unansweredandreview'),
             }
             props.setMyOption(undefined);
             history.replace("/startexam", examDetails) ;
           }
        }
        else
        {
           setShow(true);
           setMsg('Server is Busy. Please wait for some Seconds...');
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
        }
     });
    //--------------------------------------------------------------------------
  }
  else
  {
    const ExamId = props.data.location.state.exam.id;
    await API.put('/exam/'+ExamId,{"status":"saveCurQuestion","curQuestion":myIndex})
    .then(res =>
     {
         if(res.data.status === 'success')
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
    });
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

async function getQuestions(exam)
{
  const ExamId = exam.id;
  const res = await API.get('/answer',{params: {"exam_id": ExamId}});

  if(res.data.status === 'success')
  {
    return res.data.data;
  }
  else
  {
    return null;
  }
}


export default QuestWiseTimer;