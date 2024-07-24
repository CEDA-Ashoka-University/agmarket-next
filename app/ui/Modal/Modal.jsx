/* eslint-disable react/prop-types */
import { createPortal } from "react-dom";
import styles from "./Modal.module.css";

function Modal({ handleCloseModal, children }) {
  return createPortal(
    <div
      className={styles.modal_wrapper}
      onClick={e => {
        e.stopPropagation();
        handleCloseModal();
      }}
    >
      <div className={styles.modal_container} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body
  );
}

export default Modal;
