import React,{ useState,useEffect,useContext } from 'react';
import { ShowContext } from '../../../App';
import { UserContext } from '../../../App';
import BootstrapTable from 'react-bootstrap-table-next';
import API from '../../../api';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import DeleteConfirmationPopUp from '../../../DeleteConfirmationPopUp';

const GlobalClusterList = ({setInserted , inserted}) => {
    const [list,setList] = useState();
    const { setShow, setMsg } = useContext(ShowContext);
    const { currentUser } = useContext(UserContext);
    const [delId,setDelId]                          =   useState();
    const [visible, setVisible]                     =   useState(false);

    useEffect(() => {
        getList(setList,setShow,setMsg);
    },[inserted]);

    const header  =   getHeader();
    let data = null;

    if(list !== undefined)
    {
        data = getData(list,setVisible,setDelId);
    }

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

    return (
        list !== undefined && list.length > 0 ?
            <div>
                <BootstrapTable keyField='srno' data={ data } columns={ header } filter={ filterFactory() } pagination={ paginationFactory(options) }/>

                {visible ?
                <DeleteConfirmationPopUp visible={visible} setVisible={setVisible} popupMsg={"Do you really want to delete this Allocation ?"} deleteRecord={deleteRecord} id={delId} setInserted={setInserted} inserted={inserted} setShow={setShow} setMsg={setMsg} setCurPage={1}/>
            :null}
            </div>
        :null
    );
};

async function deleteRecord(id,setMyList,myList,setShow,setMsg)
{
    await API.put('/user/'+id,{'region':null})
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

function getData(list,setVisible,setDelId)
{
    if(list !== undefined && list.length > 0)
    {
        let myData = [];
        let i = 1;

        list.map((data, index) => 
        {
            myData.push({
                srno                    : i++,
                region                  : data.user.name,
                admin                   : data.region.name,
                delete                  : <button className="btn btn-danger" onClick={()=>{setVisible(true);setDelId(data.user.uid);}}>Delete</button>
            });
        })

        return myData;
    }
    else
    {
        return [];
    }
}

function getHeader()
{
    let myHeader = [
        { text: 'Sr No', dataField: 'srno'},
        { text: 'Region', dataField: 'region',filter: textFilter()},
        { text: 'Admin', dataField: 'admin',filter: textFilter()},
        { text: 'Delete', dataField: 'delete'},
    ];
    return myHeader;
}

async function getList(setList,setShow,setMsg)
{
    await API.get('/user/withRegion/CADMIN')
    .then(function (res) 
    {
        if(res.data.status==='success')
        {
            setList(res.data.data);
        }
    })
    .catch(function (error) 
    {
        setShow(true);
        setMsg(error.response.data.message);
        setList(undefined);
    });
}

export default GlobalClusterList;