import React, { useState, useEffect } from "react";
import Table from "../../common/table";
import config1 from "../../common/mis";
import { misAlert, postData, generateColumns } from "../../common/common";
import { Card, Button } from 'react-bootstrap';
import ReusableForm from "../../common/form";
import CustomModal from "./modalform";
import Form from 'react-bootstrap/Form';
import * as XLSX from 'xlsx';

function EmpDetails() {
    const [data1, setData1] = useState([]);
    const [uploadedData, setUploadedData] = useState([]);
    const [fileSelected, setFileSelected] = useState(false);
    const [showEditForm1, setShowEditForm1] = useState(false);
    const tableCols = config1.TableColumns.Empconfig.split(",");
    const columns1 = generateColumns(config1.TableColumns.Empconfig);

    const openForm1 = () => {
        setShowEditForm1(true);
    };

    const handleCloseModal1 = () => {
        setShowEditForm1(false);
    };

    const handleFormSubmit = async (formData) => {
        const inputdata = { action: 'insertemployees', AndOr: "and", 'values[]': [formData] };
        const response = await postData(config1.ProcessQueryWitVals.url, inputdata);
        if (response.data[0]['insertemployeedata'] === 'sucess') {
            misAlert('success', 'Data Inserted Successfully');
            setShowEditForm1(false);
            fetchData();
        } else {
            misAlert('error', response.data[0]['insertemployeedata']);
        }
    };

   
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const sheetName = workbook.SheetNames[0];
                    const sheet = workbook.Sheets[sheetName];
                    const uploadedData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
                    if (uploadedData.length > 0) {
                        const headers = uploadedData[0];
                        const formattedData = uploadedData.slice(1).map((row) => {
                            const rowData = {};
                            headers.forEach((header, index) => {
                                rowData[header] = row[index];
                            });
                            return rowData;
                        });
                        setUploadedData(formattedData);
                        setFileSelected(true);
                    }
                } catch (error) {
                    console.error('Error parsing file:', error);
                    misAlert('error', 'Error parsing file');
                }
            };
            reader.readAsArrayBuffer(file);
        }
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
                    "devapp.emp_details",
                    "0",
                    "2000",
                    "emp_id",
                ],
            };
            const response = await postData(
                config1.ProcessDataTableQuery.url,
                requestData
            );
            const dataWithActionColumn = response.data.map((row) => ({
                ...row,
            }));
            setData1(dataWithActionColumn);
        } catch (error) {
            misAlert("error", "Error fetching data:", error);
        }
    };

    const uploadFile = async () => {
        try {
            var inputdata = { action: 'insertemployees', AndOr: "and", 'values[]': uploadedData };
            const response = await postData(config1.ProcessQueryWitVals.url, inputdata);
            if (response.data[0]['insertemployeedata'] === 'sucess') {
                misAlert('success', 'Data Inserted Successfully');
                setFileSelected(false);
                fetchData()
            } else {
                misAlert('error', response.data[0]['insertemployeedata']);
            }
        } catch (error) {
            misAlert('error', 'Failed to upload data', error);
        }
    };

    return (
        <div>
            <Card>
                <Card.Header className="d-flex justify-content-between align-items-center">
                    <Card.Title as="h5" className="mb-0">Employee Details
                        <Button title='Add Employee Details' style={{ marginLeft: '10px' }} className="badge rounded-pill bg-info p-2" onClick={openForm1}>
                            +
                        </Button>
                    </Card.Title>
                    <Form.Group controlId="formFile" className="mb-3" style={{ display: 'flex' }}>
                        <Form.Control type="file" onChange={handleFileUpload} style={{ width: '220px' }} />
                        {fileSelected && (
                            <Button variant="success" onClick={uploadFile} style={{ marginLeft: '10px' }}>
                                Upload
                            </Button>
                        )}
                    </Form.Group>
                </Card.Header>
                <Table columns={columns1} data={[...data1]} />
            </Card>
            <CustomModal
                show={showEditForm1}
                handleClose={handleCloseModal1}
                title="Employee Configuration"
            >
                <ReusableForm
                    formConfig={[
                        { name: 'emp_id', label: 'Emp Id', type: 'text', isRequired: true },
                        { name: 'emp_name', label: 'Emp Name', type: 'text', isRequired: true },
                        { name: 'email_id', label: 'Email Id', type: 'text', isRequired: true },
                        { name: 'cost_rate', label: 'Cost Rate', type: 'text', isRequired: true },
                        { name: 'mobile_num', label: 'Mobile', type: 'text', isRequired: true },

                    ]}
                    onSubmit={handleFormSubmit}
                />
            </CustomModal>
        </div>
    );
}

export default EmpDetails;
