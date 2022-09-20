import React from 'react';
import { useHistory } from 'react-router-dom';

const AnswerPallettee = ({ index, questions, marks, exam , checkerType}) => {
    let history = useHistory();
    let myArr = [];
    let bgcolor = [];
    for (let i = 1; i <= questions.length; i++) {
        myArr.push(i);
    }

    return (
        <div className="col-lg-12">
            <div className='card scroll1' style={{ height: "300px", marginTop: "5px", overflow:"auto"}}>
                <div className={"card-header bg-warning"}>
                    <b><center>Answer Navigation Palette</center></b>
                </div>
                <div className="card-body" style={{"fontSize":"10px" }}>
                    <table className="table table-bordered table-striped table-sm" style={{ "marginBottom": "5px","fontSize":"10px" }}>
                        <thead>
                            <tr style={{backgroundColor:"aqua"}}>
                                <th><center>Question No.</center></th>
                                <th><center>Marks</center></th>
                                <th><center>Outof</center></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                myArr.map((value, index) => {
                                    if(marks[index] !== 'NA')
                                    {
                                        bgcolor.push('silver')
                                    }
                                    else
                                    {
                                        bgcolor.push('white');
                                    }
                                    return (
                                        <tr style={{backgroundColor:bgcolor[index]}} key={index}>
                                            <td>
                                                <center>
                                                    <button className="btn btn-sm btn-success" onClick={() => {
                                                        goToQuestion(value-1,questions,marks,exam,history,checkerType);
                                                    }}><span style={{"fontSize":"10px"}}>{questions[index].qnid_sr}</span></button>
                                                </center>
                                            </td>
                                            <td>
                                                <center>
                                                    {marks[index]}
                                                </center>
                                            </td>
                                            <td>
                                                <center>
                                                    {questions[index].marks}
                                                </center>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table><br/>
                </div>
            </div>
        </div>
    );
};

async function goToQuestion(index,questions,marks,exam,history,checkerType)
{
    let examDetails = {
        exam: exam,
        questions: questions,
        currentQuestionIndex: index,
        marks: marks,
        checkerType: checkerType
    }
    history.replace("/paperChecking", examDetails);
}

export default AnswerPallettee;