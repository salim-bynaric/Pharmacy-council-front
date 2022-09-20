import React,{useState,useEffect,useContext} from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import API from '../../../api';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import {ShowContext} from '../../../App';
import DeleteConfirmationPopUp from '../../../DeleteConfirmationPopUp';

const TopicList = (props) => 
{
    const {setShow,setMsg}                          =   useContext(ShowContext);
    let [loading, setLoading]                       =   useState(true);
    let [topicList, setTopicList]                   =   useState([]);
    const header                                    =   getHeader();
    const [delId,setDelId]                          =   useState();
    const [visible, setVisible]                     =   useState(false);
    const data                                      =   getData(topicList,props.setMyList,props.myList,setShow,setMsg,visible,setVisible,setDelId);
    const paperId                                   = props.paperId;
    const paperCode                                 = props.paperCode;
    const paperName                                 = props.paperName;
    

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
        getTopics(setTopicList,setLoading,paperId);
    },[props.myList,paperId]);

    return (
        topicList.length > 0 && !loading ?
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

async function getTopics(setTopicList,setLoading,paperId)
{
    await API.get('/subject/topic',{params:{'type':'single','paperId':paperId}})
    .then(function (res) 
    {
        setTopicList(res.data.data);
        setLoading(false);
    })
    .catch(function (error) 
    {
        setTopicList(undefined);
        setLoading(false);
    });   
}

function getHeader()
{
    let myHeader = [
        { text: 'Sr No', dataField: 'srno'},
        { text: 'Paper Code', dataField: 'paperCode',filter: textFilter()},
        { text: 'Paper Name', dataField: 'paperName',filter: textFilter()},
        { text: 'Topic', dataField: 'topic'},
        { text: 'Sub Topic', dataField: 'subTopic'},
        { text: 'Questions', dataField: 'questions'},
        { text: 'Marks', dataField: 'marks'},
        { text: 'Question Mode', dataField: 'questMode'},
        { text: 'Delete', dataField: 'delete'},
    ];
    return myHeader;
}

function getData(subjectList,setMyList,myList,setShow,setMsg,visible,setVisible,setDelId)
{
    let myData = [];
    let i = 1;
    subjectList.map((data, index) => 
    {
        myData.push({
            srno                    : i++,
            paperCode               : data.paper.paper_code,
            paperName               : data.paper.paper_name,
            topic                   : data.topic,
            subTopic                : data.subtopic,
            questions               : data.questions,
            marks                   : data.marks,
            questMode               : data.questMode === 'O' ? 'Objective' : 'Subjective',
            delete                  : <button className="btn btn-danger" onClick={()=>{setVisible(true);setDelId(data.id);}}>Delete</button>
        });
    })

    return myData;
}

async function deleteRecord(id,setMyList,myList,setShow,setMsg)
{
    await API.delete('/subject/topic/'+id)
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

export default TopicList;