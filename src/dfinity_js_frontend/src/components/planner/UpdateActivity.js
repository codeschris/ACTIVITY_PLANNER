import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";
import { toast } from "react-toastify";
import { getActivity, updateActivity } from '../../utils/planner';
import { NotificationError, NotificationSuccess } from '../utils/Notifications';


const UpdateActivity = ({activityId}) => {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const isFormFilled = () => title && description;

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const id = activityId;
  const activityPayload = {title, description};


  useEffect(() => {
    const fetchActivity = async () => {
        try {
            const activity = await getActivity(activityId);
            setTitle(activity.title);
            setDescription(activity.description);
        }   
        catch (error) {
            console.log({error});           
        }
    }
    fetchActivity();
}, [activityId]);

const update = async () => {
    try {
        await updateActivity(id, activityPayload).then((response) => {
            toast(<NotificationSuccess text="Activity updated successfully." />);
            window.location.reload();
        } ).catch((error) => {
            toast(<NotificationError text="Failed to update a Activity." />);
        });

    } catch (error) {
        console.log({error});
        toast(<NotificationError text="Failed to update a Activity." />);
    }
}


  return (
    <>
        <Button onClick={handleShow} variant="dark" className=" px-0" style={{ color: "white" }}>
            Update
        </Button>
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Update Activity</Modal.Title>
            </Modal.Header>
            <Form>
                <Modal.Body>
                    <FloatingLabel controlId="inputName" label="Activity title" className="mb-3">
                        <Form.Control type="text" value={title} onChange={(e) => { setTitle(e.target.value); }} placeholder="Enter title of activity" />
                    </FloatingLabel>
                    <FloatingLabel controlId="inputDescription" label="Description" className="mb-3">
                        <Form.Control type="text" value={description} placeholder="Description" onChange={(e) => { setDescription(e.target.value); }} />
                    </FloatingLabel>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                    <Button variant="primary" onClick={() => { update(); handleClose(); }} disabled={!isFormFilled()}>Update</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    </>
  )
}

export default UpdateActivity