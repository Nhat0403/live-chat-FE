import './Input.css'

const Input = props => {
  return (
    <div className={`input-form-control ${props.className}`}>
      {props.label && <label htmlFor={props.id}>{props.label}</label>}
      {props.control === 'input' && (
        <input
          type={props.type}
          id={props.id}
          placeholder={props.placeholder}
          required={props.required}
          className={[
            "form-input",
            props.valid ? "" : "input-invalid",
            props.touched ? "touched" : "untouched",
            props.inputClassName
          ].join(' ')}
          value={props.value}
          onChange={props.onChange}
          onBlur={props.onBlur}
        />
      )}
      {props.control === 'textarea' && (
        <textarea
          type={props.type}
          id={props.id}
          placeholder={props.placeholder}
          className={[
            "form-input",
            props.valid ? "" : "input-invalid",
            props.touched ? "touched" : "untouched",
            props.inputClassName
          ].join(' ')}
          value={props.value}
          onChange={props.onChange}
          onBlur={props.onBlur}
          rows={props.rows}
          cols={props.cols}
        />
      )}
    </div>
  );
};

export default Input;