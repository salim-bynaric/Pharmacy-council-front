import React from 'react';
import Alert from "react-bootstrap/Alert";
import { useEffect } from "react";
import { Markup } from 'interweave';

function AlertDismissible(props) {
  useEffect(() => {
    const interval = setTimeout(() => {
      props.mySetShow(false);
    }, 10000);

    return () => clearInterval(interval);
  }, [props]);

  return (
    props.myShow && props.myMsg ?
      <Alert
        variant={"dark"}
        onClose={() => props.mySetShow(false)}
        dismissible
        style={{ position: "fixed", top: "83%", width: "58%", left: "22%", zIndex: "99999"}}
        className="animate__animated animate__tada animate_slower" 
      >
        <Markup content={props.myMsg} />
      </Alert>
      : null
  );
}

export default AlertDismissible;
