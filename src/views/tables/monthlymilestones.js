import React, { useState, useEffect } from "react";
import Table from "../../common/table";
import config1 from "../../common/mis";
import { misAlert, postData, fetchFilterDrops, generateColumnsWithAction } from "../../common/common";
import { Row, Col, Card, Form, Button, Offcanvas } from 'react-bootstrap';
import Dropdown1 from "../../common/Dropdown";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { useLocation } from "react-router-dom";
import ReusableForm from "../../common/form";
import CustomModal from "./modalform";
import { FaFilter, FaTimes, FaEdit, } from 'react-icons/fa';
import { IoIosGitCompare } from 'react-icons/io';
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

  const [showSpliForm, setShowSplitForm] = useState(false);


  const tableCols = config1.TableColumns.viewmilestone1.split(",");
  const columns1 = generateColumnsWithAction(config1.DisplayColumns.viewmilestone1);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  useEffect(() => {
    fetchData();
    fetchFilterDrops("getallprojectsdetails", "tid,project_id,project_name,project_shortname", setProjects);
    fetchFilterDrops("getallmilestones", "tid,mlstn_id,mlstn_name", setMilestones);
  }, []);

  useEffect(() => {
    fetchData();
  }, [selectedProjectShortOptions, startDate, selectedDate]);

  const handleProjectChange1 = (selectedValue) => {
    setselectedProjectShortOptions(selectedValue);
  };

  const handleReset = () => {
    setselectedProjectShortOptions("");
    setSelectedDate(null);
    setStartDate(null);
    setIsFilterApplied(false);
  };

  const handleEditClick = (row) => {
    setSelectedRow(row);
    setShowEditForm(true);
  };
  const handleSplitClick = (row) => {
    setSelectedRow(row);
    setShowSplitForm(true);
  };
  const fetchData = async () => {
    try {
      let filtertext = '';
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
        filtertext += `mlstn_startdate = '${format(startDate, 'yyyy-MM-dd')}'`;
      }
      if (selectedDate) {
        const selectedYear = selectedDate.getFullYear();
        const selectedMonth = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
        const daysInMonth = new Date(selectedYear, selectedDate.getMonth() + 1, 0).getDate();


        if (filtertext) filtertext += ' AND ';
        filtertext += `mlstn_startdate >= '${selectedYear}-${selectedMonth}-01' AND mlstn_startdate <= '${selectedYear}-${selectedMonth}-${daysInMonth}'`;
      }
      const requestData = {
        action: "getdatafordatatable",
        ["values[]"]: [
          "1",
          tableCols,
          "",
          filtertext,
          "devapp.vwmonthlymilestone",
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
        action: (
          <>
            <FaEdit
              title="Edit"
              onClick={() => handleEditClick(row)}
            />
            <IoIosGitCompare
              title="Split"
              onClick={() => handleSplitClick(row)}

            />
          </>
        ),
      }));

      setData1(dataWithActionColumn);
      setIsFilterApplied(!!filtertext);
    } catch (error) {
      misAlert("error", "Error fetching data:", error);
    }
  };



  const handleFormSubmit = async (formData) => {
    console.log(formData)
    if (formData.mlstn_parentid === "") {
      formData.mlstn_parentid = 0;
    }
    formData.budget = 0
    var inputdata = { action: 'insertmilestone', AndOr: "and", 'values[]': [formData] };
    const response = await postData(config1.ProcessQueryWitVals.url, inputdata);
    if (response.data[0]['insertmilestonedata'] === 'sucess') {
      misAlert('success', 'Data Inserted Successfully');
      setShowForm(false);
      setShowSplitForm(false);
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
    formData.budget = selectedRow.milestone_value || 0
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
  const handleSpliClose = () => {
    setShowSplitForm(false);
  };

  function orderProjects(data) {
    const orderedProjects = [];
    const processedProjects = new Set(); // To keep track of processed projects

    // Function to recursively process projects
    function processProject(project) {
      if (!processedProjects.has(project.mlstn_id)) {
        orderedProjects.push(project);
        processedProjects.add(project.mlstn_id);

        const mainProjectName = project.milestone;
        const childProjects = data.filter(p => p.parent_milestone === mainProjectName);

        childProjects.forEach(child => {
          processProject(child); // Recursively process child projects
        });
      }
    }

    // Find top-level parent projects (projects without a parent)
    const topLevelProjects = data.filter(project => !data.some(p => p.milestone === project.parent_milestone));
    topLevelProjects.forEach(project => {
      processProject(project);
    });

    return orderedProjects;
  }



  const orderedProjects = orderProjects(data1);

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
            <Form.Group controlId="formMonthDropdown">
              <Form.Label>Select Month</Form.Label>
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="MM/yyyy"
                showMonthYearPicker
                scrollableYearDropdown
                yearDropdownItemNumber={15}
                placeholderText="Select Month and Year"
                className="form-control"
              />


            </Form.Group>

          </Form>
        </Offcanvas.Body>
      </Offcanvas>

      <Row>
        <Col>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <Card.Title as="h5" className="mb-0">Monthly Milestones</Card.Title>
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
              </div>
            </Card.Header>
            <Table columns={columns1} data={orderedProjects} />
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
              name: 'project_id', label: 'Project Id', type: 'dropdown', options: projects.map((project) => ({
                value: project.project_id, name: project.project_name,
              })), isRequired: true
            },
            { name: 'mlstn_id', label: 'Milestone Id', type: 'text', isRequired: true },
            { name: 'mlstn_name', label: 'Milestone', type: 'text', isRequired: true },
            { name: 'mlstn_shortname', label: 'Milestone Code', type: 'text', isRequired: true },
            {
              name: 'mlstn_parentid', label: 'Parent Milestone', type: 'dropdown', options: milestones.map((project) => ({
                value: project.mlstn_id, name: project.mlstn_name,
              })),
            },
            { name: 'budget', label: 'Milestone Value', type: 'text', isRequired: true },
            { name: 'monthly_value', label: 'Monthly Value', type: 'text' },

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
            { name: 'mlstn_id', label: 'Milestone Id', type: 'text', initialValue: selectedRow ? selectedRow.mlstn_id : '', isRequired: true, isDisabled: true },
            { name: 'mlstn_name', label: 'Milestone Name', type: 'text', initialValue: selectedRow ? selectedRow.milestone : '', isRequired: true },
            { name: 'mlstn_shortname', label: 'Milestone Code', type: 'text', initialValue: selectedRow ? selectedRow.mlstn_shortname : '', isRequired: true },
            // {
            //   name: 'mlstn_parentid', label: 'Parent Milestone', type: 'dropdown', options: milestones.map((project) => ({
            //     value: project.tid, name: project.mlstn_name,
            //   })),initialValue: selectedRow ? selectedRow.project_id : ''
            // },
            {
              name: 'location',
              label: 'Location',
              type: 'dropdown',
              options: [
                { value: 'Onshore ', name: 'Onshore ' },
                { value: 'Offshore', name: 'Offshore' },
              ],
              initialValue: selectedRow ? selectedRow.location : '',
              isRequired: true
            },
            // { name: 'budget', label: 'Milestone Value', type: 'text', initialValue: selectedRow ? selectedRow.milestone_value : '', isDisabled: true },
            { name: 'monthly_value', label: 'Monthly Value', type: 'text', initialValue: selectedRow ? selectedRow.monthly_value : '' },


            { name: 'startdate', label: 'Start Date', type: 'date', initialValue: selectedRow ? selectedRow.mlstn_startdate : '', isRequired: true },
            { name: 'enddate', label: 'End Date', type: 'date', initialValue: selectedRow ? selectedRow.mlstn_enddate : '', isRequired: true },
            {
              name: 'status',
              label: 'Status',
              type: 'dropdown',
              options: [
                { value: 'Yet To Start', name: 'Yet To Start' },
                { value: 'In Progress', name: 'In Progress' },
                { value: 'Recognised', name: 'Recognised' },
                { value: 'Invoiced', name: 'Invoiced' },
                { value: 'Advance Invoiced', name: 'Advance Invoiced' }
              ],
              initialValue: selectedRow ? selectedRow.status : 'Yet To Start', // Default value
              isRequired: true
            },
          ]}
          onSubmit={handleEditFormSubmit}
        />
      </CustomModal>
      <CustomModal
        show={showSpliForm}
        handleClose={handleSpliClose}
        title="Split Milestone"
      >
        <ReusableForm
          formConfig={[
            {
              name: 'project_id', label: 'Project', type: 'dropdown', options: projects.map((project) => ({
                value: project.project_id, name: project.project_name,
              })), initialValue: selectedRow ? selectedRow.project_name : '', isRequired: true, isDisabled: true
            },
            {
              name: 'mlstn_parentid', label: 'Parent Milestone', type: 'dropdown', options: milestones.map((project) => ({
                value: project.mlstn_id, name: project.mlstn_name,
              })), initialValue: selectedRow ? selectedRow.milestone : '', isDisabled: true
            },
            { name: 'mlstn_id', label: 'Milestone Id', type: 'text', isRequired: true, },
            { name: 'mlstn_name', label: 'Milestone Name', type: 'text', isRequired: true },
            { name: 'mlstn_shortname', label: 'Milestone Code', type: 'text', isRequired: true },
            {
              name: 'location',
              label: 'Location',
              type: 'dropdown',
              options: [
                { value: 'Onshore ', name: 'Onshore ' },
                { value: 'Offshore', name: 'Offshore' },
              ],
              isRequired: true
            },
            // { name: 'budget', label: 'Budget', type: 'text'},
            { name: 'monthly_value', label: 'Monthly Value', type: 'text' },
            { name: 'startdate', label: 'Start Date', type: 'date', isRequired: true },
            { name: 'enddate', label: 'End Date', type: 'date', isRequired: true },
          ]}
          onSubmit={handleFormSubmit}
        />
      </CustomModal>
    </div>
  );
};

export default BootstrapTable;
