import React, { useState, useEffect } from "react";
import Table from "../../common/table";
import config1 from "../../common/mis";
import { misAlert, postData, generateColumns, fetchFilterDrops } from "../../common/common";
import { Card } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import ReusableForm from "../../common/form";
import CustomModal from "./modalform";
function UserDetails() {
    const [data1, setData1] = useState([]);
    const [projects, setProjects] = useState([]);
    const [bu, setBu] = useState([]);
    const [busl, setBusl] = useState([]);
    const [customer, setCustomer] = useState([]);
    const [vertical, setVertical] = useState([]);
    const [users, setUsers] = useState([]);

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
            fetchFilterDrops("getusers", "uid,username", setUsers),

        ]);
    };
    const handleFormSubmit = async (formData) => {
        console.log(formData)
        // if (formData.budget === "") {
        //     formData.budget = selectedRow ? selectedRow.budget : '';
        //   }
        //   if (formData.hours === "") {
        //     formData.hours = 0;
        //   }
          const inputdata = { action: 'insertconfiguration', AndOr: "and", 'values[]': [formData] };
          const response = await postData(config1.ProcessQueryWitVals.url, inputdata);
          if (response.data[0]['insertconfigdata'] === 'sucess') {
            misAlert('success', 'Configured Successfully');
            setShowEditForm1(false);
            fetchData();
          } else {
            misAlert('error', response.data[0]['insertconfigdata']);
          }
    };
    var tableCols = config1.TableColumns.Userconfig.split(",");
    const columns1 = generateColumns(config1.TableColumns.Userconfig);
    const [showEditForm1, setShowEditForm1] = useState(false);

    const openForm1 = () => {
        setShowEditForm1(true);
    };

    const handleCloseModal1 = () => {
        setShowEditForm1(false);
    };
    useEffect(() => {
        fetchData();
    }, []);
    const fetchData = async () => {
        try {
            const requestData = {
                action: "getdatafordatatable",
                ["values[]"]: [
                    "1",
                    tableCols,
                    "",
                    "",
                    "devapp.configuration_view",
                    "0",
                    "2000",
                    "username",
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
    return (
        <div>
            <Card>
                <Card.Header className="d-flex justify-content-between align-items-center">
                    <Card.Title as="h5" className="mb-0">Users</Card.Title>
                    <Button title='Add' className="badge rounded-pill bg-info p-2" onClick={openForm1}>
                        +
                    </Button>
                </Card.Header>
                <Table columns={columns1} data={data1} />
            </Card>
            <CustomModal
                show={showEditForm1}
                handleClose={handleCloseModal1}
                title="User Configuration"
            >
                <ReusableForm
                    formConfig={[
                        {
                            name: 'uid', label: 'User', type: 'dropdown', options: users.map((project) => ({
                                value: project.uid, name: project.username,
                            })),
                        },
                        {
                            name: 'project_id', label: 'Project', type: 'dropdown', options: projects.map((project) => ({
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
