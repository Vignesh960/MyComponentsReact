import React from 'react';
import { Offcanvas, Button, Form, Row, Col } from 'react-bootstrap';
import Dropdown1 from '../../common/Dropdown'; 
const FilterSidebar = ({
  isOpen,
  handleClose,
  bu,
  busl,
  vertical,
  customer,
  projects,
  selectedBu,
  selectedBusl,
  selectedVertical,
  selectedCustomer,
  selectedProjectOptions,
  selectedProjectShortOptions,
  startDate,
  endDate,
  handleBuChange,
  handleBuSlChange,
  handleVerticalChange,
  handleCustomerChange,
  handleProjectChange,
  handleProjectChange1,
  setStartDate,
  setEndDate,
  handleReset
}) => {
  return (
    <Offcanvas show={isOpen} onHide={handleClose} placement="end" className="p-2">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title className="w-100">
          <Button title="Reset" className="badge rounded-pill bg-info p-2" onClick={handleReset}>
            Reset
          </Button>
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="p-2">
        <Form>
          <Row>
            <Col xs={12} className="mb-2">
              <Dropdown1
                label="BU"
                options={bu.map(item => ({ value: item.bu, label: item.bu }))}
                value={selectedBu}
                onChange={handleBuChange}
                className="form-control-sm"
              />
            </Col>
            <Col xs={12} className="mb-2">
              <Dropdown1
                label="BU SL"
                options={busl.map(item => ({ value: item.bu_sl, label: item.bu_sl }))}
                value={selectedBusl}
                onChange={handleBuSlChange}
                className="form-control-sm"
              />
            </Col>
            <Col xs={12} className="mb-2">
              <Dropdown1
                label="Vertical"
                options={vertical.map(item => ({ value: item.bu_vertical, label: item.bu_vertical }))}
                value={selectedVertical}
                onChange={handleVerticalChange}
                className="form-control-sm"
              />
            </Col>
            <Col xs={12} className="mb-2">
              <Dropdown1
                label="Customer"
                options={customer.map(item => ({ value: item.customer, label: item.customer }))}
                value={selectedCustomer}
                onChange={handleCustomerChange}
                className="form-control-sm"
              />
            </Col>
            <Col xs={12} className="mb-2">
              <Dropdown1
                label="Project"
                options={projects.map(item => ({ value: item.tid, label: item.project_name }))}
                value={selectedProjectOptions}
                onChange={handleProjectChange}
                className="form-control-sm"
              />
            </Col>
            {/* <Col xs={12} className="mb-2">
              <Dropdown1
                label="Project Code"
                options={projects.map(item => ({ value: item.tid, label: item.project_shortname }))}
                value={selectedProjectShortOptions}
                onChange={handleProjectChange1}
                className="form-control-sm"
              />
            </Col> */}
            <Col xs={12} className="mb-2">
              <Form.Group controlId="formStartDate">
                <Form.Label className="mb-1">Start Date</Form.Label>
                <Form.Control type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="form-control-sm" />
              </Form.Group>
            </Col>
            <Col xs={12} className="mb-2">
              <Form.Group controlId="formEndDate">
                <Form.Label className="mb-1">End Date</Form.Label>
                <Form.Control type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="form-control-sm" />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default FilterSidebar;
