import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, FormGroup, Label, Input } from 'reactstrap';
import DatePicker from 'react-datepicker';
import moment from 'moment';

const EditModal = ({ isOpen, toggle, selectedRow, setSelectedRow }) => {
    const notRequired = ['total_milestones', 'project_parentid'];
    const dateFields = ['startdate', 'enddate', 'mlstn_startdate', 'mlstn_enddate'];

    const handleSave = () => {
        const filteredRow = {};
        Object.entries(selectedRow).forEach(([key, value]) => {
            if (!notRequired.includes(key)) {
                filteredRow[key] = value;
            }
        });
        console.log('Saving modified row:', filteredRow);
    };

    if (!selectedRow) {
        return null; 
    }
    const values = Object.entries(selectedRow).filter(([key, value]) => !notRequired.includes(key));
    const numRows = Math.ceil(values.length / 3);
    return (
        <Modal isOpen={isOpen} toggle={toggle}>
            <ModalHeader>Edit Row</ModalHeader>
            <ModalBody>
                <form>
                    {[...Array(numRows)].map((_, rowIndex) => (
                        <div className="row" key={rowIndex}>
                            {values.slice(rowIndex * 3, (rowIndex + 1) * 3).map(([key, value]) => (
                                <div className="col-md-4" key={key}>
                                    <FormGroup>
                                        <Label for={key}>{key.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}</Label>
                                        {dateFields.includes(key) ? (
                                            <DatePicker
                                                selected={moment(value, 'DD/MM/YYYY').toDate()}
                                                onChange={(date) => setSelectedRow((prevState) => ({
                                                    ...prevState,
                                                    [key]: moment(date).format('DD/MM/YYYY'),
                                                }))}
                                                className="form-control"
                                                dateFormat="dd/MM/yyyy"
                                            />
                                        ) : (
                                            <Input
                                                type="text"
                                                name={key}
                                                id={key}
                                                value={value}
                                                onChange={(e) => setSelectedRow(prevState => ({ ...prevState, [key]: e.target.value }))}
                                            />
                                        )}
                                    </FormGroup>
                                </div>
                            ))}
                        </div>
                    ))}
                </form>
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={handleSave}>Save</Button>
                <Button color="secondary" onClick={toggle}>Cancel</Button>
            </ModalFooter>
        </Modal>
    );
};

export default EditModal;
