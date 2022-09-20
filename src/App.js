import React, { useState, useEffect } from 'react';
import Header from './Layout/Header';
import Content from './Layout/Content';
import AlertDismissible from './AlertDismissible';
import Popup from './popup';
import { createBrowserHistory } from 'history';
import { useLocation } from 'react-router-dom';
import API from './api';
import IdleTimerContainer from './IdleTimerContainer';
import Landing from './Landing/Landing';
import { de } from './utils/Helper';
import OuterContent from './Landing/OuterContent';
import LandingHeader from './Landing/LandingHeader';
import AdminLogin from './Landing/AdminLogin';
import StudentRegister from './Landing/StudentRegister';
import Popup1 from './Landing/Popup';

export const ShowContext = React.createContext();
export const PopupContext = React.createContext();
export const UserContext = React.createContext();
export const LogoContext = React.createContext();
export const FooterContext = React.createContext();
export const WebCamContext = React.createContext();
export const QuestModeContext = React.createContext();
export const AnsImgContext = React.createContext();
export const MaskContext = React.createContext();
export const MaskSwitchContext = React.createContext();
export const ExamFolderContext = React.createContext();
export const BrowserContext = React.createContext();
export const ProctorViewContext = React.createContext();
export const CartContext = React.createContext();

const browserHistory = createBrowserHistory({});


function App() {
  const location = useLocation();
  const [questionMode, setQuestionMode] = useState('O');
  const [popupShow, setPopupShow] = useState(false);
  const [mask, setMask] = useState(false);
  const [maskSwitchContext, setMaskSwitchContext] = useState(false);
  const [popupMsg, setPopupMsg] = useState();
  const [show, setShow] = useState(false);
  const [msg, setMsg] = useState();
  const [logoVal, setLogoVal] = useState();
  const [footerVal, setFooterVal] = useState();
  const [currentUser, setCurrentUser] = useWhoAmI();
  const { detect } = require('detect-browser');
  const browser = detect();
  let [ImgArray, setImgArray] = useState([]);
  const [examFolder, setExamFolder] = useState();
  const [browserName, setBrowserName] = useState();
  const [cameraReff, setCameraReff] = useState();
  const [proctorView, setProctorView] = useState('grid');
  const [cart, setCart] = useState([]);

  const [studentRegister, setStudentRegister] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const handleClose3 = () => setStudentRegister(false);
  const [adminLogin, setAdminLogin] = useState(false);
  const handleCloseAdminLogin = () => setAdminLogin(false);

  setupAxios(setShow, setMsg);
  
  return (location.pathname === "/" || location.pathname.slice(0,6) === "/outer") ?
    (
      browser.name === 'chrome' || ((browser.name === 'edge' || browser.name === 'edge-chromium') && browser.os !== 'Android OS') || browser.name === 'chromium-webview' ?
        <div>
          <ExamFolderContext.Provider value={{ examFolder: examFolder, setExamFolder: setExamFolder }}>
            <CartContext.Provider value={{ cart, setCart }}>
              <BrowserContext.Provider value={{ browserName: browserName, setBrowserName: setBrowserName, cameraReff: cameraReff, setCameraReff: setCameraReff }}>
                <ShowContext.Provider value={{ setShow: setShow, setMsg: setMsg }}>
                  <UserContext.Provider value={{ currentUser: currentUser, setCurrentUser: setCurrentUser }}>
                    <LandingHeader setStudentRegister={setStudentRegister} setAdminLogin={setAdminLogin}/>
                    {
                      location.pathname === "/" ? 
                        <Landing adminLogin={adminLogin} setAdminLogin={setAdminLogin} studentRegister={studentRegister} setStudentRegister={setStudentRegister} /> 
                      : 
                      <OuterContent />
                    }
                    <AdminLogin show={adminLogin} handleClose={handleCloseAdminLogin} />
                    <StudentRegister Popup={Popup1} studentRegister={studentRegister} setStudentRegister={setStudentRegister} handleClose3={handleClose3} forgotPassword={forgotPassword} setForgotPassword={setForgotPassword}/>

                  </UserContext.Provider>
                </ShowContext.Provider>
              </BrowserContext.Provider>
            </CartContext.Provider>
          </ExamFolderContext.Provider>
          <AlertDismissible myShow={show} mySetShow={setShow} myMsg={msg} />
        </div>
        :
        <div>
          <br /><br />
          <center>
            <div className="alert alert-danger">
              <font size="4">This Application Supports Latest Version of Google Chrome and Chromium Browser. Microsoft Edge Web Browser is Not Supported on Android Device.</font>
            </div>
          </center>
        </div>
    )
    :
    (
      browser.name === 'chrome' || ((browser.name === 'edge' || browser.name === 'edge-chromium') && browser.os !== 'Android OS') || browser.name === 'chromium-webview' ?
        <div>
          <CartContext.Provider value={{ cart, setCart }}>
            <ProctorViewContext.Provider value={{ proctorView, setProctorView }}>
              <BrowserContext.Provider value={{ browserName: browserName, setBrowserName: setBrowserName, cameraReff: cameraReff, setCameraReff: setCameraReff }}>
                <ExamFolderContext.Provider value={{ examFolder: examFolder, setExamFolder: setExamFolder }}>
                  <MaskSwitchContext.Provider value={{ maskSwitchContext: maskSwitchContext, setMaskSwitchContext: setMaskSwitchContext }}>
                    <MaskContext.Provider value={{ mask: mask, setMask: setMask }}>
                      <AnsImgContext.Provider value={{ ImgArray: ImgArray, setImgArray: setImgArray }}>
                        <QuestModeContext.Provider value={{ questionMode: questionMode, setQuestionMode: setQuestionMode }}>
                          <LogoContext.Provider value={{ logoVal: logoVal, setLogoVal: setLogoVal }}>
                            <PopupContext.Provider value={{ setPopupShow: setPopupShow, setPopupMsg: setPopupMsg }}>
                              <UserContext.Provider value={{ currentUser: currentUser, setCurrentUser: setCurrentUser }}>
                                <ShowContext.Provider value={{ setShow: setShow, setMsg: setMsg }}>
                                  <IdleTimerContainer></IdleTimerContainer>
                                  <FooterContext.Provider value={{ footerVal: footerVal, setFooterVal: setFooterVal }}>
                                    <Header />
                                    <Content />
                                  </FooterContext.Provider>
                                </ShowContext.Provider>
                              </UserContext.Provider>
                            </PopupContext.Provider>
                          </LogoContext.Provider>
                        </QuestModeContext.Provider>
                      </AnsImgContext.Provider>

                      <Popup setPopupShow={setPopupShow} popupShow={popupShow} popupMsg={popupMsg} />
                      <AlertDismissible myShow={show} mySetShow={setShow} myMsg={msg} />

                    </MaskContext.Provider>
                  </MaskSwitchContext.Provider>
                </ExamFolderContext.Provider>
              </BrowserContext.Provider>
            </ProctorViewContext.Provider>
          </CartContext.Provider>
        </div>
        :
        <div>
          <br /><br />
          <center>
            <div className="alert alert-danger">
              <font size="4">This Application Supports Latest Version of Google Chrome and Chromium Browser. Microsoft Edge Web Browser is Not Supported on Android Device.</font>
            </div>
          </center>
        </div>
    );
}

function useWhoAmI() {
  const [currentUser, setCurrentUser] = useState();
  useEffect(() => {
    if (browserHistory.location.pathname !== '' && browserHistory.location.pathname.indexOf('/qestionWebView/') !== 0 && browserHistory.location.pathname.indexOf('/adminLogin') !== 0 && browserHistory.location.pathname.indexOf('/login') !== 0 && browserHistory.location.pathname.indexOf('/registration') !== 0 && browserHistory.location.pathname !== '/' && browserHistory.location.pathname.slice(0,6) !== "/outer") {
      whosMe();
    }
  }, []);
  async function whosMe() {
    const res = await API.get('/whoAmI');
    let data = JSON.parse(de(res.data.data));
    if (res.data.status === 'Success') {
      setCurrentUser(data);
    }
  }
  return [
    currentUser,
    setCurrentUser
  ]
}


//----------------------Axios Interceptors--------------------------------------
function setupAxios(setShow, setMsg) {
  API.interceptors.request.use(function (config) {
    const token = de(window.atob(decodeURIComponent(JSON.parse(localStorage.getItem("token")))));
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
  },
    function (error) {
      return Promise.reject(error);
    });


  API.interceptors.response.use(response => response,
    error => {
      const status = error.response;
      if ((status !== undefined) && (status.status === 401)) {
        if (window.location.href.search('linkLogin/') === -1) {
          browserHistory.replace('/');
        }
      }
      else if ((status !== undefined) && (status.status === 429)) {
        setShow(true);
        setMsg('Server is Busy. Please wait for some seconds. Your Response will not be saved till this message keeps appearing.');
      }
      else if (status === undefined || !status) {
        setShow(true);
        setMsg('There is some problem with server response.Your Response will not be saved till this message keeps appearing.');
      }
      if (!error.response) {
        setShow(true);
        setMsg('Your Connection to server is lost. Please Contact Internet Service Provider');
      }
      return Promise.reject(error);
    }
  );
}
//----------------------------End of Axios Interceptors-------------------------
export default App;
