import React, { useState, useEffect } from "react";
import Table from "../../common/table";
import config1 from "../../common/mis";
import { misAlert, postData, generateColumns, fetchFilterDrops } from "../../common/common";
import { Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Row, Col, Input } from 'reactstrap';
import { Card } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import ReusableForm from "../../common/form";
import CustomModal from "./modalform";

function UserDetails() {
    const [data, setData] = useState([]);
    const [data1, setData1] = useState([]);
    const [data2, setData2] = useState([]);
    const [data3, setData3] = useState([]);
    const [user, setUser] = useState([]);
    const [domain, setDomain] = useState([]);
    const [location, setLocation] = useState([]);
    const [project, setProject] = useState([]);
    const [selectedUserForEdit, setSelectedUserForEdit] = useState(null);
    const [projects, setProjects] = useState([]);

    const [dropdownOpen, setDropdownOpen] = useState(false);


    const [bu, setBu] = useState([]);
    const [busl, setBusl] = useState([]);
    const [customer, setCustomer] = useState([]);
    const [vertical, setVertical] = useState([]);  
    useEffect(() => {
        fetchDropdownData();
      }, []);
    const fetchDropdownData = async () => {
        await Promise.all([
          fetchFilterDrops("getallprojectsdetails", "tid,project_name,project_shortname", setProjects),
          fetchFilterDrops("getbu", "id,bu", setBu),
          fetchFilterDrops("getbusl", "id,bu_sl", setBusl),
          fetchFilterDrops("getcustomer", "id,customer", setCustomer),
          fetchFilterDrops("getbuvertical", "id,bu_vertical", setVertical),
        ]);
      };
    
    const [formData, setFormData] = useState({
        userid: "",
        password: "",
        role: "",
        phonenumber: "",
        email: "",
        teamleader: "",
        location: "",
        project: [],
        fullname: "",
        isactive: true,
        manager: "",
    });
    const handleFormSubmit = async (formData) => {
        console.log(formData)
        
      };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    var tableCols = config1.TableColumns.UserDetails.split(",");
    const columns1 = generateColumns(config1.TableColumns.UserDetails);
    const columns = generateColumns(config1.DisplayColumns.UserDetails);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showEditForm1, setShowEditForm1] = useState(false);
    const [showModal1, setShowModal1] = useState(false);

    const openForm = () => {
        setShowEditForm(true);
        setShowModal(true);
    };
    const openForm1 = () => {
        setShowEditForm1(true);
        setShowModal1(true);
    };
    const handleCloseModal = () => {
        setShowModal(false);
        setShowEditForm(false);
    };
    const handleCloseModal1 = () => {
        setShowModal1(false);
        setShowEditForm1(false);

    };
    const actionItems = [
        {
            label: "Edit",
            onClick: handleEdit
        },
    ]; async function handleEdit(row) {
        const inputdata = {
            action: "getuserview",
            AndOr: "and",
            propcorpid: row.userid,
        };
        const response = await postData(config1.ProcessQuery.url, inputdata);

        if (
            selectedUserForEdit &&
            selectedUserForEdit.userid !== row.userid
        ) {
            setShowEditForm(false);
            setShowModal(false);
        }
        setSelectedUserForEdit(row);
        setData3(response.data);
        setShowModal(true);
        setShowEditForm(true);
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData1 = new FormData();
            formData1.append("coldata", JSON.stringify(data2));
            formData1.append(
                "action",
                selectedUserForEdit ? "updateuser" : "insertuser"
            );
            formData1.append("propusername", formData.fullname);
            formData1.append("proppassword", formData.password || "");
            formData1.append("propmobilenum", formData.phonenumber);
            formData1.append("propemailid", formData.email);
            formData1.append("propcorpid", formData.userid);
            if (selectedUserForEdit) {
                formData1.append("propjuid", data3[0].uid);
            }
            const response = await postData(
                config1.UpdateDatawithfunction.url,
                formData1
            );
            const updatedData = [...data, response.data];
            setData(updatedData);
            setFormData({
                userid: "",
                password: "",
                role: "",
                phonenumber: "",
                email: "",
                teamleader: "",
                location: "",
                project: "",
                fullname: "",
                isactive: true,
            });
            misAlert("success", "Data Saved successfully.");
        } catch (error) {
            console.error("Error submitting form:", error);
            misAlert("error", "Error adding user. Please try again.");
        }
        window.location.reload(true);
    };
    useEffect(() => {
        fetchFilterDrops("getmanagerlist", "uid,username", setUser);
        fetchFilterDrops("getalluserroles", "roleid,role", setDomain);
        fetchFilterDrops("getalllocationdetails", "locationid,locationname", setLocation);
        fetchFilterDrops("getallprojectsdetails", "projectdetailid,projdetails", setProject);
        fetchData();
        fetchData2();
        if (selectedUserForEdit) {
            const selectedRole = domain.find(
                (project) => project.role === selectedUserForEdit.role
            );
            const selectedTeamleader = user.find(
                (project) => project.username === selectedUserForEdit.teamleader
            );
            const selectedManager = user.find(
                (project) => project.username === selectedUserForEdit.manager
            );
            const selectedLocation = location.find(
                (project) => project.locationname === selectedUserForEdit.location
            );
            const selectedProjects = selectedUserForEdit.projects
                ? selectedUserForEdit.projects.split(",")
                : [];

            const selectedProjectValues = selectedProjects.map((projectName) => {
                const project1 = project.find((p) => p.projdetails === projectName);
                return project1 ? project1.projectdetailid : "";
            });

            setFormData({
                userid: selectedUserForEdit.userid || "",
                password: data3[0].password || "",
                role: selectedRole ? selectedRole.roleid : "",
                isactive: selectedUserForEdit.isactive === "red" ? false : true,
                teamleader: selectedTeamleader ? selectedTeamleader.uid : "",
                phonenumber: selectedUserForEdit.mobile || "",
                email: selectedUserForEdit.emailid || "",
                project: selectedProjectValues || [],
                fullname: selectedUserForEdit.fullname || "",
                location: selectedLocation.locationid || "",
                manager: selectedManager ? selectedManager.uid : "",
            });
        }
    }, [selectedUserForEdit]);
    const fetchData = async () => {
        try {
            const requestData = {
                action: "getdatafordatatable",
                ["values[]"]: [
                    "1",
                    tableCols,
                    "",
                    "",
                    "devapp.vwuserdetails",
                    "0",
                    "2000",
                    "userid",
                ],
            };
            const response = await postData(
                config1.ProcessDataTableQuery.url,
                requestData
            );
            const dataWithActionColumn = response.data.map((row) => ({
                ...row,
                // action: <ActionColumn row={row} />,
            }));
            setData1(dataWithActionColumn);
        } catch (error) {
            misAlert("error", "Error fetching data:", error);
        }
    };

    const fetchData2 = async () => {
        try {
            var inputData = {
                action: "getdatatypes",
                proptable_schema: "devapp",
                proptable_name: "tbluserdetails",
            };
            const response = await postData(config1.ProcessQuery.url, inputData);
            setData2(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    return (
        <div>
            {showEditForm && (
                <Modal isOpen={showModal} toggle={handleCloseModal} size="lg">
                    <ModalHeader toggle={handleCloseModal}>User Details</ModalHeader>
                    <ModalBody>
                        <Form className="custom-form">
                            <Row>
                                <Col>
                                    <FormGroup>
                                        <Label for="userid">User ID</Label>
                                        <Input
                                            type="text"
                                            name="userid"
                                            value={formData.userid}
                                            onChange={handleChange}
                                            required
                                        />
                                    </FormGroup>
                                </Col>
                                <Col>
                                    <FormGroup>
                                        <Label for="password">Password</Label>
                                        <Input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <FormGroup>
                                        <Label for="fullname">Full Name</Label>
                                        <Input
                                            type="text"
                                            name="fullname"
                                            value={formData.fullname}
                                            onChange={handleChange}
                                            required
                                        />
                                    </FormGroup>
                                </Col>
                                <Col>
                                    <FormGroup>
                                        <Label for="phonenumber">Mobile</Label>
                                        <Input
                                            type="text"
                                            name="phonenumber"
                                            value={formData.phonenumber}
                                            onChange={handleChange}
                                            required
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <Col>
                                    <FormGroup>
                                        <Label for="email">Email</Label>
                                        <Input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                        </Form>
                    </ModalBody>
                    <ModalFooter>

                        <Button color="primary" onClick={handleSubmit}>
                            Save
                        </Button>{" "}
                    </ModalFooter>
                </Modal>
            )}
            <Card>
                <Card.Header className="d-flex justify-content-between align-items-center">
                    <Card.Title as="h5" className="mb-0">Users</Card.Title>

                    <Button title='Add' className="badge rounded-pill bg-info p-2" onClick={openForm}>
                        +
                    </Button>
                    <Button title='Add' className="badge rounded-pill bg-info p-2" onClick={openForm1}>
                        -
                    </Button>
                </Card.Header>
                {/* <Card.Body> */}
                <Table columns={columns1} data={data1} />
                {/* </Card.Body> */}
            </Card>
            <CustomModal
          show={showEditForm1}
          handleClose={handleCloseModal1}
          title="User Configuration"
        >
          <ReusableForm
            formConfig={[
                {
                    name: 'project_parent_id', label: 'Project', type: 'dropdown', options: projects.map((project) => ({
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
            ]}
            onSubmit={handleFormSubmit}
          />
        </CustomModal>
        </div>
        
    );
}

export default UserDetails;
