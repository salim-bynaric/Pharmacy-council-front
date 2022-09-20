import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

function PreviousButton(props) {
        const [isfirst, setIsfirst]  = useState(false)
        const myIndex               = parseInt(props.data.location.state.currentQuestionIndex);
        let history                 = useHistory();
        let prevIndexPerQuestTimer  = 0;

        useEffect(() =>
        {
          myIndex === 0 ? setIsfirst(true) : setIsfirst(false);
        },[props,myIndex]);

        return (
            <div>
                <button className="btn btn-primary btn-sm ans-btns-mg-btm" onClick={() => {
                  if(props.qwtExaust)
                  {
                    prevIndexPerQuestTimer = searchPrevUnsolvedIndex(myIndex-1,props.questArray);
                  }

                  props.setMyOption(undefined);
                  changeIndex(props,(myIndex-1),history,prevIndexPerQuestTimer)
                }}
                disabled={isfirst}>Previous</button>
            </div>
        );
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

function changeIndex(props,index,history,prevIndexPerQuestTimer=0)
{
  var originalSelectedOptions        = getSelectedOptions(props.data.location.state.questions);
  if(props.qwtExaust)
  {
    index = prevIndexPerQuestTimer;
  }
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

function getSelectedOptions(questions)
{
  let originalSelectedOptions = {};
  originalSelectedOptions = questions.map((question,index) =>
  {
    return question.stdanswer
  });
  return originalSelectedOptions;
}

export default PreviousButton;
