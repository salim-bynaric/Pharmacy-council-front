import React from 'react';
import Rbte from './Rbtes';

const RbteList = (props) => {
    let clusterList                             = props.clusterList;
    let instList                                = props.instList;
    
    return (
        <>
        {clusterList.map((rbte,index) => (
        <div className="col-lg-3" style={{overflow:"auto"}} key={rbte.uid}>
            <Rbte username={rbte.username} uid={rbte.uid}  instList={props.instList} setInstList={props.setInstList}/>
        </div>
        ))}
        </>
    );
};

export default RbteList;