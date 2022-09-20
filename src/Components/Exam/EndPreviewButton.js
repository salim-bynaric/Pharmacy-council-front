import React, {useContext} from 'react';
import { useHistory } from 'react-router-dom';
import {UserContext} from '../../App';

function EndPreviewButton(props) 
{
  let history                             =   useHistory();
  const {currentUser}                     =   useContext(UserContext);

    return (
      currentUser ?
          <>
            <div>
              <button className="btn btn-warning btn-sm ans-btns-mg-btm" onClick={() => {exit(currentUser,history);}}>End Preview</button>
            </div>
          </>
      :null
    );
}

function exit(currentUser,history)
{
  if(currentUser.role === 'ADMIN')
  {
    history.replace("/adminhome");
  }
  else if(currentUser.role === 'EADMIN')
  {
    history.replace("/instreports");
  }
}

export default EndPreviewButton;
