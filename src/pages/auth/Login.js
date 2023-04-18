import { useState } from "react";
import { emailRegex, length, onBlurHandler, onChangeHandler, required, setTouched } from "../../util/validators";
import Notificate from "../../components/UI/Notificate";
import Input from "../../components/UI/Input";
import Button from "../../components/UI/Button";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";
import UserAPI from "../../API/UserAPI";
import { useDispatch } from "react-redux";
import { addSession } from "../../Redux/Action/ActionSession";
import setCookie from "../../setCookie";
import getCookie from "../../getCookie";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [email, setEmail] = useState({
    value: '',
    valid: false,
    touched: false,
    validators: [required, emailRegex]
  });
  const [password, setPassword] = useState({
    value: '',
    valid: false,
    touched: false,
    validators: [required, length({ min: 5 })]
  });
  const [noti, setNoti] = useState(
    location.state ? {
      title: location.state.title,
      message: location.state.message
    } : null
  );

  const loginHandler = async(e) => {
    e.preventDefault();

    setTouched(setEmail);
    setTouched(setPassword);

    if(!email.valid || !password.valid) {
      console.log('no');
      return setNoti({
        title: 'Validation failed!',
        message: 'Invalid name or email or password!'
      });
    };

    if(email.valid && password.valid) {
      console.log('ok');
      const params = {
        email: email.value,
        password: password.value
      };
      const query = '?' + queryString.stringify(params);
      try {
        const response = await UserAPI.postLogin(query);
        console.log(response);
        localStorage.setItem('userId', response.userId);
        localStorage.setItem('token', response.token);
        const action = addSession(response);
        dispatch(action);
        setCookie('token', response.token, +1);
        console.log('token: ' + getCookie('token'));
        navigate('/', { state: {
          title: 'Login success!',
          message: response.message
        }});
      } catch(err) {
        console.log(err);
        if(err.response.status && err.response.status !== 200) {
          setNoti({
            title: 'Validation falied!',
            message: err.response.data.message
          });
        };
      };
    };
  }
  return(
    <>
      {noti && (
        <Notificate
          title={noti.title}
          message={noti.message}
          onConfirm={() => setNoti(null)}
        />
      )}
      <main>
        <h1>Login</h1>
        <form>
        <Input 
            control='input'
            id='email'
            type='email'
            placeholder='email'
            required={true}
            onChange={e => onChangeHandler(e, setEmail, email.validators)}
            onBlur={e => onBlurHandler(e, setEmail, email.validators)}
            value={email.value}
            valid={email.valid}
            touched={email.touched}
          />
          <Input 
            control='input'
            id='password'
            type='password'
            placeholder='password'
            required={true}
            onChange={e => onChangeHandler(e, setPassword, password.validators)}
            onBlur={e => onBlurHandler(e, setPassword, password.validators)}
            value={password.value}
            valid={password.valid}
            touched={password.touched}
          />
          <Button
            type='submit'
            onClick={loginHandler}
            children='Login'
          />
          <div>Don't have account? <NavLink to='/signup' style={{ color:'blue' }}>Go to Sign Up</NavLink></div>
        </form>
      </main>
    </>
  );
};

export default Login;