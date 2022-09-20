import React, { useContext, useEffect } from 'react';
import { CartContext, UserContext, ShowContext } from '../../App';
import API from '../../api';
import CartCard from './CartCard';
import { useHistory } from "react-router-dom";

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
const Cart = () => {
    const { currentUser } = useContext(UserContext);
    const { cart, setCart } = useContext(CartContext);
    const { setShow, setMsg } = useContext(ShowContext);
    let history = useHistory();
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
        currentUser && typeof cart === 'object' ?
            <div>
                <br /><br /><br />
                <div className="container row shop-cart">
                    <br /><br />
                    {/* <ol className="breadcrumb mb-4"> */}
                    <div className="col-lg-9">
                        <h2 className="">Exam Cart</h2>
                        </div>
                        <div className="col-lg-3">
                            <button className=' btn-dark G-cart float-right' onClick={() => {
                                history.push('/studenthome');
                            }}>Go Back</button>
                        </div>
                        </div>
                        <br /><br />
                    {/* </ol> */}
                    <div className="container row shop-cart">
                    <div className="col-lg-8 p-0">
                        {
                            cart !== 'undefined' && cart !== undefined && cart !== null && cart.length > 0 ?
                                cart.map((subject, index) => {
                                    amt = amt + parseInt(subject.price);
                                    subjectArray.push(subject.paper_code);
                                    return <CartCard key={index} subject={subject} />
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
                                        <button  onClick={() => {
                                            checkout(currentUser, amt, subjectArray, setShow, setMsg);
                                        }}>Checkout</button>
                               </div>
                               </div>
                            </div>
                            :
                            null
                    }
                </div>
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

async function checkout(currentUser, amt, subjectArray, setShow, setMsg) {
    let amount = amt;
    let customerName = currentUser.name;
    let mobile = currentUser.mobile;
    let customerEmail = currentUser.email;

    await API.post('/order', { "amount": amount, "customerName": customerName, "customerPhone": mobile, "customerEmail": customerEmail, "list": subjectArray, "enrollno": currentUser.username, "instId": currentUser.inst_id })
        .then(function (res) {
            if (res.data.status === 'success') {
                window.location.replace(res.data.link.data)
            }
        })
        .catch(function (error) {
            setShow(true);
            setMsg(error.response.data.message);
        })
}
export default Cart;