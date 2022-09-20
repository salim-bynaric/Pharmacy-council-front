import React,{useState,useEffect,useContext} from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import API from '../../../api';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import {ShowContext} from '../../../App';
import {UserContext} from '../../../App';
import DeleteConfirmationPopUp from '../../../DeleteConfirmationPopUp';

const SubProgramList = (props) => 
{
    const {setShow,setMsg}                          =   useContext(ShowContext);
    let role                                        =   props.role;
    let [loading, setLoading]                       =   useState(true);
    let [programList, setProgramList]               =   useState([]);
    const header                                    =   getHeader();
    const [delId,setDelId]                          =   useState();
    const [visible, setVisible]                     =   useState(false);
    const data                                      =   getData(programList,setVisible,setDelId);
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
        getPrograms(setProgramList,setLoading);
    },[props.myList,role,currentUser]);

    return (
        programList.length > 0 && !loading ?
        <div className="col-lg-12" style={{overflow:"auto"}}>
            <BootstrapTable keyField='srno' data={ data } columns={ header } filter={ filterFactory() } pagination={ paginationFactory(options) }/>
            {visible ?
                <DeleteConfirmationPopUp visible={visible} setVisible={setVisible} popupMsg={"Do you really want to delete this Sub-Program?"} deleteRecord={deleteRecord} id={delId} setInserted={props.setMyList} inserted={props.myList} setShow={setShow} setMsg={setMsg} setCurPage={1}/>
            :null}
        </div>
        :   
        null
    );
};

async function getPrograms(setProgramList,setLoading)
{
    await API.get('/subprogram')
    .then(function (res) 
    {
        if(res.data.status === 'success')
        {
            setProgramList(res.data.data);
            setLoading(false);
        }
    })
    .catch(function (error) 
    {
        setProgramList([]);
        setLoading(false);
    });   
}

function getHeader()
{
    let myHeader = [
        { text: 'Sr No', dataField: 'srno'},
        { text: 'Program Code', dataField: 'programCode',filter: textFilter()},
        { text: 'Program Name', dataField: 'programName'},
        { text: 'Delete', dataField: 'delete'},
    ];
    return myHeader;
}

function getData(programList,setVisible,setDelId)
{
    let myData = [];
    let i = 1;

    programList.map((data, index) => 
    {
        myData.push({
            srno                    : i++,
            programCode             : data.subprogram_code,
            programName             : data.subprogram_name,
            delete                  : <button className="btn btn-danger" onClick={()=>{setVisible(true);setDelId(data.id);}}>Delete</button>
        });
    })
    return myData;
}

async function deleteRecord(id,setMyList,myList,setShow,setMsg)
{
    await API.delete('/subprogram/'+id)
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

export default SubProgramList;