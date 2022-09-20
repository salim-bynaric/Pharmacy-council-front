import React,{useState,useEffect,useContext} from 'react';
import API from '../../../api';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import {ShowContext} from '../../../App';
import {UserContext} from '../../../App';
import DeleteConfirmationPopUp from '../../../DeleteConfirmationPopUp';

const ProgramList = (props) => 
{
    const {setShow,setMsg}                          =   useContext(ShowContext);
    let role                                        =   props.role;
    let [loading, setLoading]                       =   useState(true);
    let [programList, setProgramList]               =   useState([]);
    const header                                    =   getHeader(programList);
    const [delId,setDelId]                          =   useState();
    const [visible, setVisible]                     =   useState(false);
    const data                                      =   getData(programList,props.setMyList,props.myList,setShow,setMsg,props.edit,props.setEdit,props.setEditData,visible,setVisible,setDelId);
    const {currentUser }                            =   useContext(UserContext);
    
    

    const options = {
        sizePerPageList: [
            {
                text: '5', value: 5
            }, 
            {
                text: '10', value: 10
            }, 
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
        getPrograms(setProgramList,setLoading,currentUser);
    },[props.myList,role,currentUser]);

    return (
        programList.length > 0 && !loading ?
        <div className="col-lg-12" style={{overflow:"auto"}}>
            <BootstrapTable keyField='srno' data={ data } columns={ header } filter={ filterFactory() } pagination={ paginationFactory(options) }/>
            {visible ?
                <DeleteConfirmationPopUp visible={visible} setVisible={setVisible} popupMsg={"Do you really want to delete this Program?"} deleteRecord={deleteRecord} id={delId} setInserted={props.setMyList} inserted={props.myList} setShow={setShow} setMsg={setMsg} setCurPage={1}/>
            :null}
        </div>
        :   
        null
    );
};

async function getPrograms(setProgramList,setLoading,currentUser)
{
    let params = {};
    if(currentUser && currentUser.role === 'ADMIN' )
    {
        params = {'type':'all'}
    }
    else if(currentUser && currentUser.role === 'EADMIN')
    {
        params = {'type':'instUid','instUid':currentUser.uid}
    }

    await API.get('/program',{params:params})
    .then(function (res) 
    {
        if(res.data.status === 'success')
        {
            setProgramList(res.data.data);
            setLoading(false);
        }
        else
        {
            setProgramList([]);
            setLoading(false);
        }
    })
    .catch(function (error) 
    {
        setProgramList([]);
        setLoading(false);
    });   
}

function getHeader(programList)
{
    let myHeader = [
        { text: 'Sr No', dataField: 'srno'},
        { text: 'Institute Code', dataField: 'instCode',filter: textFilter()},
        { text: 'Institute Name', dataField: 'instName',filter: textFilter()},
        { text: 'Program Code', dataField: 'programCode',filter: textFilter()},
        { text: 'Program Name', dataField: 'programName',filter: textFilter()},
        { text: 'Edit', dataField: 'edit'},
        { text: 'Delete', dataField: 'delete'},
    ];
    return myHeader;
}

function getData(programList,setMyList,myList,setShow,setMsg,edit,setEdit,setEditData,visible,setVisible,setDelId)
{
    let myData = [];
    let i = 1;

    programList.map((data, index) => 
    {
        myData.push({
            srno                    : i++,
            instCode                : data.inst !== null ? data.inst.username : '',
            instName                : data.inst !== null ? data.inst.college_name : '',
            programCode             : data.program_code,
            programName             : data.program_name,
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
    await API.delete('/program/'+id)
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

export default ProgramList;