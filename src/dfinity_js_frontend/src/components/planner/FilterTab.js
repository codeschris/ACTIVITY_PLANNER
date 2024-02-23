import React, { useState } from 'react'
import { Row,  Button, Col,Form, InputGroup } from "react-bootstrap";


const FilterTab = ({handleSearchStatus, handleSortAsc,filterByTag}) => {
    const [filterTag, setFilterTag] = useState()


  return (
    <Row className="justify-content-between mt-1 align-items-center">
        <Col xs={12} sm={6} md={4} lg={3} className="d-flex ">
            <strong className='mx-2'>Status:  </strong>
            <Button variant="success" className="me-2"
            onClick={() => handleSearchStatus("completed")}
            >
            Completed
            </Button>
            <Button variant="warning"
            onClick={() => handleSearchStatus("pending")}
            >
            Pending
            </Button>
        </Col>

        <Col xs={12} sm={6} md={4} lg={3} className="d-flex  ">
            <strong className='mx-2'>Arrange: </strong>
            <Button variant="info" className="me-2"
            onClick={() => handleSortAsc()}
            >
            Ascending
            </Button>
        </Col>
        <Col xs={12} sm={6} md={4} lg={3} className="d-flex  ">

            <InputGroup className="mb-3">
                <Form.Control
                placeholder="Tag Name"
                aria-label="Tag"
                aria-describedby="basic-addon2"
                onChange={(e) => {
                    setFilterTag(e.target.value);
                }}
                />
                <Button variant="outline-secondary" id="button-addon2"
                    onClick={() => filterByTag(filterTag)}
                >
                    Tag
                </Button>
            </InputGroup>
        </Col>
    </Row>
  )
}

export default FilterTab