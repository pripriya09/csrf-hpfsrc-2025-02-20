

import React from 'react';
import './CustomModal.css';


const CustomConfirmModal = ( { message, onConfirm, onCancel }) => {
 
  return (
    <div className="alert-modal">
      <div className="modal-content">
        <p>{message}</p>
        <button onClick={onConfirm}>Yes</button>
        <button onClick={onCancel}>No</button>
      </div>
    </div>
  );
}


export default CustomConfirmModal;
