import React,{useState,useEffect,useContext} from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import API from '../../../api';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import {ShowContext} from '../../../App';
import {UserContext} from '../../../App';
import DeleteConfirmationPopUp from '../../../DeleteConfirmationPopUp';

const InstUrlList = (props) => 
{
    const {setShow,setMsg}                          =   useContext(ShowContext);
    let role                                        =   props.role;
    let [loading, setLoading]                       =   useState(true);
    let [urlList, setUrlList]                       =   useState([]);
    
    const [delId,setDelId]                          =   useState();
    const [visible, setVisible]                     =   useState(false);
    const header                                    =   getHeader();
    const data                                      =   getData(urlList,setVisible,setDelId);
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
        getUrlList(setUrlList,setLoading,currentUser);
    },[props.myList,role,currentUser]);

    return (
        urlList.length > 0 && !loading ?
        <div className="col-lg-12" style={{overflow:"auto"}}>
            <BootstrapTable keyField='srno' data={ data } columns={ header } filter={ filterFactory() } pagination={ paginationFactory(options) }/>
            {visible ?
                <DeleteConfirmationPopUp visible={visible} setVisible={setVisible} popupMsg={"Do you really want to delete this Url?"} deleteRecord={deleteRecord} id={delId} setInserted={props.setMyList} inserted={props.myList} setShow={setShow} setMsg={setMsg} setCurPage={1}/>
            :null}
        </div>
        :   
        null
    );
};

async function deleteRecord(id,setMyList,myList,setShow,setMsg)
{
    await API.put('/user/'+id,{ 'type':'instUrl', 'instId':id,'url':null })
    .then(function (res) 
    {
        if(res.data.status==='success')
        {
           setMyList(!myList);
           setShow(true);
           setMsg('Url Removed Successfully...');
        }
    })
    .catch(function (error) 
    {
        setShow(true);
        setMsg('Problem Removing Url...');
    });
}

function getHeader()
{
    let myHeader = [
        { text: 'Sr No', dataField: 'srno'},
        { text: 'Institute Code', dataField: 'instCode',filter: textFilter()},
        { text: 'Institute Name', dataField: 'instName'},
        { text: 'Url', dataField: 'url',filter: textFilter()},
        { text: 'Delete URL', dataField: 'delete'},
    ];
    return myHeader;
}

function getData(urlList,setVisible,setDelId)
{
    let myData = [];
    let i = 1;

    urlList.map((data, index) => 
    {
        myData.push({
            srno                    : i++,
            instCode                : data.username,
            instName                : data.college_name,
            url                     : data.url,
            delete                  : data.url !== '' && data.url !==null ? <button className="btn btn-danger" onClick={()=>{setVisible(true);setDelId(data.username);}}>Delete</button> : null
        });
    })

    return myData;
}

async function getUrlList(setUrlList,setLoading,currentUser)
{
    await API.get('/user', { params: { 'role': 'EADMIN' } })
        .then(function (res) {
            setUrlList(res.data.data);
            setLoading(false);
        })
        .catch(function (error) {
            setUrlList(undefined);
            setLoading(false);
        });
}



export default InstUrlList;