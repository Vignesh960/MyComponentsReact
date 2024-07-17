import React, { useState, useEffect } from "react";
import Table from "../../common/table";
import ReusableForm from "../../common/form";
import CustomModal from "./modalform";
import config1 from "../../common/mis";
import { misAlert, postData, generateColumnsWithAction, fetchFilterDrops } from "../../common/common";
import { Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import FilterSidebar from "./sideFilterForm";
import { FaFilter, FaTimes, FaEdit,FaEye  } from 'react-icons/fa';

const BootstrapTable = () => {
  const [data1, setData1] = useState([]);
  const [selectedProjectOptions, setselectedProjectOptions] = useState([]);
  const [selectedProjectShortOptions, setselectedProjectShortOptions] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const [bu, setBu] = useState([]);
  const [busl, setBusl] = useState([]);
  const [customer, setCustomer] = useState([]);
  const [vertical, setVertical] = useState([]);
  const [selectedBu, setselectedBu] = useState([]);
  const [selectedBusl, setselectedBusl] = useState([]);
  const [selectedCustomer, setselectedCustomer] = useState([]);
  const [selectedVertical, setselectedVertical] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]); // Define selectedRows state

  const tableCols = config1.TableColumns.viewproject.split(",");
  const columns1 = generateColumnsWithAction(config1.DisplayColumns.viewproject);

  useEffect(() => {
    fetchData();
    fetchDropdownData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [selectedProjectOptions, selectedProjectShortOptions, startDate, endDate, selectedBu, selectedBusl, selectedCustomer, selectedVertical]);

  const fetchDropdownData = async () => {
    await Promise.all([
      fetchFilterDrops("getallprojectsdetails", "tid,project_name,project_shortname", setProjects),
      fetchFilterDrops("getbu", "id,bu", setBu),
      fetchFilterDrops("getbusl", "id,bu_sl", setBusl),
      fetchFilterDrops("getcustomer", "id,customer", setCustomer),
      fetchFilterDrops("getbuvertical", "id,bu_vertical", setVertical),
    ]);
  };

  const handleFilterChange = (setter) => (selectedValue) => {
    setter(selectedValue);
  };
  const fetchData = async () => {
    try {
      let filtertext = '';

      if (selectedProjectOptions.length > 0) {
        filtertext += `tid IN (${selectedProjectOptions.map(option => `'${option}'`).join(',')})`;
      }

      if (selectedProjectShortOptions.length > 0) {
        if (filtertext) filtertext += ' AND ';
        filtertext += `tid IN (${selectedProjectShortOptions.map(option => `'${option}'`).join(',')})`;
      }
      if (selectedBu.length > 0) {
        if (filtertext) filtertext += ' AND ';
        filtertext += `bu IN (${selectedBu.map(option => `'${option}'`).join(',')})`;
      }

      if (selectedBusl.length > 0) {
        if (filtertext) filtertext += ' AND ';
        filtertext += `bu_sl IN (${selectedBusl.map(option => `'${option}'`).join(',')})`;
      }

      if (selectedVertical.length > 0) {
        if (filtertext) filtertext += ' AND ';
        filtertext += `bu_vertical IN (${selectedVertical.map(option => `'${option}'`).join(',')})`;
      }

      if (selectedCustomer.length > 0) {
        if (filtertext) filtertext += ' AND ';
        filtertext += `customer IN (${selectedCustomer.map(option => `'${option}'`).join(',')})`;
      }
      if (startDate && endDate) {
        if (filtertext) filtertext += ' AND ';
        filtertext += `(startdate >= '${format(startDate, "dd/MM/yyyy")}' AND enddate <= '${format(endDate, "dd/MM/yyyy")}')`;
      } else {
        if (startDate) {
          if (filtertext) filtertext += ' AND ';
          filtertext += `startdate >= '${format(startDate, "dd/MM/yyyy")}'`;
        }
        if (endDate) {
          if (filtertext) filtertext += ' AND ';
          filtertext += `enddate <= '${format(endDate, "dd/MM/yyyy")}'`;
        }
      }
      const requestData = {
        action: "getdatafordatatable",
        ["values[]"]: ["1", tableCols, "", filtertext, "devapp.vwproject", "0", "2000", "project_id"]
      };
      const response = await postData(config1.ProcessDataTableQuery.url, requestData);
      const dataWithActionColumn = response.data.map((row) => ({
        ...row,
        action: <FaEdit title="Edit" onClick={() => handleEditClick(row)} style={{ cursor: 'pointer' }} />,
        'total_milestones': (
          <Link to={`/tables/milestone?projectId='${row.project_id}'`}>
            {row.total_milestones}
          </Link>
        ),
      }));
      setData1(dataWithActionColumn);

      setIsFilterApplied(!!filtertext);
    } catch (error) {
      misAlert("error", "Error fetching data:", error);
    }
  };

  const handleReset = () => {
    setselectedProjectOptions([]);
    setselectedProjectShortOptions([]);
    setselectedBu([]);
    setselectedBusl([]);
    setselectedCustomer([]);
    setselectedVertical([]);
    setStartDate(null);
    setEndDate(null);
  };

  const handleAddButtonClick = () => {
    setShowForm(true);
    setSelectedRow(null);
  };

  const handleFormSubmit = async (formData) => {
    if (formData.project_parent_id === "") {
      formData.project_parent_id = 0;
    }
    if (formData.hours === "") {
      formData.hours = 0;
    }
    if (formData.startdate === "") {
      formData.startdate =formData.enddate;

    }
    const inputdata = { action: 'insertprojects', AndOr: "and", 'values[]': [formData] };
    const response = await postData(config1.ProcessQueryWitVals.url, inputdata);
    if (response.data[0]['insertprojectdata'] === 'sucess') {
      misAlert('success', 'Data Inserted Successfully');
      setShowForm(false);
      fetchData();
    } else {
      misAlert('error', response.data[0]['insertprojectdata']);
    }
  };
  const handleEditFormSubmit = async (formData) => {
    console.log(formData)
    if (formData.budget === "") {
      formData.budget = selectedRow ? selectedRow.budget : '';
    }
    if (formData.hours === "") {
      formData.hours = 0;
    }
    const inputdata = { action: 'updateprojects', AndOr: "and", 'values[]': [formData] };
    const response = await postData(config1.ProcessQueryWitVals.url, inputdata);
    if (response.data[0]['updateprojectdata'] === 'success') {
      misAlert('success', 'Data Updated Successfully');
      setShowEditForm(false);
      fetchData();
    } else {
      misAlert('error', response.data[0]['insertprojectdata']);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
  };
  const handleEditClose = () => {
    setShowEditForm(false);
  };
  const handleEditClick = (row) => {
    console.log(row)
    setSelectedRow(row);
    setShowEditForm(true);
  };
  function orderProjects(data) {
    const orderedProjects = [];
    const processedProjects = new Set(); // To keep track of processed parent projects

    data.forEach(project => {
        if (!processedProjects.has(project.project_id)) {
            orderedProjects.push(project);
            processedProjects.add(project.project_id);

            const mainProjectName = project.project_name;
            const childProjects = data.filter(p => p.parent_project === mainProjectName);

            childProjects.forEach(child => {
                orderedProjects.push(child);
                processedProjects.add(child.project_id);
            });
        }
    });

    return orderedProjects;
}

// Example usage:
const orderedProjects = orderProjects(data1);

  return (
    <div>
      <FilterSidebar
        isOpen={isFilterOpen}
        handleClose={() => setIsFilterOpen(false)}
        bu={bu}
        busl={busl}
        vertical={vertical}
        customer={customer}
        projects={projects}
        selectedBu={selectedBu}
        selectedBusl={selectedBusl}
        selectedVertical={selectedVertical}
        selectedCustomer={selectedCustomer}
        selectedProjectOptions={selectedProjectOptions}
        selectedProjectShortOptions={selectedProjectShortOptions}
        startDate={startDate}
        endDate={endDate}
        handleBuChange={handleFilterChange(setselectedBu)}
        handleBuSlChange={handleFilterChange(setselectedBusl)}
        handleVerticalChange={handleFilterChange(setselectedVertical)}
        handleCustomerChange={handleFilterChange(setselectedCustomer)}
        handleProjectChange={handleFilterChange(setselectedProjectOptions)}
        handleProjectChange1={handleFilterChange(setselectedProjectShortOptions)}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        handleReset={handleReset}
      />

      <Row>
        <Col>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <Card.Title as="h5" className="mb-0">Projects</Card.Title>
              <div>
                <Button title='View Milestone' className="badge rounded-pill bg-info p-2" >
                  {selectedRows.length > 0 && (
                    <Link to={`/tables/milestone?projectId=${selectedRows.map(row => `'${row.project_id}'`).join(',')}`}>
                     < FaEye  />
                    </Link>
                  )}
                </Button>
                <Button
                  title={isFilterApplied ? 'Clear Filter' : 'Filter'}
                  className="badge rounded-pill bg-info p-2 mr-2"
                  onClick={() => {
                    if (isFilterApplied) {
                      handleReset();
                    } else {
                      setIsFilterOpen(true);
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
            <Table columns={columns1} data={orderedProjects} checkNeeded={true} onSelectedRowsChange={setSelectedRows} displayColumns={columns1} />
          </Card>
        </Col>
      </Row>

      {/* {projects.length > 0 && ( */}
        <CustomModal
          show={showForm}
          handleClose={handleFormClose}
          title="Add Project"
        >
          <ReusableForm
            formConfig={[
              { name: 'project_id', label: 'Project Id', type: 'text', isRequired: true },
              { name: 'project_name', label: 'Project Name', type: 'text', isRequired: true },
              // { name: 'project_shortname', label: 'Project Code', type: 'text', isRequired: true },
              { name: 'budget', label: 'Budget', type: 'text', isRequired: true },
              {
                name: 'project_parent_id', label: 'Parent Project', type: 'dropdown', options: projects.map((project) => ({
                  value: project.tid, name: project.project_name,
                })),
              },
              {
                name: 'bu_id', label: 'BU', type: 'dropdown', options: bu.map((project) => ({
                  value: project.id, name: project.bu,
                })), isRequired: true
              },
              {
                name: 'bu_vertical_id', label: 'BU Vertical', type: 'dropdown', options: vertical.map((project) => ({
                  value: project.id, name: project.bu_vertical,
                })), isRequired: true
              },
              {
                name: 'customer_id', label: 'Customer', type: 'dropdown', options: customer.map((project) => ({
                  value: project.id, name: project.customer,
                })), isRequired: true
              },
              {
                name: 'bu_sl_id', label: 'BU SL', type: 'dropdown', options: busl.map((project) => ({
                  value: project.id, name: project.bu_sl,
                })), isRequired: true
              },
              {
                name: 'category',
                label: 'Category',
                type: 'dropdown',
                options: [
                  { value: 'PO', name: 'PO' },
                  { value: 'CR', name: 'CR' },
                  // { value: 'Penalty', name: 'Penalty' },
                ],               
                isRequired: true
              },
              // { name: 'category', label: 'Category', type: 'text',isRequired: true},

              
              {
                name: 'invoiced',
                label: 'Invoiced',
                type: 'dropdown',
                options: [
                  { value: 'Yet To Start', name: 'Yet To Start' },
                  { value: 'WIP', name: 'WIP' },
                  { value: 'To be invoiced', name: 'To be invoiced' },

                ],               
                isRequired: true
              },
              // { name: 'calculated_budget', label: 'Calculated Budget', type: 'text'},
              // { name: 'hours', label: 'Per Day Hours', type: 'text' },
              { name: 'startdate', label: 'Start Date', type: 'date' },
              { name: 'enddate', label: 'End Date', type: 'date', isRequired: true },
            ]}
            onSubmit={handleFormSubmit}
          />
        </CustomModal>
      {/* )} */}
      {projects.length > 0 && (
        <CustomModal
          show={showEditForm}
          handleClose={handleEditClose}
          title="Edit Project"
        >
          <ReusableForm
            formConfig={[
              { name: 'project_id', label: 'Project Id', type: 'text', initialValue: selectedRow ? selectedRow.project_id : '', isRequired: true, isDisabled: true },
              { name: 'project_name', label: 'Project Name', type: 'text', initialValue: selectedRow ? selectedRow.project_name : '', isRequired: true },
              // { name: 'project_shortname', label: 'Project Code', type: 'text', initialValue: selectedRow ? selectedRow.project_code : '', isRequired: true },
              { name: 'budget', label: 'Budget', type: 'text', initialValue: selectedRow ? selectedRow.budget : '', isRequired: true },
              // {
              //   name: 'project_parent_id', label: 'Parent Project', type: 'dropdown', options: projects.map((project) => ({
              //     value: project.tid, name: project.project_name,
              //   })),
              // },
              {
                name: 'bu_id', label: 'BU', type: 'dropdown', options: bu.map((project) => ({
                  value: project.id, name: project.bu,
                })), initialValue: selectedRow ? selectedRow.bu : '', isRequired: true
              },
              {
                name: 'bu_vertical_id', label: 'BU Vertical', type: 'dropdown', options: vertical.map((project) => ({
                  value: project.id, name: project.bu_vertical,
                })), initialValue: selectedRow ? selectedRow.bu_vertical : '', isRequired: true
              },
              {
                name: 'customer_id', label: 'Customer', type: 'dropdown', options: customer.map((project) => ({
                  value: project.id, name: project.customer,
                })), initialValue: selectedRow ? selectedRow.customer : '', isRequired: true
              },
              {
                name: 'bu_sl_id', label: 'BU SL', type: 'dropdown', options: busl.map((project) => ({
                  value: project.id, name: project.bu_sl,
                })), initialValue: selectedRow ? selectedRow.bu_sl : '', isRequired: true
              },
              {
                name: 'category',
                label: 'Category',
                type: 'dropdown',
                options: [
                  { value: 'PO', name: 'PO' },
                  { value: 'CR', name: 'CR' },
                  // { value: 'Penalty', name: 'Penalty' },
                ],
                initialValue: selectedRow ? selectedRow.category : '',              
                isRequired: true
              },
              // { name: 'category', label: 'Category', type: 'text',isRequired: true,initialValue: selectedRow ? selectedRow.category : '',  },

              
              {
                name: 'invoiced',
                label: 'Invoiced',
                type: 'dropdown',
                options: [
                  { value: 'Yet To Start', name: 'Yet To Start' },
                  { value: 'WIP', name: 'WIP' },
                  { value: 'To be invoiced', name: 'To be invoiced' },

                ],
                initialValue: selectedRow ? selectedRow.invoiced : '',               
                isRequired: true
              },
              // { name: 'calculated_budget', label: 'Calculated Budget', type: 'text', initialValue: selectedRow ? selectedRow.calculated_budget : ''},
              // { name: 'hours', label: 'Per Day Hours', type: 'text', initialValue: selectedRow ? selectedRow.per_day_hours : ''},
              { name: 'startdate', label: 'Start Date', type: 'date', initialValue: selectedRow ? selectedRow.startdate : ''},
              { name: 'enddate', label: 'End Date', type: 'date', initialValue: selectedRow ? selectedRow.enddate : '', isRequired: true },
            ]}
            onSubmit={handleEditFormSubmit}
          />
        </CustomModal>
      )}
    </div>
  );
};

export default BootstrapTable;
