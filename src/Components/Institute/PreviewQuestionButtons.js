import React from 'react';
import { useHistory } from 'react-router-dom';

const PreviewQuestionButtons = ({ questions, myIndex, paperCode,paperName,instId}) => {
    let history         = useHistory();

    return (
        <div className="col-lg-12">
            <div className='card col-lg-12'>
                <div className="card-header bg-primary row">
                    <div className="col-lg-12" style={{ color: "white" }}>
                        <h6><b><center>Questions</center></b></h6>
                    </div>
                </div>
                <div className="card-body col-lg-12 row">
                    {questions.map((qa, index) => {
                        return <div className="col-md-2 mb-2 que-no-list-btn-wid" key={qa.qnid_sr}>
                            <input type="button" className={getColor(index,myIndex)} value={index+1} onClick={() => { changeIndex(paperCode,paperName,index,history,questions,instId) }}/>
                        </div>
                    })}
                    <br />
                </div>
            </div>
        </div>
    );
};

function  getColor(index,myIndex)
{
    return (index === myIndex) ? "btn btn-sm btn-success que-no-list-wid" : "btn btn-sm btn-outline-dark que-no-list-wid";
}

function changeIndex(paperCode,paperName,index,history,questions,instId)
{
    let myData1 = {
        index:index,
        instId:instId,
        paperCode:paperCode,
        paperName:paperName,
        questions:questions
    };
    history.replace("/startExamPreview", myData1) ;
}

export default PreviewQuestionButtons;