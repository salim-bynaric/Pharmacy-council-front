import React,{useContext} from 'react';
import {UserContext} from '../../App';

function InstHome(props)
{
  const {currentUser}             =   useContext(UserContext);
    return (
      currentUser ?
      <div>
        <div className="container-fluid">
            <div className="mt-4"></div>
            <ol className="breadcrumb mb-4">
                <li className="breadcrumb-item active">{'Welcome ' + currentUser.name + ' (' + currentUser.role + ')'}</li>
            </ol>
            <div className="row col-lg-12">
                
            </div>
        </div>
      </div>
      : null
    );
}

export default InstHome;
