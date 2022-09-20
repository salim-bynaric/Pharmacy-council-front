import React from 'react';

const StudentRegistration = ({setStudentRegister}) => {
    return (
        <>
            <button className="float-right" onClick={() => {
                setStudentRegister(true);
            }}> Registration/Login </button>
        </>
    );
};

export default StudentRegistration;