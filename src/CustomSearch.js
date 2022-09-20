import React, { useContext } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { ShowContext } from './App';

function CustomSearch(props) {
    let searchParam = props.searchParam;
    const { setShow, setMsg } = useContext(ShowContext);
    let placeholder = "Enter " + searchParam.toString().toUpperCase().replace(/_/g, " ");

    return (
        <>
            <Formik
                initialValues={{ mySearch: "" }}
                onSubmit={async (values, actions) => {
                    await props.searchMethod(values.mySearch, props.dataSetter, setShow, setMsg,props.currentUser);
                    actions.setSubmitting(false);
                    actions.resetForm({
                        values: {
                            mySearch: '',
                        },
                    });
                }}
                validationSchema={Yup.object().shape({
                    mySearch: Yup.string()
                        .required("Search Value Can not be left Blank...")
                })}

            >
                {
                    props => {
                        const {
                            values,
                            touched,
                            errors,
                            isSubmitting,
                            handleChange,
                            handleBlur,
                            handleSubmit
                        } = props;

                        return (
                            <div className="col-lg-12">
                                <form onSubmit={handleSubmit}>
                                    <div className="input-group">
                                        <input
                                            className="form-control"
                                            type="text"
                                            name="mySearch"
                                            id="mySearch"
                                            placeholder={placeholder}
                                            value={values.mySearch}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                        />
                                        <div className="input-group-append">
                                            <button type="button" className="btn btn-primary" type="submit" disabled={isSubmitting}><i className="fas fa-search"></i></button>
                                        </div>
                                        {errors.mySearch && touched.mySearch && (
                                            <div className="alert alert-info col-lg-12">{errors.mySearch}</div>
                                        )}
                                    </div>
                                </form>
                            </div>
                        );
                    }
                }
            </Formik>
        </>
    );
}

export default CustomSearch;