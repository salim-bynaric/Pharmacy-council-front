import React, { useContext } from 'react';
import { UserContext } from '../App';
import { Link } from 'react-router-dom';

function Sidebar() {
    const { currentUser, setCurrentUser } = useContext(UserContext);

    if (currentUser && currentUser.role === 'STUDENT') {
        return (
            <nav className="sb-sidenav accordion sb-sidenav-dark scroll1" id="sidenavAccordion" >
                <div className="sb-sidenav-menu scroll1">
                    <div className="nav scroll1">
                        <div className="sb-sidenav-menu-heading">Main Menu</div>
                        <Link className="nav-link" to={{ pathname: "/studenthome" }}>
                            <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
                            Home
                        </Link>
                    </div>
                </div>
            </nav>
        );
    }
    else if (currentUser && currentUser.role === 'CHECKER') {
        return (
            <nav className="sb-sidenav accordion sb-sidenav-dark scroll1" id="sidenavAccordion" >
                <div className="sb-sidenav-menu scroll1">
                    <div className="nav scroll1">
                        <div className="sb-sidenav-menu-heading">Main Menu</div>
                        <Link className="nav-link" to={{ pathname: "/checkerHome" }}>
                            <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
                            Home
                        </Link>
                        <Link className="nav-link" to={{ pathname: "/checkPaper" }}>
                            <div className="sb-nav-link-icon"><i className="fas fa-address-card"></i></div>
                            Check Paper
                        </Link>
                    </div>
                </div>
            </nav>
        );
    }
    else if (currentUser && currentUser.role === 'PROCTOR') {
        return (
            <nav className="sb-sidenav accordion sb-sidenav-dark scroll1" id="sidenavAccordion" >
                <div className="sb-sidenav-menu scroll1">
                    <div className="nav scroll1">
                        <div className="sb-sidenav-menu-heading">Main Menu</div>
                        <Link className="nav-link" to={{ pathname: "/proctorHome" }}>
                            <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
                            Home
                        </Link>
                        <Link className="nav-link" to={{ pathname: "/proctorReports" }}>
                            <div className="sb-nav-link-icon"><i className="fas fa-address-card"></i></div>
                            Reports
                        </Link>
                    </div>
                </div>
            </nav>
        );
    }
    else if (currentUser && currentUser.role === 'ADMIN') {
        return (
            <nav className="sb-sidenav accordion sb-sidenav-dark scroll1" id="sidenavAccordion">
                <div className="sb-sidenav-menu scroll1">
                    <div className="nav scroll1">
                        <div className="sb-sidenav-menu-heading">Main Menu</div>
                        <Link className="nav-link" to={{ pathname: "/adminhome" }}>
                            <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
                            Home
                        </Link>
                        <Link className="nav-link" to={{ pathname: "/dashboardReportAdmin" }}>
                            <div className="sb-nav-link-icon"><i className="fas fa-address-card"></i></div>
                            Dashboard Report
                        </Link>
                        <Link className="nav-link" to={{ pathname: "/invigilatorDashboard" }}>
                            <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
                            Invigilator Dashboard
                        </Link>
                        <Link className="nav-link" to={{ pathname: "/examProctoring" }}>
                            <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
                                Exam Proctoring
                        </Link>
                        {currentUser.username === 'admin' ?
                            <>
                                <a className="nav-link collapsed" data-toggle="collapse" data-target="#collapseConfigurations" aria-expanded="false" aria-controls="collapseLayouts">
                                    <div className="sb-nav-link-icon"><i className="fas fa-cogs"></i></div>
                                    General Configurations
                                    <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                                </a>
                                <div className="collapse" id="collapseConfigurations" aria-labelledby="headingOne" data-parent="#sidenavAccordion">
                                    <nav className="sb-sidenav-menu-nested nav">
                                        <Link className="nav-link" to={{ pathname: "/resetDatabase" }}>
                                            <div className="sb-nav-link-icon"><i className="fas fa-tools"></i></div>
                                            Reset Database
                                        </Link>
                                        <Link className="nav-link" to={{ pathname: "/addInstitutes" }}>
                                            <div className="sb-nav-link-icon"><i className="fas fa-university"></i></div>
                                            Add/Upload Institutes
                                        </Link>
                                        <Link className="nav-link" to={{ pathname: "/configHeader" }}>
                                            <div className="sb-nav-link-icon"><i className="fas fa-tools"></i></div>
                                            Configure Header
                                        </Link>
                                        <Link className="nav-link" to={{ pathname: "/configFooter" }}>
                                            <div className="sb-nav-link-icon"><i className="fas fa-tools"></i></div>
                                            Configure Footer
                                        </Link>
                                        <Link className="nav-link" to={{ pathname: "/setInstUrl" }}>
                                            <div className="sb-nav-link-icon"><i className="fas fa-tools"></i></div>
                                            Set Inst Url
                                        </Link>
                                        <Link className="nav-link" to={{ pathname: "/addAdminUser" }}>
                                            <div className="sb-nav-link-icon"><i className="fas fa-tools"></i></div>
                                            Add Admin User
                                        </Link>
                                        <Link className="nav-link" to={{ pathname: "/addSubAdminUser" }}>
                                            <div className="sb-nav-link-icon"><i className="fas fa-tools"></i></div>
                                            Add Sub-Admin
                                        </Link>
                                        <Link className="nav-link" to={{ pathname: "/setDataFolder" }}>
                                            <div className="sb-nav-link-icon"><i className="fas fa-tools"></i></div>
                                            Set Data Folder
                                        </Link>
                                        
                                        {/*<Link className="nav-link" to={{ pathname: "/addGlobController" }}>
                                            <div className="sb-nav-link-icon"><i className="fas fa-tools"></i></div>
                                            Add Global Controller
                                        </Link>
                                        <Link className="nav-link" to={{ pathname: "/addClusterController" }}>
                                            <div className="sb-nav-link-icon"><i className="fas fa-tools"></i></div>
                                            Add Cluster Controller
                                        </Link>
                                        <Link className="nav-link" to={{ pathname: "/addInstitutes" }}>
                                            <div className="sb-nav-link-icon"><i className="fas fa-university"></i></div>
                                            Add/Upload Institutes
                                        </Link>
                                        <Link className="nav-link" to={{ pathname: "/globalClusterAllocation" }}>
                                            <div className="sb-nav-link-icon"><i className="fas fa-university"></i></div>
                                            Global-Cluster Alloc
                                        </Link>
                                        <Link className="nav-link" to={{ pathname: "/instClusterAllocation" }}>
                                            <div className="sb-nav-link-icon"><i className="fas fa-university"></i></div>
                                            Inst-Cluster Alloc
                                        </Link>*/}
                                        <Link className="nav-link" to={{ pathname: "/changeUserPassword" }}>
                                            <div className="sb-nav-link-icon"><i className="fas fa-university"></i></div>
                                            Change Password
                                        </Link>
                                    </nav>
                                </div>
                                <a className="nav-link collapsed" data-toggle="collapse" data-target="#examConfigurations" aria-expanded="false" aria-controls="collapseLayouts">
                                    <div className="sb-nav-link-icon"><i className="fas fa-cogs"></i></div>
                                    Exam Configurations
                                    <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                                </a>
                                <div className="collapse" id="examConfigurations" aria-labelledby="headingOne" data-parent="#sidenavAccordion">
                                    <nav className="sb-sidenav-menu-nested nav">
                                        <Link className="nav-link" to={{ pathname: "/autoEndExam" }}>
                                            <div className="sb-nav-link-icon"><i className="fas fa-hourglass-end"></i></div>
                                            Auto End Exam
                                        </Link>
                                        <Link className="nav-link" to={{ pathname: "/clearsession" }}>
                                            <div className="sb-nav-link-icon"><i className="fas fa-address-card"></i></div>
                                            Clear Session
                                        </Link>
                            
                                        <Link className="nav-link" to={{ pathname: "/clearsessionScript" }}>
                                            <div className="sb-nav-link-icon"><i className="fas fa-address-card"></i></div>
                                            Clear Session Script
                                        </Link>
                                    </nav>
                                </div>
                            </>
                            : null}

                        <Link className="nav-link" to={{ pathname: "/adminreports" }}>
                            <div className="sb-nav-link-icon"><i className="fas fa-clipboard-list"></i></div>
                            Reports
                        </Link>
                        {currentUser.role === 'ADMIN' && currentUser.username !== 'admin' ?
                            <>
                                <a className="nav-link collapsed" data-toggle="collapse" data-target="#proofReadQB" aria-expanded="false" aria-controls="collapseLayouts">
                                    <div className="sb-nav-link-icon"><i className="fas fa-book-reader"></i></div>
                                    Proof Read QB
                                    <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                                </a>
                                <div className="collapse" id="proofReadQB" aria-labelledby="headingOne" data-parent="#sidenavAccordion">
                                    <nav className="sb-sidenav-menu-nested nav">
                                        <Link className="nav-link" to={{ pathname: "/examPreView" }}>
                                            <div className="sb-nav-link-icon"><i className="fas fa-binoculars"></i></div>
                                            Exam Preview
                                        </Link>
                                        <Link className="nav-link" to={{ pathname: "/examListView" }}>
                                            <div className="sb-nav-link-icon"><i className="fas fa-clipboard-list"></i></div>
                                            Exam Listview
                                        </Link>
                                    </nav>
                                </div>
                            </>
                            : null}
                    </div>
                </div>
            </nav>
        );
    }
    else if (currentUser && currentUser.role === 'EADMIN') {
        return (
            <nav className="sb-sidenav accordion sb-sidenav-dark scroll1" id="sidenavAccordion" >
                <div className="sb-sidenav-menu scroll1">
                    <div className="nav scroll1">
                        <div className="sb-sidenav-menu-heading">Main Menu</div>
                        <Link className="nav-link" to={{ pathname: "/insthome" }}>
                            <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
                            Home
                        </Link>
                        <Link className="nav-link" to={{ pathname: "/myExamDashboard" }}>
                            <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
                            Exam Dashboard
                        </Link>
                        <Link className="nav-link" to={{ pathname: "/invigilatorDashboard" }}>
                            <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
                            Invigilator Dashboard
                        </Link>
                        <Link className="nav-link" to={{ pathname: "/examProctoring" }}>
                            <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
                                Exam Proctoring
                        </Link>
                        <a className="nav-link collapsed" data-toggle="collapse" data-target="#examConfigurations" aria-expanded="false" aria-controls="collapseLayouts">
                            <div className="sb-nav-link-icon"><i className="fas fa-cogs"></i></div>
                            Exam Configurations
                            <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                        </a>
                        <div className="collapse" id="examConfigurations" aria-labelledby="headingOne" data-parent="#sidenavAccordion">
                            <nav className="sb-sidenav-menu-nested nav">
                                <Link className="nav-link" to={{ pathname: "/programMaster" }}>
                                    <div className="sb-nav-link-icon"><i className="fas fa-list-alt"></i></div>
                                    Program Master
                                </Link>
                                <Link className="nav-link" to={{ pathname: "/subProgramMaster" }}>
                                    <div className="sb-nav-link-icon"><i className="fas fa-list-alt"></i></div>
                                    Sub Program Master
                                </Link>
                                <Link className="nav-link" to={{ pathname: "/subjectMaster" }}>
                                    <div className="sb-nav-link-icon"><i className="fas fa-list-alt"></i></div>
                                    Subject Master
                                </Link>
                                {/* Newly Added */}
                                <Link className="nav-link" to={{ pathname: "/uploadStudyMaterial" }}>
                                    <div className="sb-nav-link-icon"><i className="fas fa-list-alt"></i></div>
                                    Upload Study Material
                                </Link>

                                <Link className="nav-link" to={{ pathname: "/addTest" }}>
                                    <div className="sb-nav-link-icon"><i className="fas fa-list-alt"></i></div>
                                    Add Test
                                </Link>
                                <Link className="nav-link" to={{ pathname: "/configGenericTest" }}>
                                    <div className="sb-nav-link-icon"><i className="fas fa-list-alt"></i></div>
                                    Configure Test
                                </Link>
                                <Link className="nav-link" to={{ pathname: "/studentMaster" }}>
                                    <div className="sb-nav-link-icon"><i className="fas fa-list-alt"></i></div>
                                    Student Master
                                </Link>

                                <Link className="nav-link" to={{ pathname: "/addProctor" }}>
                                    <div className="sb-nav-link-icon"><i className="fas fa-list-alt"></i></div>
                                    Add Proctor
                                </Link>


                                <Link className="nav-link" to={{ pathname: "/addQuestChecker" }}>
                                    <div className="sb-nav-link-icon"><i className="fas fa-list-alt"></i></div>
                                    Add Qust Checker
                                </Link>


                                <Link className="nav-link" to={{ pathname: "/addPaperSetter" }}>
                                    <div className="sb-nav-link-icon"><i className="fas fa-list-alt"></i></div>
                                    Add Papper Setter
                                </Link>
                            </nav>
                        </div>

                        <a className="nav-link collapsed" data-toggle="collapse" data-target="#endReset" aria-expanded="false" aria-controls="collapseLayouts">
                            <div className="sb-nav-link-icon"><i className="fas fa-cogs"></i></div>
                            End/Reset Facilities
                            <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                        </a>
                        <div className="collapse" id="endReset" aria-labelledby="headingOne" data-parent="#sidenavAccordion">
                            <nav className="sb-sidenav-menu-nested nav">
                                <Link className="nav-link" to={{ pathname: "/autoEndExam" }}>
                                    <div className="sb-nav-link-icon"><i className="fas fa-hourglass-end"></i></div>
                                    Auto End Exam
                                </Link>
                                <Link className="nav-link" to={{ pathname: "/resetExam" }}>
                                    <div className="sb-nav-link-icon"><i className="fas fa-list-alt"></i></div>
                                    Reset Examination
                                </Link>
                                <Link className="nav-link" to={{ pathname: "/resetTime" }}>
                                    <div className="sb-nav-link-icon"><i className="fas fa-hourglass-end"></i></div>
                                    Reset Exam Time
                                </Link>
                                <Link className="nav-link" to={{ pathname: "/clearsession" }}>
                                    <div className="sb-nav-link-icon"><i className="fas fa-address-card"></i></div>
                                    Clear Session
                                </Link>
                                <Link className="nav-link" to={{ pathname: "/clearsessionScript" }}>
                                    <div className="sb-nav-link-icon"><i className="fas fa-address-card"></i></div>
                                    Clear Session Script
                                </Link>
                            </nav>
                        </div>

                        <a className="nav-link collapsed" data-toggle="collapse" data-target="#questionBanks" aria-expanded="false" aria-controls="collapseLayouts">
                            <div className="sb-nav-link-icon"><i className="fas fa-cogs"></i></div>
                            Question Banks
                            <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                        </a>
                        <div className="collapse" id="questionBanks" aria-labelledby="headingOne" data-parent="#sidenavAccordion">
                            <nav className="sb-sidenav-menu-nested nav">
                                <Link className="nav-link" to={{ pathname: "/questionBank" }}>
                                    <div className="sb-nav-link-icon"><i className="fas fa-list-alt"></i></div>
                                    Objective QB
                                </Link>
                                <Link className="nav-link" to={{ pathname: "/subjectiveQB" }}>
                                    <div className="sb-nav-link-icon"><i className="fas fa-list-alt"></i></div>
                                    Subjective QB
                                </Link>
                            </nav>
                        </div>


                        <a className="nav-link collapsed" data-toggle="collapse" data-target="#proofReadQB" aria-expanded="false" aria-controls="collapseLayouts">
                            <div className="sb-nav-link-icon"><i className="fas fa-book-reader"></i></div>
                            Proof Read QB
                            <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                        </a>
                        <div className="collapse" id="proofReadQB" aria-labelledby="headingOne" data-parent="#sidenavAccordion">
                            <nav className="sb-sidenav-menu-nested nav">
                                <Link className="nav-link" to={{ pathname: "/examPreView" }}>
                                    <div className="sb-nav-link-icon"><i className="fas fa-binoculars"></i></div>
                                    Exam Preview
                                </Link>
                                <Link className="nav-link" to={{ pathname: "/examListView" }}>
                                    <div className="sb-nav-link-icon"><i className="fas fa-clipboard-list"></i></div>
                                    Exam Listview
                                </Link>
                            </nav>
                        </div>


                        <a className="nav-link collapsed" data-toggle="collapse" data-target="#examAllocations" aria-expanded="false" aria-controls="collapseLayouts">
                            <div className="sb-nav-link-icon"><i className="fas fa-cogs"></i></div>
                            Allocations
                            <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                        </a>
                        <div className="collapse" id="examAllocations" aria-labelledby="headingOne" data-parent="#sidenavAccordion">
                            <nav className="sb-sidenav-menu-nested nav">
                                <Link className="nav-link" to={{ pathname: "/studSubjectAlloc" }}>
                                    <div className="sb-nav-link-icon"><i className="fas fa-list-alt"></i></div>
                                    Stud Subject Alloc
                                </Link>
                                <Link className="nav-link" to={{ pathname: "/studProctorAlloc" }}>
                                    <div className="sb-nav-link-icon"><i className="fas fa-list-alt"></i></div>
                                    Stud Proctor Alloc
                                </Link>
                                <Link className="nav-link" to={{ pathname: "/uploadStudProctor" }}>
                                    <div className="sb-nav-link-icon"><i className="fas fa-list-alt"></i></div>
                                    Upload Proctor Alloc
                                </Link>
                                <Link className="nav-link" to={{ pathname: "/studCheckerAlloc" }}>
                                    <div className="sb-nav-link-icon"><i className="fas fa-list-alt"></i></div>
                                    Stud Checker Alloc
                                </Link>
                            </nav>
                        </div>




                        <Link className="nav-link" to={{ pathname: "/instreports" }}>
                            <div className="sb-nav-link-icon"><i className="fas fa-clipboard-list" aria-hidden="true"></i></div>
                            Reports
                        </Link>
                    </div>
                </div>
            </nav>
        );
    }
    else if (currentUser && currentUser.role === 'GADMIN') {
        return (
            <nav className="sb-sidenav accordion sb-sidenav-dark scroll1" id="sidenavAccordion" >
                <div className="sb-sidenav-menu scroll1">
                    <div className="nav scroll1">
                        <div className="sb-sidenav-menu-heading">Main Menu</div>
                        <Link className="nav-link" to={{ pathname: "/gadminhome" }}>
                            <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
                            Home
                        </Link>
                    </div>
                </div>
            </nav>
        );
    }
    else if (currentUser && currentUser.role === 'PAPERSETTER') {
        return (
            <nav className="sb-sidenav accordion sb-sidenav-dark scroll1" id="sidenavAccordion" >
                <div className="sb-sidenav-menu scroll1">
                    <div className="nav scroll1">
                        <div className="sb-sidenav-menu-heading">Main Menu</div>
                        <Link className="nav-link" to={{ pathname: "/setterHome" }}>
                            <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
                            Home
                        </Link>
                        <Link className="nav-link" to={{ pathname: "/questionBank" }}>
                            <div className="sb-nav-link-icon"><i className="fas fa-list-alt"></i></div>
                            Objective QB
                        </Link>
                        <Link className="nav-link" to={{ pathname: "/subjectiveQB" }}>
                            <div className="sb-nav-link-icon"><i className="fas fa-list-alt"></i></div>
                            Subjective QB
                        </Link>
                    </div>
                </div>
            </nav>
        );
    }
    else if (currentUser && currentUser.role === 'CADMIN') {
        return (
            <nav className="sb-sidenav accordion sb-sidenav-dark scroll1" id="sidenavAccordion" >
                <div className="sb-sidenav-menu scroll1">
                    <div className="nav scroll1">
                        <div className="sb-sidenav-menu-heading">Main Menu</div>
                        <Link className="nav-link" to={{ pathname: "/cadminhome" }}>
                            <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
                            Home
                        </Link>

                        <a className="nav-link collapsed" data-toggle="collapse" data-target="#collapseConfigurations" aria-expanded="false" aria-controls="collapseLayouts">
                            <div className="sb-nav-link-icon"><i className="fas fa-cogs"></i></div>
                            Configurations
                            <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                        </a>
                        <div className="collapse" id="collapseConfigurations" aria-labelledby="headingOne" data-parent="#sidenavAccordion">
                            <nav className="sb-sidenav-menu-nested nav">
                                <Link className="nav-link" to={{ pathname: "/addInstitutes" }}>
                                    <div className="sb-nav-link-icon"><i className="fas fa-university"></i></div>
                                    Add/Upload Institutes
                                </Link>
                            </nav>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }
    else if (currentUser && currentUser.role === 'SUBADMIN') {
        return (
            <nav className="sb-sidenav accordion sb-sidenav-dark scroll1" id="sidenavAccordion" >
                <div className="sb-sidenav-menu scroll1">
                    <div className="nav scroll1">
                        <div className="sb-sidenav-menu-heading">Main Menu</div>
                        <Link className="nav-link" to={{ pathname: "/subAdminHome" }}>
                            <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
                            Home
                        </Link>
                        <Link className="nav-link" to={{ pathname: "/adminreports" }}>
                            <div className="sb-nav-link-icon"><i className="fas fa-clipboard-list"></i></div>
                            Reports
                        </Link>
                    </div>
                </div>
            </nav>
        );
    }
    else {
        return (
            <nav className="sb-sidenav accordion sb-sidenav-dark scroll1" id="sidenavAccordion" >
                <div className="sb-sidenav-menu scroll1">
                    <div className="nav scroll1">
                        <div className="sb-sidenav-menu-heading">Main Menu</div>
                        <Link className="nav-link" to={{ pathname: "/login" }}>
                            <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
                            Home
                        </Link>
                    </div>
                </div>
            </nav>
        );
    }
}

export default Sidebar;
