import React, {useState, useEffect,useContext} from 'react';
import {ShowContext} from '../../../App';
import BootstrapTable from 'react-bootstrap-table-next';
import API from '../../../api';
import {UserContext} from '../../../App';
import Pagination from 'react-js-pagination';
import CustomSearch from '../../../CustomSearch';
import DeleteConfirmationPopUp from '../../../DeleteConfirmationPopUp';

const ProctorList = (props) => 
{
    const [proctorList,setProctorList]  = useState();
    const {setShow,setMsg}              = useContext(ShowContext);
    const {currentUser }                = useContext(UserContext);
    let [loading, setLoading]           = useState(true);
    const [delId,setDelId]              = useState();
    const [visible, setVisible]         = useState(false);

    const [curPage,setCurPage]          =   useState(0);
    const [perPage,setPerPage]          =   useState(0);
    const [total,setTotal]              =   useState(0);

    useEffect(() => {
        if(currentUser !== undefined)
        {
            getProctorList(setProctorList,currentUser,curPage,setCurPage,setPerPage,setTotal,setLoading);
        }
    },[props.myList,currentUser]);

    const header                        =   getHeader();
    const data                          =   getData(proctorList,curPage,perPage,props.setMyList,props.myList,setShow,setMsg,props.setEdit,props.setEditData,visible,setVisible,setDelId);

    return (
        proctorList !== undefined && currentUser !== undefined ?
        <div>
            <div className="col-lg-12" style={{"marginTop":"10px","marginBottom":"20px"}}>
                <CustomSearch searchParam={['username']} searchMethod={searchProctor} dataSetter={setProctorList}/>
            </div>
            <div className="col-lg-12" style={{overflow:"auto"}}>
                <BootstrapTable keyField='srno' data={ data } columns={ header }/>
                {visible ?
                    <DeleteConfirmationPopUp visible={visible} setVisible={setVisible} popupMsg={"Do you really want to delete this Proctor?"} deleteRecord={deleteRecord} id={delId} setInserted={props.setMyList} inserted={props.myList} setShow={setShow} setMsg={setMsg} setCurPage={1}/>
                :null}
            </div>
            <div className="mt-3">
                    <Pagination 
                        totalItemsCount={total}
                        activePage={curPage}
                        itemsCountPerPage={perPage}
                        onChange={(pageNumber) =>{
                            getProctorList(setProctorList,currentUser,pageNumber,setCurPage,setPerPage,setTotal,setLoading);
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

async function searchProctor(searchValue,setProctorList,setShow,setMsg,currentUser)
{
        await API.get('user/',{params: {"username":searchValue,"role":'PROCTOR'}})
        .then((res) => 
        {
            setProctorList(res.data.data);
        })
        .catch(function (error) 
        {
            setShow(true);
            setMsg('Proctor Not Found ...');
        });
}


function getHeader()
{
    let myHeader = [
        { text: 'Sr No', dataField: 'srno'},
        { text: 'Inst Id', dataField: 'instid'},
        { text: 'Proctor Name', dataField: 'name'},
        { text: 'Mobile No', dataField: 'mobile'},
        { text: 'Email', dataField: 'email'},
        { text: 'Edit', dataField: 'edit'},
        { text: 'Delete', dataField: 'delete'},
    ];
    return myHeader;
}

function getData(proctorList,curPage,perPage,setMyList,myList,setShow,setMsg,setEdit,setEditData,visible,setVisible,setDelId)
{
    let myData = [];
    let i = (curPage-1)*perPage+1;
    if(proctorList !== undefined)
    {
        proctorList.map((data, index) => 
        {

            myData.push({
                srno                    : i++,
                instid                  : data.inst_id,
                name                    : data.name,
                mobile                  : data.mobile,
                email                   : data.email,
                edit                    : <button className="btn btn-warning" onClick={()=>{editRecord(data,setEdit,setEditData);}}>Edit</button>,
                delete                  : <button className="btn btn-danger" onClick={()=>{setVisible(true);setDelId(data.uid);}}>Delete</button>
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
    await API.delete('/user/'+uid,{data:{'type':'proctor'}})
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

async function getProctorList(setProctorList,currentUser,page=1,setCurPage,setPerPage,setTotal,setLoading)
{
    let params = {};
    
    if(currentUser && currentUser.role === 'ADMIN' )
    {
        params = {'role':'PROCTOR',"page":page}
    }
    else if(currentUser && currentUser.role === 'EADMIN')
    {
        params = {'role':'PROCTOR','instId':currentUser.username,"page":page}
    }

    await API.get('/user', {params: params})
    .then(function (res) 
    {
        setProctorList(res.data.data);
        setCurPage(res.data.current_page);
        setPerPage(res.data.per_page);
        setTotal(res.data.total);
        setLoading(false);
    })
    .catch(function (error) 
    {
        setProctorList([]);
        setLoading(false);
    });   
}

export default ProctorList;