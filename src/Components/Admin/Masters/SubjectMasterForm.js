import React, { useState, useEffect, useContext } from 'react';
import { Formik, yupToFormErrors } from 'formik';
import * as Yup from 'yup';
import API from '../../../api';
import { ShowContext } from '../../../App';
import { UserContext } from '../../../App';
import TagsInput from './TagsInput';

const SubjectMasterForm = (props) => {
    const ref = React.useRef();
    const [myMsg, setMyMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const myFlag = useFlag(setLoading);
    const [keywords, setKeywords] = useState([]);
    const myInitialValues = { paperCode: '', paperName: '', file: '', flag: myFlag, programId: '',subprogramId:'', instId: '', semester: '', examCategory: '', categoryName: '', description: '', keyWords: keywords };
    const { setShow, setMsg } = useContext(ShowContext);
    const [insts, setInsts] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [subprograms, setSubPrograms] = useState([]);
    const { currentUser } = useContext(UserContext);

    useEffect(() => {
        if (myFlag !== undefined && currentUser) {
            getInsts(setInsts, setShow, setMsg, currentUser);
        }
        getPrograms(setPrograms, myFlag, setShow, setMsg);

        getSubPrograms(setSubPrograms, myFlag, setShow, setMsg);
    }, [myFlag, setShow, setMsg, currentUser]);

    return (
        !loading && myFlag !== undefined ? <Formik
            initialValues={myInitialValues}
            onSubmit={async (values, actions) => {
                setMyMsg('');
                saveSubject(values, setLoading, setShow, setMsg, setMyMsg, props.setMyList, props.myList, currentUser, keywords);
                actions.setSubmitting(false);
                setKeywords([]);
                ref.current.value='';
                actions.resetForm({
                    values: {
                        paperCode: '', paperName: '', file: '', flag: myFlag, programId: '',subprogramId:'', instId: '', semester: '', examType: '', examCategory: '', categoryName: '', description: '', keyWords: keywords
                    },
                });
            }}

            validationSchema={Yup.object({
                paperCode: Yup.string()
                    .required("Paper Code is Required"),
                paperName: Yup.string()
                    .required("Paper Name is Required."),
                file: Yup.mixed().required('File is required'),
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
                        <div className="col-xl-8">
                            <form id="form-Prog" method="post" className="form-horizontal" onSubmit={handleSubmit}>
                                <div className="card mb-4">
                                    <div className="card-header">
                                        <i className="fas fa-address-card mr-1" />
                                        Add Subject Form
                                    </div>
                                    <div className="card-body">
                                        {(myFlag === 0 || currentUser.role !== 'EADMIN') && insts.length > 0 && (
                                            <div className="form-group">
                                                <div className="col-lg-12 row">
                                                    <div className="col-lg-4">
                                                        Select Institute
                                                    </div>
                                                    <div className="col-lg-8">
                                                        <select id="instId" name="instId" className="form-control" onChange={(e) => {
                                                            setLoading(true);
                                                            handleChange(e);
                                                            getPrograms1(setPrograms, e.target.value, setShow, setMsg);
                                                            setLoading(false);
                                                        }} onBlur={handleBlur} value={values.instId}>
                                                            <option value="">Select Institute</option>
                                                            {
                                                                insts.map(inst =>
                                                                (
                                                                    <option key={inst.uid} value={inst.uid}>
                                                                        ({inst.username}) {inst.college_name}
                                                                    </option>
                                                                ))
                                                            }
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
                                                <div className="col-lg-8">
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
                                                    <TagsInput tags={keywords} setTags={setKeywords} />
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

                                        {myMsg !== '' && (
                                            <div className="alert alert-dark animate__animated animate__tada animate_slower">{myMsg}</div>)}

                                        {loading && (
                                            <div className="custom-loader"></div>
                                        )}
                                    </div>
                                </div>
                            </form>
                        </div>
                    );
                }
            }
        </Formik>
            : null
    );
};

function useFlag(setLoading) {
    const [flag, setFlag] = useState();

    useEffect(() => { updateFlag(); }, []);

    async function updateFlag() {
        setLoading(true);
        const res = await API.get('/settings', { params: { "type": "login" } });
        if (res.data.status === 'success') {
            setFlag(res.data.flag);
            setLoading(false);
        }
    }

    return flag;
}

async function getInsts(setInsts, setShow, setMsg, currentUser) {
    let params = {};
    if (currentUser && currentUser.role === 'ADMIN') {
        params = { "role": "EADMIN" };
    }
    else if (currentUser && currentUser.role === 'EADMIN') {
        params = { "role": "EADMIN", 'instUid': currentUser.uid };
    }

    await API.get('/user', { params: params })
        .then((res) => {
            if (res.data.status === 'success') {
                setInsts(res.data.data);
            }
            else {
                setShow(true);
                setMsg('Problem Fetching Data from Server');
            }
        });
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

async function saveSubject(values, setLoading, setShow, setMsg, setMyMsg, setMyList, myList, currentUser, keywords) {
    let fd = new FormData();
    setLoading(true);
    let instId = null;
    let paperCode = values.paperCode;fd.append("paperCode", paperCode);
    let paperName = values.paperName;fd.append("paperName", paperName);
    let programId = values.programId;fd.append("programId", programId);
    let subprogramId = values.subprogramId;fd.append("subprogramId", subprogramId);fd.append("instId", currentUser.uid);
    let semester = values.semester;fd.append("semester", semester);
    let exam_mode = values.examType;fd.append("examMode", exam_mode);
    let exam_category = values.examCategory;fd.append("examCategory", exam_category);
    let sectionNames = values.categoryName;fd.append("sectionNames", sectionNames);
    let description = values.description;fd.append("description", description);
    let file = values.file;fd.append("file", file);
    fd.append("keywords",keywords);

    if (keywords.length < 3) {
        setShow(true);
        setMsg('Please Enter at least 3 keywords');
        setLoading(false);
        return false;
    }

    if (currentUser.role === 'EADMIN') {
        instId = currentUser.uid;
    }

    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    }

    await API.post('/subject', fd,config)
        .then((res) => {
            if (res.data.status === 'success') {
                setMyMsg(res.data.message);
                setLoading(false);
                setMyList(!myList);
            }
            else {
                setMyMsg(res.data.message);
                setLoading(false);
            }
        })
        .catch(function (error) {
            setMyMsg(error.response.data.message);
            setLoading(false);
        });

}

export default SubjectMasterForm;