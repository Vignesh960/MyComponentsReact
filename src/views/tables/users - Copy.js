import React, { useState, useEffect } from "react";
import Table from "../../common/table";
import config1 from "../../common/mis";
import { misAlert, postData, generateColumns, fetchFilterDrops } from "../../common/common";
import Dropdown1 from "../../common/Dropdown";
import moment from "moment";
import { Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Button, Row, Col, Input } from 'reactstrap';
import { Card } from 'react-bootstrap';

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
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggleDropdown = () => {
        setDropdownOpen(prevState => !prevState);
    }
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

    const openForm = () => {
        setShowEditForm(true);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setShowEditForm(false);
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
            formData1.append("proproleid", formData.role);
            formData1.append("propisactive", formData.isactive);
            formData1.append("propmanagerid", formData.manager);
            formData1.append("propmobilenum", formData.phonenumber);
            formData1.append("propemailid", formData.email);
            formData1.append("propcorpid", formData.userid);
            formData1.append("propjod", moment().format("MM/DD/YY"));
            formData1.append("propdob", moment().format("MM/DD/YY"));
            formData1.append("proplevel", 1);
            formData1.append("propprojects", formData.project);
            formData1.append("propteamleaderid", formData.teamleader);
            formData1.append("proplocationid", formData.location);
            formData1.append("propcreatedby", 1);
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
                                <Col>
                                    <FormGroup>

                                        <Dropdown1 label={"Role"} options={domain.map((project) => ({
                                            value: project.roleid,
                                            label: project.role,
                                        }))} value={formData.role} onChange={(selectedValue) =>
                                            setFormData((prevData) => ({
                                                ...prevData,
                                                role: selectedValue,
                                            }))
                                        } />
                                    </FormGroup>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                <Col>
                                    <FormGroup>
                                        <Dropdown1 label={"Manager"} options={user.map((project) => ({
                                            value: project.uid,
                                            label: project.username,
                                        }))} value={formData.manager} onChange={(selectedValue) =>
                                            setFormData((prevData) => ({
                                                ...prevData,
                                                manager: selectedValue,
                                            }))
                                        } />
                                    </FormGroup>
                                </Col>
                                <Col>
                                    <FormGroup>

                                        <Dropdown1 label={"Teamleader"} options={user.map((project) => ({
                                            value: project.uid,
                                            label: project.username,
                                        }))} value={formData.teamleader} onChange={(selectedValue) =>
                                            setFormData((prevData) => ({
                                                ...prevData,
                                                teamleader: selectedValue,
                                            }))
                                        } />
                                    </FormGroup>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                <Col>
                                    <FormGroup>
                                        <Dropdown1 label={"Location"} options={location.map((project) => ({
                                            value: project.locationid,
                                            label: project.locationname,
                                        }))} value={formData.location} onChange={(selectedValue) =>
                                            setFormData((prevData) => ({
                                                ...prevData,
                                                location: selectedValue,
                                            }))
                                        } />
                                    </FormGroup>
                                </Col>
                                <Col>
                                    <FormGroup>
                                        <Dropdown1 label={"Project"} options={project.map((project) => ({
                                            value: project.projectdetailid,
                                            label: project.projdetails,
                                        }))} value={formData.project} onChange={(selectedValue) =>
                                            setFormData((prevData) => ({
                                                ...prevData,
                                                project: selectedValue,
                                            }))
                                        } />
                                    </FormGroup>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                <Col>
                                    <FormGroup>
                                        <Label for="isactive">Is Active</Label>
                                        <div key="inline-radio" className="mb-3">
                                            <FormGroup check inline>
                                                <Label check>
                                                    <Input
                                                        type="radio"
                                                        name="isactive"
                                                        value="true"
                                                        checked={formData.isactive}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                    {' '}Yes
                                                </Label>
                                            </FormGroup>
                                        </div>
                                    </FormGroup>
                                </Col>
                            </Row>

                            {/* <div className="text-center">
                <Button color="primary" type="submit">
                  Save
                </Button>
              </div> */}
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
                    <button
                        type="button"
                        id="Tooltip-123"
                        className="btn-pill btn-shadow me-3 btn btn-info"
                        onClick={openForm}
                    >
                        Add User
                    </button>
                </Card.Header>
                <Card.Body>
                    <Table columns={columns1} data={data1} />
                </Card.Body>
            </Card>
        </div>
    );
}

export default UserDetails;
