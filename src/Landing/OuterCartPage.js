import React, { useContext, useEffect, useState } from 'react';
import { CartContext, UserContext, ShowContext } from '../App';
import API from '../api';
import OuterCartCard from './OuterCartCard';
import { useHistory } from "react-router-dom";
import StudentRegister from './StudentRegister';
import Popup from './Popup';

//-----------While unloading page this hook will be invoked to store state of user and examination---------
const useUnload = fn => {
    const cb = React.useRef(fn);
    React.useEffect(() => {
        const onUnload = cb.current;
        window.addEventListener('beforeunload', onUnload);
        return () => {
            window.removeEventListener('beforeunload', onUnload);
        };
    }, [cb]);
};
//------------------------------------------------------------------------------------------------------------------
const OuterCartPage = () => {
    const { currentUser } = useContext(UserContext);
    const { cart, setCart } = useContext(CartContext);
    const { setShow, setMsg } = useContext(ShowContext);
    let history = useHistory();
    const [studentRegister, setStudentRegister] = useState(false);
    const [forgotPassword, setForgotPassword] = useState(false);
    const handleClose3 = () => setStudentRegister(false);
    let subjectArray = [];
    let amt = 0;

    useUnload(e => {
        e.preventDefault();
        setCart(JSON.parse(localStorage.getItem('myExamCart')));
    });

    useEffect(() => {

        if (localStorage.getItem('myExamCart') !== undefined && localStorage.getItem('myExamCart') !== 'undefined' && localStorage.getItem('myExamCart') !== null) {
            setCart(JSON.parse(localStorage.getItem('myExamCart')));
        }

    }, [localStorage.getItem('myExamCart')])

    useEffect(() => {
        if (localStorage.getItem('myExamCart') !== undefined && localStorage.getItem('myExamCart') !== null && localStorage.getItem('myExamCart') !== 'undefined' && typeof cart === 'string') {
            setCart(JSON.parse(localStorage.getItem('myExamCart')))
        }
    })

    return (
        typeof cart === 'object' ?
            <div>
                <br /><br /><br />
                <div className="container row shop-cart">
                    <br /><br />
                    <div className="col-lg-9">
                        <h2 className="">Exam Cart</h2>
                    </div>
                    <div className="col-lg-3">
                        <button className=' btn-dark G-cart float-right' onClick={() => {
                            history.push('/');
                        }}>Go Back</button>
                    </div>
                </div>
                <br /><br />
                <div className="container row shop-cart">
                    <div className="col-lg-8 p-0">
                        {
                            cart !== 'undefined' && cart !== undefined && cart !== null && cart.length > 0 ?
                                cart.map((subject, index) => {
                                    amt = amt + parseInt(subject.price);
                                    subjectArray.push(subject.paper_code);
                                    return <OuterCartCard key={index} subject={subject} />
                                })
                                : null
                        }
                    </div>
                    {
                        localStorage.getItem('myExamCart') !== undefined && localStorage.getItem('myExamCart') !== null && localStorage.getItem('myExamCart') !== 'undefined' ?
                            <div className='col-lg-4'>
                                <div className='check-out'>
                                    <div className='cart-header'>Total</div>
                                    <div className='cart-body'>
                                        ₹{amt}
                                    </div>
                                    <div className='cart-footer'>
                                        <button onClick={() => {
                                            setStudentRegister(true);
                                        }}>Checkout</button>
                                    </div>
                                </div>
                            </div>
                            :
                            null
                    }
                </div>
                <StudentRegister Popup={Popup} studentRegister={studentRegister} setStudentRegister={setStudentRegister} handleClose3={handleClose3} forgotPassword={forgotPassword} setForgotPassword={setForgotPassword}/>
            </div>
            :
            <div>
                <div className="container-fluid row">
                    <br /><br />
                    <ol className="breadcrumb mb-4">
                        <li className="breadcrumb-item active">Cart</li>
                    </ol>
                    <div className="col-lg-12">
                        <div className="alert alert-dark" role="alert">
                            Your Cart is Empty...
                        </div>
                    </div>
                </div>
            </div>
    );
};


export default OuterCartPage;