import React, { useState, useEffect, useContext } from 'react';
import API from '../../api';
import CountCard from './CountCard';
import ExamCard from './ExamCard';
import { useLocation } from 'react-router-dom';
import { UserContext } from '../../App';
import SearchBox from './SearchBox';
import { ShowContext } from '../../App';
import { de } from '../../utils/Helper';
import ExamCategory from '../ExamPurchase/ExamCategory';
import PurchasePopUp from './PurchasePopUp';


function StudHome(props) {
  const location = useLocation();
  const { currentUser } = useContext(UserContext);
  let [loading, setLoading] = useState(true);
  const { setShow, setMsg } = useContext(ShowContext);
  localStorage.setItem("etime", undefined);

  //-------------For Purchasing success or failure of examination -------------------
  const [showMessage, setShowMessage] = useState(false);
  const [params, setParams] = useState();
  const handleClose = () => setShowMessage(false);
  useEffect(() => {
    if (props.location.search !== null && props.location.search !== undefined && props.location.search !== '') {
      setShowMessage(true);
      setParams(props.location.search);
    }
  }, [props.location.search]);
  //---------------------------------------------------------------------------------

  const [userRequest, setUserRequest] = useState({
    loading: true,
    myExams: null,
    numExams: 0,
    compExams: 0,
    yetToStartExam: 0,
    resumeExam: 0,
    expiredExam: 0
  });

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };

  useEffect(() => {
    if (props.location.state && props.location.state.end === 'success') {
      setShow(true);
      setMsg('Exam Compleated Successfully...');
    }
  }, [props.location.state])

  //------------------------Restraining back button of browser--------------------
  useEffect(() => {
    window.history.pushState(location.state, '', '/studenthome');
  }, [location]);
  //------------------------------------------------------------------------------

  useEffect(() => {
    if (currentUser) {
      getExamData(currentUser, setUserRequest, setLoading, setShow, setMsg);
    }
  }, [currentUser]);

  return (
    !userRequest.loading && currentUser && !loading ?
      <div>
        <div className="container-fluid">
          <br />
          <div className="breadcrumb row">
            <div className="col-lg-8 std-name" style={{ "color": "black" }}>
              {currentUser.username}-{currentUser.name}
            </div>
            <div className="col-lg-4">
              {
                currentUser.ph === 'PH' ?
                  <span style={{ "color": "red" }}><b>{'You are eligible for Divyang Concession'}</b></span>
                  : null
              }
            </div>
          </div>

          <div className="row animate__animated animate__pulse animate_slower row">
            <CountCard count={userRequest.numExams} label={"All"} color={"info"} onClick={() => { getExamData(currentUser, setUserRequest, setLoading, setShow, setMsg); }} />
            <CountCard count={userRequest.yetToStartExam} label={"Yet To Start"} color={"success"} onClick={() => { getExamData(currentUser, setUserRequest, setLoading, setShow, setMsg, 'yettostart'); }} />
            <CountCard count={userRequest.resumeExam} label={"Resume"} color={"primary"} onClick={() => { getExamData(currentUser, setUserRequest, setLoading, setShow, setMsg, 'inprogress'); }} />
            <CountCard count={userRequest.compExams} label={"Completed"} color={"warning"} onClick={() => { getExamData(currentUser, setUserRequest, setLoading, setShow, setMsg, 'over'); }} />


            <CountCard count={userRequest.expiredExam} label={"Expired"} color={"danger"} onClick={() => { getExamData(currentUser, setUserRequest, setLoading, setShow, setMsg, 'expired'); }} />
            <SearchBox getExamData={getExamData} setUserRequest={setUserRequest} setLoading={setLoading} currentUser={currentUser} />
          </div>
          <br />
          <div className="row animate__animated animate__pulse animate_slower">
            {
              userRequest.myExams.length > 0 ?
                <>
                  {
                    userRequest.myExams.map((exam,index) =>
                    {
                      return <ExamCard exam={exam} key={index} currentUser={currentUser} />
                    })
                  }
                </>
                :
                <div className="alert alert-danger col-lg-12">
                  No Examination Found.
                </div>
            }
          </div>
          <hr />
          <div className="row animate__animated animate__pulse animate_slower col-lg-12">
            <ExamCategory purchased={userRequest.myExams} />
          </div>
          <br />
        </div>
        <PurchasePopUp url={params} show={showMessage} handleClose={handleClose} />
      </div>
      :
      <div className="custom-loader"></div>
  );
}


async function getExamData(currentUser, setUserRequest, setLoading, setShow, setMsg, filter1 = 'All') {
  setLoading(true);
  const res = await API.get('/exam', { params: { 'stdid': currentUser.uid } });
  let exams = JSON.parse(de(res.data));
  //-------------------Sort data according to start time of exam date for cards---------
  let unsortedData = exams;
  let sorted = [];
  sorted = unsortedData.sort(function (a, b) {
    if (a.paper !== null && a.paper !== undefined && b.paper !== null && b.paper !== undefined) {
      return a.starttime - b.starttime;
    }
  });
  //----------------------------------------------------------------------
  let i = 0;
  let compleated = 0;
  let yetToStart = 0;
  let resume = 0;
  let expired = 0;
  let numExams = exams.length;
  let EndTime = '';
  let Now = '';
  let overIndex = [];
  let inprogressIndex = [];
  let yetToStartIndex = [];
  let expiredIndex = [];

  Object.keys(sorted).forEach(function (key) {
    EndTime = sorted[key].paper !== null ? sorted[key].paper.to_date : '';
    Now = sorted[key].now;

    if (sorted[key].examstatus === 'over') {
      compleated = compleated + 1;
      overIndex.push(key);
    }
    else if (sorted[key].examstatus === '' || sorted[key].examstatus === null) {
      if (EndTime < Now) {
        expired = expired + 1;
        expiredIndex.push(key);
      }
      else {
        yetToStart = yetToStart + 1;
        yetToStartIndex.push(key);
      }
    }
    else if (sorted[key].examstatus === 'inprogress') {
      if (EndTime < Now) {
        expired = expired + 1;
        expiredIndex.push(key);
      }
      else {
        resume = resume + 1;
        inprogressIndex.push(key);
      }
    }
    else if (sorted[key].examstatus === 'expired') {
      expired = expired + 1;
      expiredIndex.push(key);
    }
  });

  //---------------------------Filtering array based on examStatus-------
  if (filter1 === 'over') {
    for (i = 0; i < inprogressIndex.length; i++) {
      delete sorted[inprogressIndex[i]];
    }

    for (i = 0; i < yetToStartIndex.length; i++) {
      delete sorted[yetToStartIndex[i]];
    }

    for (i = 0; i < expiredIndex.length; i++) {
      delete sorted[expiredIndex[i]];
    }
  }
  else if (filter1 === 'inprogress') {
    for (i = 0; i < overIndex.length; i++) {
      delete sorted[overIndex[i]];
    }

    for (i = 0; i < expiredIndex.length; i++) {
      delete sorted[expiredIndex[i]];
    }

    for (i = 0; i < yetToStartIndex.length; i++) {
      delete sorted[yetToStartIndex[i]];
    }
  }
  else if (filter1 === 'expired') {
    for (i = 0; i < overIndex.length; i++) {
      delete sorted[overIndex[i]];
    }

    for (i = 0; i < yetToStartIndex.length; i++) {
      delete sorted[yetToStartIndex[i]];
    }

    for (i = 0; i < inprogressIndex.length; i++) {
      delete sorted[inprogressIndex[i]];
    }
  }
  else if (filter1 === 'yettostart') {
    for (i = 0; i < overIndex.length; i++) {
      delete sorted[overIndex[i]];
    }

    for (i = 0; i < expiredIndex.length; i++) {
      delete sorted[expiredIndex[i]];
    }

    for (i = 0; i < inprogressIndex.length; i++) {
      delete sorted[inprogressIndex[i]];
    }
  }
  else if (filter1 === 'All') {

  }
  else {
    let searched = [];
    //-------------------------Search Paper Name-------------------------------------
    for (let i = 0; i < sorted.length; i++) {
      let paper_name = sorted[i].paper.paper_name.toLowerCase();
      let paperr_code = sorted[i].paper.paper_code.toLowerCase();
      let myFilter = filter1.toLowerCase();

      if (paper_name.includes(myFilter)) {
        searched.push(sorted[i]);
      }
      else if (paperr_code.includes(myFilter)) {
        searched.push(sorted[i]);
      }
    }
    exams = searched;
    //-------------------------------------------------------------------------------
  }
  //-------------deleted empty elements from an array---------------
  sorted = sorted.filter(function (e) { return e != null; });
  //----------------------------------------------------------------
  if (filter1 === 'over' && compleated === 0) {
    setShow(true);
    setMsg('Exam Not Found ...');
  }
  else if (filter1 === 'yettostart' && yetToStart === 0) {
    setShow(true);
    setMsg('Exam Not Found ...');
  }
  else if (filter1 === 'inprogress' && resume === 0) {
    setShow(true);
    setMsg('Exam Not Found ...');
  }
  else if (filter1 === 'expired' && expired === 0) {
    setShow(true);
    setMsg('Exam Not Found ...');
  }
  //---------------------------------------------------------------------
  if (exams) {
    setUserRequest({ loading: false, myExams: exams, numExams: unsortedData.length, compExams: compleated, yetToStartExam: yetToStart, resumeExam: resume, expiredExam: expired });
  }
  else {
    setUserRequest({ loading: false, myExams: exams, numExams: 0, compExams: compleated, yetToStartExam: yetToStart, resumeExam: resume, expiredExam: expired });
  }
  setLoading(false);
}

export default StudHome;
