import React, { useState, useEffect } from "react";
import Table from "../../common/table";
import config1 from "../../common/mis";
import { misAlert, postData, generateColumns, fetchFilterDrops } from "../../common/common";
import { Card } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import ReusableForm from "../../common/form";
import CustomModal from "./modalform";
import Form from 'react-bootstrap/Form';

function TagDetails() {
    const [data1, setData1] = useState([]);
    const [projects, setProjects] = useState([]);
    const [user, setUser] = useState([]);


    const handleFormSubmit = async (formData) => {
        const inputdata = { action: 'insertprojectconfig', AndOr: "and", 'values[]': [formData] };
        const response = await postData(config1.ProcessQueryWitVals.url, inputdata);
        if (response.data[0]['insertemployeedata'] === 'sucess') {
            misAlert('success', 'Data Inserted Successfully');
            setShowEditForm1(false);
            fetchData();
        } else {
            misAlert('error', response.data[0]['insertemployeedata']);
        }
    };

    useEffect(() => {
        fetchFilterDrops("getallprojectsdetails", "tid,project_id,project_name,project_shortname", setProjects);
        fetchFilterDrops("getemployees", "id,emp_name", setUser);
    }, []);
    const columns1 = generateColumns(config1.TableColumns.ProjectTagDetails);
    const [showEditForm1, setShowEditForm1] = useState(false);

    const openForm1 = () => {
        setShowEditForm1(true);
    };

    const handleCloseModal1 = () => {
        setShowEditForm1(false);
    };


    return (
        <div>
            <Card>
                <Card.Header className="d-flex justify-content-between align-items-center">
                    <Card.Title as="h5" className="mb-0">Project Tag Details
                    </Card.Title>
                    <Button title='Add Employee Details' style={{ marginLeft: '10px' }} className="badge rounded-pill bg-info p-2" onClick={openForm1}>
                        +
                    </Button>
                </Card.Header>
                <Table columns={columns1} data={data1} />
            </Card>
            <CustomModal
                show={showEditForm1}
                handleClose={handleCloseModal1}
                title="Project Tagging"
            >
                <ReusableForm
                    formConfig={[
                        {
                            name: 'project_id', label: 'Project', type: 'dropdown', options: projects.map((project) => ({
                                value: project.project_id, name: project.project_name,
                            })), isRequired: true
                        },
                        {
                            name: 'emp_name', label: 'Emp Name', type: 'dropdown', options: user.map((project) => ({
                                value: project.id, name: project.emp_name,
                            })), isRequired: true
                        },
                        { name: 'start_date', label: 'Start Date', type: 'text', isRequired: true },
                        { name: 'end_date', label: 'End Date', type: 'text', isRequired: true },
                    ]}
                    onSubmit={handleFormSubmit}
                />
            </CustomModal>
        </div>
    );
}

export default TagDetails;
