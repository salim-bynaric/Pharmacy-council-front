import { current } from 'immer';
import React,{useContext} from 'react';
import { UserContext } from '../../App';

const Checkerhome = () => {
    const { currentUser } = useContext(UserContext);
    return (
        currentUser ?
        <div className="container-fluid">
            <h1 className="mt-4">Paper Checker Home</h1>
            <div className="breadcrumb col-lg-12 row">
                <div className="breadcrumb-item col-lg-8">{'Welcome ' + currentUser.name + ' (' + currentUser.role + ')'}</div>
            </div>
            <div className="col-xl-12">
            </div>
        </div>
        :null
    );
};


export default Checkerhome;