import React,{useState,useEffect,useContext} from 'react';
import {ShowContext, UserContext} from '../../App';
import API from '../../api';
import AutoEndExamNext from './AutoEndExamNext';

function AutoEndExam()
{
    const [insts,setInsts]      =   useState([]);
    const {setShow,setMsg}      =   useContext(ShowContext);
    const [value, setValue]     =   useState();
    const {currentUser}         =   useContext(UserContext)

    useEffect(() => {
      if(currentUser)
      {
        getInsts(setInsts,setShow,setMsg,currentUser);
      }
    },[currentUser]);

    return (
      <>
      {insts.length > 0 && currentUser ?
      <div>
        <div className="container-fluid">
            <br/>
            <ol className="breadcrumb mb-4">
                <li className="breadcrumb-item active">Auto End Examination</li>
            </ol>
            <div className="row col-lg-12 animate__animated animate__fadeInDown animate_slower">
              <select id="inst_id" name="inst_id" className="form-control" onChange={e => {setValue(e.currentTarget.value);}}>
                <option value="">Select Institute</option>
                {
                  insts.map(inst => 
                  (
                    <option key={inst.uid} value={inst.username}>
                      {inst.username}-{inst.name}
                    </option>
                  ))
                }
              </select>
            </div>
        </div>
      </div>
      : null}
      {
        value !== undefined ?
          <div className="col-lg-12">
                <AutoEndExamNext instId={value} role={'ADMIN'}/>
          </div>
        : 
          null
      }

      {
        value === '' ?
          <div className="col-lg-12">
            <div className="col-lg-12 alert alert-warning">
              Please Select Institute
            </div>
          </div>
        :
          null
      }
      </>
    );
}

async function getInsts(setInsts,setShow,setMsg,currentUser)
{
  let parameters = null;
  if(currentUser.role === 'ADMIN' && currentUser.username === 'admin')
  {
    parameters = {params: {"role":"EADMIN"}};
    await API.get('/user',parameters)
    .then((res) => {
      if(res.data.status === 'success')
      {
        setInsts(res.data.data);
      }
      else
      {
        setShow(true);
        setMsg('Problem Fetching Data from Server');
      }
    });
  }
  else
  {
    setInsts([currentUser]);
  }
  
}

export default AutoEndExam;
