import React, { useState, useEffect, useContext } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import API from '../../../api';
import { ShowContext, UserContext, ExamFolderContext } from '../../../App';
import Modal from "react-bootstrap/Modal";
import TagsInput from './TagsInput';


const EditSubject = (props) => {
    const ref = React.useRef();
    const { currentUser } = useContext(UserContext);
    const handleClose = () => props.setEdit(false);
    const [keywords, setKeywords] = useState(props.editData.keywords !== null ? props.editData.keywords.split(',') : []);
    const myFlag = useFlag();
    const openEdit = props.edit;
    const setEdit = props.setEdit;
    const [subprograms, setSubPrograms] = useState([]);
    const { examFolder } = useContext(ExamFolderContext);

    const instUid = props.editData.institute.uid;
    const instCode = props.editData.institute.username;
    const instName = props.editData.institute.college_name;
    const paperCode = props.editData.paper_code;
    const paperName = props.editData.paper_name;
    const programId = props.editData.program.id;
    const sem = props.editData.semester;
    const setMyList = props.setMyList;
    const myList = props.myList;
    const SubjectId = props.editData.id;
    const examType = props.editData.exam_mode;
    const examCategory = props.editData.examCategory !== null ? props.editData.examCategory : '';
    const categoryName = props.editData.sectionNames !== null ? props.editData.sectionNames : '';
    const description = props.editData.description;
    const image = props.editData.subjectImage !== null ? props.editData.subjectImage : null;
    let Path = null;
    const subprogramId = props.editData.subprogram ? props.editData.subprogram.id : 0;

    if (image) {
        Path = process.env.REACT_APP_PROJPATH + 'data/' + examFolder + '/files/' + image + '?i=' + Date.now();
    }

    const myInitialValues = { paperCode: paperCode, paperName: paperName, file: '', flag: myFlag, programId: programId, subprogramId: subprogramId, instId: instUid, semester: sem, 'examType': examType, 'examCategory': examCategory, 'categoryName': categoryName, description: description, keyWords: keywords };

    const { setShow, setMsg } = useContext(ShowContext);
    const [programs, setPrograms] = useState([]);

    useEffect(() => {
        getPrograms(setPrograms, myFlag, setShow, setMsg);

        getSubPrograms(setSubPrograms, myFlag, setShow, setMsg);
    }, [myFlag, setShow, setMsg]);


    return (
        myFlag !== undefined && currentUser ? <Formik
            initialValues={myInitialValues}
            onSubmit={async (values, actions) => {
                updateSubject(values, setMyList, myList, SubjectId, setEdit, setShow, setMsg, keywords, currentUser);
            }}
            validationSchema={Yup.object({
                paperCode: Yup.string()
                    .required("Paper Code is Required"),
                paperName: Yup.string()
                    .required("Paper Name is Required."),
                flag: Yup.number(),
                programId: Yup.number()
                    .required("Program is Required"),
                subprogramId: Yup.number()
                    .required("Sub Program is Required"),
                instId: Yup.string().when('flag', {
                    is: 0,
                    then: Yup.string().required("Inst ID is Required")
                }),
                semester: Yup.number()
                    .required('Semester is Required'),
                examType: Yup.string()
                    .required('Exam Type is Required'),
                examCategory: Yup.string(),
                categoryName: Yup.string().when('examCategory', {
                    is: (examCategory) => (examCategory !== '' && examCategory !== undefined),
                    then: Yup.string().required("Section Name is Required")
                }),
                description: Yup.string()
                    .required("Description of Course is Required"),
                keyWords: Yup.array().min(3, "Enter Minimum 3 Keywords").required("Keywords are required")
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
                        setFieldValue
                    } = props;
                    return (
                        <Modal show={openEdit} onHide={handleClose} backdrop="static" size="lg">
                            <Modal.Header closeButton style={{ backgroundColor: "OliveDrab", color: "white" }}>
                                <Modal.Title>Edit Subject</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div className="col-xl-12">
                                    <form id="edit-form-Subject" method="post" className="form-horizontal" onSubmit={handleSubmit}>
                                        <div className="card mb-4">
                                            <div className="card-header">
                                                <i className="fas fa-address-card mr-1" />
                                                Edit Subject Form
                                            </div>
                                            <div className="card-body">
                                                {myFlag === 0 && (
                                                    <div className="form-group">
                                                        <div className="col-lg-12 row">
                                                            <div className="col-lg-4">
                                                                Select Institute
                                                            </div>
                                                            <div className="col-lg-8">
                                                                <select id="instId" name="instId" className="form-control" onChange={(e) => {

                                                                    handleChange(e);
                                                                    getPrograms1(setPrograms, e.target.value, setShow, setMsg);

                                                                }} onBlur={handleBlur} value={values.instId}>
                                                                    <option value={instUid}>{instCode}-{instName}</option>

                                                                </select>

                                                                {errors.instId ? <div className="alert alert-info">{errors.instId}</div> : null}
                                                            </div>
                                                        </div>
                                                    </div>)}
                                                <div className="form-group">
                                                    <div className="col-lg-12 row">
                                                        <div className="col-lg-4">
                                                            Enter Paper Code
                                                        </div>
                                                        <div className="col-lg-8">
                                                            <input type="text" id="paperCode" name="paperCode" onChange={handleChange} value={values.paperCode} onBlur={handleBlur} className="form-control" placeholder="Enter Paper Code..." />

                                                            {errors.paperCode ? <div className="alert alert-info">{errors.paperCode}</div> : null}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <div className="col-lg-12 row">
                                                        <div className="col-lg-4">
                                                            Enter Subject Name
                                                        </div>
                                                        <div className="col-lg-8">
                                                            <input type="text" id="paperName" name="paperName" onChange={handleChange} value={values.paperName} onBlur={handleBlur} className="form-control" placeholder="Enter Subject Name..." />

                                                            {errors.paperName ? <div className="alert alert-info">{errors.paperName}</div> : null}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="form-group">
                                                    <div className="col-lg-12 row">
                                                        <div className="col-lg-4">
                                                            Select Subject Image
                                                        </div>
                                                        <div className="col-lg-6">
                                                            <input
                                                                id="file"
                                                                name="file"
                                                                type="file"
                                                                ref={ref}
                                                                onChange={(event) => {
                                                                    setFieldValue("file", event.currentTarget.files[0]);
                                                                }}
                                                                onBlur={handleBlur}
                                                                className="form-control"
                                                            />
                                                            {errors.file ? <div className="alert alert-info">{errors.file}</div> : null}
                                                        </div>
                                                        <div className="col-lg-2">
                                                            {
                                                                Path !== null ?
                                                                    <img src={Path} height="50" width="90" style={{ "borderRadius": "10px" }}></img>
                                                                    : null
                                                            }
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="form-group">
                                                    <div className="col-lg-12 row">
                                                        <div className="col-lg-4">
                                                            Select Program
                                                        </div>
                                                        <div className="col-lg-8">
                                                            <select id="programId" name="programId" className="form-control" onChange={handleChange} onBlur={handleBlur} value={values.programId}>
                                                                <option value="">Select Program</option>
                                                                {
                                                                    programs.map(program =>
                                                                    (
                                                                        <option key={program.id} value={program.id}>
                                                                            ({program.program_code}) {program.program_name}
                                                                        </option>
                                                                    ))
                                                                }
                                                            </select>

                                                            {errors.programId ? <div className="alert alert-info">{errors.programId}</div> : null}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="form-group">
                                                    <div className="col-lg-12 row">
                                                        <div className="col-lg-4">
                                                            Select Sub-Program
                                                        </div>
                                                        <div className="col-lg-8">
                                                            <select id="subprogramId" name="subprogramId" className="form-control" onChange={handleChange} onBlur={handleBlur} value={values.subprogramId}>
                                                                <option value="">Select Sub-Program</option>
                                                                {
                                                                    subprograms.map(program =>
                                                                    (
                                                                        <option key={program.id} value={program.id}>
                                                                            ({program.subprogram_code}) {program.subprogram_name}
                                                                        </option>
                                                                    ))
                                                                }
                                                            </select>

                                                            {errors.subprogramId ? <div className="alert alert-info">{errors.subprogramId}</div> : null}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="form-group">
                                                    <div className="col-lg-12 row">
                                                        <div className="col-lg-4">
                                                            Select Semester
                                                        </div>
                                                        <div className="col-lg-8">
                                                            <select id="semester" name="semester" className="form-control" onChange={handleChange} onBlur={handleBlur} value={values.semester}>
                                                                <option value="">Select Semester</option>
                                                                <option value="1">1</option>
                                                                <option value="2">2</option>
                                                                <option value="3">3</option>
                                                                <option value="4">4</option>
                                                                <option value="5">5</option>
                                                                <option value="6">6</option>
                                                                <option value="7">7</option>
                                                                <option value="8">8</option>
                                                            </select>

                                                            {errors.semester ? <div className="alert alert-info">{errors.semester}</div> : null}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <div className="col-lg-12 row">
                                                        <div className="col-lg-4">
                                                            Description of Course
                                                        </div>
                                                        <div className="col-lg-8">
                                                            <textarea id="description" name="description" onChange={handleChange} value={values.description} onBlur={handleBlur} className="form-control" placeholder="Enter Description of Course..." ></textarea>

                                                            {errors.description ? <div className="alert alert-info">{errors.description}</div> : null}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="form-group">
                                                    <div className="col-lg-12 row">
                                                        <div className="col-lg-4">
                                                            Enter Keywords
                                                        </div>
                                                        <div className="col-lg-8">
                                                            <TagsInput tags={keywords} setTags={setKeywords} disabled={true} />
                                                            {errors.keyWords ? <div className="alert alert-info">{errors.keyWords}</div> : null}
                                                        </div>
                                                    </div>

                                                </div>
                                                <div className="form-group">
                                                    <div className="col-lg-12 row">
                                                        <div className="col-lg-4">
                                                            Select Exam Type
                                                        </div>
                                                        <div className="col-lg-8">
                                                            <select id="examType" name="examType" className="form-control" onChange={handleChange} onBlur={handleBlur} value={values.examType}>
                                                                <option value="">Select Exam Type</option>
                                                                <option value="objective">Objective Exam</option>
                                                                <option value="subjective">Subjective Exam</option>
                                                                <option value="both">Subjective+Objective Exam</option>
                                                            </select>

                                                            {errors.examType ? <div className="alert alert-info">{errors.examType}</div> : null}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <div className="col-lg-12 row">
                                                        <div className="col-lg-4">
                                                            Select Exam Category
                                                        </div>
                                                        <div className="col-lg-8">
                                                            <select id="examCategory" name="examCategory" className="form-control" onChange={(e) => {
                                                                handleChange(e);
                                                                if (e.target.value === '' || e.target.value === undefined) {
                                                                    setFieldValue("categoryName", '');
                                                                }
                                                            }} onBlur={handleBlur} value={values.examCategory}>
                                                                <option value="">Normal Examination</option>
                                                                <option value="sectional">Sectional Examination</option>
                                                            </select>

                                                            {errors.examCategory ? <div className="alert alert-info">{errors.examCategory}</div> : null}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <div className="col-lg-12 row">
                                                        <div className="col-lg-4">
                                                            Section Names Comma Seperated
                                                        </div>
                                                        <div className="col-lg-8">
                                                            <input type="text" id="categoryName" name="categoryName" onChange={handleChange} value={values.categoryName} onBlur={handleBlur} className="form-control" placeholder="Enter Section Names Comma Seperated..." disabled={(values.examCategory === '' || values.examCategory === undefined)} />

                                                            {errors.categoryName ? <div className="alert alert-info">{errors.categoryName}</div> : null}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card-footer">
                                                <div className="form-group">
                                                    <center>
                                                        <button type="submit" className="btn btn-primary" onClick={() => {
                                                            setFieldValue("keyWords", keywords);
                                                        }} disabled={isSubmitting}>Submit</button>
                                                    </center>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </Modal.Body>
                        </Modal>
                    );
                }
            }
        </Formik>
            : null
    );
};

async function getSubPrograms(setSubPrograms, myFlag, setShow, setMsg) {
    await API.get('/subprogram')
        .then((res) => {
            if (res.data.status === 'success') {
                setSubPrograms(res.data.data);
            }
            else {
                setShow(true);
                setMsg('Problem Fetching Data from Server');
            }
        });
}

async function updateSubject(values, setMyList, myList, SubjectId, setEdit, setShow, setMsg, keywords, currentUser) {
    let fd = new FormData();
    fd.append("type", "form");
    let paperCode = values.paperCode; fd.append("paperCode", paperCode);
    let paperName = values.paperName; fd.append("paperName", paperName);
    let programId = values.programId; fd.append("programId", programId);
    let instId = currentUser.uid; fd.append("instId", instId);
    let semester = values.semester; fd.append("semester", semester);
    let exam_mode = values.examType; fd.append("examMode", exam_mode);
    let exam_category = values.examCategory; fd.append("examCategory", exam_category);
    let sectionNames = values.categoryName; fd.append("sectionNames", sectionNames);
    let description = values.description; fd.append("description", description);
    let file = values.file; fd.append("file", file);
    let subprogramId = values.subprogramId;fd.append("subprogramId", subprogramId);

    fd.append("keywords", keywords);
    fd.append("_method", 'put');

    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    }

    await API.post('/subject/' + SubjectId, fd, config)
        .then(function (res) {
            if (res.data.status === 'success') {
                setMyList(!myList);
                setEdit(false);
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

function useFlag() {
    const [flag, setFlag] = useState();

    useEffect(() => { updateFlag(); }, []);

    async function updateFlag() {
        const res = await API.get('/settings', { params: { "type": "login" } });
        if (res.data.status === 'success') {
            setFlag(res.data.flag);
        }
    }

    return flag;
}

async function getPrograms(setPrograms, myFlag, setShow, setMsg) {
    await API.get('/program', { params: { "type": "all" } })
        .then((res) => {
            if (res.data.status === 'success') {
                setPrograms(res.data.data);
            }
            else {
                setShow(true);
                setMsg('Problem Fetching Data from Server');
            }
        });
}

async function getPrograms1(setPrograms, instUid, setShow, setMsg) {
    await API.get('/program', { params: { "type": "instUid", "instUid": instUid } })
        .then((res) => {
            if (res.data.status === 'success') {
                setPrograms(res.data.data);
            }
            else {
                setShow(true);
                setMsg('Problem Fetching Data from Server');
            }
        });
}



export default EditSubject;