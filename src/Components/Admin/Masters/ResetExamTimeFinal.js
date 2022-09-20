import React, {useState} from 'react';
import API from '../../../api';

const ResetExamTimeFinal = ({ examid, elapsedTime, examStatus,setElapseTime,setExamStatus,setShow,setMsg,setLoading }) => {
    const [time,setTime] = useState();
    let minutes = Math.floor(elapsedTime / 60);
    let seconds = elapsedTime - minutes * 60;
    let content = [];
    for (let i = 1; i <= minutes; i++) {
        content.push(<option value={i}>{i}</option>);
    }

    return (
        <>
            <div className="col-lg-12 row">
                <div className="col-lg-4">
                    <div className="alert alert-dark">
                        <b>Exam Id: {examid}</b><br />
                        <b>Exam Status: {examStatus}</b>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="alert alert-success">
                        <center><b>Elapsed Time: {elapsedTime} Seconds</b><br />
                            (<b>Minutes:</b> {minutes} <b>Seconds:</b> {seconds})</center>
                    </div>
                </div>
                <div className="col-lg-4 row">
                    <div className="col-lg-4">
                        Additional Time
                    </div>
                    <div className="col-lg-8">
                        <select id="addtime" name="addtime" className="form-control" onChange={(e) => {
                            setTime(e.target.value);
                        }}>
                            <option value="">Select Additional Time</option>
                            {content}
                        </select>
                    </div>
                </div><br />
            </div>
            <center>
                <button className="btn btn-primary" onClick={async () => {
                    setLoading(true);
                    await resetExamTime(examid,time,setShow,setMsg,setElapseTime,setExamStatus);
                    setLoading(false);
                }}>Reset Exam Time</button>
            </center><br/><br/>
        </>
    );
};

async function resetExamTime(examid,time,setShow,setMsg,setElapseTime,setExamStatus)
{
    if(time === '0' || time ==='' || time === undefined )
    {
        setShow(true);
        setMsg('Please Select Proper Additional Time...');
        return false;
    }

    await API.put('/examSession', { 'exam_id': examid,'time':time,'type':'additionalTime' })
        .then(function (res) {
            if (res.data.status === 'success') {
                setShow(true);
                setMsg(res.data.message);
                setElapseTime(undefined);setExamStatus(undefined);
            }
        })
        .catch(function (error) {
            setShow(true);
            setMsg('Problem Fetching Exam Session Data from Server');
        })
}

export default ResetExamTimeFinal;