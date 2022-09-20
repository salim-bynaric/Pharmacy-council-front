import React, { useState, useEffect, useContext } from 'react';
import { ShowContext } from '../../../App';
import BootstrapTable from 'react-bootstrap-table-next';
import API from '../../../api';
import { UserContext } from '../../../App';
import Pagination from 'react-js-pagination';
import CustomSearch from '../../../CustomSearch';

const CheckerSubjectAllocList = (props) => {
    const [checkerList, setCheckerList] = useState();
    const { setShow, setMsg } = useContext(ShowContext);
    const { currentUser } = useContext(UserContext);
    let [loading, setLoading] = useState(true);

    const [curPage, setCurPage] = useState(0);
    const [perPage, setPerPage] = useState(0);
    const [total, setTotal] = useState(0);

    useEffect(async () => {
        if (currentUser !== undefined) {
            await getCheckerList(setCheckerList, currentUser, curPage, setCurPage, setPerPage, setTotal, setLoading);
        }
    }, [props.myList, currentUser]);

    const header = getHeader();
    const data = getData(checkerList, curPage, perPage, props.setMyList, props.myList, setShow, setMsg, props.setEdit, props.setEditData);

    return (
        checkerList !== undefined && currentUser !== undefined && currentUser ?
            <div>
                <div className="col-lg-12" style={{ "marginTop": "10px", "marginBottom": "20px" }}>
                    <CustomSearch searchParam={['username']} searchMethod={searchPaperChecker} dataSetter={setCheckerList} currentUser={currentUser}/>
                </div>
                <div className="col-lg-12" style={{ overflow: "auto" }}>
                    <BootstrapTable keyField='srno' data={data} columns={header} />
                </div>
                <div className="mt-3">
                    <Pagination
                        totalItemsCount={total}
                        activePage={curPage}
                        itemsCountPerPage={perPage}
                        onChange={(pageNumber) => {
                            getCheckerList(setCheckerList, currentUser, pageNumber, setCurPage, setPerPage, setTotal, setLoading);
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

async function searchPaperChecker(searchValue, setCheckerList, setShow, setMsg, currentUser) {
    let instId = '';
    let instUid ='';
    if (currentUser.role === 'EADMIN') {
        instId = currentUser.username;
        instUid = currentUser.uid;
    }
    await API.get('/subject/checkerAllocation', { params: { "username": searchValue, "type": 'search', "instId": instId,"instUid":instUid } })
        .then((res) => {
            setCheckerList(res.data.data);
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
        { text: 'Paper Cheker', dataField: 'checkerName' },
        { text: 'Subject', dataField: 'subject' },
        { text: 'Type', dataField: 'type' },
        { text: 'Delete', dataField: 'delete' },
    ];
    return myHeader;
}

function getData(checkerList, curPage, perPage, setMyList, myList, setShow, setMsg, setEdit, setEditData) {
    let myData = [];
    let i = (curPage - 1) * perPage + 1;
    if (checkerList !== undefined) {
        checkerList.map((data, index) => {
            let type = '';
            if (data.type === 'QPC') {
                type = 'Paper Checker';
            }
            else if (data.type === 'QPM') {
                type = 'Paper Moderator';
            }
            
            myData.push({
                srno: i++,
                instid: data.instId.username,
                checkerName: data.checker.username + '-' + data.checker.name,
                subject: data.subject.paper_code + '-' + data.subject.paper_name,
                type: type,
                delete: <button className="btn btn-danger" onClick={() => { deleteRecord(data.id, setMyList, myList, setShow, setMsg); }}>Delete</button>,
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
    await API.delete('/subject/checkerAllocation/' + uid)
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

async function getCheckerList(setCheckerList, currentUser, page = 1, setCurPage, setPerPage, setTotal, setLoading) {
    let params = {};

    if (currentUser && currentUser.role === 'ADMIN') {
        params = { "page": page }
    }
    else if (currentUser && currentUser.role === 'EADMIN') {
        params = { 'instId': currentUser.uid, "page": page }
    }

    await API.get('/subject/checkerAllocation', { params: params })
        .then(function (res) {
            setCheckerList(res.data.data);
            setCurPage(res.data.meta.current_page);
            setPerPage(res.data.meta.per_page);
            setTotal(res.data.meta.total);
            setLoading(false);
        })
        .catch(function (error) {
            setCheckerList([]);
            setLoading(false);
        });
}

export default CheckerSubjectAllocList;