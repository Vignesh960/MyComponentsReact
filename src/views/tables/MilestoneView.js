import React, { useState, useEffect } from "react";
import Table from "../../common/table";
import config1 from "../../common/mis";
import { misAlert, postData, generateColumns, fetchFilterDrops, generateColumnsWithAction } from "../../common/common";
import { Row, Col, Card, Form, Button, Offcanvas } from 'react-bootstrap';
import Dropdown1 from "../../common/Dropdown";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { useLocation } from "react-router-dom";
import ReusableForm from "../../common/form";
import CustomModal from "./modalform";
import { FaFilter, FaTimes, FaEdit, } from 'react-icons/fa';

const BootstrapTable = () => {
  const [data1, setData1] = useState([]);
  const [selectedProjectShortOptions, setselectedProjectShortOptions] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [projects, setProjects] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const location = useLocation();
  const [showForm, setShowForm] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  const tableCols = config1.TableColumns.viewmilestone.split(",");
  const columns1 = generateColumnsWithAction(config1.DisplayColumns.viewmilestone);

  useEffect(() => {
    fetchData();
    fetchFilterDrops("getallprojectsdetails", "tid,project_id,project_name,project_shortname", setProjects);
    fetchFilterDrops("getallmilestones", "tid,mlstn_name", setMilestones);
  }, []);

  useEffect(() => {
    fetchData();
  }, [selectedProjectShortOptions, startDate]);

  const handleProjectChange1 = (selectedValue) => {
    setselectedProjectShortOptions(selectedValue);
  };

  const handleReset = () => {
    // Clear URL parameters
    // window.history.replaceState({}, document.title, window.location.pathname);

    // Reset state values
    setselectedProjectShortOptions("");
    setStartDate(null);
    setIsFilterApplied(false);
    // fetchData()
  };

  const handleEditClick = (row) => {
    console.log(row)
    setSelectedRow(row);
    setShowEditForm(true);
  };
  const fetchData = async () => {
    try {
      let filtertext = ``;
      // let filtertext = ''

      const urlParams = new URLSearchParams(location.search);
      const projectId = urlParams.get('projectId');
      if (projectId) {
        filtertext += projectId.includes(',') ? `project_id IN (${projectId})` : `project_id IN (${projectId})`;
      }

      if (selectedProjectShortOptions.length > 0) {
        if (filtertext) filtertext += ' AND ';
        filtertext += `project_id  IN (${selectedProjectShortOptions.map(option => `'${option}'`).join(',')})`;
      }
      if (startDate) {
        if (filtertext) filtertext += ' AND ';
        filtertext += `mlstn_enddate = '${format(startDate, "dd/MM/yyyy")}'`;
      }

      const requestData = {
        action: "getdatafordatatable",
        ["values[]"]: [
          "1",
          tableCols,
          "",
          filtertext,
          "devapp.vwprojectmilestone",
          "0",
          "2000",
          "project_name",
        ],
      };

      const response = await postData(
        config1.ProcessDataTableQuery.url,
        requestData
      );

      const dataWithActionColumn = response.data.map((row) => ({
        ...row,
        action: <FaEdit title="Edit" onClick={() => handleEditClick(row)} style={{ cursor: 'pointer' }} />,
      }));

      setData1(dataWithActionColumn);
      setIsFilterApplied(!!filtertext);
    } catch (error) {
      misAlert("error", "Error fetching data:", error);
    }
  };

  const handleAddButtonClick = () => {
    setShowForm(true);
  };

  const handleFormSubmit = async (formData) => {
      formData.mlstn_parentid = 0;    
    formData.monthly_value = formData.budget
    var inputdata = { action: 'insertmilestone', AndOr: "and", 'values[]': [formData] };
    const response = await postData(config1.ProcessQueryWitVals.url, inputdata);
    if (response.data[0]['insertmilestonedata'] === 'sucess') {
      misAlert('success', 'Data Inserted Successfully');
      setShowForm(false);
      fetchData()
    } else {
      misAlert('error', response.data[0]['insertmilestonedata']);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  const handleEditFormSubmit = async (formData) => {
    if (selectedRow) {
      formData.mlstn_id = selectedRow ? selectedRow.mlstn_id : '';
      formData.status = selectedRow ? selectedRow.status : '';
     
    }
    formData.monthly_value = formData ? formData.budget : 0;
    const inputdata = { action: 'updatemilestone', AndOr: "and", 'values[]': [formData] };
    const response = await postData(config1.ProcessQueryWitVals.url, inputdata);
    if (response.data[0]['updatemilestonedata'] === 'success') {
      misAlert('success', 'Data Updated Successfully');
      setShowEditForm(false);
      fetchData();
    } else {
      misAlert('error', response.data[0]['updatemilestonedata']);
    }
  };


  const handleEditClose = () => {
    setShowEditForm(false);
  };


  return (
    <div>
      <Offcanvas show={showSidebar} onHide={toggleSidebar} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="w-100">
            <Button title="Reset" className="badge rounded-pill bg-info p-2" onClick={handleReset}>
              Reset
            </Button>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form>
            <Form.Group controlId="formProjectCode">
              <Dropdown1
                label={"Project"}
                options={projects.map((project) => ({
                  value: project.project_id,
                  label: project.project_name,
                }))}
                value={selectedProjectShortOptions}
                onChange={handleProjectChange1}
              />
            </Form.Group>
            <Form.Group controlId="formMilestoneDate">
              <Form.Label>Milestone Date</Form.Label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                className="form-control"
                dateFormat="dd/MM/yyyy"
                isClearable
              />
            </Form.Group>

          </Form>
        </Offcanvas.Body>
      </Offcanvas>

      <Row>
        <Col>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <Card.Title as="h5" className="mb-0">Milestone</Card.Title>
              <div>
                <Button
                  title={isFilterApplied ? 'Clear Filter' : 'Filter'}
                  className="badge rounded-pill bg-info p-2 mr-2"
                  onClick={() => {
                    if (isFilterApplied) {
                      handleReset();
                    } else {
                      setShowSidebar(true);
                    }
                  }}
                >
                  {isFilterApplied ? <FaTimes /> : <FaFilter />}
                </Button>
                <Button title='Add' className="badge rounded-pill bg-info p-2" onClick={handleAddButtonClick}>
                  +
                </Button>
              </div>
            </Card.Header>
            <Table columns={columns1} data={data1} />
          </Card>
        </Col>
      </Row>

      <CustomModal
        show={showForm}
        handleClose={handleFormClose}
        title="Add Milestone"
      >
        <ReusableForm
          formConfig={[
            {
              name: 'project_id', label: 'Project', type: 'dropdown', options: projects.map((project) => ({
                value: project.project_id, name: project.project_name,
              })), isRequired: true
            },
            { name: 'mlstn_id', label: 'Milestone Id', type: 'text', isRequired: true },
            { name: 'mlstn_name', label: 'Milestone Name', type: 'text', isRequired: true },
            { name: 'mlstn_shortname', label: 'Milestone Code', type: 'text', isRequired: true },
            // {
            //   name: 'mlstn_parentid', label: 'Parent Milestone', type: 'dropdown', options: milestones.map((project) => ({
            //     value: project.tid, name: project.mlstn_name,
            //   })),
            // },
            { name: 'budget', label: 'Milestone Value', type: 'text', isRequired: true },
            // { name: 'monthly_value', label: 'Monthly Value', type: 'text'},

            { name: 'startdate', label: 'Start Date', type: 'date', isRequired: true },
            { name: 'enddate', label: 'End Date', type: 'date', isRequired: true },
          ]}
          onSubmit={handleFormSubmit}
        />
      </CustomModal>

      <CustomModal
        show={showEditForm}
        handleClose={handleEditClose}
        title="Edit Milestone"
      >
        <ReusableForm
          formConfig={[
            {
              name: 'project_id', label: 'Project', type: 'dropdown', options: projects.map((project) => ({
                value: project.project_id, name: project.project_name,
              })), initialValue: selectedRow ? selectedRow.project_name : '', isRequired: true
            },
            // { name: 'mlstn_id', label: 'Milestone Id', type: 'text', initialValue: selectedRow ? selectedRow.mlstn_id : '',isRequired: true, isDisabled: true },
            { name: 'mlstn_name', label: 'Milestone Name', type: 'text', initialValue: selectedRow ? selectedRow.milestone : '', isRequired: true },
            { name: 'mlstn_shortname', label: 'Milestone Code', type: 'text', initialValue: selectedRow ? selectedRow.mlstn_shortname : '', isRequired: true },
            // {
            //   name: 'mlstn_parentid', label: 'Parent Milestone', type: 'dropdown', options: milestones.map((project) => ({
            //     value: project.tid, name: project.mlstn_name,
            //   })),initialValue: selectedRow ? selectedRow.project_id : ''
            // },
            { name: 'budget', label: 'Milestone Value', type: 'text', initialValue: selectedRow ? selectedRow.milestone_value : '' },
            // { name: 'monthly_value', label: 'Monthly Value', type: 'text',initialValue: selectedRow ? selectedRow.monthly_value : ''},

            { name: 'startdate', label: 'Start Date', type: 'date', initialValue: selectedRow ? selectedRow.mlstn_startdate : '', isRequired: true },
            { name: 'enddate', label: 'End Date', type: 'date', initialValue: selectedRow ? selectedRow.mlstn_enddate : '', isRequired: true },

            
          ]}
          onSubmit={handleEditFormSubmit}
        />
      </CustomModal>
    </div>
  );
};

export default BootstrapTable;
