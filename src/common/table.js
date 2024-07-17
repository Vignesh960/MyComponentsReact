import React, { useState, useMemo, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { Table, Input, Pagination, PaginationItem, PaginationLink, Button, Card, CardBody } from "reactstrap";
import { FaDownload } from 'react-icons/fa';
import { utils as XLSXUtils, writeFile } from 'xlsx';

const BootstrapTable = ({ columns, data, checkNeeded, onSelectedRowsChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortedColumn, setSortedColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRows, setSelectedRows] = useState([]);

  const filteredData = useMemo(() => {
    return data.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  const getClassForStatus = (statusValue) => {
    const classMap = {
      "Yet To Start": "badge rounded-pill bg-info p-2",
      "In Progress": "badge rounded-pill bg-warning p-2",
      "Recognised": "badge rounded-pill bg-primary p-2",
      "Invoiced": "badge rounded-pill bg-success p-2",
      "Advance Invoiced": "badge rounded-pill bg-dark p-2",
    };
    return classMap[statusValue] || "";
  };

  const capitalizedColumns = useMemo(() => {
    return columns.map(column => ({
      ...column,
      Header: column.Header
        .split("_")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    }));
  }, [columns]);

  const sortedData = useMemo(() => {
    if (!sortedColumn) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortedColumn] || ""; // Handle null or undefined values
      const bValue = b[sortedColumn] || ""; // Handle null or undefined values
      const sortDirectionMultiplier = sortDirection === "asc" ? 1 : -1;
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirectionMultiplier * (aValue - bValue);
      } else if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirectionMultiplier * aValue.localeCompare(bValue);
      } else {
        return 0; // Handle case where values are neither strings nor numbers
      }
    });
  }, [filteredData, sortedColumn, sortDirection]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, currentPage, rowsPerPage]);

  const totalPages = useMemo(() => Math.ceil(filteredData.length / rowsPerPage), [filteredData.length, rowsPerPage]);
  const startEntry = useMemo(() => (currentPage - 1) * rowsPerPage + 1, [currentPage, rowsPerPage]);
  const endEntry = useMemo(() => Math.min(currentPage * rowsPerPage, filteredData.length), [currentPage, rowsPerPage, filteredData.length]);

  const handleSort = useCallback((column) => {
    const direction = sortedColumn === column ? (sortDirection === "asc" ? "desc" : "asc") : "asc";
    setSortedColumn(column);
    setSortDirection(direction);
  }, [sortedColumn, sortDirection]);

  const handlePageChange = useCallback((page) => setCurrentPage(page), []);

  const handleRowsPerPageChange = useCallback((e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1);
  }, []);

  const handleCheckboxChange = useCallback((row) => {
    const selectedIndex = selectedRows.findIndex(selectedRow => selectedRow === row);
    if (selectedIndex > -1) {
      setSelectedRows(selectedRows.filter((_, index) => index !== selectedIndex));
    } else {
      setSelectedRows([...selectedRows, row]);
    }
  }, [selectedRows]);

  const handleDownloadExcel = useCallback(() => {
    const worksheet = XLSXUtils.json_to_sheet(filteredData);
    const workbook = XLSXUtils.book_new();
    XLSXUtils.book_append_sheet(workbook, worksheet, 'Sheet1');
    writeFile(workbook, 'table_data.xlsx');
  }, [filteredData]);

  useEffect(() => {
    if (checkNeeded && onSelectedRowsChange) {
      onSelectedRowsChange(selectedRows);
    }
  }, [selectedRows, onSelectedRowsChange, checkNeeded]);

  return (
    <Card>
      <CardBody style={{ overflow: "auto" }}>
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex align-items-center">
              <select
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
                className="badge rounded-pill bg-secondary p-2"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            <Input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-auto d-inline"
            />
          </div>
          <Table striped bordered hover responsive className="responsive-table">
            <thead>
              <tr>
                {checkNeeded && (
                  <th>
                    <input
                      type="checkbox"
                      checked={selectedRows.length === paginatedData.length}
                      onChange={() => {
                        if (selectedRows.length === paginatedData.length) {
                          setSelectedRows([]);
                        } else {
                          setSelectedRows(paginatedData);
                        }
                      }}
                    />
                  </th>
                )}
                {capitalizedColumns.map((column) => (
                  <th key={column.accessor} onClick={() => handleSort(column.accessor)}>
                    {column.Header} {sortedColumn === column.accessor ? (sortDirection === "asc" ? "↑" : "↓") : ""}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {checkNeeded && (
                    <td>
                      <input type="checkbox" checked={selectedRows.includes(row)} onChange={() => handleCheckboxChange(row)} />
                    </td>
                  )}
                  {columns.map((column, colIndex) => (
                    <td key={`${rowIndex}-${colIndex}`}>
                      {column.accessor === "status" ? (
                        <div className={getClassForStatus(row[column.accessor])}>{row[column.accessor]}</div>
                      ) : (
                        row[column.accessor]
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Button className="badge rounded-pill bg-info p-2" title="Download" style={{ cursor: 'pointer' }} onClick={handleDownloadExcel}>
              <FaDownload />
            </Button>

            <div>
              Showing {startEntry} to {endEntry} of {filteredData.length} entries
            </div>
            <Pagination>
              <PaginationItem disabled={currentPage <= 1}>
                <PaginationLink previous onClick={() => handlePageChange(currentPage - 1)} />
              </PaginationItem>
              {[...Array(totalPages)].map((_, pageIndex) => (
                <PaginationItem active={pageIndex + 1 === currentPage} key={pageIndex}>
                  <PaginationLink onClick={() => handlePageChange(pageIndex + 1)}>
                    {pageIndex + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem disabled={currentPage >= totalPages}>
                <PaginationLink next onClick={() => handlePageChange(currentPage + 1)} />
              </PaginationItem>
            </Pagination>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

BootstrapTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  checkNeeded: PropTypes.bool,
  onSelectedRowsChange: PropTypes.func,
};

export default BootstrapTable;
