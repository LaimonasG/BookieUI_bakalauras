import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { register, login } from "../../services/auth.service";
import { NavigateFunction, json, useNavigate } from 'react-router-dom';

export interface IUser {
  username: string,
  email: string,
  password: string,
}

const Register: React.FC = () => {
  let navigate: NavigateFunction = useNavigate();
  const [successful, setSuccessful] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const initialValues: IUser = {
    username: "",
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .test(
        "len",
        "Naudotojo vardo reikšmė turi būti 3-25 simbolių ilgio. ",
        (val: any) =>
          val &&
          val.toString().length >= 3 &&
          val.toString().length <= 25
      )
      .required("Naudotojo vardo laukas būtinas."),
    email: Yup.string()
      .email("Tai ne validus elektroninis paštas.")
      .required("Elektroninio pašto laukas būtinas."),
    password: Yup.string()
      .test(
        "len",
        "Slaptažodžio reikšmė turi būti 6-40 simbolių ilgio.",
        (val: any) =>
          val &&
          val.toString().length >= 6 &&
          val.toString().length <= 40
      )
      .required("Slaptažodžio laukas būtinas."),
  });

  const handleRegister = (formValue: IUser) => {
    const { username, email, password } = formValue;

    register(username, email, password).then(
      (response) => {
        setMessage(response.data.message);
        setSuccessful(true);

        // Perform login after successful registration
        login(username, password).then(
          (data) => {
            navigate("/");
            window.location.reload();
          },
          (error) => {
            const resMessage =
              (error.response &&
                error.response.data) ||
              error.message ||
              error.toString();

            setMessage(resMessage);
            setSuccessful(false);
          }
        );
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data) ||
          error.message ||
          error.toString();

        setMessage(resMessage);
        setSuccessful(false);
      }
    );
  };

  return (
    <div className="col-md-12">
      <div className="card card-container">
        <img
          src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
          alt="profile-img"
          className="profile-img-card"
        />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleRegister}
        >
          <Form>
            {!successful && (
              <div>
                <div className="form-group">
                  <label htmlFor="username"> Naudotojo vardas </label>
                  <Field name="username" type="text" className="form-control" />
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="alert alert-danger"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email"> Elektroninis paštas </label>
                  <Field name="email" type="email" className="form-control" />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="alert alert-danger"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password"> Slaptažodis </label>
                  <Field
                    name="password"
                    type="password"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="alert alert-danger"
                  />
                </div>

                <div className="form-group">
                  <button type="submit" className="btn btn-primary btn-block">Registruotis</button>
                </div>
              </div>
            )}

            {message && (
              <div className="form-group">
                <div
                  className={
                    successful ? "alert alert-success" : "alert alert-danger"
                  }
                  role="alert"
                >
                  {message}
                </div>
              </div>
            )}
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default Register;