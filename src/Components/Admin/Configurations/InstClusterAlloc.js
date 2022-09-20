import React, {useState,useEffect} from 'react';
import API from '../../../api';
import InstClusterAllocForm from './InstClusterAllocForm';
import InstClusterList from './InstClusterList';
import UploadInstClusterMap from './UploadInstClusterMap';

const InstClusterAlloc = () => {
    const [instList,setInstList]            =   useState([]);
    const [clusterList,setClusterList]      =   useState([]); 
    const [inserted,setInserted]            =   useState(true);

    useEffect(() => {
        getInstituteList(setInstList);
        getClusterList(setClusterList);
    },[]);

    return (
        <div>
            <div className="container-fluid">
                <br/>
                <ol className="breadcrumb mb-4">
                    <li className="breadcrumb-item active">Institutes to Cluster Allocation</li>
                </ol>
                <div className="row animate__animated animate__pulse animate_slower">
                    <div className='col-lg-8'>
                        <InstClusterAllocForm instList={instList} clusterList={clusterList} setInserted={setInserted} inserted={inserted}/>
                    </div>
                    <div className='col-lg-4'>
                        <UploadInstClusterMap setInserted={setInserted} inserted={inserted} />
                    </div>
                    <div className='col-lg-12'>
                        <InstClusterList setInserted={setInserted} inserted={inserted}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

async function getInstituteList(setInstList)
{
    await API.get('/user', {params: {'role': 'EADMIN'}})
    .then(function (res) 
    {
        setInstList(res.data.data);
    })
    .catch(function (error) 
    {
       
    });   
}

async function getClusterList(setClusterList)
{
    await API.get('/user', {params: {'role': 'CADMIN'}})
    .then(function (res) 
    {
        setClusterList(res.data.data);
    })
    .catch(function (error) 
    {
       
    });   
}

export default InstClusterAlloc;