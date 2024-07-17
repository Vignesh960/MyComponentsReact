import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const CustomModal = ({ show, handleClose, title, children }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className="py-2"> {/* Reduced padding */}
        <Modal.Title className="h6">{title}</Modal.Title> {/* Smaller font size */}
      </Modal.Header>
      <Modal.Body className="py-2"> {/* Reduced padding */}
        {children}
      </Modal.Body>
      
    </Modal>
  );
};

export default CustomModal;
