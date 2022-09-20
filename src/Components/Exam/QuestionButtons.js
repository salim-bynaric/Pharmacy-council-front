import React, {useState,useEffect} from 'react';
import { useHistory } from 'react-router-dom';

function QuestionButtons(props) {
  const qas           = props.qas.location.state.questions;
  const myIndex       = props.qas.location.state.currentQuestionIndex;
  let history         = useHistory();

  let category = props.qas.location.state.exam.paper.examCategory;
  const [sections,setSections] = useState([]);

  useEffect(() => {
    props.setQuestArray(props.questArray);
    if(category === 'sectional')
    {
      getDistinctSections(qas,setSections);
    }
  },[]);
        return (
        
              <div className='col-md-12 card que-btn' style={{'boxShadow':'none', 'padding':'0'}}>
                  <div className="card-header bg-primary text-center" style={{"color":"#fff", 'padding': '4px', 'marginBottom': '5px'}}>
                      <h6><b>Questions</b></h6>
                  </div>
                  {
                    category === 'sectional' && sections.length > 0 ?
                      <div className="card-body row newbodystyle card-new" style={{"padding": "0px 0px", "margin-right ": "10px;"}} >
                        {
                          sections.map((section,index) => {  
                            return (
                              <div key={index} className='row newbodystyle'>
                                <div className='col-lg-12'>
                               
                                
                                    <h6 className='text-center ex-btn-title'>{section}</h6>
                                
                              
                                </div>
                                {
                                  qas.map((qa,index) => 
                                  {
                                    if(qa.question.section === section)
                                    {
                                      if(props.qwtExaust && qas[index].answered === 'answered')
                                      {
                                        props.questArray[index] = 1;
                                      }
                                      return <div className="col-md-1.7 mb-2 que-no-list-btn-wid" key={qa.qnid_sr}>
                                          <input type="button" className={getColor(index,myIndex,qa)} value={qa.qnid_sr}  onClick={() => {changeIndex(props,index,history)}} disabled={(props.disableBtn || props.questArray[index])}/>
                                      </div>
                                    }
                                  })
                                }
                              </div>
                            )
                          })
                        }
                      </div>
                    :
                    <div className="card-body row newbodystyle" style={{"padding":"0px 10px"}}>
                      {qas.map((qa,index) => {
                        if(props.qwtExaust && qas[index].answered === 'answered')
                        {
                          props.questArray[index] = 1;
                        }
                        return <div className="col-md-2 mb-2 que-no-list-btn-wid" key={qa.qnid_sr}>
                            <input type="button" className={getColor(index,myIndex,qa)} value={qa.qnid_sr}  onClick={() => {changeIndex(props,index,history)}} disabled={(props.disableBtn || props.questArray[index])}/>
                        </div>
                      })}
                      <br/>
                    </div>
                  }
              </div>
           
        );
}

function getDistinctSections(qas,setSections)
{
  let array = [];
  for(let i=0;i<qas.length;i++)
  {
    array.push(qas[i].question.section);
  }

  array = [...new Set(array)];

  setSections(array);
}

function changeIndex(props,index,history)
{
  var originalSelectedOptions        = getSelectedOptions(props.qas.location.state.questions);

  const examDetailsButtons = {
    preview                            :  props.qas.location.state.preview,
    exam                               :  props.qas.location.state.exam,
    questions                          :  props.qas.location.state.questions,
    currentQuestionIndex               :  index,
    solvedQuestionIndexes              :  props.qas.location.state.solvedQuestionIndexes, unsolvedQuestionIndexes            :  props.qas.location.state.unsolvedQuestionIndexes,
    markedSolvedIndexes                :  props.qas.location.state.markedSolvedIndexes,
    markedUnsolvedIndexes              :  props.qas.location.state.markedUnsolvedIndexes
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

function getColor(index,myIndex,qa)
{
    if(index === myIndex) {return "btn btn-sm btn-danger que-no-list-wid";}
    switch (qa.answered) {
      case "unanswered"         : return "btn btn-sm btn-outline-dark que-no-list-wid";
      case "answered"           : return "btn btn-sm btn-success que-no-list-wid";
      case "answeredandreview"  : return "btn btn-sm btn-primary que-no-list-wid";
      default                   : return "btn btn-sm btn-warning que-no-list-wid";
    }
}

export default QuestionButtons;
