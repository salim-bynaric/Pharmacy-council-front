import React,{useState,useEffect,useContext} from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import API from '../../../api';
import ClipLoader from "react-spinners/ClipLoader";
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import {ShowContext} from '../../../App';

const InstProgramList = (props) => 
{
    const {setShow,setMsg}                          =   useContext(ShowContext);
    let [loading, setLoading]                       =   useState(true);
    let [instProgramList, setInstProgramList]       =   useState([]);
    const header                                    =   getHeader();
    const data                                      =   getData(instProgramList,props.setMyList,props.myList,setShow,setMsg);
    

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
        getInstProgramAlloc(setInstProgramList,setLoading);
    },[props.myList]);

    return (
        instProgramList.length > 0 && !loading ?
        <div className="col-lg-12" style={{overflow:"auto"}}>
            <BootstrapTable keyField='srno' data={ data } columns={ header } filter={ filterFactory() } pagination={ paginationFactory(options) }/>
        </div>
        :   
        <div className="col-lg-12" style={{position:"absolute",top:"40%",left:"50%"}}>
            <ClipLoader color={'#ff0000'} loading={loading} size={200} />
        </div>
    );
};

async function getInstProgramAlloc(setTestList,setLoading)
{
    await API.get('/program/inst',{params:{'type':'all'}})
    .then(function (res) 
    {
        setTestList(res.data.data);
        setLoading(false);
    })
    .catch(function (error) 
    {
        setTestList(undefined);
        setLoading(false);
    });   
}

function getHeader()
{
    let myHeader = [
        { text: 'Sr No', dataField: 'srno'},
        { text: 'Inst ID', dataField: 'instid',filter: textFilter()},
        { text: 'Inst Name', dataField: 'instname',filter: textFilter()},
        { text: 'Program Code', dataField: 'programcode'},
        { text: 'Program Name', dataField: 'programname'},
        { text: 'Delete', dataField: 'del'},
    ];
    return myHeader;
}

function getData(instProgramList,setMyList,myList,setShow,setMsg)
{
    let myData = [];
    let i = 1;
    instProgramList.map((data, index) => 
    {
        myData.push({
            srno                    : i++,
            instid                  : data.inst.username,
            instname                : data.inst.college_name,
            programcode             : data.program.program_code,
            programname             : data.program.program_name,
            del                   : <button className="btn btn-danger" onClick={()=>{delRecord(data.id,setMyList,myList,setShow,setMsg);}}>Delete</button>,
        });
    })

    return myData;
}

async function delRecord(id,setMyList,myList,setShow,setMsg)
{
    await API.delete('/program/inst/'+id)
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

export default InstProgramList;