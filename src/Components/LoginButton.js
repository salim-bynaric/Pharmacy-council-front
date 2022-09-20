import React, { useContext } from 'react';
import API from '../api';
import { useHistory } from 'react-router-dom';
import { UserContext } from '../App';

function LoginButton(props) {
  let history = useHistory(props);
  const { currentUser, setCurrentUser } = useContext(UserContext);

  async function loginLogout() {
    if (props.label === 'Logout') {
      //-----------Call Logout API and on success redirect to Login Page-------
      await API.post('/logout')
        .then(async function (res) {
          setCurrentUser(undefined);
          await localStorage.removeItem("token");
          props.setIsLoggedIn(false);
          history.replace('/');
          setCurrentUser(undefined);
        })
        .catch(async function (error) {
          setCurrentUser(undefined);
          await localStorage.removeItem("token");
          props.setIsLoggedIn(false);
          history.replace('/');
          setCurrentUser(undefined);
        });
      //-----------------------------------------------------------------------
    }
    else {
      history.replace('/');
    }
  }

  return (
    <div className="newbtheader" style={{ "float": "right" }}>
      <button onClick={() => { loginLogout(props) }} className="btn btn-danger">{props.label}</button>
    </div>
  );
}

export default LoginButton;
