import React, { useState, useContext, useEffect } from 'react';
import Modal from "react-bootstrap/Modal";
import { UserContext } from '../../App';
import { ShowContext } from '../../App';
import API from '../../api';
import { Formik } from 'formik';
import * as Yup from 'yup';

let socket;


const WarningModal = ({ showWarning, handleClose1, enroll, examid, paperId, instId, room, warningDriver, warningType }) => {
    const { currentUser } = useContext(UserContext);
    const myInitialValues = { warning: '', custWarning: '' };
    const { setShow, setMsg } = useContext(ShowContext);
    const [customWarning, setCustomWarning] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const handleCloseConfirmation = () => setShowConfirmation(false);

    return (
        <Formik
            initialValues={myInitialValues}
            onSubmit={async (values, actions) => {
                if (values.warning === '11') {
                    values.warning = '11$:$' + values.custWarning;
                }

                await sendWarning(values, enroll, examid, paperId, instId, currentUser, setShow, setMsg, socket, room, warningDriver,warningType);

                actions.setSubmitting(false);

                actions.resetForm({
                    values: { warning: '', custWarning: '' }
                });
            }}
            validationSchema={Yup.object({
                warning: Yup.string()
                    .required("Warning is Required"),
            })}
        >
            {
                props => {
                    const {
                        values,
                        errors,
                        isSubmitting,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        setFieldValue,
                    } = props;
                    return (
                        currentUser ?
                            <div>
                                <Modal show={showWarning} onHide={handleClose1} size="lg" backdrop="static">
                                    <Modal.Header closeButton style={{ backgroundColor: "OliveDrab", color: "white", zIndex: "99999" }} >
                                        <Modal.Title><center>Send Warning-{enroll}</center></Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <form id="form-Topic" method="post" className="form-horizontal" onSubmit={handleSubmit}>
                                            <div className='card'>
                                                <div className="card-header">
                                                    <i className="fa fa-exclamation-triangle fa-sm"></i> <b>Select Warning</b>
                                                </div>
                                                <div className="card-body col-lg-12 row">
                                                    <div className="form-group col-lg-12">
                                                        <div className="col-lg-12 row">
                                                            <div className="col-lg-4">
                                                                Select Warning
                                                            </div>
                                                            <div className="col-lg-8">
                                                                {warningType == '1' ?
                                                                    <select id="warning" name="warning" className="form-control" onChange={(e) => {
                                                                        handleChange(e);
                                                                        if (e.target.value === '11') {
                                                                            setCustomWarning(true);
                                                                        }
                                                                        else {
                                                                            setCustomWarning(false);
                                                                        }
                                                                    }}
                                                                        onBlur={handleBlur}
                                                                        value={values.warning} style={{'fontSize':'11px'}}>

                                                                        <option value="">Select Warning</option>

                                                                        <option value="1$:$You will be booked for malpractice if you do not adjust light so that your image is visible in the window on the examination screen">1a.Examinee Not visible on camera due to bad or improper light.</option>

                                                                        <option value="2$:$You will be booked for malpractice if you are not seen on screen again">1b.Examinee not seen on the screen.</option>

                                                                        <option value="3$:$You will be booked for malpractice if you do not correct camera position">1c.The camera turned away from the face of examinee</option>

                                                                        <option value="4$:$You will be booked for malpractice if you do not remove the cover over camera">1d.Camera covered to obstruct vision.</option>

                                                                        <option value="5$:$You will be booked for malpractice if you are again seen in possession of electronic device or gadget not   permitted during the examination">2a.Examinee observed in possession and use of communication device / electronic gadget/ mobile phone / smart watch / tablet / I pad / earphone etc.  during the examination</option>

                                                                        <option value="6$:$You will be booked for malpractice if you are again seen in possession of book/notes/web sources not   permitted during the examination.">2b.Examinee observed in possession and referring to  books, notes, web-sources or any other material or means to retrieve answers  during the examination</option>

                                                                        <option value="7$:$You will be booked for malpractice if you are again seen with additional person/s during the examination">3a.Additional person/s apart from the examinee is/are seen collaborating with examinee during the examination.</option>

                                                                        <option value="8$:$You will be booked for serious malpractice of impersonation in the examination if person other than designated examinee is noticed on the screen again">4a.A person other than the designated examinee as shown in photograph on the hall ticket is seen attempting the examination</option>
                                                                    </select>
                                                                    :
                                                                    <select id="warning" name="warning" className="form-control" onChange={(e) => {
                                                                        handleChange(e);
                                                                        if (e.target.value === '11') {
                                                                            setCustomWarning(true);
                                                                        }
                                                                        else {
                                                                            setCustomWarning(false);
                                                                        }
                                                                    }}
                                                                        onBlur={handleBlur}
                                                                        value={values.warning}>
                                                                        <option value="">Select Warning</option>
                                                                        <option value="1$:$You are not visible properly. Adjust your position such that adequate light falls on your face. If you do not comply, you will be booked for malpractice case">Poor Visibility of Student due to bad or improper light</option>
                                                                        <option value="2$:$You have moved away from screen of your device.This may lead to registering of malpractice case against you">Examinee not present before the screen</option>
                                                                        <option value="3$:$Examinee  is  impersonated  by  other  person.  A malpractice case is being registered against you">The person present in front of examination screen changes in between</option>
                                                                        <option value="4$:$You  appear  accessing  information  while  giving online examination. This may lead to registering of malpractice case against you">Examinee seen with additional communication device (Mobile/Tablet) while giving online examination</option>
                                                                        <option value="5$:$You are taking help of other person for your online examination. This may lead to registering of malpractice case against you">Additional  person  appears  along  with examinee</option>
                                                                        <option value="6$:$You  are  copying  during  examination.  This  may lead to registering of malpractice case against you">Examinee seen referring to book/notes/reference material</option>
                                                                        <option value="7$:$You are talking during the examination. This may lead to registering of malpractice case against you">Examinee seen talking</option>
                                                                        <option value="8$:$You are interrupting online examination intentionally. This may lead to registering  of malpractice case against you">Examinees online examination is interrupted frequently</option>
                                                                        <option value="9$:$You appear to get help from other sources during examination.   This  may   lead   to   registering  of malpractice case against you">Examinee appears to frequently looking away from screen</option>
                                                                        <option value="10$:$You   are   indulging   in   unfair   practice   during examination.   This  may   lead   to   registering  of malpractice case against you">Any other suspicious action not listed above</option>
                                                                        <option value="11">Send Your Custom Message.</option>
                                                                    </select>
                                                                }

                                                                {errors.warning ? <div className="alert alert-info">{errors.warning}</div> : null}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {customWarning ?
                                                        <div className="form-group col-lg-12">
                                                            <div className="col-lg-12 row">
                                                                <div className="col-lg-4">
                                                                    Enter Custom Warning
                                                                </div>
                                                                <div className="col-lg-8">
                                                                    <input type="text" className="form-control" placeholder="Enter Custom Warning" name="custWarning" id="custWarning"
                                                                        value={values.custWarning}
                                                                        onChange={handleChange} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        : null}
                                                </div>
                                                <div className="card-footer col-lg-12">
                                                    <div className="form-group">
                                                        <center>
                                                            <a herf="#" onClick={() => {
                                                                setShowConfirmation(true);
                                                            }} className="btn btn-primary btn-sm">Submit</a>
                                                            
                                                        </center>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </Modal.Body>
                                </Modal>
                                

                                <Modal show={showConfirmation} onHide={handleCloseConfirmation} backdrop="static">
                                    <Modal.Header closeButton style={{ backgroundColor: "black", color: "white", zIndex: "99999" }} >
                                        <Modal.Title><center>Confirmation !!!</center></Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        Do you really want to send this Warning ?
                                    </Modal.Body>
                                    <Modal.Footer>
                                            <button type="submit" className="btn btn-primary btn-sm" onClick={(e) => {setShowConfirmation(false);handleSubmit(e);}} disabled={isSubmitting}>Submit</button>
                                            &nbsp;&nbsp;&nbsp;
                                            <button type="submit" className="btn btn-success btn-sm" onClick={(e) => {setShowConfirmation(false);}}>Close</button>
                                    </Modal.Footer>
                                </Modal>

                            </div>
                            : null
                    );
                }
            }
        </Formik>
    );
}

async function sendWarning(values, enroll, examid, paperId, instId, currentUser, setShow, setMsg, socket, room, warningDriver,warningType) {
    let warning = values.warning.split('$:$')[1];
    let warningNo = values.warning.split('$:$')[0];
    let from = currentUser.username;
    let to = enroll;


    await API.post('/proctor/sendWarning/' + examid, { 'warning': warning, 'from': from, 'to': to, 'paperId': paperId, 'instId': instId, 'warningNo': warningNo, 'warningDriver': warningDriver,'warningType':warningType })
        .then((res) => {
            if (res.data.status === 'success') {
                setShow(true);
                setMsg(res.data.message);
            }
            else {
                setShow(true);
                setMsg(res.data.message);
            }
        })
        .catch(function (error) {
            setShow(true);
            setMsg(error.response.data.message);
        });
}

export default WarningModal;