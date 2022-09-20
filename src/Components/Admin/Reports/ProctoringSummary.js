import React, {useContext} from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import Moment from 'react-moment';
import { UserContext } from '../../../App';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


const ProctoringSummary = ({ data, dateSlot }) => {
    const header = getHeader(data[0]);
    const data1 = getData(data);
    const { currentUser } = useContext(UserContext);

    const options = {
        sizePerPageList: [
            {
                text: '50', value: 50
            },
            {
                text: '500', value: 500
            },
            {
                text: '1000', value: 1000
            },
            {
                text: '10000', value: 10000
            }
        ]
    };

    return (
        <div className="col-lg-12 scroll1" style={{ "overflow": "auto" }}>
            <div className="col-lg-12" style={{ "marginBottom": "10px" }}>
                <center>
                    <button className="btn btn-success" onClick={() => {
                        printPdf(data1,currentUser,dateSlot);
                    }}>Export to Pdf</button>
                </center>
            </div>
            <BootstrapTable keyField='srno' data={data1} columns={header} filter={filterFactory()} pagination={paginationFactory(options)} />
        </div>
    );
};

function printPdf(proctorData,currentUser,dateSlot)
{
    let date = dateSlot.split(':$:')[0];
    let slot = dateSlot.split(':$:')[1];

    let myData = [];
    let i = 1;
    proctorData.map((data, index) => 
    {
        let start = data.start ? new Date(parseInt(data.start)) :'';
        let end = data.end ? new Date(parseInt(data.end)) :'';
        myData.push(
                [i++,data.enrollno,data.name,data.subject,start,end,data.one,data.two,data.three,data.four,data.five,data.six,data.seven,data.eight]
        )
    });

    const doc = new jsPDF('landscape','mm','a4');
    let pageHeight= doc.internal.pageSize.height;
    doc.text("Proctoring Summary Report", 130, 7);
    doc.setFontSize(7);
    doc.text('Slot:'+slot, 15, 12);
    doc.setFontSize(9);
    doc.text('Institute: '+currentUser.college_name, 15, 17);
    doc.text('Proctor: '+currentUser.username, 15, 22);

    doc.autoTable({
        head: [['Sr.No.', 'EnrollNo', 'Student Name','Subject','Start Time','End Time','1A','1B','1C','1D','2A','2B','3A','4A']],
        body: myData,
        startY : 27,
    });

    let finalY = doc.lastAutoTable.finalY+35;
    if (finalY >= pageHeight)
    {
        doc.addPage();
        finalY = 30;
    }
    doc.setFontSize(12);
    doc.text(10, finalY-20, 'Proctor Name');
    doc.text(230, finalY-20, 'Proctor Signature');

    doc.text(10, finalY-5, 'Date: '+new Date().toLocaleString());
    doc.text(230, finalY-5, 'Officer Incharge,Examination');
      
    doc.save('Proctoring Summary Report.pdf');
}

function convertTimestamp(timestamp) {
    var d = new Date(timestamp * 1000),	// Convert the passed timestamp to milliseconds
          yyyy = d.getFullYear(),
          mm = ('0' + (d.getMonth() + 1)).slice(-2),	// Months are zero based. Add leading 0.
          dd = ('0' + d.getDate()).slice(-2),			// Add leading 0.
          hh = d.getHours(),
          h = hh,
          min = ('0' + d.getMinutes()).slice(-2),		// Add leading 0.
          ampm = 'AM',
          time;
              
      if (hh > 12) {
          h = hh - 12;
          ampm = 'PM';
      } else if (hh === 12) {
          h = 12;
          ampm = 'PM';
      } else if (hh == 0) {
          h = 12;
      }
      
      // ie: 2013-02-18, 8:35 AM	
      time = yyyy + '-' + mm + '-' + dd + ', ' + h + ':' + min + ' ' + ampm;
          
      return time;
  }

function getHeader(data) {
    let myHeader = null;
    if (data.warningType == '0') {
        myHeader = [
            { text: 'Sr No', dataField: 'srno' },
            { text: 'Enrollment No', dataField: 'enrollno', filter: textFilter() },
            { text: 'Student Name', dataField: 'name' },
            { text: 'Subject', dataField: 'subject', filter: textFilter() },
            { text: 'Start Time', dataField: 'starttime' },
            { text: 'End Time', dataField: 'endtime' },
            { text: 'Warning1', dataField: '1' },
            { text: 'Warning2', dataField: '2' },
            { text: 'Warning3', dataField: '3' },
            { text: 'Warning4', dataField: '4' },
            { text: 'Warning5', dataField: '5' },
            { text: 'Warning6', dataField: '6' },
            { text: 'Warning7', dataField: '7' },
            { text: 'Warning8', dataField: '8' },
            { text: 'Warning9', dataField: '9' },
            { text: 'Warning10', dataField: '10' },
            { text: 'Warning11', dataField: '11' },
        ];
    }
    else {
        myHeader = [
            { text: 'Sr No', dataField: 'srno' },
            { text: 'Enrollment No', dataField: 'enrollno', filter: textFilter() },
            { text: 'Student Name', dataField: 'name' },
            { text: 'Subject', dataField: 'subject', filter: textFilter() },
            { text: 'Start Time', dataField: 'starttime' },
            { text: 'End Time', dataField: 'endtime' },
            { text: 'Warning 1A', dataField: 'one' },
            { text: 'Warning 1B', dataField: 'two' },
            { text: 'Warning 1C', dataField: 'three' },
            { text: 'Warning 1D', dataField: 'four' },
            { text: 'Warning 2A', dataField: 'five' },
            { text: 'Warning 2B', dataField: 'six' },
            { text: 'Warning 3A', dataField: 'seven' },
            { text: 'Warning 4A', dataField: 'eight' },
        ];
    }

    return myHeader;
}

function getData(myData) {
    let rowData = [];
    let i = 1;

    myData.map((data, index) => {
        if (data.warningType == '0') {
            rowData.push({
                srno: i++,
                enrollno: data[0].enroll,
                name: data[0].name,
                subject: data[0].subject,
                starttime: data[0].examstart ? <Moment format="YYYY-MM-DD, H:mm:ss A">{data[0].examstart}</Moment> : '',
                endtime: data[0].examend ? <Moment format="YYYY-MM-DD, H:mm:ss A">{data[0].examend}</Moment> : '',
                one: data[0].one,
                two: data[0].two,
                three: data[0].three,
                four: data[0].four,
                five: data[0].five,
                six: data[0].six,
                seven: data[0].seven,
                eight: data[0].eight,
                nine: data[0].nine,
                ten: data[0].ten,
                eleven: data[0].eleven,
                start:data[0].examstart,
                end:data[0].examend,
            });
        }
        else {
            rowData.push({
                srno: i++,
                enrollno: data[0].enroll,
                name: data[0].name,
                subject: data[0].subject,
                starttime: data[0].examstart ? <Moment format="YYYY-MM-DD, H:mm:ss A">{data[0].examstart}</Moment> : '',
                endtime: data[0].examend ? <Moment format="YYYY-MM-DD, H:mm:ss A">{data[0].examend}</Moment> : '',
                one: data[0].one,
                two: data[0].two,
                three: data[0].three,
                four: data[0].four,
                five: data[0].five,
                six: data[0].six,
                seven: data[0].seven,
                eight: data[0].eight,
                start:data[0].examstart,
                end:data[0].examend,
            });
        }
    })
    return rowData;
}

export default ProctoringSummary;