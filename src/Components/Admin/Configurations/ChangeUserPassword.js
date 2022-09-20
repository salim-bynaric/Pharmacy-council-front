import React, {useState,useContext} from 'react';
import {UserContext} from '../../../App';
import UserPasswordForm from './UserPasswordForm';

const ChangeUserPassword = () => {
    const {currentUser }            = useContext(UserContext);
    return (
        currentUser ?
        <div>
            <div className="container-fluid">
                <br/>
                <ol className="breadcrumb mb-4">
                    <li className="breadcrumb-item active">Change User Password</li>
                </ol>
                <div className="row animate__animated animate__fadeInDown animate_slower">
                    <UserPasswordForm />
                </div>
            </div>
        </div>
        :null
    );
};

export default ChangeUserPassword;