import React,{useState,useEffect} from 'react';
import { Link } from 'react-router-dom';


const CountDownButton = (props) => {
    let fromTime                =   props.StartTime;
    let now                     =   props.Now;

    let [remTime,setRemNow]     =   useState(fromTime-now);

    useEffect(()=> {
        let  interval = setInterval(() => {
            setRemNow(remTime-1000);
            remTime = remTime -1000;
        }, 1000);

        return () => clearInterval(interval); 
    },[]);
    
    return (
        <div>
            {Math.round(remTime/1000) > 0 ?
            <button className='btn btn-sm btn-success'>Exam Starts in <b>{getTimer(Math.round(remTime/1000))}</b></button>
            :
            <Link to={{pathname: '/instructions',state: {exam:props.exam,role:props.role}}} className='btn btn-success'>Start Exam</Link>
            }
        </div>
    );
};

function getTimer(seconds)
{
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600*24));
    var h = Math.floor(seconds % (3600*24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);

    var dDisplay = d > 0 ? (d < 10 ? "0" : "") + d : "00";
    var hDisplay = h > 0 ? (h < 10 ? "0" : "") + h : "00";
    var mDisplay = m > 0 ? (m < 10 ? "0" : "") + m : "00";
    var sDisplay = s > 0 ? (s < 10 ? "0" : "") + s : "00";
    
    return dDisplay +':'+ hDisplay +':'+ mDisplay +':'+ sDisplay;
}

export default CountDownButton;