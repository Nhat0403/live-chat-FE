export const required = value => value.trim() !== '';

export const length = config => value => {
  let isValid = true;
  if (config.min) {
    isValid = isValid && value.trim().length >= config.min;
  }
  if (config.max) {
    isValid = isValid && value.trim().length <= config.max;
  }
  return isValid;
};

export const emailRegex = value =>
  /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(
    value
  );

export const validate = (value, setInput, validators) => {
  let valid = true;
  for(const validator of validators) {
    valid = valid && validator(value)
  };
  setInput(prev => ({
    ...prev,
    value: value,
    valid: valid
  }));
};

export const onChangeHandler = (e, setInput, validators) => {
  const value = e.target.value;
  validate(value, setInput, validators);
};

export const onBlurHandler = (e, setInput, validators) => {
  const value = e.target.value;
  validate(value, setInput, validators);
  setInput(prev => ({
    ...prev,
    touched: true
  }));
};

export const setTouched = setInput => {
  return setInput(prev => ({
    ...prev,
    touched: true
  }));
};
