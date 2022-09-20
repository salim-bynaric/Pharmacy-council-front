import React,{useState,useEffect,useContext} from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import API from '../../../api';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import {ShowContext} from '../../../App';
import { Link } from 'react-router-dom';
import {UserContext} from '../../../App';
import DeleteConfirmationPopUp from '../../../DeleteConfirmationPopUp';

const SubjectList = (props) => 
{
    const {setShow,setMsg}                          =   useContext(ShowContext);
    let [loading, setLoading]                       =   useState(true);
    let [subjectList, setSubjectList]               =   useState([]);
    const [delId,setDelId]                          =   useState();
    const [visible, setVisible]                     =   useState(false);
    const header                                    =   getHeader();
    const data                                      =   getData(subjectList,props.setMyList,props.myList,setShow,setMsg,props.edit,props.setEdit,props.setEditData,visible,setVisible,setDelId);
    const {currentUser }                            =   useContext(UserContext);
    

    const options = {
        sizePerPageList: [
            {
                text: '50', value: 50
            },
            {
                text: '500', value: 500
            }, 
            {
                text: '1000', value: 1000
            }, 
            {
                text: '10000', value: 10000
            }
        ]
    };

    useEffect(() => 
    {
        getSubjects(setSubjectList,setLoading,currentUser);
    },[props.myList]);

    return (
        subjectList.length > 0 && !loading ?
        <div className="col-lg-12" style={{overflow:"auto"}}>
            <BootstrapTable keyField='srno' data={ data } columns={ header } filter={ filterFactory() } pagination={ paginationFactory(options) }/>
            {visible ?
                <DeleteConfirmationPopUp visible={visible} setVisible={setVisible} popupMsg={"Do you really want to delete this Subject ?"} deleteRecord={deleteRecord} id={delId} setInserted={props.setMyList} inserted={props.myList} setShow={setShow} setMsg={setMsg} setCurPage={1}/>
            :null}
        </div>
        :   
        null
    );
};

async function getSubjects(setSubjectList,setLoading,currentUser)
{
    let params = {};

    if(currentUser && currentUser.role === 'ADMIN')
    {
        params = {'type':'all'};
    }
    else if(currentUser && currentUser.role === 'EADMIN')
    {
        params = {'type':'byInstUid','instUid':currentUser.uid};
    }
    
    if(currentUser)
    {
        await API.get('/subject',{params:params})
        .then(function (res) 
        {
            if(res.data.status === 'success')
            {
                setSubjectList(res.data.data);
                setLoading(false);
            }
            else
            {
                setSubjectList([]);
                setLoading(false);
            }
        })
        .catch(function (error) 
        {
            setSubjectList([]);
            setLoading(false);
        });   
    }
}

function getHeader()
{
    let myHeader = [
        { text: 'Sr No', dataField: 'srno'},
        { text: 'Inst Code', dataField: 'instCode',filter: textFilter()},
        { text: 'Inst Name', dataField: 'instName',filter: textFilter()},
        { text: 'Program Code', dataField: 'progCode',filter: textFilter()},
        { text: 'Paper Code', dataField: 'paperCode',filter: textFilter()},
        { text: 'Paper Name', dataField: 'paperName',filter: textFilter()},
        { text: 'Add/View Topic Data', dataField: 'topicData'},
        { text: 'Edit', dataField: 'edit'},
        { text: 'Delete', dataField: 'delete'},
    ];
    return myHeader;
}

function getData(subjectList,setMyList,myList,setShow,setMsg,edit,setEdit,setEditData,visible,setVisible,setDelId)
{
    let myData = [];
    let i = 1;
    subjectList.map((data, index) => 
    {
        myData.push({
            srno                    : i++,
            instCode                : data.institute !== null ? data.institute.username : '',
            instName                : data.institute !== null ? data.institute.college_name : '',
            progCode                : data.program ? data.program.program_code : '',
            paperCode               : data.paper_code,
            paperName               : data.paper_name,
            topicData               : <Link className="nav-link" to={{pathname: "/addTopic",state:{paperId: data.id,paperCode:data.paper_code,paperName:data.paper_name,examCategory:data.examCategory,sectionNames:data.sectionNames}}}>Add/View Topics</Link>,
            edit                    : <button className="btn btn-warning" onClick={()=>{editRecord(data,setEdit,setEditData);}}>Edit</button>,
            delete                  : <button className="btn btn-danger" onClick={()=>{setVisible(true);setDelId(data.id);}}>Delete</button>
        });
    })

    return myData;
}

function editRecord(data,setEdit,setEditData)
{
    setEdit(true);
    setEditData(data);
}

async function deleteRecord(id,setMyList,myList,setShow,setMsg)
{
    await API.delete('/subject/'+id)
    .then(function (res) 
    {
        if(res.data.status==='success')
        {
            setShow(true);
            setMsg(res.data.message);
            setMyList(!myList);
            setTimeout(()=>{setShow(false)}, 10000);
        }
    })
    .catch(function (error) 
    {
        setShow(true);
        setMsg(error.response.data.message);
        setTimeout(()=>{setShow(false)}, 10000);
    });
}

export default SubjectList;