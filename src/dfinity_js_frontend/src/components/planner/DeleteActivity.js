import React from 'react'
import { deleteActivity } from '../../utils/planner';
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { NotificationError, NotificationSuccess } from '../utils/Notifications';


const DeleteActivity = ({activityId}) => {

  const removeActivity = async () => {
    try {
        deleteActivity(activityId).then(() => {
            toast(<NotificationSuccess text="Activity deleted successfully." />);
            window.location.reload();
        }).catch((error) => {
            toast(<NotificationError text="Failed to delete a Activity." />);
        })
    } catch (error) {
        console.log({error});
        toast.error("Failed to delete Activity");
    }
}

  return (
      <Button variant="danger" onClick={() => {
          removeActivity();
      }}>Delete</Button>
  )
}

export default DeleteActivity