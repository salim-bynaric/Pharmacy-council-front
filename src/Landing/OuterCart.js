import React, { useContext, useEffect } from 'react';
import { CartContext, UserContext, ShowContext } from '../App';
import StudentRegistration from './StudentRegistration';
import AdminLoginButton from './AdminLoginButton';
import { useHistory } from 'react-router-dom';

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
//---------------------------------------------------------------------------------------------------------

const OuterCart = ({setStudentRegister,setAdminLogin}) => {
    const { currentUser } = useContext(UserContext);
    const { cart, setCart } = useContext(CartContext);
    const { setShow, setMsg } = useContext(ShowContext);
    const CartPath = process.env.REACT_APP_PROJPATH + 'assets/images/cart.png';
    let history = useHistory();

    useUnload(e => {
        e.preventDefault();
        setCart(JSON.parse(localStorage.getItem('myExamCart')));
    });

    useEffect(() => {
        if(localStorage.getItem('myExamCart') !== 'undefined' && localStorage.getItem('myExamCart') !== null && localStorage.getItem('myExamCart') !== undefined && localStorage.getItem('myExamCart') !== '')
        {
            setCart(JSON.parse(localStorage.getItem('myExamCart')));
        }
    },[localStorage.getItem('myExamCart')]);

    return (
        <>
            <div className="col-md-12 cart-section">
                <img src={CartPath} height="30" width="30" title="cart" onClick={() => {
                    history.push("/outercart");
                }}/>

                <StudentRegistration setStudentRegister={setStudentRegister} />
                <AdminLoginButton setAdminLogin={setAdminLogin} />
            </div>
        </>
    );
};

export default OuterCart;