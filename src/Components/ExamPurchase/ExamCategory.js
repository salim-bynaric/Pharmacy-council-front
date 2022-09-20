import React, { useEffect, useState, useContext } from 'react';
import { UserContext, ShowContext } from '../../App';
import API from '../../api';
import { de } from '../../utils/Helper';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import ExamCardPurchase from './ExamCardPurchase';
import ExamCategoryTabs from './ExamCategoryTabs';


const ExamCategory = ({ purchased }) => {
    const [categories, setCategories] = useState();
    const { currentUser } = useContext(UserContext);
    const { setShow, setMsg } = useContext(ShowContext);

    useEffect(() => {
        if (currentUser) {
            getExamCategories(setCategories, currentUser, setShow, setMsg);
        }
    }, [currentUser]);

    return (
        <>
            <ExamCategoryTabs categories={categories} purchased={purchased}/>
        </>
    );
};

async function getExamCategories(setCategories, currentUser, setShow, setMsg) {
    await API.get('/program/student/inst', { params: { 'type': 'instwise', 'instId': currentUser.inst_id } })
        .then(res => {
            if (res.data.status === 'success') {
                let categories = JSON.parse(de(res.data.data));
                setCategories(categories);
            }
        })
        .catch(function (error) {
            setShow(true);
            setMsg(error.response.data.message);
        });
}

export default ExamCategory;