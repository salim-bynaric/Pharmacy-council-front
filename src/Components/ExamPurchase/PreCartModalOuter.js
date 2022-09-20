import React, { useContext } from 'react';
import Modal from "react-bootstrap/Modal";
import { ExamFolderContext,UserContext } from '../../App';
import { useHistory } from 'react-router-dom';

const PreCartModal = ({ show, handleClose, exam,handleClose1 }) => {
    const { examFolder } = useContext(ExamFolderContext);
    const { currentUser } = useContext(UserContext);
    let Path = process.env.REACT_APP_PROJPATH + 'data/' + examFolder + '/files/' + exam.subjectImage + '?i=' + Date.now();
    let history = useHistory();

    return (
        exam !== undefined ?
            <div>
                <Modal show={show} onHide={() => { handleClose() }} backdrop="static" className="cart-poup">
                    <Modal.Body>
                        <div className="popup-header">
                            <button type="button" className="close" data-dismiss="modal" aria-hidden="true" onClick={() => {
                                handleClose();
                            }}>x</button>

                            <div className="pop-img"> <img src="assets\images\Landing\logos.png"></img></div><br />

                            <div className='sub-cart'>
                                <div className='row'>
                                    <div className='col-lg-1 img-vertical'><img src="assets\images\tick.png" height="30px" width="30px"></img></div>
                                    <div className='col-lg-2'><img src={Path} height="70px" width="70px" style={{ "paddingRight": "5px" }}></img></div>
                                    <div className='col-lg-5'><b>{exam.paper_code}-{exam.paper_name}</b></div>
                                    <div className='col-lg-4'><button className='btn-dark G-cart ' onClick={() => {
                                        handleClose();
                                        handleClose1();
                                        history.push("/outercart")
                                    }}>Go To Cart</button></div>
                                </div>
                            </div></div><br /><br /><br />
                    </Modal.Body>
                </Modal>
            </div>
            : null
    );
};

export default PreCartModal;