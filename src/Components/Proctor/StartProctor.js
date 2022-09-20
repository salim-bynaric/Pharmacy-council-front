import React, { useState, useEffect,useContext } from 'react';
import ProctorSnapshot from './ProctorSnapshot';
import {useHistory,useLocation} from 'react-router-dom';
import {getFullScreenElement} from '../../utils/Helper';
import { UserContext,ShowContext,ProctorViewContext } from "../../App";
import API from "../../api";
import VideoProctor from './VideoProctor';


const StartProctor = (props) => 
{
    let instId          = props.location.state !== undefined ? props.location.state.instId : undefined;
    let date            = props.location.state !== undefined ? props.location.state.date : undefined;
    let slot            = props.location.state !== undefined ? props.location.state.slot : undefined;
    let proctorData     = props.location.state !== undefined ? props.location.state.proctorData : undefined;
    let path            = props.location.state !== undefined ? props.location.state.path : undefined
    
    //This is required for other Users than  Proctor for api calling--------------------------------------
    let proctorUid      = props.location.state !== undefined ? props.location.state.proctorUid : undefined;
    //----------------------------------------------------------------------------------------------------
    let history         = useHistory();

    const [notLogged,setNotLogged]          = useState();
    const [inprogress,setInprogress]        = useState();
    const [completed,setCompleted]          = useState();
    const [showInfoBox,setShowInfoBox]      = useState(false);
    const { currentUser }                   = useContext(UserContext);
    const { setProctorView }                = useContext(ProctorViewContext);
    const [openList ,setOpenList]           = useState(false);
    const [myProctorData, setMyProctorData] = useState();
    const { setShow, setMsg }               = useContext(ShowContext);

    const presence                          = process.env.REACT_APP_PROCTOR_PRESENCE;
    const presenceHeartBeatTime             = process.env.REACT_APP_PROCTOR_PRESENCE_TIME * 1000;
    const proctorShowTime = process.env.REACT_APP_PROCTOR_SHOW_TIME;

    let displayStr = '';
    displayStr = openList ? {display:'block'} : {display:'none'};

    //-----------------------Regularly check camera permission after every second-----------------------
   useEffect(() => 
   {
     if(myProctorData !== undefined && myProctorData[0].subject.proctoringType === 'V')
     {
        let myInterval = setInterval(async () => 
        {
        let stream = null;
        try {
            stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
            });
        } catch (err) {
            setShow(true);
            setMsg("Please give camera permissions for starting Proctoring...");
            if (currentUser && currentUser.role === "PROCTOR") {
            history.push("/proctorHome");
            }
        }
        }, 1000);
    }
  },[myProctorData]);

    //--------------------------------------------------------------------

    useEffect(() => 
    {
        if(currentUser && props.location.state !== undefined)
        {
            let refreshInterval = setInterval(() => 
            {
                if(currentUser.role === 'PROCTOR')
                {
                    handleOnChange(date + ":$:" + slot,currentUser,setShow,setMsg,history);
                }
                else
                {
                    handleOnChange1(date + ":$:" + slot,currentUser,setShow,setMsg,history,proctorUid,instId);
                }
            }, proctorShowTime);

            return () => {
                    clearInterval(refreshInterval);
            }
        }
    },[currentUser,props.location.state]);

    
    useEffect(() => {
        if(proctorData !== undefined)
        {
            getProctorDataStatistics(proctorData,setMyProctorData,setNotLogged,setInprogress,setCompleted);
        }
    }, [proctorData,history.location]);

    return (
        props.location.state !== undefined && myProctorData !== undefined ?
            <div>
                <div className="container-fluid proctorcontainer"><br/><br/>
                <div className="breadcrumb col-lg-12 row proctorbread">
                        <div className="col-lg-8">
                            <font>Examinee List</font>
                        </div>
                        <div className="col-lg-4">
                            <button className="btn btn-sm btn-success" style={{float:"right"}} onClick={() => {history.replace('/proctorHome')}}>Go Back</button>
                        </div>
                    </div>
                    <div className="container-fluid proctor-view flex">
                    <div className="fullscreen-info">
                            <ul>
                            <li onClick={() => {
                                setOpenList(!openList);
                            }}><i className="fas fa-list" ></i></li>
                                <ul className="snapview" style={displayStr}>
                                    <li onClick={() => {setProctorView('grid');}} title="Change View"><button><i className="fas fa-border-all"></i></button></li>
                                    <li onClick={() => {setProctorView('list');}} title="Fullscreen Mode"><button ><i className="fas fa-list"></i></button></li>
                                </ul>
                            <li onClick={() =>{
                                if(getFullScreenElement())
                                {
                                    document.exitFullscreen();
                                }
                                else
                                {
                                    document.documentElement.requestFullscreen().catch((e) => {
                                    })
                                }
                            }}><i className="fas fa-expand-arrows-alt" ></i></li>
                            <li onClick={() =>{
                                setShowInfoBox(!showInfoBox);
                            }} title="Show/Hide Exam Summary"><i className="fas fa-info"></i></li>
                             <li onClick={() =>
                                {
                                    if(currentUser.role === 'PROCTOR')
                                    {
                                        history.push('/proctorHome');
                                    }
                                    else if(currentUser.role === 'EADMIN' || currentUser.role === 'ADMIN')
                                    {
                                        history.push('/examProctoring');
                                    }
                                }} title="Go Back to Home"><i className="fas fa-arrow-alt-circle-left"></i></li>
                            </ul>
                            {
                                showInfoBox ?
                                    <div className='info-box'>
                                        <b>&nbsp;&nbsp;Block Summary</b><br/>
                                        &nbsp;&nbsp;Total: {myProctorData.length}<br/>
                                        &nbsp;&nbsp;Not Started: {notLogged}<br/>
                                        &nbsp;&nbsp;Inprogress: {inprogress}<br/>
                                        &nbsp;&nbsp;Completed: {completed}
                                    </div>
                                :null
                            }
                     </div>
                        <ul id="divstudentdata" className="divstudentdata list-grid-ul" style={{"marginBottom":"50px"}}>
                            {
                                myProctorData.map((data,index) =>
                                {
                                    if(data.subject.proctoringType === 'I')
                                    {
                                        return <li className="grid" key={index}>
                                            <ProctorSnapshot data={data} instId={instId} date={date}  slot={slot} height={100} examid={data.exam.id} day={data.subject.day} region={data.student.region} />
                                        </li>
                                    }
                                    else if(data.subject.proctoringType === 'V')
                                    {
                                        return <li className="grid video-grid" key={index} >
                                            <VideoProctor data={data} instId={instId} date={date}  slot={slot} height={100} examid={data.exam.id} day={data.subject.day} region={data.student.region} token={data.token}/>
                                        </li>
                                    }
                                })
                            }
                        </ul>
                    </div>
                </div>
            </div>
        : null
    );
};



function getProctorDataStatistics(proctorData,setMyProctorData,setNotLogged,setInprogress,setCompleted)
{
    let newArrInprogress = [];
    let newArrOver = [];
    let newArrNS=[];
    let newArr = [];
    let notLoggedIn =0 ;let inprogress=0;let completed=0;

    proctorData.map((data,index) => 
    {
        if(data.exam.examstatus == 'inprogress')
        {
            inprogress++;
            newArrInprogress.push(data);
        }
        else if(data.exam.examstatus == 'over')
        {
            completed++;
            newArrOver.push(data);
        }
        else
        {
            notLoggedIn++;
            newArrNS.push(data);
        }
    });

    newArr = [...newArrInprogress,...newArrNS,...newArrOver];
    setMyProctorData(newArr);
    setNotLogged(notLoggedIn);setInprogress(inprogress);setCompleted(completed);
}

async function handleOnChange(dateSlot,currentUser,setShow,setMsg,history) 
{
    if(dateSlot !== undefined && dateSlot !== '')
    {
      let date = dateSlot.split(":$:")[0];
      let slot = dateSlot.split(":$:")[1];
  
      let uid = currentUser.uid;
  
          await API.get("/proctorAllocation", {
              params: {
              type: "byDateSlot",
              dateSlot: dateSlot,
              proctorUid: uid,
              instId: currentUser.inst_id,
              },
          }).then((res) => {
              if (res.data.status === "success") 
              {
              if (res.data.data.length !== 0) {
                  if (res.data.data.length <= 30) 
                  {
                    history.push("/startProctor", {
                      proctorData: res.data.data,
                      date: date,
                      instId: currentUser.inst_id,
                      proctorUid: uid,
                      slot: slot,
                      path: 'A'
                  });
                  } else {
                  setShow(true);
                  setMsg(
                      "You Can not proctor more than 30 Students in Bulk Proctoring..."
                  );
                  }
              } else {
                  setShow(true);
                  setMsg("You are not allocated with any student for this subject...");
              }
              } else {
              setShow(true);
              setMsg("Problem Fetching Data from Server");
              }
          });
      }
}

async function handleOnChange1(dateSlot,currentUser,setShow,setMsg,history,proctorUid,instId) 
{
    if(dateSlot !== undefined && dateSlot !== '')
    {
      let date = dateSlot.split(":$:")[0];
      let slot = dateSlot.split(":$:")[1];
  
      let uid = proctorUid;
  
          await API.get("/proctorAllocation", {
              params: {
              type: "byDateSlot",
              dateSlot: dateSlot,
              proctorUid: uid,
              instId: instId,
              },
          }).then((res) => {
              if (res.data.status === "success") 
              {
              if (res.data.data.length !== 0) {
                  if (res.data.data.length <= 30) {
                  history.push("/startProctor", {
                      proctorData: res.data.data,
                      date: date,
                      instId: instId,
                      proctorUid: uid,
                      slot: slot,
                      path: 'A'
                  });
                  } else {
                  setShow(true);
                  setMsg(
                      "You Can not proctor more than 30 Students in Bulk Proctoring..."
                  );
                  }
              } else {
                  setShow(true);
                  setMsg("You are not allocated with any student for this subject...");
              }
              } else {
              setShow(true);
              setMsg("Problem Fetching Data from Server");
              }
          });
      }
}

export default StartProctor;