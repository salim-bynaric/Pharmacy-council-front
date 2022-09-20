import React,{useState,useEffect,useContext} from 'react';
import QuestionBankForm from './QuestionBankForm';
import QuestionList from './QuestionList';
import UploadQB from './UplodQB';
import API from '../../../api';
import {ShowContext} from '../../../App';
import {UserContext} from '../../../App';


const QuestionBank = (props) => {
    
    const [subjects,setSubjects]    = useState();
    const {setShow,setMsg}          = useContext(ShowContext);
    const [inserted,setInserted]    = useState(false);
    const {currentUser }            = useContext(UserContext);
    const [unconfSubList,setUnconfSubList] = useState([]);

    useEffect(() => {
        getSubjects(setSubjects,currentUser,setMsg,setShow);
        if(currentUser !== undefined && currentUser.role === 'PAPERSETTER')
        {
            getUnconfSubjectId(currentUser.inst_id,setUnconfSubList);
        }
    },[currentUser]);

    return (
        currentUser && subjects !== undefined ?
            subjects.length > 0 ?
                <div>
                    <div className="container-fluid">
                    <br/>
                    <ol className="breadcrumb mb-4">
                        <li className="breadcrumb-item active">Objective Question Bank</li>
                    </ol>
                        
                        <div className="row col-lg-12">
                            <QuestionBankForm subjects={subjects} setInserted={setInserted} inserted={inserted}/>
                            { currentUser.role !== 'PAPERSETTER' ?
                            <UploadQB setInserted={setInserted} inserted={inserted}/>
                            :null}
                            <QuestionList subjects={subjects} setInserted={setInserted} inserted={inserted} paperId={props.location.state !== undefined ? props.location.state.paperId : undefined} unconfSubList={unconfSubList}/>
                        </div>
                    </div>
                </div>
            :
            <div className="col-lg-12"><br/>
                <div className="alert alert-dark" role="alert">
                    No Subject Data found...
                </div>
            </div>
        :null
    );
};

async function getUnconfSubjectId(inst_id,setUnconfSubList)
{
    await API.get('/subject/unconfSubList',{params: {"instId":inst_id}})
        .then((res) => 
        {
            if(res.data.status === 'success')
            {
                let paperArray = [];
                
                if(res.data.data.length > 0)
                {
                    res.data.data.map((row,index) => {
                        paperArray.push(row.paperId);
                    });
                    setUnconfSubList([...paperArray]);
                }
            }
        });
}

async function getSubjects(setSubjects,currentUser,setMsg,setShow)
{
    if(currentUser && currentUser.role === 'EADMIN')
    {
        await API.get('/subject',{params: {"type":"byInstUid","instUid":currentUser.uid,"mode":"objective"}})
        .then((res) => 
        {
            if(res.data.status === 'success')
            {
                setSubjects(res.data.data);   
            }
            else
            {
                setShow(true);
                setMsg('Problem Fetching Data from Server');
            }
        });
    }
    else if(currentUser && currentUser.role === 'PAPERSETTER')
    {
        await API.get('/subject',{params: {"type":"byPaperSetter","paperSetterId":currentUser.uid,"instId":currentUser.inst_id,"mode":"objective"}})
        .then((res) => 
        {
            if(res.data.status === 'success')
            {
                setSubjects(res.data.data);
            }
            else
            {
                setSubjects(res.data.data);
            }
        })
        .catch((err)=>{
            setSubjects(err.response.data.data);
        })
    }
}

export default QuestionBank;