import React from 'react';

import './Input.css';

const FilePicker = props => (
  <div className={`input-form-control ${props.className}`}>
    {props.label && <label htmlFor={props.id}>{props.label}</label>}
    <input
      className={[
        !props.valid ? 'invalid' : 'valid',
        props.touched ? 'touched' : 'untouched'
      ].join(' ')}
      type="file"
      id={props.id}
      onChange={props.onChange}
      onBlur={props.onBlur}
      multiple={props.multiple}
      name={props.id}
      value={props.value}
    />
  </div>
);

export default FilePicker;
