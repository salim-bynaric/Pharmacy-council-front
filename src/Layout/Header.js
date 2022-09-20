import React, { useState, useEffect, useContext } from 'react';
import LoginButton from '../Components/LoginButton';
import { useHistory, useLocation } from 'react-router-dom';
import { ShowContext } from '../App';
import { UserContext, BrowserContext, CartContext } from '../App';
import { FooterContext } from '../App';
import { LogoContext, ExamFolderContext } from '../App';
import API from '../api';
import io from 'socket.io-client';
import { en, de } from '../utils/Helper';

const CONNECTION_PORT = process.env.REACT_APP_PROCTOR_SERVER;
const CartPath = process.env.REACT_APP_PROJPATH + 'assets/images/cart.png';

function Header() {
    const { footerVal, setFooterVal } = useContext(FooterContext);
    const { setShow, setMsg } = useContext(ShowContext);
    const { logoVal } = useContext(LogoContext);
    const { currentUser } = useContext(UserContext);
    let history = useHistory();
    let location = useLocation();
    let [toggle, setToggle] = useState(false);
    let [isLoggedIn, setIsLoggedIn] = useState(false);
    let [isStartExam, setIsStartExam] = useState(false);
    let [isLoaded, setIsLoaded] = useState(false);
    const { setExamFolder } = useContext(ExamFolderContext);
    let [myHeader, imgPath] = useHeader(setIsLoaded, logoVal, setFooterVal, currentUser, setExamFolder);
    let PathName = location.pathname;
    const { setBrowserName } = useContext(BrowserContext);

    const { detect } = require('detect-browser');
    const browser = detect();

    useEffect(() => {
        setBrowserName(browser.name);
    });

    if (currentUser) { var headerClass = currentUser.role == 'STUDENT' ? "student_header" : "admin_header" };

    useEffect(() => {
        let PathName = location.pathname;
        const searchString = process.env.REACT_APP_NON_AUTH_PATHS.split(' ').find((str) => str === PathName);
        if (PathName === '/startexam' || PathName === '/paperChecking' || PathName === '/startProctor' || PathName === '/startExamPreview') {
            if (window.innerWidth < 1000) {
                setIsStartExam(true);
                setToggle(true);
                document.body.classList.remove('sb-nav-fixed'); document.body.classList.remove('sb-sidenav-toggled');
            }
            else {
                setIsStartExam(true);
                setToggle(false);
                document.body.classList.add('sb-sidenav-toggled'); document.body.classList.remove('sb-nav-fixed');
            }
            document.body.classList.add('noscroll');
        }
        else {
            if (PathName === '/login' || PathName === '/adminLogin' || PathName === '/registration') {
                if (window.innerWidth < 1000) {
                    if (document.getElementById('header') !== null) {
                        document.getElementById('header').style.display = "none";
                    }
                    if (document.getElementById('footer') !== null) {
                        document.getElementById('footer').style.display = "none";
                    }
                    setIsStartExam(true);
                    setToggle(true);
                    document.body.classList.remove('sb-nav-fixed');
                    document.body.classList.remove('sb-sidenav-toggled');
                }
                else {
                    //document.body.classList.add('noscroll');
                    if (document.getElementById('layoutSidenav_nav') !== null) {
                        document.getElementById('layoutSidenav_nav').style.display = "none";
                    }
                    if (document.getElementById('header') !== null) {
                        document.getElementById('header').style.display = "none";
                    }
                    if (document.getElementById('footer') !== null) {
                        document.getElementById('footer').style.display = "none";
                    }
                    setIsStartExam(true);
                    setToggle(false);
                    document.body.classList.add('sb-sidenav-toggled'); document.body.classList.remove('sb-nav-fixed');
                }
            }
            else {
                document.body.classList.remove('noscroll');
                if (document.getElementById('layoutSidenav_nav') !== null) {
                    document.getElementById('layoutSidenav_nav').style.display = "block";
                }
                if (document.getElementById('header') !== null) {
                    document.getElementById('header').style.display = "block";
                }
                if (document.getElementById('footer') !== null) {
                    document.getElementById('footer').style.display = "block";
                }
            }
            setIsStartExam(false);
            setToggle(false);
            document.body.classList.add('sb-nav-fixed'); document.body.classList.remove('sb-sidenav-toggled');
        }

        if (PathName !== searchString) {
            setIsLoggedIn(true);
        }
        else {
            setIsLoggedIn(false);
        }

        if (PathName === '/login' || PathName === '/adminLogin' || PathName === '/registration') {
            setToggle(true);
            document.body.classList.remove('sb-sidenav-toggled'); document.body.classList.remove('sb-nav-fixed');
        }
    }, [location, history, setShow, setMsg]);

    return (
        !isStartExam && currentUser && (!PathName.includes('qestionWebView')) ?
            <div id="header" className={headerClass}>
                <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">
                    <a href="/# " className="navbar-brand"><img src={imgPath + '?val=' + logoVal} height="50" width="120" alt="Logo" style={{ borderRadius: "45%" }} onDragStart={(e) => { e.preventDefault(); }}></img></a>

                    {(location.pathname !== '/login') && (location.pathname !== '/registration') ?
                        <button className="btn btn-link btn-sm order-1 order-lg-0" style={{ float: "right" }} id="sidebarToggle" onClick={() => { toggleSidebar(setToggle, toggle) }}><i className="fas fa-bars"></i></button>
                        : null}

                    <form className="d-none d-md-inline-block form-inline ml-auto mr-0 mr-md-3 my-2 my-md-0">

                    </form>
                    {
                        currentUser.role === 'STUDENT' ?
                            <img src={CartPath} height={30} width={30} onClick={() => {
                                history.push("/cart");
                            }} title="cart"/>
                            : null
                    }
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    {isLoggedIn ? <LoginButton url={'/logout'} label={'Logout'} setIsLoggedIn={setIsLoggedIn} /> : null}
                </nav>
            </div>
            : null
    );
}

function toggleSidebar(setToggle, toggle) {
    setToggle(!toggle);
    if (!toggle) {
        document.body.classList.add('sb-sidenav-toggled'); document.body.classList.remove('sb-nav-fixed');
    }
    else {
        document.body.classList.add('sb-nav-fixed'); document.body.classList.remove('sb-sidenav-toggled');
    }
}



function useHeader(setIsLoaded, logoVal, setFooterVal, currentUser, setExamFolder) {
    let [myHeader, setMyHeader] = useState('Bynaric Exams');
    let [imgPath, setImgPath] = useState('');

    useEffect(() => {
        if (currentUser) {
            getHeaderData(setFooterVal, currentUser);
        }
    }, [logoVal, currentUser]);

    async function getHeaderData(setFooterVal, currentUser) {
        let userId = '';
        let instId = '';
        if (currentUser) {
            userId = currentUser.uid;
            instId = currentUser.inst_id;
        }

        await API.get('/configurations', { params: { "type": en("headerconfig"), "instId": en(instId) } })
            .then(function (res) {
                let header = de(res.data.header);
                let footer = de(res.data.footer);
                let imgpath = de(res.data.imgpath);
                let examFolder = de(res.data.examFolder);

                if (res.data.status === 'success') {
                    setMyHeader(header);
                    setFooterVal(footer);
                    setImgPath(imgpath);
                    setExamFolder(examFolder);
                    setIsLoaded(true);
                }
                else {
                    setMyHeader('Bynaric Exams');
                    setImgPath('');
                    setExamFolder('');
                    setIsLoaded(true);
                }
            })
            .catch(function (error) {
                setMyHeader('Bynaric Exams');
                setImgPath('');
                setExamFolder('');
                setIsLoaded(true);
            })
    }

    return [myHeader, imgPath];
}

export default Header;
