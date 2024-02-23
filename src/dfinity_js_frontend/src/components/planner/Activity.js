import React, { useState } from "react";
import PropTypes from "prop-types";
import { Card, Button,Form, Col, Badge, Stack,FloatingLabel, InputGroup, Row } from "react-bootstrap";
import { Principal } from "@dfinity/principal";
import PlanImg from "../../assets/img/Plan.jpg";
import UpdateActivity from "./UpdateActivity";
import DeleteActivity from "./DeleteActivity";
import { addTag, completeActivity, removeTag, setPriority, updateStatus } from "../../utils/planner";
import { toast } from "react-toastify";
import { NotificationError, NotificationSuccess } from "../utils/Notifications";

const Activity = ({activity}) => {
    const {id, creator, title, description,elapsed_time, tags,status, priority} = activity;

    const [changedStatus, setChangedStatus] = useState("");
    const [addedTag, setAddedTag] = useState("");
    const [deleteTag, setDeleteTag] = useState("");
    const [placedPriority, setPlacedPriority] = useState("");

    const calculateTime = async() => {
        try {
            await window.canister.planner.calculateElapsedTime(id).then(() => {
                window.location.reload();
                toast(<NotificationSuccess text="Elapsed Time calculated successfully." />);
            }).catch((error) => {
                toast(<NotificationError text="Failed to calculate Elapsed Time." />);
            });
        } catch (error) {
            console.error(error);
        }
    }


    const complete = () => {
        try {
            completeActivity(id).then(() => {
                window.location.reload();
                toast(<NotificationSuccess text="Activity status updated successfully." />);
            }).catch((error) => {
                toast(<NotificationError text="Failed to update a Activity status." />);
            });
        }
        catch (error) {
            console.log({error});
            toast(<NotificationError text="Failed to update a Activity status." />);
        }
    }


    const statusUpdate =  () => {
        try {
             updateStatus(id, changedStatus).then(() => {
                window.location.reload();
                toast(<NotificationSuccess text="Activity status updated successfully." />);
            } ).catch((error) => {
                toast(<NotificationError text="Failed to update a Activity status." />);
            });

        } catch (error) {
            console.log({error});
            toast(<NotificationError text="Failed to update a Activity status." />);
        }
    }

    const insertTag = () => {
        try {
            addTag(id, addedTag).then(() => {
                window.location.reload();
                toast(<NotificationSuccess text="Tag added successfully." />);
            }).catch((error) => {
                toast(<NotificationError text="Failed to add a tag." />);
            });
        } catch (error) {
            console.log({error});
            toast(<NotificationError text="Failed to add a tag." />);
        }
    }

    const discardTag = () => {
        try {
            removeTag(id, deleteTag).then(() => {
                window.location.reload();
                toast(<NotificationSuccess text="Tag deleted successfully." />);
            }).catch((error) => {
                toast(<NotificationError text="Failed to delete a tag." />);
            });
        } catch (error) {
            console.log({error});
            toast(<NotificationError text="Failed to delete a tag." />);
        }
    }

    const updatePriority = () => {
        try {
            setPriority(id, placedPriority).then(() => {
                window.location.reload();
                toast(<NotificationSuccess text="Priority updated successfully." />);
            }).catch((error) => {
                toast(<NotificationError text="Failed to update a priority." />);
            });
        } catch (error) {
            console.log({error});
            toast(<NotificationError text="Failed to update a priority." />);
        }
    }

    return (
        <Col key={id}>
            <Card className=" h-70">
                <Card.Header>
                    <Stack direction="horizontal" gap={2}>
                        <span className="font-monospace text-secondary">{Principal.from(creator).toText()}</span>
                        <Badge bg="secondary" className="ms-auto">
                            {status}
                        </Badge>
                    </Stack>
                </Card.Header>
                <div className=" ratio ratio-4x3">
                    <img src={PlanImg} alt={title} style={{ objectFit: "cover" }} />
                </div>
                <Card.Body className="d-flex  flex-column text-center">
                    <Card.Title>{title}</Card.Title>
                    <Card.Text className="flex-grow-1 ">{description}</Card.Text>
                    <Card.Text className="text-secondary">
                        <span><strong>Elapsed Time: </strong>{elapsed_time} minutes</span>
                    </Card.Text>
                    <Card.Text className="text-secondary">
                        <strong>Tags: </strong>
                        {tags.map((tag, index) => (
                            <Badge key={index} bg="secondary" className="me-1">
                                {tag}
                            </Badge>
                        ))}
                    </Card.Text>
                    <Card.Text className="text-secondary">
                        <span><strong>Priority Level: </strong>{priority}</span>
                    </Card.Text>
                    <InputGroup className="mb-3">
                        <Form.Control
                        placeholder="Status"
                        aria-label="Status"
                        aria-describedby="basic-addon2"
                        onChange={(e) => {
                            setChangedStatus(e.target.value);
                        }}
                        />
                        <Button variant="outline-secondary" id="button-addon2"
                        onClick={statusUpdate}
                        >
                        Update Status
                        </Button>
                    </InputGroup>

                    <InputGroup className="mb-3">
                        <Form.Control
                        placeholder="Tag Name"
                        aria-label="Tag"
                        aria-describedby="basic-addon2"
                        onChange={(e) => {
                            setAddedTag(e.target.value);
                        }}
                        />
                        <Button variant="outline-secondary" id="button-addon2"
                            onClick={insertTag}
                        >
                        Add Tag
                        </Button>
                    </InputGroup>

                    <InputGroup className="mb-3">
                        <Form.Control
                        placeholder="Tag Name"
                        aria-label="Tag"
                        aria-describedby="basic-addon2"
                        onChange={(e) => {
                            setDeleteTag(e.target.value);
                        }}
                        />
                        <Button variant="outline-secondary" id="button-addon2"
                            onClick={discardTag}
                        >
                        Delete Tag
                        </Button>
                    </InputGroup>

                    <InputGroup className="mb-3">
                        <Form.Control
                        placeholder="Priority"
                        aria-label="Priority"
                        aria-describedby="basic-addon2"
                        onChange={(e) => {
                            setPlacedPriority(e.target.value);
                        }}
                        />
                        <Button variant="outline-secondary" id="button-addon2"
                            onClick={updatePriority}
                        >
                        Set Priority
                        </Button>
                    </InputGroup>

                    <Button variant="outline-dark" className="w-100 py-3 mb-2"
                    onClick={calculateTime}
                    >
                        Calculate Elapsed Time
                    </Button>

                    <Row>
                        <Col className="d-flex justify-content-center">
                            <Stack direction="horizontal" gap={3}>
                               <DeleteActivity activityId={id} />
                                <UpdateActivity activityId={id}/>
                                <Button variant="success" onClick={complete} >
                                    Done ✅
                                </Button>
                            </Stack>
                        </Col>

                    </Row>

                
            </Card.Body>
            
            </Card>


        </Col>
    );
    
}

export default Activity