import React, { useEffect, useRef, useState } from "react";
// initial state for state
const initialState = {
  form: {
    name: { value: "", msg: "" },
    email: {
      value: "",
      msg: "",
      regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    },
    mobile: { value: "", msg: "", regex: /^[0-9]{10}$/ },
    password: {
      value: "",
      msg: "",
      regex: /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
    },
    confirm_password: { value: "", msg: "" },
  },
  captcha: "",
  captchaVerified: false,
  showPassword: false,
  signupCompleted: false,
};

const Signup = () => {
  const [state, setState] = useState(initialState);
  const [darkMode, setDarkMode] = useState(false);
  const captchaMsg = useRef();
  // responsible for generate captcha of 5 character
  const captchaGenerator = () => {
    let uniqueChar = "";
    const randomChar =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 5; i++) {
      uniqueChar += randomChar.charAt(Math.random() * randomChar.length);
    }
    setState({ ...state, captcha: uniqueChar });
  };

  // generate captcha when component mounted and when removed clear the ref
  useEffect(() => {
    captchaGenerator();
  }, []);

  // cleanup code
  useEffect(
    () => () => {
      return () => {
        captchaMsg.current = null;
      };
    },
    []
  );

  // validation & controlled done by this function
  const formHandler = (event) => {
    state.form[event.target.name].value = event.target.value;
    if (state.form[event.target.name].regex) {
      if (!state.form[event.target.name].regex.test(event.target.value)) {
        if (event.target.name === "password")
          state.form[
            event.target.name
          ].msg = `Enter valid Password should be min 8 letter password, with at least a symbol, upper and lower case letters and a number. `;
        else
          state.form[
            event.target.name
          ].msg = `Enter valid ${event.target.name}`;
      } else {
        state.form[event.target.name].msg = false;
      }
    } else {
      state.form[event.target.name].msg = false;
    }
    if (state.form.confirm_password.value !== state.form.password.value) {
      state.form.confirm_password.msg =
        "password and confirm password must be same";
    } else state.form.confirm_password.msg = false;
    setState({ ...state });
  };

  //  when form submitted then check all sides completed or not
  const submitHandler = (event) => {
    event.preventDefault();
    let flag = true;
    Object.entries(state.form).forEach((key, val) => {
      if (val.msg) {
        flag = false;
      }
    });
    if (!state.captchaVerified) flag = false;
    setState({ ...state, signupCompleted: flag });
  };

  //   when successfully signup
  if (state.signupCompleted)
    return (
      <>
        <div className="container container--green">
          <div className="form">
            <h3>Signup Successfully</h3>
            {Object.entries(state.form).map(([key, val]) => (
              <p>{`${key.replace("_", " ")} : ${val.value}`}</p>
            ))}
            <button className="btn" onClick={() => setState(initialState)}>
              Reset
            </button>
          </div>
        </div>
      </>
    );

  // signup form render
  return (
    <>
      <div className={`container ${darkMode ? "container--dark" : ""}`}>
        <form className="form" onSubmit={submitHandler}>
          <button
            className="btn--switch"
            onClick={() => setDarkMode((prev) => !darkMode)}
          >
            Switch to {darkMode ? "Light" : "Dark"} mode
          </button>
          <h2 className="form-heading">Sign Up Form</h2>
          {Object.entries(state.form).map(([key, val]) => (
            <>
              <div className="input-wrapper">
                <div className="input-icon">
                  <img
                    src={
                      key === "confirm_password" ? "password.png" : key + ".png"
                    }
                    alt="password"
                  />
                </div>
                <input
                  type={
                    !key.includes("password")
                      ? "text"
                      : state.showPassword
                      ? "text"
                      : "password"
                  }
                  name={key}
                  required
                  onChange={formHandler}
                  value={val.value}
                  placeholder={`Enter ${key.replace("_", " ")}`}
                />
              </div>
              <small className="input-msgs">{val.msg}</small>
            </>
          ))}
          <div className="captcha">
            <input
              onChange={() =>
                setState((prev) => {
                  return { ...state, showPassword: !prev.showPassword };
                })
              }
              type="checkbox"
              id="passwordview"
            />
            <label htmlFor="passwordview">Show Password</label>
            <p>Captcha:</p>
            <div className="captcha-box" selectable="False">
              <del>{state.captcha}</del>
            </div>
            <small className="input-msgs" ref={captchaMsg}></small>
            <div className="input-wrapper input-wrapper--captcha">
              <div className="input-icon">
                <img
                  onClick={() => captchaGenerator()}
                  src="Steve-Zondicons-Refresh.svg"
                  alt="refresh"
                />
              </div>
              <input
                type="text"
                onChange={(e) => {
                  if (e.target.value === state.captcha) {
                    captchaMsg.current.innerText = "captcha verified";
                    captchaMsg.current.style.color = "green";
                  } else {
                    captchaMsg.current.innerText = "Invalid Captcha code";
                    captchaMsg.current.style.color = "red";
                  }
                  setState({
                    ...state,
                    captchaVerified: e.target.value === state.captcha,
                  });
                }}
                placeholder="Enter The Captcha"
                name=""
              />
            </div>
          </div>
          <button className="btn" type="submit">
            SUBMIT
          </button>
        </form>
      </div>
    </>
  );
};

export default Signup;
