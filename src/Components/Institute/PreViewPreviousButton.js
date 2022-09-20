import React from 'react';
import { useHistory } from 'react-router-dom';

const PreViewPreviousButton = ({questions, myIndex, paperCode,paperName,instId}) => {
    let history         = useHistory();

    return (
        <div>
            <button className="btn btn-primary btn-sm ans-btns-mg-btm" onClick={() => {
                  changeIndex(paperCode,paperName,myIndex,history,questions,instId)
                }}>Previous</button>
        </div>
    );
};

function changeIndex(paperCode,paperName,index,history,questions,instId)
{
    if(index >= 0)
    {
        let myData1 = {
            index:index > 0 ? --index : 0,
            paperCode:paperCode,
            instId:instId,
            paperName:paperName,
            questions:questions
        };
        history.replace("/startExamPreview", myData1) ;
    }
}

export default PreViewPreviousButton;