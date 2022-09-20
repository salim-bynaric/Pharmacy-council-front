import React, { useState, useEffect, useContext } from 'react';
import { UserContext, ShowContext } from '../App';
import API from '../api';
import { de } from '../utils/Helper';
import MainCategories from './MainCategories';

const Categories = ({score,setScore}) => {
    const [data, setData] = useState();

    const [categories, setCategories] = useState();
    const [showCategories, setShowCategories] = useState(false);

    const [subCategories, setSubCategories] = useState();
    const [showSubCategories, setShowSubCategories] = useState(false);

    const [exams, setExams] = useState();
    const [showExams, setShowExams] = useState(false);

    const { currentUser } = useContext(UserContext);
    const { setShow, setMsg } = useContext(ShowContext);
    

    useEffect(() => {
        getCategoryData(currentUser, setShow, setMsg, setData, setCategories);
    }, []);

    useEffect(() => {
        if(score === 0)
        {
            setShowCategories(false);setShowSubCategories(false);setShowExams(false);
        }
    },[score]);
    
    return (
        <>
            <nav className="navbar navbar-expand-lg navbar" id="main_navbar" >
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon" ><i className="fas fa-bars"></i></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                {
                    categories !== undefined && categories.length > 0 ?
                        <MainCategories categories={categories} setCategories={setCategories} showCategories={showCategories} setShowCategories={setShowCategories} data={data} subCategories={subCategories} setSubCategories={setSubCategories} exams={exams} setExams={setExams} showSubCategories={showSubCategories} setShowSubCategories={setShowSubCategories} showExams={showExams} setShowExams={setShowExams} />
                    : null
                }
                </div>
            </nav>
        </>
    );
};


async function getCategoryData(currentUser, setShow, setMsg, setData, setCategories) {
    await API.get('/subject/categoryData')
        .then((res) => {
            if (res.data.status === 'success') {
                setData(JSON.parse(de(res.data.data)));
                let categories = [];
                let data = JSON.parse(de(res.data.data));
                for (let i = 0; i < data.length; i++) {
                    categories.push(data[i].programId + '-' + data[i].program_name)
                }
                categories = [...new Set(categories)];
                setCategories(categories);
            }
        })
        .catch((error) => {
            setShow(true);
            setMsg(error.response.data.message);
        });
}

export default Categories;