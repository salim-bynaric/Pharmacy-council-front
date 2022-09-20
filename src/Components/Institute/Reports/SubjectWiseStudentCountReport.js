import React, { useState, useEffect, useContext } from "react";
import { UserContext, ShowContext } from "../../../App";
import BootstrapTable from 'react-bootstrap-table-next';
import API from '../../../api';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';

const SubjectWiseStudentCountReport = () => {
  const { setShow, setMsg } = useContext(ShowContext);
  const { currentUser } = useContext(UserContext);
  const [data, setData] = useState();

  useEffect(() => {
    if (currentUser) {
      getSubjectWiseStudData(setShow, setMsg, currentUser, setData);
    }
  }, [currentUser]);

  const header                                    =   getHeader();
  const data1                                     =   getData(data);

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

  return currentUser ? (
    <div>
      <div className="container-fluid">
        <br />
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item active">
            Subject Wise Student Count Report
          </li>
        </ol>
        <div className="row animate__animated animate__pulse animate_slower">
          <div className="col-xl-12">
            {data !== undefined && data.length > 0 ? 
                <BootstrapTable keyField='srno' data={ data1 } columns={ header } filter={ filterFactory() } pagination={ paginationFactory(options) }/>
             : null}
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

function getData(testData)
{
    let myData = [];
    let i = 1;
    if(testData !== undefined && testData.length > 0)
    {
        testData.map((data, index) => 
        {
            myData.push({
                srno                    : i++,
                paperCode               : '('+data.subject.paper_code+') '+data.subject.paper_name,
                total                   : data.count,
            });
        })

        return myData;
    }
}

function getHeader()
{
    let myHeader = [
        { text: 'Sr No', dataField: 'srno'},
        { text: 'Paper Code/Name', dataField: 'paperCode',filter: textFilter()},
        { text: 'Total Students', dataField: 'total'},
    ];
    return myHeader;
}

async function getSubjectWiseStudData(setShow, setMsg, currentUser, setData) {
  let param = null;
  if (currentUser.role === "ADMIN") {
    if (currentUser.username === "admin") {
      param = { params: { instId: "all" } };
    } else {
      param = { params: { instId: currentUser.inst_id } };
    }
  } else if (currentUser.role === "EADMIN") {
    param = { params: { instId: currentUser.inst_id } };
  }

  await API.get("/report/subjectWiseStudCount", param)
    .then((res) => {
        if(res.data.status === 'success')
        {
            setData(res.data.data);
        }
    })
    .catch(function (error) {
        setShow(true);
        setMsg(error.response.data.message);
    });
}

export default SubjectWiseStudentCountReport;
