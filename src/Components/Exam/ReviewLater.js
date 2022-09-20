import React from 'react';
import API from '../../api';
import { useHistory } from 'react-router-dom';
import {en,de} from '../../utils/Helper';

function ReviewLater(props) {

        let myReviewArray     = props.myReviewQuestions;
        const questionIndex   = props.index;
        let history           = useHistory();
        const reviewVal       = myReviewArray[questionIndex];

        return (
            <div>
              <input type="checkbox" name="reviewlater" checked={reviewVal} onChange={async () => {
                props.setDisableBtn(true);
                await toggleReview(reviewVal,questionIndex,props,history,myReviewArray);
                props.setDisableBtn(false);
              }}/> To be Reviewed Later
            </div>
        );
}

async function toggleReview(reviewVal,questionIndex,props,history,myReviewArray)
{
  let length = myReviewArray.length;
  let questions = props.data.location.state.questions;

  const origAnswerType  = questions[questionIndex].answered;
  const answerId        = questions[questionIndex].id;
  let newAnswerType     = 'unanswered';

  let myUnsolvedQuestionIndexes   =  props.data.location.state.unsolvedQuestionIndexes;
  let mySolvedQuestionIndexes     =  props.data.location.state.solvedQuestionIndexes;
  let myMarkedUnsolvedIndexes     =  props.data.location.state.markedUnsolvedIndexes;
  let myMarkedSolvedIndexes       =  props.data.location.state.markedSolvedIndexes;


  if(origAnswerType === 'answered')
  {
    newAnswerType = 'answeredandreview';
  }
  else if(origAnswerType === 'unanswered')
  {
    newAnswerType = 'unansweredandreview';
  }
  else if(origAnswerType === 'answeredandreview')
  {
    newAnswerType = 'answered';
  }
  else if(origAnswerType === 'unansweredandreview')
  {
    newAnswerType = 'unanswered';
  }

  questions[questionIndex].answered = newAnswerType;
  //---------------Update answer to Database------------------------------------
  await API.put('/answer/'+answerId,{"type":"savereview","answered": en(newAnswerType)})
  .then(res =>
   {
       if(res.data.status === 'success')
       {
          if(origAnswerType === 'answered')
          {
            mySolvedQuestionIndexes = mySolvedQuestionIndexes.filter(item => item !== questionIndex);
            myMarkedSolvedIndexes.push(questionIndex);
          }
          else if(origAnswerType === 'unanswered')
          {
            myUnsolvedQuestionIndexes = myUnsolvedQuestionIndexes.filter(item => item !== questionIndex);
            myMarkedUnsolvedIndexes.push(questionIndex);
          }
          else if(origAnswerType === 'answeredandreview')
          {
            myMarkedSolvedIndexes   = myMarkedSolvedIndexes.filter(item => item !== questionIndex);
            mySolvedQuestionIndexes.push(questionIndex);

          }
          else if(origAnswerType === 'unansweredandreview')
          {
            myMarkedUnsolvedIndexes = myMarkedUnsolvedIndexes.filter(item => item !== questionIndex);
            myUnsolvedQuestionIndexes.push(questionIndex);
          }
          //-------Remove duplicate indexes in an array using set operations---------
          mySolvedQuestionIndexes   = [...new Set(mySolvedQuestionIndexes)];
          myMarkedSolvedIndexes     = [...new Set(myMarkedSolvedIndexes)];
          myUnsolvedQuestionIndexes = [...new Set(myUnsolvedQuestionIndexes)];
          myMarkedUnsolvedIndexes   = [...new Set(myMarkedUnsolvedIndexes)];
          //-------------------------------------------------------------------------

          myMarkedUnsolvedIndexes.sort();
          myMarkedSolvedIndexes.sort();
          mySolvedQuestionIndexes.sort();
          myUnsolvedQuestionIndexes.sort();

         const examDetailsButtons = {
         exam                               :  props.data.location.state.exam,
         questions                          :  questions,
         currentQuestionIndex               :  questionIndex,
         solvedQuestionIndexes              :  mySolvedQuestionIndexes, 
         unsolvedQuestionIndexes            :  myUnsolvedQuestionIndexes,
         markedSolvedIndexes                :  myMarkedSolvedIndexes,
         markedUnsolvedIndexes              :  myMarkedUnsolvedIndexes,
         }
         history.replace("/startexam", examDetailsButtons) ;
       }
  })
  .catch(error =>
  {
       const examDetailsButtons = {
       exam                               :  props.data.location.state.exam,
       questions                          :  props.data.location.state.questions,
       currentQuestionIndex               :  questionIndex,
       solvedQuestionIndexes              :  props.data.location.state.solvedQuestionIndexes, unsolvedQuestionIndexes            :  props.data.location.state.unsolvedQuestionIndexes,
       markedSolvedIndexes                :  props.data.location.state.markedSolvedIndexes,
       markedUnsolvedIndexes              :  props.data.location.state.markedUnsolvedIndexes,
       }
       history.replace("/startexam", examDetailsButtons) ;
  });
  //----------------------------------------------------------------------------
}

export default ReviewLater;
