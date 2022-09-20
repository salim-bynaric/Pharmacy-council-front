import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import API from '../../api';
import {ShowContext} from '../../App';
import {en} from '../../utils/Helper';

const NextSaveSubjective = (props) => {
        const {setShow,setMsg}      = useContext(ShowContext);
        const [islast, setIslast]   = useState(false)
        const myIndex               = parseInt(props.data.location.state.currentQuestionIndex);
        let history                 = useHistory();
        const maxQuestions          = parseInt(props.data.location.state.questions.length);
        let label                   = 'Save & Next';

        const questions             = props.data.location.state.questions;
        const exam                  = props.data.location.state.exam;
        const qnid                  = questions[myIndex].id;
        const answer                = props.subjectiveAnswer;
        //props.setSubjectiveAnswer(undefined);
        let nextIndexPerQustTimer   = 0;
        

        if(myIndex === maxQuestions-1)
        {
            label  = 'Save';
        }
        else
        {
            label  = 'Save & Next';
        }
        
        useEffect(() =>
        {
          myIndex < (maxQuestions) ? setIslast(false) : setIslast(true);
        },[myIndex,maxQuestions]);

    return (
        <div>
            <button className="btn btn-primary btn-sm ans-btns-mg-btm"
                onClick={async () => {
                  props.setDisableBtn(true);
                  await saveSubjectiveAnswer(exam,questions,answer,myIndex,setShow,setMsg,history,maxQuestions,props,nextIndexPerQustTimer);
                  props.setDisableBtn(false);
                }}
                disabled={islast || props.disableBtn}>{label}</button>
        </div>
    );
};

function getNextUnsolvedIndex(fromIndex,questArray)
{
  return questArray.indexOf(0,fromIndex);
}
function searchPrevUnsolvedIndex(myIndex,questArray)
{
  let i = myIndex;
  for(i = myIndex;i >= 0;i--)
  {
    if(questArray[i] === 0)
    {
      break;
    }
  }
  return i;
}

async function saveSubjectiveAnswer(exam,questions,answer,myIndex,setShow,setMsg,history,maxQuestions,props,nextIndexPerQustTimer=0)
{
    if(questions[myIndex].question.allowImageUpload === '' || questions[myIndex].question.allowImageUpload === null || questions[myIndex].question.allowImageUpload === undefined || questions[myIndex].question.allowImageUpload === 'N')
    {
        if(answer === '' || answer === null || answer === undefined || answer === '<p></p>')
        {
            if(props.qwtExaust)
            {
                nextIndexPerQustTimer = getNextUnsolvedIndex(myIndex+1,props.questArray);
                if(nextIndexPerQustTimer === -1)
                {
                    nextIndexPerQustTimer = searchPrevUnsolvedIndex(myIndex,props.questArray);
                    if(nextIndexPerQustTimer === -1)
                    {
                        nextIndexPerQustTimer = maxQuestions - 1;
                    }
                }
                myIndex = nextIndexPerQustTimer-1;
            }

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
    

    let myQuestions             = questions;
    const answerId              = myQuestions[myIndex].id;
    const curOptionStatus       = myQuestions[myIndex].answered;
    let newOptionStatus         = '';
    let ExamId                  = exam.id;
    let allowImgUp              = questions[myIndex].question.allowImageUpload;

    let myUnsolvedQuestionIndexes   =  props.data.location.state.unsolvedQuestionIndexes;
    let mySolvedQuestionIndexes     =  props.data.location.state.solvedQuestionIndexes;
    let myMarkedUnsolvedIndexes     =  props.data.location.state.markedUnsolvedIndexes;
    let myMarkedSolvedIndexes       =  props.data.location.state.markedSolvedIndexes;

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
    
        await API.put('/answer/'+answerId,{"type":"savesubjectiveanswer","answered": en(newOptionStatus), "stdanswer": en(answer), "answer_by": en(''+ExamId+''),"curQuestion":en(''+myIndex+''),"allowImgUp":en(allowImgUp)})
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

                if(props.qwtExaust)
                {
                    nextIndexPerQustTimer = getNextUnsolvedIndex(myIndex+1,props.questArray);
                    if(nextIndexPerQustTimer === -1)
                    {
                        nextIndexPerQustTimer = searchPrevUnsolvedIndex(myIndex-1,props.questArray);
                        if(nextIndexPerQustTimer === -1)
                        {
                            nextIndexPerQustTimer = maxQuestions - 1;
                        }
                    }
                    myIndex = nextIndexPerQustTimer-1;
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
                if(props.qwtExaust)
                {
                    nextIndexPerQustTimer = getNextUnsolvedIndex(myIndex+1,props.questArray);
                    if(nextIndexPerQustTimer === -1)
                    {
                        nextIndexPerQustTimer = searchPrevUnsolvedIndex(myIndex,props.questArray);
                        if(nextIndexPerQustTimer === -1)
                        {
                            nextIndexPerQustTimer = maxQuestions - 1;
                        }
                    }
                    myIndex = nextIndexPerQustTimer-1;
                }

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

export default NextSaveSubjective;