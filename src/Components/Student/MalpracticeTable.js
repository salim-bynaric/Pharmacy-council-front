import React from 'react';

const MalpracticeTable = () => {
    return (
        <div style={{overflow:"auto"}}>
            <center>
                <h6><b>MALPRACTICE CASES CORRESPONDING WARNINGS AND PUNISHMENTS AS PER RECOMMENDATIONS AND APPROVAL OF HIGHER AUTHORITIES</b></h6>
            </center>
            <table className="table table-bordered">
                <thead>
                <tr style={{"backgroundColor":"aqua"}}>
                    <th>Malpractice Number</th>
                    <th>Suspicious Action</th>
                    <th>Warning Message</th>
                    <th>QUANTUM of PUNISHMENT as per SPC Recommendations & approval</th>
                </tr>
                </thead>
                <tbody>
                    <tr>
                        <td rowSpan={4}>1</td>
                        <td>
                            a)Examinee Not visible on camera due to bad or improper light
                        </td>
                        <td>
                            You will be booked for malpractice if you do not adjust light so that your image is visible in the window on the examination screen.
                        </td>
                        <td rowSpan={4}>
                            In case, the examinee fails to comply in spite of being warned for more than 3 times under Malpractice Number-1, during the online examination of a subject/course.He/She shall be liable to a punishment of Cancellation of the performance of the examines in that subject/course for the ongoing examination.Punishment Nomenclature : (Subject/Course)
                        </td>
                    </tr>
                    <tr>
                        <td>
                            b)Examinee not seen on the screen
                        </td>
                        <td>
                            You will be booked for malpractice if you are not seen on screen again.
                        </td>
                    </tr>
                    <tr>
                        <td>
                            c)The camera turned away from the face of examinee
                        </td>
                        <td>
                            You will be booked for malpractice if you do not correct camera position.
                        </td>
                    </tr>
                    <tr>
                        <td>
                            d)Camera covered to obstruct vision.
                        </td>
                        <td>
                            You will be booked for malpractice if you do not remove the cover over camera.
                        </td>
                    </tr>
                    <tr>
                        <td rowSpan={2}>2</td>
                        <td>
                            a)Examinee observed in possession and use of communication device / electronic gadget/mobile phone / smart watch / tablet / I pad / earphone etc. during the examination.
                        </td>
                        <td>
                            You will be booked for malpractice if you are again seen in possession of electronic device / gadget not permitted during the examination.
                        </td>
                        <td rowSpan={2}>
                            In case the examinee fails to comply even after being warned for more than 2 times under Malpractice Number-2, he/she shall be liable to a punishment of Cancellation of the performance of the examinee in that subject/course in the ongoing examination.Punishment Nomenclature : (Subject/Course)
                        </td>
                    </tr>
                    <tr>
                        <td>
                            b)Examinee observed in possession and referring to books, notes, web-sources or any other material or means to retrieve answers during the examination
                        </td>
                        <td>
                            You will be booked for malpractice if you are again seen in possession of book / notes/ web sources not permitted during the examination.
                        </td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td>
                            Additional person/s apart from the examinee is/are seen collaborating with examinee during the examination.
                        </td>
                        <td>
                            You will be booked for malpractice if you are again seen with additional person/s during the examination.
                        </td>
                        <td>
                            In case the examinee fails to comply even after being warned for more than 2 times under Malpractice Number-3, he/she shall be liable to a punishment of Cancellation of the performance of the examinee in all the subjects/courses for which he/she appeared in the current examination. Punishment Nomenclature : (1+0) (Applied on the Enrollment Number of the examinee.)
                        </td>
                    </tr>
                    <tr>
                        <td>4</td>
                        <td>
                            A person other than the designated examinee as shown in photograph on the hall ticket is seen attempting the examination.
                        </td>
                        <td>
                            You will be booked for serious malpractice of impersonation in the examination if person other than designated examinee is noticed on the screen again.
                        </td>
                        <td>
                            In case the examinee fails to comply even after being warned once, he/she shall be liable to a punishment of Cancellation of the performance of the examinee in all the subjects/courses for which he/she appeared simultaneously, as regular/ex-student in the current examination. Punishment Nomenclature: (1+0) (Applied on the Enrollment Number of the examinee.)mination. Punishment Nomenclature : (1+0) (Applied on the Enrollment Number of the examinee.)
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default MalpracticeTable;