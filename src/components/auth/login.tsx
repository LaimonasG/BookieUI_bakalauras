import React, { useState } from "react";
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./Login/Login.css"
import { login } from "../../services/auth.service";

const Login: React.FC = () => {
  const navigate: NavigateFunction = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const initialValues: {
    username: string;
    password: string;
  } = {
    username: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Naudotojo vardo laukas būtinas."),
    password: Yup.string().required("Slaptažodžio laukas būtinas"),
  });

  const handleLogin = (formValue: { username: string; password: string }) => {
    const { username, password } = formValue;

    setMessage("");
    setLoading(true);

    login(username, password).then(
      () => {
        navigate("/");
        window.location.reload();
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data) ||
          error.message ||
          error.toString();

        setLoading(false);
        setMessage(resMessage);
      }
    );
  };


  return (
    <div className="center-container">
      <div className="card card-container">
        <img
          src={`avatar.svg`}
          alt="profile-img"
          className="profile-img-card"
        />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          {({ handleChange, handleBlur }) => (
            <Form>
              <div className="form-content">
                <div className="form-group">
                  <label htmlFor="username">Naudotojo vardas</label>
                  <Field
                    name="username"
                    type="text"
                    className="form-control"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      handleChange(e); // call Formik's handleChange
                      setMessage("");
                    }}
                    onBlur={handleBlur}
                  />
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="alert alert-danger"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Slaptažodis</label>
                  <Field
                    name="password"
                    type="password"
                    className="form-control"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      handleChange(e); // call Formik's handleChange
                      setMessage("");
                    }}
                    onBlur={handleBlur}
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="alert alert-danger"
                  />
                </div>

                <div className="form-group">
                  <button type="submit" className="btn btn-login btn-block" disabled={loading}>
                    {loading && (
                      <span className="spinner-border spinner-border-sm"></span>
                    )}
                    <span>Prisijungti</span>
                  </button>
                </div>
              </div>

              {message && (
                <div className="form-group">
                  <div className="alert alert-danger" role="alert">
                    {message}
                  </div>
                </div>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;