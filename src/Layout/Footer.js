import React, { useState, useEffect, useContext } from 'react';
import API from '../api';
import { FooterContext } from '../App';
import { useLocation } from 'react-router-dom';

function Footer() {
    let location = useLocation();
    const { footerVal } = useContext(FooterContext);
    let d = new Date();
    let year = d.getFullYear();
    let PathName = location.pathname;


    return (
        PathName === '/studenthome' ?
            <div className="alert alert-danger col-lg-12" role="alert" >
                <b>If Any discrepancy found in papers assigned to you, please contact us.</b>
            </div>
            : <div id="footer"></div>
    );
}


export default Footer;
