import React, {useContext} from 'react';
import { Route } from 'react-router-dom';
import { UserContext } from '../App';
import Sidebar from './Sidebar';
import Footer from './Footer';
import AdminLogin from '../Landing/AdminLogin';
import StudHome from '../Components/Student/StudHome';
import Instructions from '../Components/Student/Instructions';
import Startexam from '../Components/Startexam';

import AdminHome from '../Components/Admin/Adminhome';
import AdminReports from '../Components/Admin/AdminReports';
import AdminExamReport from '../Components/Admin/Reports/AdminExamReport';
import ClearSession from '../Components/Admin/ClearSession';
import ConfigureHeader from '../Components/Admin/Configurations/ConfigureHeader';
import ConfigureFooter from '../Components/Admin/Configurations/ConfigureFooter';

import InstHome from '../Components/Institute/InstHome';
import InstReports from '../Components/Institute/InstReports';
import InstExamReport from '../Components/Institute/Reports/InstExamReport';
import InstExamStudReport from '../Components/Institute/Reports/InstExamStudtReport';

import GlobalController from '../Components/Admin/Configurations/GlobalController';
import ClusterController from '../Components/Admin/Configurations/ClusterController';
import GadminHome from '../Components/Gadmin/GadminHome';
import CadminHome from '../Components/Cadmin/CadminHome';
import AddInstitute from '../Components/Cadmin/AddInst';
import InstituteToClusterAllocation from '../Components/Admin/Configurations/InstClusterAlloc';
import GlobClusterAlloc from '../Components/Admin/Configurations/GlobClusterAlloc';
import SubjectMaster from '../Components/Admin/Masters/SubjectMaster';

import ProgramMaster from '../Components/Admin/Masters/ProgramMaster';
import StudentMaster from '../Components/Admin/Masters/StudentMaster';
import StudSubjectAlloc from '../Components/Admin/Masters/StudSubjectAlloc';
import TestMaster from '../Components/Admin/Masters/TestMaster';
import AddTopic from '../Components/Admin/Masters/AddTopic';
import ConfigureTest from '../Components/Admin/Masters/ConfigureTest';
import ConfigureTestGeneric from '../Components/Admin/Masters/ConfigureTestGeneric';
import InstProgramAllocation from '../Components/Admin/Configurations/InstProgramAllocation';
import examQuestionSpecificationReport from '../Components/Admin/Reports/examQuestionSpecificationReport';
import examQuestionSpecificationMatchReport from '../Components/Admin/Reports/examQuestionSpecificationMatchReport';

import QuestionBank from '../Components/Admin/Masters/QuestionBank';
import ModerateQB  from '../Components/Admin/Masters/ModerateQB';

import Registration from '../Components/Registration';
import studentExamLogReport from '../Components/Institute/Reports/StudExamLogReport';
import StudExamLogReport from '../Components/Institute/Reports/StudExamLogReport';
import StudentProctoringReport from '../Components/Institute/Reports/StudentProctoringReport';
import ExamDashboardReport from '../Components/Institute/Reports/ExamDashboardReport';
import StudentSubAllocReport from '../Components/Institute/Reports/StudentSubAllocReport';
import AutoEndExam from '../Components/Admin/AutoEndExam';
import DashboardReportAdmin from '../Components/Admin/Reports/DashboardReportAdmin';
import SubjectiveQB from '../Components/Admin/Masters/SubjectiveQB';
import ModerateSubjectiveQB from '../Components/Admin/Masters/moderateSubjectiveQB';
import AddQuestChecker from '../Components/Admin/Masters/AddQuestChecker';
import StudCheckerAlloc from '../Components/Admin/Masters/StudCheckerAlloc';
import Checkerhome from '../Components/Checker/Checkerhome';
import PaperChecking from '../Components/Checker/PaperChecking';
import AddProctor from '../Components/Admin/Masters/AddProctor';
import StudProctorAlloc from '../Components/Admin/Masters/StudProctorAlloc';
import ProctorHome from '../Components/Proctor/ProctorHome';
import StartProctor from '../Components/Proctor/StartProctor';
import UploadStudProctor from '../Components/Admin/Masters/UploadStudProctor';
import ProctoringSummaryReport from '../Components/Admin/Reports/ProctoringSummaryReport';
import ResetExam from '../Components/Institute/ResetExam';
import ProctorReports from '../Components/Proctor/ProctorReports';
import ProctorStudAllocReport from '../Components/Proctor/Reports/ProctorStudAllocReport';
import InvigilatorsDashboard from '../Components/Admin/Reports/InvigilatorsDashboard';
import ResetExamTime from '../Components/Admin/Masters/ResetExamTime';
import AddPaperSetter from '../Components/Admin/Masters/AddPaperSetter';
import SetterHome from '../Components/Setter/SetterHome';
import SetterSubjectAlloc from '../Components/Admin/Masters/SetterSubjectAlloc';
import UploadSubjectiveAnswer from '../Components/Student/UploadSubjectiveAnswer';
import CheckerSubjectAlloc from '../Components/Admin/Masters/CheckerSubjectAlloc';
import CheckPaper from '../Components/Checker/CheckePaper';
import QuestionWebView from '../QuestionWebView';
import CheckerCountReport from '../Components/Admin/Reports/CheckerCountReport';
import ModeratorCountReport from '../Components/Admin/Reports/ModeratorCountReport';
import SubAnsNotSolvedReport from '../Components/Admin/Reports/SubAnsNotSolvedReport';
import AddAdminUser from '../Components/Admin/Configurations/AddAdminUser';
import SetDataFolder from '../Components/Admin/Configurations/SetDataFolder';
import SetInstUrl from '../Components/Admin/Configurations/SetInstUrl';
import ExamPreView from '../Components/Institute/ExamPreView';
import StartExamPreView from '../Components/Institute/StartExamPreview';
import ExamListView from '../Components/Institute/ExamListView';
import StudQuestions from '../Components/Checker/StudQuestions';
import PaperSetterDetailsReport from '../Components/Admin/Reports/PaperSetterDetailsReport';
import ResetDatabase from '../Components/Admin/Configurations/ResetDatabase';
import ChangeUserPassword from '../Components/Admin/Configurations/ChangeUserPassword';
import AddSubAdminUser from '../Components/Admin/Configurations/AddSubAdminUser';
import SubAdminHome from '../Components/SubAdmin/SubAdminHome';
import ClearSessionScript from '../Components/Admin/Configurations/ClearSessionScript';
import QBStatusReport from '../Components/Institute/Reports/QBStatusReport';
import StudentProctoringCountReport from '../Components/Institute/Reports/StudentProctoringCountReport';
import StudentAttendanceReport from '../Components/Admin/Reports/StudentAttendanceReport';
import SubjectWiseStudentCountReport from '../Components/Institute/Reports/SubjectWiseStudentCountReport';
import ProctorWiseStudentCountReport from '../Components/Institute/Reports/ProctorWiseStudentCountReport';
import SubjectWiseQuestionCountReport from '../Components/Institute/Reports/SubjectWiseQuestionCountReport';
import StudQuestCountMismatchReport from '../Components/Institute/Reports/StudQuestCountMismatchReport';
import MyExamDashboard from '../Components/Institute/Reports/MyExamDashboard';
import MySubjectWiseDashboard from '../Components/Institute/Reports/MySubjectWiseDashboard';
import SectionalStudMarksReport from '../Components/Admin/Reports/SectionalStudMarksReport';
import ExamProctoring from '../Components/Admin/ExamProctoring';
import Cart from '../Components/Cart/Cart';
import Txnsuccess from '../Components/Cart/Txnsuccess';
import Txnfailure from '../Components/Cart/Txnfailure';
import SubProgramMaster from '../Components/Admin/Masters/SubProgramMaster';
import StudyMaterial from '../Components/Student/StudyMaterial';
import UploadStudyMaterial from '../Components/Admin/Masters/UploadStudyMaterial';


function Content() 
{
    const { currentUser } = useContext(UserContext);
    let SidenavClass = (currentUser && (currentUser.role === 'STUDENT' || currentUser.role === 'PROCTOR')) ? 'student_sidenav' : 'admin_content';
        return (
            <>
            <Route path="/qestionWebView/:id" component={QuestionWebView} />
            <div id="layoutSidenav"  className={SidenavClass}>
                <div id="layoutSidenav_nav" className="scroll1"><Sidebar /></div>
                    <div id="layoutSidenav_content"  className={SidenavClass}>
                        <main>
                            
                            
                            <Route exact path="/registration" component={Registration} />
                            
                            <Route exact path="/studenthome" component={StudHome} />
                            <Route exact path="/instructions" component={Instructions} />
                            <Route exact path="/startexam" component={Startexam} />

                            <Route exact path="/adminhome" component={AdminHome} />
                            <Route exact path="/adminreports" component={AdminReports} />
                            <Route exact path="/adminexamreport" component={AdminExamReport} />
                            <Route exact path="/clearsession" component={ClearSession} />
                            <Route exact path="/configHeader" component={ConfigureHeader} />
                            <Route exact path="/configFooter" component={ConfigureFooter} />

                            <Route exact path="/insthome" component={InstHome} />
                            <Route exact path="/instreports" component={InstReports} />
                            <Route exact path="/instexamreport" component={InstExamReport} />
                            <Route exact path="/instexamstudentreport" component={InstExamStudReport} />

                            <Route exact path="/addGlobController" component={GlobalController} />
                            <Route exact path="/addClusterController" component={ClusterController} />
                            <Route exact path="/gadminhome" component={GadminHome} />
                            <Route exact path="/cadminhome" component={CadminHome} />
                            <Route exact path="/addInstitutes" component={AddInstitute} />
                            <Route exact path="/instClusterAllocation" component={InstituteToClusterAllocation} />
                            <Route exact path="/globalClusterAllocation" component={GlobClusterAlloc} />
                            <Route exact path="/programMaster" component={ProgramMaster} />
                            <Route exact path="/subjectMaster" component={SubjectMaster} />
                            <Route exact path="/studentMaster" component={StudentMaster} />
                            <Route exact path="/studSubjectAlloc" component={StudSubjectAlloc} />
                            <Route exact path="/addTest" component={TestMaster} />
                            <Route exact path="/addTopic" component={AddTopic} />
                            <Route exact path="/configureTest" component={ConfigureTest} />
                            <Route exact path="/instProgramAllocation" component={InstProgramAllocation} />
                            <Route exact path="/examQuestionSpecificationReport" component={examQuestionSpecificationReport} />
                            <Route exact path="/examQuestionSpecificationMatchReport" component={examQuestionSpecificationMatchReport} />
                            <Route exact path="/questionBank" component={QuestionBank} />
                            <Route exact path="/moderateQB" component={ModerateQB} />
                            <Route exact path="/configGenericTest" component={ConfigureTestGeneric} />
                            <Route exact path="/studentExamLogReport" component={StudExamLogReport} />
                            <Route exact path="/studentProctoringsReport" component={StudentProctoringReport} />
                            <Route exact path="/examDashboardReport" component={ExamDashboardReport} />
                            <Route exact path="/studentSubAllocReport" component={StudentSubAllocReport} />
                            <Route exact path="/autoEndExam" component={AutoEndExam} />
                            <Route exact path="/dashboardReportAdmin" component={DashboardReportAdmin} />
                            <Route exact path="/subjectiveQB" component={SubjectiveQB} />
                            <Route exact path="/moderateSubjectiveQB" component={ModerateSubjectiveQB} />
                            <Route exact path="/addQuestChecker" component={AddQuestChecker} />
                            <Route exact path="/studCheckerAlloc" component={StudCheckerAlloc} />
                            <Route exact path="/checkerHome" component={Checkerhome} />
                            <Route exact path="/paperChecking" component={PaperChecking} />
                            <Route exact path="/addProctor" component={AddProctor} />
                            <Route exact path="/studProctorAlloc" component={StudProctorAlloc} />
                            <Route exact path="/proctorHome" component={ProctorHome} />
                            <Route exact path="/startProctor" component={StartProctor} />
                            <Route exact path="/uploadStudProctor" component={UploadStudProctor} />
                            <Route exact path="/proctoringSummaryReport" component={ProctoringSummaryReport} />
                            <Route exact path="/resetExam" component={ResetExam}/>
                            <Route exact path="/proctorReports" component={ProctorReports}/>
                            <Route exact path="/proctorStudAllocReport" component={ProctorStudAllocReport}/>
                            <Route exact path="/invigilatorDashboard" component={InvigilatorsDashboard}/>
                            <Route exact path="/resetTime" component={ResetExamTime}/>
                            <Route exact path="/addPaperSetter" component={AddPaperSetter}/>
                            <Route exact path="/setterHome" component={SetterHome}/>
                            <Route exact path="/setterSubjectAlloc" component={SetterSubjectAlloc}/>
                            <Route exact path="/uploadSubjectiveAnswer" component={UploadSubjectiveAnswer}/>
                            <Route exact path="/checkerSubjectAlloc" component={CheckerSubjectAlloc}/>
                            <Route exact path="/checkPaper" component={CheckPaper}/>
                            <Route exact path="/checkerCountReport" component={CheckerCountReport}/>
                            <Route exact path="/moderatorCountReport" component={ModeratorCountReport}/>
                            <Route exact path="/subAnsNotSolvedReport" component={SubAnsNotSolvedReport}/>
                            <Route exact path="/addAdminUser" component={AddAdminUser}/>
                            <Route exact path="/setDataFolder" component={SetDataFolder}/>
                            <Route exact path="/setInstUrl" component={SetInstUrl}/>
                            <Route exact path="/examPreView" component={ExamPreView}/>
                            <Route exact path="/startExamPreView" component={StartExamPreView}/>
                            <Route exact path="/examListView" component={ExamListView}/>
                            <Route exact path="/studQuestions/:examId" component={StudQuestions}/>
                            <Route exact path="/paperSetterDetailsReport" component={PaperSetterDetailsReport}/>
                            <Route exact path="/resetDatabase" component={ResetDatabase}/>
                            <Route exact path="/changeUserPassword" component={ChangeUserPassword}/>
                            <Route exact path="/addSubAdminUser" component={AddSubAdminUser}/>
                            <Route exact path="/subAdminHome" component={SubAdminHome}/>
                            <Route exact path="/clearsessionScript" component={ClearSessionScript}/>
                            <Route exact path="/qbStatusReport" component={QBStatusReport}/>
                            <Route exact path="/studProctoringCountReport" component={StudentProctoringCountReport}/>
                            <Route exact path="/studentAttendanceReport" component={StudentAttendanceReport}/>
                            <Route exact path="/subjectWiseStudentCountReport" component={SubjectWiseStudentCountReport}/>
                            <Route exact path="/proctorWiseStudentCountReport" component={ProctorWiseStudentCountReport}/>
                            <Route exact path="/subjectWiseQuestionCountReport" component={SubjectWiseQuestionCountReport}/>
                            <Route exact path="/studQuestCountMismatchReport" component={StudQuestCountMismatchReport}/>
                            <Route exact path="/myExamDashboard" component={MyExamDashboard}/>
                            <Route exact path="/mySubjectWiseDashboard" component={MySubjectWiseDashboard}/>
                            <Route exact path="/sectionWiseStudMarks" component={SectionalStudMarksReport}/>
                            <Route exact path="/examProctoring" component={ExamProctoring}/>

                            <Route exact path="/cart" component={Cart}/>
                            <Route path="/txnsuccess" component={Txnsuccess}/>
                            <Route path="/txnfailure" component={Txnfailure}/>
                            <Route path="/subProgramMaster" component={SubProgramMaster}/>
                            <Route path="/study-material" component={StudyMaterial}/>
                            <Route path="/uploadStudyMaterial" component={UploadStudyMaterial}/>


                            
                        </main>
                        <footer className="py-4 bg-light mt-auto" id="footer">
                            <Footer />
                        </footer>
                    </div>
                </div>
            </>
        );
}

export default Content;
