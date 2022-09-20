import React,{useState,useEffect,useContext} from 'react';
import API from '../../../api';
import {ShowContext} from '../../../App';
import {UserContext} from '../../../App';
import SubjectiveQBForm from './SubjectiveQBForm';
import SubjectiveQBUpload from './SubjectiveQBUpload';
import SubjectiveQBList from './SubjectiveQBList';

const SubjectiveQB = (props) => {
    const [subjects,setSubjects]    = useState([]);
    const {setShow,setMsg}          = useContext(ShowContext);
    const [loading,setLoading]      = useState(true);
    const [inserted,setInserted]    = useState(false);
    const {currentUser }            = useContext(UserContext);
    const [unconfSubList,setUnconfSubList] = useState([]);

    useEffect(() => {
        getSubjects(setSubjects,currentUser,setMsg,setShow,setLoading);
        if(currentUser !== undefined && currentUser.role === 'PAPERSETTER')
        {
            getUnconfSubjectId(currentUser.inst_id,setUnconfSubList);
        }
    },[currentUser]);

    return (
        !loading ?
            currentUser && subjects.length > 0 && currentUser !== undefined ?
            <div>
                <div className="container-fluid">
                    <br/>
                    <ol className="breadcrumb mb-4">
                        Subjective Question Bank &nbsp;&nbsp;&nbsp;&nbsp;<li className="breadcrumb-item active" style={{"color":"red"}}><b>Instruction: Please Upload Only .jpg image as Question and Model Answer. </b></li>
                    </ol>
                    <div className="row col-lg-12">
                        <SubjectiveQBForm subjects={subjects} inserted={inserted} setInserted={setInserted} currentUser={currentUser}/>
                        { currentUser.role !== 'PAPERSETTER' ?
                        <SubjectiveQBUpload subjects={subjects} inserted={inserted} setInserted={setInserted} currentUser={currentUser}/>
                        :null}
                        <SubjectiveQBList subjects={subjects} inserted={inserted} setInserted={setInserted} currentUser={currentUser} paperId={props.location.state !== undefined ? props.location.state.paperId : undefined} unconfSubList={unconfSubList}/>
                    </div>
                </div>
            </div>
            :
            <div className="col-lg-12"><br/>
                <div className="alert alert-dark">
                    No Subject Data found...
                </div>
            </div>
        :<div className="custom-loader"></div>
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

async function getSubjects(setSubjects,currentUser,setMsg,setShow,setLoading)
{
    if(currentUser && currentUser.role === 'EADMIN')
    {
        await API.get('/subject',{params: {"type":"byInstUid","instUid":currentUser.uid,"mode":"subjective"}})
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
        setLoading(false);
    }
    else if(currentUser && currentUser.role === 'PAPERSETTER')
    {
        await API.get('/subject',{params: {"type":"byPaperSetter","paperSetterId":currentUser.uid,"instId":currentUser.inst_id,"mode":"subjective"}})
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
        });
        setLoading(false);
    }
}


export default SubjectiveQB;