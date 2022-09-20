import React, { useContext } from 'react';
import { ExamFolderContext, CartContext } from '../../App';

const CartCard = ({ subject }) => {
    const { examFolder } = useContext(ExamFolderContext);
    const { cart, setCart } = useContext(CartContext);
    let Path = process.env.REACT_APP_PROJPATH + 'data/' + examFolder + '/files/' + subject.subjectImage + '?i=' + Date.now();

    return (
        <div className='cart-list'>
            
                <div className="row no-gutters">
                    <div className="col-md-3">
                        <img src={Path} className="card-img" />
                    </div>
                    <div className="col-md-9 row">
                        <div className="c-body col-md-6">
                            <h6 className="c-title">{subject.paper_code + '-' + subject.paper_name}</h6>
                            <p className="c-text"><small className="text-muted">Last updated 3 mins ago</small></p>
                        </div>

                        <div className="col-md-3">
                            ₹{subject.price}
                        </div>

                        <div className="col-md-3">
                            <button onClick={() => 
                            {
                                let tempCart = removeExam(cart,subject.paper_code);
                                localStorage.setItem('myExamCart', tempCart.length > 0 ? JSON.stringify(tempCart) : undefined);
                                setCart(tempCart);
                            }} className='G-cart-remove'>Remove</button>
                        </div>
                    </div>
                </div>
            </div>
        
    );
};

function removeExam(cart,paper_code) 
{
    if(cart !== undefined && cart !== null && cart !== 'undefined')
    {
        return cart.filter(function(subject) {
            if (subject.paper_code == paper_code) {
                return false;
            }
            return true;
        });
    }
}


export default CartCard;