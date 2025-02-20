

import React from 'react';
import './CustomModal.css';

const CustomModal = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="alert-modal">
        <div className="modal-header">
           
          {/* <button onClick={onClose}>&times;</button> */}
        </div>
       
          {message}
        
        <div className="modal-footer">
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
