import React, { useState, useEffect, useContext } from 'react';
import { ShowContext } from '../../../App';
import BootstrapTable from 'react-bootstrap-table-next';
import API from '../../../api';
import { UserContext } from '../../../App';
import Pagination from 'react-js-pagination';
import CustomSearch from '../../../CustomSearch';
import DeleteConfirmationPopUp from '../../../DeleteConfirmationPopUp';


const SetterSubjectAllocList = (props) => {
    const [paperSetterList, setPaperSetterList] = useState();
    const { setShow, setMsg } = useContext(ShowContext);
    const { currentUser } = useContext(UserContext);
    let [loading, setLoading] = useState(true);

    const [curPage, setCurPage] = useState(0);
    const [perPage, setPerPage] = useState(0);
    const [total, setTotal] = useState(0);
    const [delId,setDelId]                          =   useState();
    const [visible, setVisible]                     =   useState(false);

    useEffect(async () => {
        if (currentUser !== undefined) {
            await getPaperSetterList(setPaperSetterList, currentUser, curPage, setCurPage, setPerPage, setTotal, setLoading);
        }
    }, [props.myList, currentUser]);

    const header = getHeader();
    const data = getData(paperSetterList, curPage, perPage, props.setMyList, props.myList, setShow, setMsg, props.setEdit, props.setEditData,visible,setVisible,setDelId);

    return (
        paperSetterList !== undefined && currentUser !== undefined && currentUser ?
            <div>
                <div className="col-lg-12" style={{ "marginTop": "10px", "marginBottom": "20px" }}>
                    <CustomSearch searchParam={['username']} searchMethod={searchPaperSetter} dataSetter={setPaperSetterList} currentUser={currentUser}/>
                </div>
                <div className="col-lg-12" style={{ overflow: "auto" }}>
                    <BootstrapTable keyField='srno' data={data} columns={header} />
                    {visible ?
                        <DeleteConfirmationPopUp visible={visible} setVisible={setVisible} popupMsg={"Do you really want to delete this Allocation?"} deleteRecord={deleteRecord} id={delId} setInserted={props.setMyList} inserted={props.myList} setShow={setShow} setMsg={setMsg} setCurPage={1}/>
                    :null}
                </div>
                <div className="mt-3">
                    <Pagination
                        totalItemsCount={total}
                        activePage={curPage}
                        itemsCountPerPage={perPage}
                        onChange={(pageNumber) => {
                            getPaperSetterList(setPaperSetterList, currentUser, pageNumber, setCurPage, setPerPage, setTotal, setLoading);
                        }}
                        itemClass="page-item"
                        linkClass="page-link"
                        firstPageText="First"
                        lastPageText="Last"
                    />
                </div>
            </div>
            : null
    );
};

async function searchPaperSetter(searchValue, setPaperSetterList, setShow, setMsg, currentUser) {
    let instId = '';
    let instUid ='';
    if (currentUser.role === 'EADMIN') {
        instId = currentUser.username;
        instUid = currentUser.uid;
    }
    await API.get('/subject/setterAllocation', { params: { "username": searchValue, "type": 'search', "instId": instId,"instUid":instUid } })
        .then((res) => {
            setPaperSetterList(res.data.data);
        })
        .catch(function (error) {
            setShow(true);
            setMsg('Paper Setter Not Found ...');
        });
}


function getHeader() {
    let myHeader = [
        { text: 'Sr No', dataField: 'srno' },
        { text: 'Inst Id', dataField: 'instid' },
        { text: 'Paper Setter', dataField: 'setterName' },
        { text: 'Subject', dataField: 'subject' },
        { text: 'Type', dataField: 'type' },
        { text: 'Delete', dataField: 'delete' },
    ];
    return myHeader;
}

function getData(paperSetterList, curPage, perPage, setMyList, myList, setShow, setMsg, setEdit, setEditData,visible,setVisible,setDelId) {
    let myData = [];
    let i = (curPage - 1) * perPage + 1;
    if (paperSetterList !== undefined) {
        paperSetterList.map((data, index) => {
            let type = '';
            if (data.type === 'PS') {
                type = 'Paper Setter';
            }
            else if (data.type === 'PM') {
                type = 'Paper Moderator';
            }
            else if (data.type === 'PSM') {
                type = 'Paper Setter & Moderator';
            }
            myData.push({
                srno: i++,
                instid: data.institute.username,
                setterName: data.paperSetter.username + '-' + data.paperSetter.name,
                subject: data.subject.paper_code + '-' + data.subject.paper_name,
                type: type,
                delete: <button className="btn btn-danger" onClick={() => { setVisible(true);setDelId(data.id); }}>Delete</button>,
            });
        })
    }

    return myData;
}

function editRecord(data, setEdit, setEditData) {
    setEdit(true);
    setEditData(data);
}
async function deleteRecord(uid, setMyList, myList, setShow, setMsg) {
    await API.delete('/subject/setterAllocation/' + uid)
        .then(function (res) {
            if (res.data.status === 'success') {
                setShow(true);
                setMsg(res.data.message);
                setMyList(!myList);
                setTimeout(() => { setShow(false) }, 10000);
            }
        })
        .catch(function (error) {
        });
}

async function getPaperSetterList(setPaperSetterList, currentUser, page = 1, setCurPage, setPerPage, setTotal, setLoading) {
    let params = {};

    if (currentUser && currentUser.role === 'ADMIN') {
        params = { "page": page }
    }
    else if (currentUser && currentUser.role === 'EADMIN') {
        params = { 'instId': currentUser.uid, "page": page }
    }

    await API.get('/subject/setterAllocation', { params: params })
        .then(function (res) {
            setPaperSetterList(res.data.data);
            setCurPage(res.data.meta.current_page);
            setPerPage(res.data.meta.per_page);
            setTotal(res.data.meta.total);
            setLoading(false);
        })
        .catch(function (error) {
            setPaperSetterList([]);
            setLoading(false);
        });
}

export default SetterSubjectAllocList;