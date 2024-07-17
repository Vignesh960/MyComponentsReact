import React, { useState, useEffect } from "react";
import TableComponent from '../../common/totalReport';
import { Row, Col, Card, Form, Button, Offcanvas } from 'react-bootstrap';
import Dropdown1 from "../../common/Dropdown";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaFilter, FaTimes, FaDownload } from 'react-icons/fa';
import { misAlert, postData, fetchFilterDrops } from "../../common/common";
import config1 from "../../common/mis";
import { utils, writeFile } from 'xlsx';

const App = () => {
    const [data1, setData1] = useState([]);
    const [selectedProjectShortOptions, setselectedProjectShortOptions] = useState([]);
    const [projects, setProjects] = useState([]);
    const [isFilterApplied, setIsFilterApplied] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);
    const [selectedCustomer, setselectedCustomer] = useState([]);
    const [customer, setCustomer] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [dashSalesData, setDashSalesData] = useState([
        { title: 'Invoiced', amount: '0', icon: 'icon-arrow-up text-c-green', value: 0, class: 'progress-c-theme' },
        { title: 'Recognised', amount: '0', icon: 'icon-arrow-down text-c-red', value: 0, class: 'progress-c-theme2' },
        { title: 'Advance', amount: '0', icon: 'icon-arrow-up text-c-green', value: 0, color: 'progress-c-theme' }
    ]);

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    const handleReset = () => {
        setselectedProjectShortOptions([]);
        setIsFilterApplied(false);
        setSelectedDate(null);
        setselectedCustomer([]);
    };

    const handleProjectChange1 = (selectedValue) => {
        setselectedProjectShortOptions(selectedValue);
    };

    const handleCustomer = (selectedValue) => {
        setselectedCustomer(selectedValue);
    };

    useEffect(() => {
        fetchFilterDrops("getallprojectsdetails", "tid,project_id,project_name,project_shortname", setProjects);
        fetchFilterDrops("getcustomer", "id,customer", setCustomer);
    }, []);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    useEffect(() => {
        fetchData();
    }, [selectedCustomer, selectedProjectShortOptions, selectedDate]);

    const fetchData = async () => {
        let filtertext = ``;

        if (selectedCustomer.length > 0) {
            if (filtertext) filtertext += ' AND ';
            filtertext += `customer_id IN (${selectedCustomer.map(option => `${option}`).join(',')})`;
        }

        if (selectedProjectShortOptions.length > 0) {
            if (filtertext) filtertext += ' AND ';
            filtertext += `tid IN (${selectedProjectShortOptions.map(option => `'${option}'`).join(',')})`;
        }

        if (selectedDate) {
            const selectedYear = selectedDate.getFullYear();
            const selectedMonth = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
            const daysInMonth = new Date(selectedYear, selectedDate.getMonth() + 1, 0).getDate();

            if (filtertext) filtertext += ' AND ';
            filtertext += `(invoiced_date >= '${selectedYear}-${selectedMonth}-01' AND invoiced_date <= '${selectedYear}-${selectedMonth}-${daysInMonth}')`;
            filtertext += ` OR `;
            filtertext += `(recognised_date >= '${selectedYear}-${selectedMonth}-01' AND recognised_date <= '${selectedYear}-${selectedMonth}-${daysInMonth}')`;
        }

        try {
            const requestData = {
                action: "getdatafordatatable",
                ["values[]"]: [
                    "1",
                    config1.TableColumns.monthlyreport,
                    "",
                    filtertext,
                    "devapp.vwinvoicedmilestone",
                    "0",
                    "2000",
                    "customer",
                ],
            };

            const response = await postData(config1.ProcessDataTableQuery.url, requestData);
            const dataWithActionColumn = response.data.map((row) => ({
                ...row,
            }));

            setData1(dataWithActionColumn);
            updateDashSalesData(dataWithActionColumn);
        } catch (error) {
            misAlert("error", "Error fetching data:", error);
        }
    };

    const updateDashSalesData = (data) => {
        const totalInvoicedAmount = data.reduce((total, item) => total + Number(item.invoiced_amount), 0);
        const totalRecognisedAmount = data.reduce((total, item) => total + Number(item.recognised_amount), 0);
        const totalAdvancedAmount = data.reduce((total, item) => total + Number(item.advance_amount), 0);

        const updatedDashSalesData = [
            { title: 'Invoiced', amount: totalInvoicedAmount.toString(), icon: 'icon-arrow-up text-c-green', value: 100, class: 'progress-c-theme' },
            { title: 'Recognised', amount: totalRecognisedAmount.toString(), icon: 'icon-arrow-down text-c-red', value: 100, class: 'progress-c-theme2' },
            { title: 'Advance', amount: totalAdvancedAmount.toString(), icon: 'icon-arrow-up text-c-green', value: 100, color: 'progress-c-theme' }
        ];

        setDashSalesData(updatedDashSalesData);
    };


    const transformData = (originalData) => {
        const transformedData = {};
        const months = [
            { shortName: 'Jan' },
            { shortName: 'Feb' },
            { shortName: 'Mar' },
            { shortName: 'Apr' },
            { shortName: 'May' },
            { shortName: 'Jun' },
            { shortName: 'Jul' },
            { shortName: 'Aug' },
            { shortName: 'Sep' },
            { shortName: 'Oct' },
            { shortName: 'Nov' },
            { shortName: 'Dec' }
        ];

        const filteredData = originalData.filter(item =>
            Number(item.invoiced_amount) > 0 || Number(item.recognised_amount) > 0 || Number(item.advance_amount) > 0
        );

        filteredData.forEach(item => {
            const { customer, bu, bu_sl, bu_vertical, project_name, invoiced_amount, recognised_amount, invoiced_date, recognised_date, advance_amount, advance_date } = item;

            const invoicedDate = new Date(invoiced_date);
            const recognisedDate = new Date(recognised_date);
            const advanceDate = new Date(advance_date);
            const invoicedMonth = invoicedDate.getMonth();
            const recognisedMonth = recognisedDate.getMonth();
            const advancedMonth = advanceDate.getMonth();

            if (!transformedData[customer]) {
                transformedData[customer] = {};
            }

            if (!transformedData[customer][project_name]) {
                transformedData[customer][project_name] = {
                    customer: customer,
                    prjname: project_name,
                    bu: bu,
                    bu_sl: bu_sl,
                    bu_vertical: bu_vertical,
                    months: {
                        Jan: { invoiced: 0, recognised: 0, advance: 0 },
                        Feb: { invoiced: 0, recognised: 0, advance: 0 },
                        Mar: { invoiced: 0, recognised: 0, advance: 0 },
                        Apr: { invoiced: 0, recognised: 0, advance: 0 },
                        May: { invoiced: 0, recognised: 0, advance: 0 },
                        Jun: { invoiced: 0, recognised: 0, advance: 0 },
                        Jul: { invoiced: 0, recognised: 0, advance: 0 },
                        Aug: { invoiced: 0, recognised: 0, advance: 0 },
                        Sep: { invoiced: 0, recognised: 0, advance: 0 },
                        Oct: { invoiced: 0, recognised: 0, advance: 0 },
                        Nov: { invoiced: 0, recognised: 0, advance: 0 },
                        Dec: { invoiced: 0, recognised: 0, advance: 0 },
                    }
                };
            }

            const invoicedMonthName = months[invoicedMonth].shortName;
            const recognisedMonthName = months[recognisedMonth].shortName;
            const advanceMonthName = months[advancedMonth].shortName;


            transformedData[customer][project_name].months[invoicedMonthName].invoiced += Number(invoiced_amount);
            transformedData[customer][project_name].months[recognisedMonthName].recognised += Number(recognised_amount);
            transformedData[customer][project_name].months[advanceMonthName].advance += Number(advance_amount);
        });

        const dataArray = Object.keys(transformedData).reduce((acc, customer) => {
            const projects = Object.values(transformedData[customer]);
            acc.push(...projects);
            return acc;
        }, []);

        return dataArray;
    };

    const transformedData = transformData(data1);

    const handleDownload = () => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
        // Define headers with only one "Total" column per month
        const headers = [
            ["Bu", "Bu SL", "Bu Vertical", "Customer", "Project", "Total"].concat(months),
            ["", "", "", "", "", ""].concat(months.map(() => "Total")) // Total row for each month
        ];
    
        const rows = transformedData.map(row => {
            const result = [
                row.bu,
                row.bu_sl,
                row.bu_vertical,
                row.customer,
                row.prjname,
                months.reduce((acc, month) => 
                    acc + (row.months[month]?.invoiced || 0) +
                          (row.months[month]?.recognised || 0) +
                          (row.months[month]?.advance || 0),
                    0
                )
            ];
    
            months.forEach(month => {
                // Calculate the total for each month
                const monthTotal = (row.months[month]?.invoiced || 0) +
                                  (row.months[month]?.recognised || 0) +
                                  (row.months[month]?.advance || 0);
                
                result.push(monthTotal);
            });
    
            // Calculate the total for the entire row
           
    
            return result;
        });
    
        const worksheet = utils.aoa_to_sheet(headers.concat(rows));
    
        // Merging cells for the multi-level header
        const merges = [];
        let col = 6; // Start merging from the 6th column (index 5)
        months.forEach((month, index) => {
            merges.push({
                s: { r: 0, c: col },
                e: { r: 0, c: col } // Merge only one cell for each month
            });
            col++;
        });
        worksheet['!merges'] = merges;
    
        const workbook = utils.book_new();
        utils.book_append_sheet(workbook, worksheet, 'Monthly Summary');
        writeFile(workbook, 'Monthly_Summary.xlsx');
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
                                label={"Customer"}
                                options={customer.map((project) => ({
                                    value: project.id,
                                    label: project.customer,
                                }))}
                                value={selectedCustomer}
                                onChange={handleCustomer}
                            />
                        </Form.Group>
                        <Form.Group controlId="formProjectCode">
                            <Dropdown1
                                label={"Project"}
                                options={projects.map((project) => ({
                                    value: project.tid,
                                    label: project.project_name,
                                }))}
                                value={selectedProjectShortOptions}
                                onChange={handleProjectChange1}
                            />
                        </Form.Group>
                        <Form.Group controlId="formMilestoneDate">
                            <Form.Label>Milestone Date</Form.Label>
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
                {dashSalesData.map((data, index) => (
                    <Col key={index} xl={6} xxl={4}>
                        <Card>
                            <Card.Body>
                                <h6 className="mb-4">{data.title}</h6>
                                <div className="row d-flex align-items-center">
                                    <div className="col-9">
                                        <h3 className="f-w-300 d-flex align-items-center m-b-0">
                                            {data.amount}
                                        </h3>
                                    </div>
                                </div>
                                <div className="progress m-t-30" style={{ height: '7px' }}>
                                    <div
                                        className={`progress-bar ${data.class}`}
                                        role="progressbar"
                                        style={{ width: `${data.value}%` }}
                                        aria-valuenow={data.value}
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                    />
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Header className="d-flex justify-content-between align-items-center">
                            <Card.Title as="h5" className="mb-0">Monthly Summary</Card.Title>
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
                                <Button className="badge rounded-pill bg-info p-2" title="Download" style={{ cursor: 'pointer' }} onClick={handleDownload}>
                                    <FaDownload />
                                </Button>
                            </div>
                        </Card.Header>
                        <TableComponent data={transformedData} />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default App;
