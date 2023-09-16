import React, {useContext} from 'react';
import {ErrorMessage, Field, Form, Formik} from "formik";
import {AuthContext} from "../../../services/context/auth.context";

export function LoginForm(){
    let context = useContext(AuthContext);
    function handleLogin(){
        context?.verifyAuthentication()
    }


    return (
        <Formik
            initialValues={{ email: '', password: '' }}
            validate={values => {
                const errors :{email?:string} = {};
                if (!values.email) {
                    errors.email = 'Required';
                } else if (
                    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                ) {
                    errors.email = 'Invalid email address';
                }
                return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
                setTimeout(() => {
                    alert(JSON.stringify(values, null, 2));
                    handleLogin();
                    setSubmitting(false);
                }, 400);
            }}
        >
            {({ isSubmitting }) => (
                <Form>
                    <Field type="email" name="email" />
                    <ErrorMessage name="email" component="div" />
                    <Field type="password" name="password" />
                    <ErrorMessage name="password" component="div" />
                    <button type="submit" disabled={isSubmitting}>
                        Submit
                    </button>
                </Form>
            )}
        </Formik>
)}