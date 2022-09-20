import React, { useState } from 'react';
import StudentGetStarted from './StudentGetStarted';

const Landing = ({adminLogin,setAdminLogin,studentRegister,setStudentRegister}) => {
    const [forgotPassword, setForgotPassword] = useState(false);
    let name = process.env.REACT_APP_CLIENT_TEXT;
    return (
        <div>
            <div className="limiter" id="login-landing">
                <div className="container-login100" >
                    
                    <div className="container">
                        <div className="row">
                            <div className="col-md-6 banner-text">
                                <h1>{name}</h1>
                                <p>Everybody who needs an exam to be taken by a group of students.
                                    Our Client range from Schools and Institutes to Universities.</p>
                                <img src="assets\images\Landing\Banner-image.png"></img>
                            </div>
                            <div className="col-md-6 col-md-offset-1">
                                <div className="login_topimg">
                                </div>
                                <div className="wrap-login100">
                                    <StudentGetStarted studentRegister={studentRegister} setStudentRegister={setStudentRegister} forgotPassword={forgotPassword} setForgotPassword={setForgotPassword} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Landing;