import React from 'react';
import './TableComponent.css';
import { utils, writeFile } from 'xlsx';

const TableComponent = ({ data }) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return (
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <th rowSpan="2">Bu</th>
                        <th rowSpan="2">Bu SL</th>
                        <th rowSpan="2">Bu Vertical</th>
                        <th rowSpan="2">Customer</th>
                        <th rowSpan="2">Project</th>
                        <th rowSpan="2">Total</th>
                        {months.map((month, index) => (
                            <React.Fragment key={index}>
                                <th colSpan="1">{month}</th>
                            </React.Fragment>
                        ))}
                    </tr>
                    <tr>
                        {months.map((month, index) => (
                            <React.Fragment key={index}>
                                {/* <th>Invoiced</th>
                                <th>Recognised</th>
                                <th>Advance</th> */}
                                <th>Total</th>
                            </React.Fragment>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            <td>{row.bu}</td>
                            <td>{row.bu_sl}</td>
                            <td>{row.bu_vertical}</td>
                            <td>{row.customer}</td>
                            <td>{row.prjname}</td>
                            <td>
                                {months.reduce((acc, month) =>
                                    acc + (row.months[month]?.invoiced || 0) +
                                        (row.months[month]?.recognised || 0) +
                                        (row.months[month]?.advance || 0),
                                    0
                                )}
                            </td>
                            {months.map((month, monthIndex) => (
                                <React.Fragment key={`${rowIndex}-${monthIndex}`}>
                                    {/* <td>{row.months[month]?.invoiced || '-'}</td>
                                    <td>{row.months[month]?.recognised || '-'}</td>
                                    <td>{row.months[month]?.advance || '-'}</td> */}
                                    <td>
                                        {(
                                            (row.months[month]?.invoiced || 0) +
                                            (row.months[month]?.recognised || 0) +
                                            (row.months[month]?.advance || 0)
                                        )}
                                    </td>
                                </React.Fragment>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TableComponent;
