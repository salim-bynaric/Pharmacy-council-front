import React,{useState,useEffect} from 'react';
import {useLocation, Link } from 'react-router-dom';
import AddTopicForm from './AddTopicForm';
import TopicList from './TopicList';
import API from '../../../api';
import Axios from 'axios';

const AddTopic = () => {
    const [myList, setMyList]   = useState(true);
    const location              = useLocation();
    const [examMode,setExamMode]= useState();
    const [subjectDat,setSubjectDat] = useState();

    const paperId               = location.state.paperId;
    const paperCode             = location.state.paperCode;
    const paperName             = location.state.paperName; 
    const [msgg ,setMsgg]       = useState('');


    useEffect(() => {
        getParallelData(paperId,setMsgg,paperName,setExamMode,setSubjectDat);
    },[paperId,paperName,myList]);

    return (
        subjectDat !== undefined ?
        <div>
            <div className="container-fluid">
                 <br/>
                <ol className="breadcrumb mb-4">
                    <li className="breadcrumb-item active">Topic Master</li>
                    <span style={{"float":"right"}} className="col-lg-2">
                        <Link to="subjectMaster" className="btn btn-danger btn-sm">Go Back</Link>
                    </span>
                </ol>
                {msgg!== '' ?
                <div className="breadcrumb col-lg-12">
                    <div className="breadcrumb-item col-lg-12" style={{color:"maroon"}}>
                        <b>{msgg}</b>
                    </div>
                </div>
                :null}
                <div className="row animate__animated animate__pulse animate_slower">
                    <AddTopicForm myList={myList} setMyList={setMyList} paperId={paperId} paperCode={paperCode} paperName={paperName} examMode={examMode} subjectData={subjectDat}/>
                    {/*<UploadTopics myList={myList} setMyList={setMyList} paperId={paperId} paperCode={paperCode} paperName={paperName}/>*/}
                    <TopicList myList={myList} setMyList={setMyList} paperId={paperId} paperCode={paperCode} paperName={paperName} />
                </div>
            </div>
        </div>
        :null
    );
};

async function getParallelData(paperId,setMsgg,paperName,setExamMode,setSubjectDat)
{
    let subjectData = null;
    let topicData   = null;
    let TotalMarks  =   0;
    let TotalQuest  =   0;
    let TopicSumMarks=  0;
    let TopicSumQuest=  0;

    //--------------Get Topic Data---------------------------------------------------
    await Axios.all([
        API.get('/paper/'+paperId),
        API.get('/subject/topic',{params:{'type':'single','paperId':paperId}})
    ])
    .then(responseArr => 
    {
        if(responseArr[0].data.status==='success')
        {
            subjectData = responseArr[0].data.data;
            setSubjectDat(subjectData);
            if(subjectData)
            {
                TotalMarks = subjectData.marks;
                TotalQuest = subjectData.questions;
                setExamMode(subjectData.exam_mode);
            }
        }
        
        if(responseArr[1].data.status==='success')
        {
            topicData = responseArr[1].data.data;
            if(topicData)
            {
                topicData.forEach(record => {
                    TopicSumMarks = TopicSumMarks + record.questions*record.marks;
                    TopicSumQuest = TopicSumQuest + record.questions;
                });
            }
        }

        if((TotalMarks !==  TopicSumMarks))
        {
            setMsgg("Exam Marks for Subject:"+paperName+" are not matching with Topic wise added Marks");
        }
        if(TotalMarks === 0)
        {
            setMsgg("Important: Exam Marks for Subject is not yet added.");
        }
        if(TopicSumMarks === 0)
        {
            setMsgg("Important: Topic wise data is not added for this subject.");
        }

        if((TotalQuest !==  TopicSumQuest))
        {
            setMsgg("Important: Exam Question Count for Subject:"+paperName+" are not matching with Topic wise Question count added");
        }
        if(TotalQuest === 0)
        {
            setMsgg("Important: Exam Question Count for Subject is not yet added.");
        }
        if(TopicSumQuest === 0)
        {
            setMsgg("Important: Topic wise data is not added for this subject.");
        }

    })
    .catch(function (error) 
    {
       
    });
}

export default AddTopic;