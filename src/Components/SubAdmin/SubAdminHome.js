import React,{useContext} from 'react';
import { UserContext } from '../../App';

const SubAdminHome = () => {
    const { currentUser } = useContext(UserContext);
    return (
        currentUser ?
        <div>
            <div className="container-fluid">
                <h1 className="mt-4">Sub-Admin Home</h1>
                <ol className="breadcrumb mb-4">
                    <li className="breadcrumb-item active">{'Welcome ' + currentUser.name + ' (' + currentUser.role + ')'}</li>
                </ol>
                <div className="row col-lg-12">
                    
                </div>

            </div>
        </div>
        :null
    );
};

export default SubAdminHome;