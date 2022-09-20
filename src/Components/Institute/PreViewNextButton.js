import React from 'react';
import { useHistory } from 'react-router-dom';

const PreViewNextButton = ({questions, myIndex, paperCode,paperName,instId}) => {
    let history         = useHistory();

    return (
        <div>
            <button className="btn btn-primary btn-sm ans-btns-mg-btm" onClick={() => {
                  changeIndex(paperCode,paperName,myIndex,history,questions,instId)
                }}>Next</button>
        </div>
    );
};

function changeIndex(paperCode,paperName,index,history,questions,instId)
{
    if(index < questions.length-1)
    {
        let myData1 = {
            index:++index,
            instId:instId,
            paperCode:paperCode,
            paperName:paperName,
            questions:questions
        };
        history.replace("/startExamPreview", myData1) ;
    }
}

export default PreViewNextButton;