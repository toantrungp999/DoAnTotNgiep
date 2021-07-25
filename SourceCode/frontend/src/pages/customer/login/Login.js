import React, { useEffect, useState, memo } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  signinRequest,
  signinByApiRequest,
} from "./../../../actions/userActions";
import { isEmail } from "../../../extentions/ArrayEx";
import GoogleLogin from "react-google-login";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import Input from "../../../components/common/formField/Input";
import "./Login.css";

function Login(props) {
  let [firstSubmit, setFirstSubmit] = useState(false);
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  const userInfoReducer = useSelector((state) => state.userInfoReducer);
  var { message, loading, userInfo, inform } = userInfoReducer;
  const dispatch = useDispatch();
  const redirect = props.location.search
    ? props.location.search.split("=")[1]
    : "/";
  useEffect(() => {
    if (userInfo) props.history.push(redirect);
    return () => {
      //
    };
  }, [userInfo, props.history, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    email = email.trim();
    password = password.trim();
    if (
      email &&
      email.length >= 6 &&
      email.length <= 255 &&
      isEmail(email) &&
      password &&
      password.length >= 6 &&
      password.length <= 255
    )
      dispatch(signinRequest({ email, password }));
    setFirstSubmit(true);
  };

  const signupByApi = (res, type) => {
    let postData;
    if (type === "facebook" && res.email) {
      postData = {
        access_token: res.accessToken,
      };
      dispatch(signinByApiRequest("facebook", postData));
    }

    if (type === "google" && res.profileObj && res.profileObj.email) {
      postData = {
        tokenId: res.tokenId,
      };
      console.log(res);
      dispatch(signinByApiRequest("google", postData));
    }
  };

  const responseFacebook = (response) => {
    signupByApi(response, "facebook");
  };

  const responseGoogle = (response) => {
    signupByApi(response, "google");
  };
  const button_submit = loading ? (
    <input type="button" className="btn btn-submit" value="LOADING..." />
  ) : (
    <input type="submit" className="btn btn-submit" value="Đăng nhập" />
  );
  return (
    <div className="login-page">
      <div className="login-section" id="login-box">
        <form className="" onSubmit={submitHandler}>
          <h3 className="">Đăng nhập</h3>
          <div className="form-group mt-10">
            <span className="text-success">{inform ? inform : ""}</span>{" "}
          </div>

          <Input
            label=""
            name="email"
            value={email}
            firstSubmit={firstSubmit}
            labelWidth="0px"
            placeHolder="Email"
            vertical={true}
            onChange={(e) => setEmail(e.target.value)}
            rules={[
              { require: true, message: "Chưa nhập email" },
              { email: true, message: "Email không hợp lệ" },
              { min: 6, message: "Nhập từ 6 ký tự" },
              { max: 255, message: "Không nhập quá 255 ký tự" },
            ]}
          />
          <Input
            name="password"
            value={password}
            firstSubmit={firstSubmit}
            label=""
            placeHolder="Mật khẩu"
            labelWidth="0px"
            type="password"
            vertical={true}
            onChange={(e) => setPassword(e.target.value)}
            rules={[
              { require: true, message: "Chưa nhập mật khẩu" },
              { min: 6, message: "Nhập từ 6 ký tự" },
              { max: 255, message: "Không nhập quá 255 ký tự" },
            ]}
          />

          <div className="form-group">{button_submit}</div>

          <div className="btn-google">
            <GoogleLogin
              clientId="1039038590000-2jrf04enlt5tcjk3ul2hnckukjctef2p.apps.googleusercontent.com"
              buttonText="Login with Google"
              className="btnGoogle"
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
            ></GoogleLogin>
          </div>
          <div className="btn-facebook">
            <FacebookLogin
              // icon={iconFB}
              appId="673086710276780"
              autoLoad={false}
              fields="name,email,picture"
              callback={responseFacebook}
              render={(renderProps) => (
                <button
                  type="button"
                  className="btnFacebook"
                  onClick={renderProps.onClick}
                >
                  <i aria-hidden="true" className="fa fa-facebook"></i> Login
                  with Facebook
                </button>
              )}
            />
          </div>

          <div className="form-group">
            <span className="text-danger">{message ? message : ""}</span>
          </div>
          <div className="form-group">
            <p className="text-center">
              {" "}
              Bạn chưa có tài khoản?
              <Link className="text-info" to="/register">
                {" "}
                Đăng ký ngay!
              </Link>
            </p>
          </div>
          <div className="form-group">
            <p className="text-center">
              <Link className="text-info" to="/forgotpassword">
                Quên mật khẩu?
              </Link>
            </p>
          </div>
        </form>
      </div>
      <div className="panel-login-section">
        <span>BlueFashion</span>
      </div>
    </div>
  );
}
export default memo(Login);
