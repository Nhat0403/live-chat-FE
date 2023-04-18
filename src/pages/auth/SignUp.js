import { useState } from "react";
import Button from "../../components/UI/Button";
import Input from "../../components/UI/Input";
import Notificate from "../../components/UI/Notificate";
import { required, length, emailRegex, onChangeHandler, onBlurHandler, setTouched } from "../../util/validators";
import queryString from "query-string";
import UserAPI from "../../API/UserAPI";
import { NavLink, useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState({
    value: '',
    valid: false,
    touched: false,
    validators: [required]
  });
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
  const [noti, setNoti] = useState(null);

  const signUpHandler = async(e) => {
    e.preventDefault();

    setTouched(setName);
    setTouched(setEmail);
    setTouched(setPassword);

    if(!name.valid || !email.valid || !password.valid) {
      console.log('no');
      return setNoti({
        title: 'Validation failed!',
        message: 'Invalid name or email or password!'
      });
    };

    if(name.valid && email.valid && password.valid) {
      console.log('ok');
      const params = {
        name: name.value,
        email: email.value,
        password: password.value
      };
      const query = '?' + queryString.stringify(params);
      try {
        const response = await UserAPI.postSignUp(query);
        console.log(response);
        navigate('/login', { state: {
          title: 'Sign Up success!',
          message: response.message,
        }})
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
  };

  return (
    <>
      {noti && (
        <Notificate 
          title={noti.title}
          message={noti.message}
          onConfirm={() => setNoti(null)}
        />
      )}
      <main>
        <h1>Sign Up</h1>
        <form>
          <Input 
            control='input'
            id='name'
            type='text'
            placeholder='name'
            required={true}
            onChange={e => onChangeHandler(e, setName, name.validators)}
            onBlur={e => onBlurHandler(e, setName, name.validators)}
            value={name.value}
            valid={name.valid}
            touched={name.touched}
          />
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
            onClick={signUpHandler}
            children='SignUp'
          />
          <div>Have an account? <NavLink to='/login' style={{ color: 'blue' }}>Go to Login</NavLink></div>
        </form>
      </main>
    </>
  );
};

export default SignUp;