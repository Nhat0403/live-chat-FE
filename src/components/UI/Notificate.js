import classes from "./Notificate.module.css";
import React from "react";

const Notificate = (props) => {
  return (
    <div>
      <div className={classes.backdrop} onClick={props.onConfirm} />
      <div className={classes.modal}>
        <header className={classes.header}>
          <h2>{props.title}</h2>
        </header>
        <div className={classes.content}>
          {props.message}
        </div>
        <footer className={classes.actions}>
        </footer>
      </div>
    </div>
  );
};

export default Notificate;
