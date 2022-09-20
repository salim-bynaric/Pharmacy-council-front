import React, { useContext, useEffect, useState } from 'react';
import { ExamFolderContext, ShowContext } from '../../App';
import { CartContext, UserContext } from '../../App';
import { removeDuplicate } from '../../utils/Helper';
import { useHistory } from 'react-router-dom';
import PreCartModal from './PreCartModalOuter';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import ReadMore from './ReadMore';

//-----------While unloading page this hook will be invoked to store state of user and examination------------------
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

const ExamCardPurchase = ({ exams, purchased, subCategory, handleClose1,useSubcategory=true}) => {
    let cartArray = [];
    const { examFolder } = useContext(ExamFolderContext);
    const { cart, setCart } = useContext(CartContext);
    const { setShow, setMsg } = useContext(ShowContext);
    const { currentUser } = useContext(UserContext);
    const [openPreCart, setOpenPreCart] = useState(false);
    const [clickedExam, setClickedExam] = useState();
    const handleClose = () => setOpenPreCart(false);
    let history = useHistory();

    useEffect(() => {
        if (localStorage.getItem('myExamCart') !== undefined && localStorage.getItem('myExamCart') !== 'undefined' && localStorage.getItem('myExamCart') !== null) {
            cartArray = [...JSON.parse(localStorage.getItem('myExamCart'))];
        }
    });

    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 3000 },
            items: 5
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 4
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 3
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1
        }
    };


    useUnload(e => {
        e.preventDefault();
        setCart(localStorage.getItem('myExamCart'));
    });

    useEffect(() => {
        setCart(localStorage.getItem('myExamCart'));
    }, [localStorage.getItem('myExamCart')]);

    return (
        subCategory ?
            <>
                <div className="container-fluid my-5">
                    <div id="multi-item-example" className="carousel slide carousel-multi-item" data-ride="carousel" data-bs-interval="false">
                        <div className="carousel-inner" role="listbox">
                            {
                                exams.map((exam, index) => {
                                    if (!searchInPurchased(purchased, exam) && useSubcategory ? subcategoryMatch(exam, subCategory) : true) {
                                        let lable = 'Go To Cart'
                                        //----------------Search whether this Exam is present  in Cart-------------------------------------------
                                        if (inCart(localStorage.getItem('myExamCart') !== undefined && localStorage.getItem('myExamCart') !== 'undefined' && localStorage.getItem('myExamCart') !== null ? JSON.parse(localStorage.getItem('myExamCart')) : [], exam)) {
                                            lable = 'Go To Cart';
                                        }
                                        else {
                                            lable = 'Add To Cart';
                                        }
                                        //-------------------------------------------------------------------------------------------------------
                                        let Path = process.env.REACT_APP_PROJPATH + 'data/' + examFolder + '/files/' + exam.subjectImage + '?i=' + Date.now();
                                        return <center key={index}><div>
                                            <div className="col-md-12" style={{ float: 'left' }}>
                                                <div className="card mb-2 slider-cart">
                                                    <img className="card-img-top" src={Path} alt="Card image cap" />
                                                    <div className="card-body">
                                                        <h6 className="card-title">{exam.paper_code + '-' + exam.paper_name}</h6>
                                                        <ReadMore maxLength="50">{exam.description}</ReadMore>
                                                        <div><b>Exam Type:</b> {exam.exam_mode}</div>
                                                        <div className='col-lg-12 row' style={{ "fontSize": "11px" }}>
                                                            <div className='col-lg-6'><b>Quest:</b> {exam.questions}</div>
                                                            <div className='col-lg-6'><b>Marks:</b> {exam.marks}</div>
                                                            <div className='col-lg-6'><b>Time:</b> {exam.durations}</div>
                                                            <div className='col-lg-6'><b>Price:</b>{exam.price}</div>
                                                        </div>
                                                        <hr />
                                                        <center>
                                                            <button className='add_cart' onClick={() => {
                                                                cartArray.push(exam);
                                                                setClickedExam(exam);
                                                                cartArray = removeDuplicate(cartArray, 'paper_code');
                                                                localStorage.setItem('myExamCart', undefined);
                                                                localStorage.setItem('myExamCart', JSON.stringify(cartArray));
                                                                setCart(cartArray);
                                                                lable == 'Go To Cart' ? history.push("/outercart") : setOpenPreCart(true)
                                                            }} style={{ "fontSize": "12px" }}>{lable}</button> <button className='btn_Purchase' onClick={() => {
                                                                cartArray.push(exam);
                                                                cartArray = removeDuplicate(cartArray, 'paper_code');
                                                                localStorage.setItem('myExamCart', undefined);
                                                                localStorage.setItem('myExamCart', JSON.stringify(cartArray));
                                                                setCart(cartArray);
                                                                history.push("/outercart");
                                                                handleClose1();
                                                            }} style={{ "fontSize": "12px" }}>Purchase</button>
                                                        </center>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        </center>
                                    }
                                })
                            }
                        </div>
                    </div>
                </div>
                {
                    clickedExam ?
                        <PreCartModal show={openPreCart} handleClose={handleClose} exam={clickedExam} handleClose1={handleClose1} />
                    : null
                }
            </>
            : null
    );
};

function subcategoryMatch(exam, subcategory) {
    return (exam.subprogram.subprogram_code === subcategory && exam.price !== null && exam.price !== undefined) ? 1 : 0;
}

function searchInPurchased(purchased, exam) {
    let array = [];
    for (let i = 0; i < purchased.length; i++) {
        array.push(purchased[i] && purchased[i].paper && purchased[i].paper.paper_code);
    }
    const found = array.find(element => element === exam.paper_code);
    if (found) { return 1; } else { return 0; }
}

function inCart(cart, exam) {
    let paper_code = exam.paper_code;
    if (cart !== undefined && cart !== null && cart !== 'undefined' && cart.length > 0) {
        for (let i = 0; i < cart.length; i++) {
            if (cart[i].paper_code == paper_code) {
                return 1;
            }
        }
        return 0;
    }
    else {
        return 0;
    }
}

export default ExamCardPurchase;