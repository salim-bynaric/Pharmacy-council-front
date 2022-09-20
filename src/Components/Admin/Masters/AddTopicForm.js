import React, { useState, useContext } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import API from "../../../api";
import { ShowContext } from "../../../App";

const AddTopicForm = (props) => {
  const examMode = props.examMode;
  let modeVal = "";
  if (examMode === "subjective") {
    modeVal = "S";
  } else if (examMode === "objective") {
    modeVal = "O";
  } else if (examMode === "both") {
    modeVal = "B";
  }

  const [mySection, setMySection] = useState(
    props.subjectData.section !== null ? props.subjectData.section : ""
  );

  const [mySectionFlg, setMySectionFlg] = useState(
    props.subjectData !== undefined &&
      props.subjectData.examCategory === "sectional"
      ? true
      : false
  );

  const sectionNames =
    props.subjectData !== undefined &&
    props.subjectData !== null &&
    props.subjectData.sectionNames !== null
      ? props.subjectData.sectionNames.split(",")
      : "";

  const [myMsg, setMyMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [topics1, setTopics] = useState([]);
  const [subtopics1, setSubTopics] = useState([]);
  const myInitialValues = {
    paperId: "",
    topic: "",
    subTopic: "",
    questMode: modeVal,
    questType: "",
    questions: "",
    marks: "",
    sectionFlg: mySectionFlg,
    section: mySection,
  };
  const { setShow, setMsg } = useContext(ShowContext);
  const paperId = props.paperId;
  const paperCode = props.paperCode;
  const paperName = props.paperName;

  return !loading && props && props.examMode !== undefined ? (
    <Formik
      initialValues={myInitialValues}
      onSubmit={async (values, actions) => {
        saveTopics(
          values,
          setLoading,
          setShow,
          setMsg,
          setMyMsg,
          props.setMyList,
          props.myList
        );
        actions.setSubmitting(false);
        actions.resetForm({
          values: {
            paperId: "",
            topic: "",
            subTopic: "",
            questMode: modeVal,
            questType: "",
            questions: "",
            marks: "",
          },
        });
      }}
      validationSchema={Yup.object({
        paperId: Yup.number().required("Subject is Required"),
        topic: Yup.number().required("Topic number is Required."),
        subTopic: Yup.number(),
        questMode: Yup.string().required("Question Mode is Required."),
        questType: Yup.string(),
        questions: Yup.number().required("Number of Questions are Required"),
        marks: Yup.number().required("Marks Per Question is Required"),
        sectionFlg: Yup.boolean(),
        section: Yup.string().when("sectionFlg", {
          is: (val) => (val === true ? true : false),
          then: Yup.string().required("Section is Required..."),
        }),
      })}
    >
      {(props) => {
        const {
          values,
          errors,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit,
        } = props;
        return (
          <div className="col-xl-12">
            <form
              id="form-Topic"
              method="post"
              className="form-horizontal"
              onSubmit={handleSubmit}
            >
              <div className="card mb-4">
                <div className="card-header">
                  <i className="fas fa-address-card mr-1" />
                  Add Topics Form
                </div>
                <div className="card-body">
                  <div className="form-group">
                    <div className="col-lg-12 row">
                      <div className="col-lg-4">Select Subject</div>
                      <div className="col-lg-8">
                        <select
                          id="paperId"
                          name="paperId"
                          className="form-control"
                          onChange={(e) => {
                            handleChange(e);
                            getTopicsSubtopics(
                              e.target.value,
                              setShow,
                              setMsg,
                              setTopics,
                              setSubTopics
                            );
                          }}
                          onBlur={handleBlur}
                          value={values.paperId}
                        >
                          <option value="">Select Subject</option>
                          <option value={paperId}>
                            ({paperCode}) {paperName}
                          </option>
                        </select>

                        {errors.paperId ? (
                          <div className="alert alert-info">
                            {errors.paperId}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="col-lg-12 row">
                      <div className="col-lg-4">Select Topic</div>
                      <div className="col-lg-8">
                        <select
                          id="topic"
                          name="topic"
                          className="form-control"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.topic}
                        >
                          <option value="">Select Topic</option>
                          {topics1.map((value, index) => (
                            <option key={index} value={value}>
                              {value}
                            </option>
                          ))}
                        </select>

                        {errors.topic ? (
                          <div className="alert alert-info">{errors.topic}</div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="col-lg-12 row">
                      <div className="col-lg-4">Select Sub Topic</div>
                      <div className="col-lg-8">
                        <select
                          id="subTopic"
                          name="subTopic"
                          className="form-control"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.subTopic}
                        >
                          <option value="">Select Sub Topic</option>
                          {subtopics1.map((value, index) => (
                            <option key={index} value={value}>
                              {value}
                            </option>
                          ))}
                        </select>

                        {errors.subTopic ? (
                          <div className="alert alert-info">
                            {errors.subTopic}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="col-lg-12 row">
                      <div className="col-lg-4">Select Question Mode</div>
                      <div className="col-lg-8">
                        <select
                          id="questMode"
                          name="questMode"
                          className="form-control"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.questMode}
                          disabled={modeVal !== "B" ? true : false}
                        >
                          <option value="">Select Question Mode</option>
                          <option value="O">Objective</option>
                          <option value="S">Subjective</option>
                        </select>

                        {errors.questMode ? (
                          <div className="alert alert-info">
                            {errors.questMode}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="col-lg-12 row">
                      <div className="col-lg-4">Select Question Type</div>
                      <div className="col-lg-8">
                        <select
                          id="questType"
                          name="questType"
                          className="form-control"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.questType}
                        >
                          <option value="">Select Question Type</option>
                          <option value="R">R</option>
                          <option value="U">U</option>
                          <option value="A">A</option>
                        </select>

                        {errors.questType ? (
                          <div className="alert alert-info">
                            {errors.questType}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="col-lg-12 row">
                      <div className="col-lg-4">Enter Number of Questions</div>
                      <div className="col-lg-8">
                        <input
                          type="text"
                          id="questions"
                          name="questions"
                          onChange={handleChange}
                          value={values.questions}
                          onBlur={handleBlur}
                          className="form-control"
                          placeholder="Enter Number of Questions..."
                        />

                        {errors.questions ? (
                          <div className="alert alert-info">
                            {errors.questions}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="col-lg-12 row">
                      <div className="col-lg-4">Enter Marks/Question</div>
                      <div className="col-lg-8">
                        <input
                          type="text"
                          id="marks"
                          name="marks"
                          onChange={handleChange}
                          value={values.marks}
                          onBlur={handleBlur}
                          className="form-control"
                          placeholder="Enter Marks Per Question..."
                        />

                        {errors.marks ? (
                          <div className="alert alert-info">{errors.marks}</div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  {mySectionFlg &&
                  mySection !== "" &&
                  sectionNames.length > 0 ? (
                    <div className="form-group">
                      <div className="col-lg-12 row">
                        <div className="col-lg-4">Select Section</div>
                        <div className="col-lg-8">
                          <select
                            id="section"
                            name="section"
                            className="form-control"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.section}
                          >
                            <option value="">Select Section</option>
                            {sectionNames.map((value, index) => (
                              <option key={index} value={value}>
                                {value}
                              </option>
                            ))}
                          </select>
                          {errors.section ? (
                            <div className="alert alert-info">
                              {errors.section}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
                <div className="card-footer">
                  <div className="form-group">
                    <center>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSubmitting}
                      >
                        Submit
                      </button>
                    </center>
                  </div>

                  {myMsg !== "" && (
                    <div className="alert alert-dark animate__animated animate__tada animate_slower">
                      {myMsg}
                    </div>
                  )}

                  {loading && <div className="custom-loader"></div>}
                </div>
              </div>
            </form>
          </div>
        );
      }}
    </Formik>
  ) : null;
};

async function getTopicsSubtopics(
  value,
  setShow,
  setMsg,
  setTopics,
  setSubTopics
) {
  let data = null;
  let topicArray = [];
  let subTopicArray = [];

  await API.get("/questions/" + value, {
    params: { type: "getAllQuestionsByPaperCode" },
  })
    .then((res) => {
      if (res.data.status === "success") {
        data = [...res.data.data];
        if (data.length > 0) {
          data.forEach((row) => {
            topicArray.push(row.topic);
            subTopicArray.push(row.subtopic);
          });
        } else {
          topicArray.push(0);
          subTopicArray.push(0);
        }
      } else {
        setShow(true);
        setMsg(res.data.message);
      }
      topicArray = [...new Set(topicArray)];
      subTopicArray = [...new Set(subTopicArray)];

      setTopics(topicArray);
      setSubTopics(subTopicArray);
    })
    .catch(function (error) {
      setShow(true);
      setMsg(error.response.data.message);
      setTopics(topicArray);
      setSubTopics(subTopicArray);
    });
}

async function saveTopics(
  values,
  setLoading,
  setShow,
  setMsg,
  setMyMsg,
  setMyList,
  myList
) {
  setLoading(true);
  let paperId = values.paperId;
  let topic = values.topic;
  let subTopic = values.subTopic;
  let questMode = values.questMode;
  let questType = values.questType;
  let questions = values.questions;
  let marks = values.marks;
  let section = values.section;

  await API.post("/subject/topic", {
    paperId: paperId,
    topic: topic,
    subTopic: subTopic,
    questType: questType,
    questions: questions,
    marks: marks,
    questMode: questMode,
    section:section,
  })
    .then((res) => {
      if (res.data.status === "success") {
        setMyMsg(res.data.message);
        setLoading(false);
        setMyList(!myList);
      } else {
        setMyMsg(res.data.message);
        setLoading(false);
        setMyList(!myList);
      }
    })
    .catch(function (error) {
      setMyMsg(error.response.data.message);
      setLoading(false);
    });
}

export default AddTopicForm;
