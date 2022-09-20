import React,{useState,useEffect,useContext} from 'react';
import API from '../../api';
import ReactSpeedometer from "react-d3-speedometer"
import {UserContext} from '../../App';

function Adminhome(props)
{
  const [count,setCount]    = useState(0);
  const [limit, setLimit]   = useState(0);
  const {currentUser}             =   useContext(UserContext);

  const activeUserDuration  = process.env.REACT_APP_ACTIVE_USERS_DURATION;

  
  useEffect(() => {
    getActiveUserCount(setCount,setLimit);
    const interval = setInterval(() => 
    {
      getActiveUserCount(setCount,setLimit);
    },activeUserDuration);
    return () => clearInterval(interval);
  },[]);

    return (
      currentUser ?
      <div>
        <div className="container-fluid">
            <div className="mt-4"></div>
            <ol className="breadcrumb mb-4">
                <li className="breadcrumb-item active">{'Welcome ' + currentUser.name + ' (' + currentUser.role + ')'}</li>
            </ol>
            <div className="col-lg-12 animate__animated animate__fadeInDown animate_slower">
              <div className="card mb-4">
                <div className="card-header">
                  <i className="fas fa-users mr-1"/>
                    <b>Active Users Count</b>
                </div>
                <div>
                  <center>     
                  {limit > 0 ?
                    <ReactSpeedometer value={count} maxValue={limit} minValue={0} forceRender={true}/>  
                  :null}  
                  </center>
                </div>
      

              </div>
            </div>

        </div>
      </div>
      :null
    );
}

async function getActiveUserCount(setCount,setLimit)
{
  let date            = new Date();
  let date1           = date ? date.toISOString().slice(0, 10) : '';

  const res = await API.get('/exam/active/count/',{params: {"date": date1}});

  if(res.data.status === 'success')
  {
    setCount(res.data.data);
    if(parseInt(res.data.data) < 100)
    {
      setLimit(100);
    }
    else if(parseInt(res.data.data) < 1000)
    {
      setLimit(1000);
    }
    else if(parseInt(res.data.data) < 10000)
    {
      setLimit(10000);
    }
    else if(parseInt(res.data.data) < 100000)
    {
      setLimit(100000);
    }
    else if(parseInt(res.data.data) < 1000000)
    {
      setLimit(1000000);
    }
    else if(parseInt(res.data.data) < 10000000)
    {
      setLimit(10000000);
    }
  }
  else
  {
    setCount(0);
    setLimit(100);
  }
}

export default Adminhome;
