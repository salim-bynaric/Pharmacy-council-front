import React, {useState,useContext} from 'react';
import { ExamFolderContext } from '../../App';
import ExamSubCategoryTab from './ExamSubCategoryTab';
import Modal from "react-bootstrap/Modal";
import ExamCardPurchase from './ExamCardPurchase';

const ExamCategoryTabs = ({ categories,purchased }) => {
    const { examFolder } = useContext(ExamFolderContext);
    const Path = process.env.REACT_APP_PROJPATH+'data/'+examFolder+'/files/';
    const [show,setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [myCategory,setMyCategory] = useState();
    const [subCategory,setSubCategory] = useState();

    return (
        categories !== undefined && examFolder ?
            <>
                <div className='col-lg-12'>
                    <div className="tr-job-posted section-padding">
                        <div className="container-fluid">
                            <div className="job-tab">
                                <ul className="nav nav-tabs justify-content-center scroll" role="tablist">
                                    {
                                        categories.map((category, index) => {
                                            return <li role="presentation" className={(index === 0) ? "active" : ""} key={index}>
                                                <a className={(index === 0) ? "active show" : ""} href={'#' + category.program_code} aria-controls={category.program_code} role="tab" data-toggle="tab" aria-selected="true">{category.program_name}</a>
                                            </li>
                                        })
                                    }
                                </ul>
                                <div className="tab-content text-left">
                                    {
                                        categories.map((category, index) => {
                                            let myArr = getSubCategories(category);
                                            return <div role="tabpanel" className={(index === 0) ? "tab-pane fade active show" : "tab-pane fade in"} id={category.program_code} key={index}>
                                                <div className="row">
                                                    {
                                                        myArr.length > 0 && myArr.map((element, index1) => {
                                                            return <ExamSubCategoryTab key={index1} category={category} index={index1} Path={Path} element={element} purchased={purchased} setShow={setShow} setMyCategory={setMyCategory} setSubCategory={setSubCategory}/>
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Modal show={show} onHide={() => { handleClose() }} backdrop="static" centered size="xl" contentClassName="my-modal-height slider-popup">
                    <Modal.Body>
                        <div className="popup-header">
                            <button type="button" className="close" data-dismiss="modal" aria-hidden="true" onClick={() => {
                                setMyCategory(undefined);
                                handleClose();
                            }}>x</button>

                            <div className="pop-img"> <img src="assets\images\Landing\logos.png"></img></div>

                            <div className='col-lg-12 row'>
                                {
                                    myCategory !== undefined && subCategory !== undefined && subCategory.length > 0  ?
                                        <ExamCardPurchase exams={myCategory.subjects} purchased={purchased} subCategory={subCategory} handleClose1={handleClose}/>
                                    :null
                                }
                            </div>
                        </div><br />
                    </Modal.Body>
                </Modal>

            </>
            : null
    );
};

function getSubCategories(category) {
    let arr = [];
    for (let i = 0; i < category.subjects.length; i++) {
        if(category.subjects[i].subprogram !== null && category.subjects[i].subprogram !== undefined)
        {
            arr.push(category.subjects[i].subprogram.subprogram_name+':$:'+category.subjects[i].subprogram.logo+':$:'+category.subjects[i].subprogram.subprogram_code);
        }
    }
    arr = [...new Set(arr)];
    return arr;
}

export default ExamCategoryTabs;