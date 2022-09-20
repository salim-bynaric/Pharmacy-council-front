import React from 'react';

function OverallSummery(props) 
{
        let attempted = getIndexes(props.data.location.state.questions, 'answered');
        let unattempted = getIndexes(props.data.location.state.questions, 'unanswered');
        let answeredAndReviewed = getIndexes(props.data.location.state.questions, 'answeredandreview');
        let unansweredAndReviewed = getIndexes(props.data.location.state.questions, 'unansweredandreview');
        
        const reviewLater = props.data.location.state.exam.paper.review_question;
        return (
          <div className="summery-block"  style={{float:"right",marginTop:"10px","marginBottom":"10px"}}>
              <div className='card col-lg-12' style={{'boxShadow':'none'}}>
                  <div className="card-header bg-primary row"  style={{"color":"#fff", 'padding': '4px', 'marginBottom': '5px'}}>
                    <div className="col-lg-12">
                      <h5><center>Overall Summary</center></h5>
                    </div>
                  </div>
                  <div className="card-body row" style={{ 'padding': '8px'}} >
                
                    <span>
                      <button className="btn btn-danger que-no-list-wid">{parseInt(props.data.location.state.currentQuestionIndex)+1}</button>
                    </span>
                    <span style={{fontSize:"12","marginLeft":"10px"}}>
                      Current Question
                    </span>
              
                    <div className="col-lg-12">
                      <h6><b>Total Attempted:{parseInt(attempted.length) + parseInt(answeredAndReviewed.length)}</b></h6>
                    </div>
                    
                    <span>
                      <button className="btn btn-sm btn-success que-no-list-wid" style={{"marginBottom":"5px"}}>{attempted.length} </button>
                    </span>
                    <span style={{fontSize:"12","marginLeft":"10px"}}>
                      Attempted
                    </span>
                    <div className="col-lg-12">
                      
                    </div>
                    {reviewLater ?
                    <>
                      <span>
                        <button className="btn btn-sm btn-primary que-no-list-wid" style={{"marginBottom":"5px"}}>{answeredAndReviewed.length}</button>
                      </span>
                      <span style={{fontSize:"12","marginLeft":"10px"}}>
                        Attempted and Review 
                      </span> 
                    </>: ''}
                    
                     
                    
                    <div className="col-lg-12">
                      <h6><b>Total Not Attempted:{parseInt(unattempted.length) + parseInt(unansweredAndReviewed.length)}</b></h6>
                    </div>
                   
                    <span>
                      <button className="btn btn-sm btn-outline-dark que-no-list-wid" style={{"marginBottom":"5px"}}>{unattempted.length}</button>
                    </span>
                    <span style={{fontSize:"12","marginLeft":"10px"}}>
                      Not Attempted
                    </span>
                    <div className="col-lg-12">
                      
                    </div>
                    {reviewLater ?
                    <>
                    <span>
                      <button className="btn btn-sm btn-warning que-no-list-wid" style={{"marginBottom":"5px"}}>{unansweredAndReviewed.length}</button>
                    </span>
                    <span style={{fontSize:"12","marginLeft":"10px"}}>
                      Not Attempted and Review 
                    </span>
                    </> : null}
                  </div>
              </div>
            </div>
        );
}

function getIndexes(myQuestions, searchString) {
  let arr = [];

  myQuestions.forEach(function (question, index) {
    if (question.answered === searchString) {
      arr.push(index);
    }
  });
  return arr;
}

export default OverallSummery;
