import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";


const AddActivity = ({save}) => {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const isFormFilled = () => title && description;

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Button onClick={handleShow} variant="dark" className=" px-2" style={{ color: "white" }}>
                AddActivity
            </Button>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>New Activity</Modal.Title>
                </Modal.Header>
                <Form>
                    <Modal.Body>
                        <FloatingLabel controlId="inputName" label="Activity title" className="mb-3">
                            <Form.Control type="text" onChange={(e) => { setTitle(e.target.value); }} placeholder="Enter title of activity" />
                        </FloatingLabel>
                        <FloatingLabel controlId="inputDescription" label="Description" className="mb-3">
                            <Form.Control type="text" placeholder="Description" onChange={(e) => { setDescription(e.target.value); }} />
                        </FloatingLabel>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>Close</Button>
                        <Button variant="primary" onClick={() => { save({ title, description }); handleClose(); }} disabled={!isFormFilled()}>Save</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}

AddActivity.propTypes = {
    save: PropTypes.func.isRequired
}

export default AddActivity