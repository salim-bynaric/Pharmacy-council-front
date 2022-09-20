import React from 'react';
import Insts from './Insts';
import {ItemTypes} from '../../../utils/Items';
import {useDrop} from 'react-dnd';
import API from '../../../api';


const Rbtes = (props) => {
    let style                                   = {};
    
    const [{isOver}, drop]                  = useDrop({
        accept: ItemTypes.CARD,
        drop(item, monitor) {
            const didDrop = monitor.didDrop();
            if (!didDrop)
            {
                let targetId = props.uid;
                let sourceId = item.uid;
                searchAndUpdate(sourceId,targetId,props.instList,props.setInstList);
            } 
        },
        collect: monitor => ({
            isOver: !! monitor.isOver(),
        })
    });
   
    if(isOver)
    {
        style = {height:"350px",backgroundColor:"aqua",overflow:"auto"};
    }
    else
    {
        style = {height:"350px",overflow:"auto"};
    }

    return (
            <div className="card mb-4" ref={drop}>
                <div className="card-header bg-primary text-white" style={{fontSize:"10px"}}>
                    <i className="fas fa-university mr-1"></i>
                    {props.username} ({props.uid})
                </div>
                <div className="card-body" style={style}>
                    {props.instList.map((institute,index) => {
                        return  (institute.region !== null) && (institute.region === props.uid) ?
                        <Insts key={institute.uid} id={institute.uid} username={institute.username} instName={institute.college_name} instList={props.instList} setInstList={props.setInstList}/>
                        :null
                    })}
                </div>
                <div className="card-footer">
                </div>
            </div>
    );
};

async function searchAndUpdate(sourceId,targetId,instList,setInstList)
{
    let dummyInstList = [...instList];
    for(let i = 0;i < dummyInstList.length;i++)
    {
        if(sourceId === dummyInstList[i].uid)
        {
            dummyInstList[i].region = targetId;
        }
    }
    setInstList(dummyInstList);
    await API.put('/user/'+sourceId, {'region':targetId})
    .then(function (res) 
    {
    })
    .catch(function (error) 
    {
            
    });
}

export default Rbtes;