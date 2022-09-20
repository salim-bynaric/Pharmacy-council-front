import React,{useContext} from 'react';
import {ShowContext} from '../../App';
import API from '../../api';
import { useHistory } from 'react-router-dom';
import {de} from '../../utils/Helper';

const ClearResponse = (props) => 
{
    const myIndex               = parseInt(props.data.location.state.currentQuestionIndex);
    const ExamId                = props.data.location.state.exam.id;
    const {setShow,setMsg}      = useContext(ShowContext);
    let history                 = useHistory();
  
    return (
      props.data.location !== undefined && props.data.location.state.exam.paper.clearResponse === 1 ?
        <div>
            <button className="btn btn-sm btn-success" onClick={() => {
                clearResponse(ExamId,myIndex,setShow,setMsg,props,history);
            }}>Clear Response</button>
        </div>
      :null
    );
};

async function clearResponse(ExamId,myIndex,setShow,setMsg,props,history)
{
    let qnidSr = myIndex + 1;
    await API.put('/answer/'+qnidSr+'/'+ExamId)
    .then(res =>
     {
        if(res.data.status === 'success')
        {
            let myQuestions                           =   JSON.parse(de(res.data.data));
            let mySolvedQuestionIndexes               =   getIndexes(myQuestions,'answered'); 
            let myUnsolvedQuestionIndexes             =   getIndexes(myQuestions,'unanswered');
            let myMarkedSolvedIndexes                 =   getIndexes(myQuestions,'answeredandreview');
            let myMarkedUnsolvedIndexes               =   getIndexes(myQuestions,'unansweredandreview');

            var originalSelectedOptions               =   getSelectedOptions(myQuestions);

            const examDetailsButtons = 
            {
                exam                               :  props.data.location.state.exam,
                questions                          :  myQuestions,
                currentQuestionIndex               :  myIndex,
                solvedQuestionIndexes              :  mySolvedQuestionIndexes, 
                unsolvedQuestionIndexes            :  myUnsolvedQuestionIndexes,
                markedSolvedIndexes                :  myMarkedSolvedIndexes,
                markedUnsolvedIndexes              :  myMarkedUnsolvedIndexes,
            }
            props.setSelectedOptions(originalSelectedOptions);
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

function getSelectedOptions(questions)
{
  let originalSelectedOptions = {};
  originalSelectedOptions = questions.map((question,index) =>
  {
    return question.stdanswer
  });
  return originalSelectedOptions;
}

export default ClearResponse;