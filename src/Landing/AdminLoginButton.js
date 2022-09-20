import React from 'react';
import { useHistory } from 'react-router-dom';

const AdminLogin = ({setAdminLogin}) => {
    const history =  useHistory();
    return (
        <>
            <button className="float-right" onClick={() => {
                setAdminLogin(true);
            }}> Admin Login </button>
        </>
    );
};

export default AdminLogin;