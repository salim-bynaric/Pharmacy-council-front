import React, {useState, useEffect,useContext} from 'react';
import {ShowContext} from '../../../App';
import BootstrapTable from 'react-bootstrap-table-next';
import API from '../../../api';
import {UserContext} from '../../../App';
import Pagination from 'react-js-pagination';
import CustomSearch from '../../../CustomSearch';
import { Link } from 'react-router-dom';
import DeleteConfirmationPopUp from '../../../DeleteConfirmationPopUp';

const PaperSetterList = (props) => 
{
    const [paperSetterList,setPaperSetterList]  = useState();
    const {setShow,setMsg}              = useContext(ShowContext);
    const {currentUser }                = useContext(UserContext);
    let [loading, setLoading]           = useState(true);

    const [curPage,setCurPage]          =   useState(0);
    const [perPage,setPerPage]          =   useState(0);
    const [total,setTotal]              =   useState(0);
    const [delId,setDelId]                          =   useState();
    const [visible, setVisible]                     =   useState(false);

    useEffect(() => {
        if(currentUser !== undefined)
        {
            getPaperSetterList(setPaperSetterList,currentUser,curPage,setCurPage,setPerPage,setTotal,setLoading);
        }
    },[props.myList,currentUser]);

    const header                        =   getHeader();
    const data                          =   getData(paperSetterList,curPage,perPage,props.setMyList,props.myList,setShow,setMsg,props.setEdit,props.setEditData,visible,setVisible,setDelId);

    return (
        paperSetterList !== undefined && currentUser !== undefined ?
        <div>
            <div className="col-lg-12" style={{"marginTop":"10px","marginBottom":"20px"}}>
                <CustomSearch searchParam={['username']} searchMethod={searchPaperSetter} dataSetter={setPaperSetterList}/>
            </div>
            <div className="col-lg-12" style={{overflow:"auto"}}>
                <BootstrapTable keyField='srno' data={ data } columns={ header }/>
                {visible ?
                    <DeleteConfirmationPopUp visible={visible} setVisible={setVisible} popupMsg={"Do you really want to delete Paper Setter?"} deleteRecord={deleteRecord} id={delId} setInserted={props.setMyList} inserted={props.myList} setShow={setShow} setMsg={setMsg} setCurPage={1}/>
                :null}
            </div>
            <div className="mt-3">
                    <Pagination 
                        totalItemsCount={total}
                        activePage={curPage}
                        itemsCountPerPage={perPage}
                        onChange={(pageNumber) =>{
                            getPaperSetterList(setPaperSetterList,currentUser,pageNumber,setCurPage,setPerPage,setTotal,setLoading);
                        }}
                        itemClass="page-item"
                        linkClass="page-link"
                        firstPageText="First"
                        lastPageText="Last"
                    />
            </div>
            <div className="col-lg-12">
                {
                    loading ?
                        <div className="custom-loader"></div>
                    :null
                }
            </div>
        </div>
        :null
    );
};

async function searchPaperSetter(searchValue,setPaperSetterList,setShow,setMsg,currentUser)
{
        await API.get('user/',{params: {"username":searchValue,"role":'PAPERSETTER'}})
        .then((res) => 
        {
            setPaperSetterList(res.data.data);
        })
        .catch(function (error) 
        {
            setShow(true);
            setMsg('Paper Setter Not Found ...');
        });
}


function getHeader()
{
    let myHeader = [
        { text: 'Sr No', dataField: 'srno'},
        { text: 'Inst Id', dataField: 'instid'},
        { text: 'Paper Setter Name', dataField: 'name'},
        { text: 'Mobile No', dataField: 'mobile'},
        { text: 'Email', dataField: 'email'},
        { text: 'Edit', dataField: 'edit'},
        { text: 'Delete', dataField: 'delete'},
        { text: 'Subjects', dataField: 'subjects'},
    ];
    return myHeader;
}

function getData(paperSetterList,curPage,perPage,setMyList,myList,setShow,setMsg,setEdit,setEditData,visible,setVisible,setDelId)
{
    let myData = [];
    let i = (curPage-1)*perPage+1;
    if(paperSetterList !== undefined)
    {
        paperSetterList.map((data, index) => 
        {
            myData.push({
                srno                    : i++,
                instid                  : data.inst_id,
                name                    : data.name,
                mobile                  : data.mobile,
                email                   : data.email,
                edit                    : <button className="btn btn-warning" onClick={()=>{editRecord(data,setEdit,setEditData);}}>Edit</button>,
                delete                  : <button className="btn btn-danger" onClick={()=>{setVisible(true);setDelId(data.uid);}}>Delete</button>,
                subjects                : <Link className="nav-link" to={{pathname: "/setterSubjectAlloc",state:{data:data}}}>Allocate Subjects</Link>,
            });
        })
    }

    return myData;
}

function editRecord(data,setEdit,setEditData)
{
    setEdit(true);
    setEditData(data);
}
async function deleteRecord(uid,setMyList,myList,setShow,setMsg)
{
    await API.delete('/user/'+uid,{data:{'type':'paperSetter'}})
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
    
    });
}

async function getPaperSetterList(setPaperSetterList,currentUser,page=1,setCurPage,setPerPage,setTotal,setLoading)
{
    let params = {};
    
    if(currentUser && currentUser.role === 'ADMIN' )
    {
        params = {'role':'PAPERSETTER',"page":page}
    }
    else if(currentUser && currentUser.role === 'EADMIN')
    {
        params = {'role':'PAPERSETTER','instId':currentUser.username,"page":page}
    }

    await API.get('/user', {params: params})
    .then(function (res) 
    {
        setPaperSetterList(res.data.data);
        setCurPage(res.data.current_page);
        setPerPage(res.data.per_page);
        setTotal(res.data.total);
        setLoading(false);
    })
    .catch(function (error) 
    {
        setPaperSetterList([]);
        setLoading(false);
    });   
}

export default PaperSetterList;