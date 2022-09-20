import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import API from '../../api';
import {ShowContext} from '../../App';
import {en} from '../../utils/Helper';

function NextSaveButton(props) 
{
        const {setShow,setMsg}      = useContext(ShowContext);
        const [islast, setIslast]   = useState(false)
        let myIndex                 = parseInt(props.data.location.state.currentQuestionIndex);
        let history                 = useHistory();
        const maxQuestions          = parseInt(props.data.location.state.questions.length);
        let [label,setLabel]        = useState('Next');
        let nextIndexPerQustTimer   = 0;

        useEffect(() => 
        {
          if(myIndex === maxQuestions-1)
          {
            setLabel('Save');
            setIslast(true);
          }
          else
          {
            setLabel('Next');
            setIslast(false);
          }
        });

        return (
            <div>
                <button className="btn btn-primary btn-sm ans-btns-mg-btm"
                onClick={async () => {
                  props.setDisableBtn(true);
                  //await saveAndChangeIndex(props,(myIndex+1),history,maxQuestions,props.myOption,setShow,setMsg,nextIndexPerQustTimer);
                  await changeIndex(props,(myIndex+1),history);
                  props.setDisableBtn(false);
                }}
                >{label}</button>
            </div>
        );
}

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

function changeIndex(props,index,history)
{
  var originalSelectedOptions       = getSelectedOptions(props.data.location.state.questions);
  const maxQuestions                = parseInt(props.data.location.state.questions.length);
  let examDetailsButtons            = {};  
  if(index >= 0 && index < maxQuestions)
  {
    examDetailsButtons = {
      preview                            :  props.data.location.state.preview,
      exam                               :  props.data.location.state.exam,
      questions                          :  props.data.location.state.questions,
      currentQuestionIndex               :  index,
      solvedQuestionIndexes              :  props.data.location.state.solvedQuestionIndexes, unsolvedQuestionIndexes            :  props.data.location.state.unsolvedQuestionIndexes,
      markedSolvedIndexes                :  props.data.location.state.markedSolvedIndexes,
      markedUnsolvedIndexes              :  props.data.location.state.markedUnsolvedIndexes
    }
  }
  else
  {
    examDetailsButtons = {
      preview                            :  props.data.location.state.preview,
      exam                               :  props.data.location.state.exam,
      questions                          :  props.data.location.state.questions,
      currentQuestionIndex               :  index-1,
      solvedQuestionIndexes              :  props.data.location.state.solvedQuestionIndexes, unsolvedQuestionIndexes            :  props.data.location.state.unsolvedQuestionIndexes,
      markedSolvedIndexes                :  props.data.location.state.markedSolvedIndexes,
      markedUnsolvedIndexes              :  props.data.location.state.markedUnsolvedIndexes
    }
  }
  props.setSelectedOptions(originalSelectedOptions);
  props.setMyOption(undefined);
  history.replace("/startexam", examDetailsButtons) ;
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

export default NextSaveButton;
