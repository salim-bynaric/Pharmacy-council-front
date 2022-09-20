import React, {useState,useEffect} from 'react';
import API from '../../../api';
import GlobClusterAllocForm from './GlobClusterAllocForm';
import UploadGlobClusterMap from './UploadGlobClusterMap';
import GlobalClusterList from './GlobalClusterList';

const GlobClusterAlloc = () => {
    const [globList,setGlobList]            =   useState([]);
    const [clusterList,setClusterList]      =   useState([]); 
    const [inserted,setInserted]            =   useState(true);

    useEffect(() => {
        getGlobList(setGlobList);
        getClusterList(setClusterList);
    },[]);

    return (
        <div>
            <div className="container-fluid">
                <br/>
                <ol className="breadcrumb mb-4">
                    <li className="breadcrumb-item active">Global to Cluster Admin Allocation</li>
                </ol>
                <div className="row animate__animated animate__pulse animate_slower">
                    <div className='col-lg-8'>
                        <GlobClusterAllocForm globList={globList} clusterList={clusterList} setInserted={setInserted} inserted={inserted}/>
                    </div>
                    <div className='col-lg-4'>
                        <UploadGlobClusterMap setInserted={setInserted} inserted={inserted}/>
                    </div>
                    <div className='col-lg-12'>
                        <GlobalClusterList setInserted={setInserted} inserted={inserted}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

async function getGlobList(setGlobList)
{
    await API.get('/user', {params: {'role': 'GADMIN'}})
    .then(function (res) 
    {
        setGlobList(res.data.data);
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

export default GlobClusterAlloc;