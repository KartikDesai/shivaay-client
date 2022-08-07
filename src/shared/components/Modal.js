import React, {useState} from 'react';
import { Button, ButtonToolbar, Modal } from 'reactstrap';
import classNames from 'classnames';
import {withRouter} from "react-router-dom";

const ModalComponent = props => {

  const [modal, setModal] =  useState(props.isOpen);

  if (props.isOpen && !modal) {
    setModal(true);
  }

  const close = () => {
    props.onClose();
    setModal(false);
    if (props.status === 401) {
      props.history.push('/logout');
    }
  };

  const {
    color, colored, header
  } = props;
  let { message, title } = props;
  let Icon;
  
  if (props.status === 401) {
    message = "Please sign in again.";
    title = "Session Timeout!";
  }

  switch (color) {
    case 'primary':
      Icon = <span className="lnr lnr-pushpin modal__title-icon" />;
      break;
    case 'success':
      Icon = <span className="lnr lnr-thumbs-up modal__title-icon" />;
      break;
    case 'warning':
      Icon = <span className="lnr lnr-flag modal__title-icon" />;
      break;
    case 'danger':
      Icon = <span className="lnr lnr-cross-circle modal__title-icon" />;
      break;
    default:
      break;
  }
  const modalClass = classNames({
    'modal-dialog--colored': colored,
    'modal-dialog--header': header,
  });

  return (
    <div>
      <Modal
        isOpen={modal}
        onClosed={close}
        modalClassName={`ltr-support`}
        className={`modal-dialog--${color} ${modalClass}`}
        style={{ top: '25%'}}
      >
        <div className="modal__header">
          <button className="lnr lnr-cross modal__close-btn" type="button" onClick={close} />
          {header ? '' : Icon}
          <h4 className="text-modal  modal__title">{title}</h4>
        </div>
        <div className="modal__body">
          {message}
        </div>
        <ButtonToolbar className="modal__footer">
          <Button className="modal_ok" outline={colored} color={color} onClick={close}>Close</Button>
        </ButtonToolbar>
      </Modal>
    </div>
  );
}

export default withRouter(ModalComponent);