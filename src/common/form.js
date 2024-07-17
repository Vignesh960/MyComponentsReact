import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { populateDataInList } from "../common/common";
import config from "../common/mis";

function DynamicForm({ formConfig, onSubmit }) {
    const initialFormValues = (formConfig) => {
        return formConfig.reduce((acc, field) => {
            if (field.type === 'dropdown') {
                const initialValueOption = field.options.find(option => option.name === field.initialValue);
                acc[field.name] = initialValueOption ? initialValueOption.value : ''; // Use option.value if found, otherwise set to empty string
            } else {
                acc[field.name] = field.initialValue || ''; // Set initial value if provided
            }
            return acc;
        }, {});
    };

    const [formValues, setFormValues] = useState(initialFormValues(formConfig));
    const [errors, setErrors] = useState({});
    const [parentProject, setParentProject] = useState('');
    const [parentProjectBudget, setParentProjectBudget] = useState(10000000000);

    useEffect(() => {
        resetBudget();
    }, [parentProject]);

    const resetBudget = () => {
        setFormValues(prevValues => ({ ...prevValues, budget: formConfig.find(field => field.name === 'budget')?.initialValue || '' }));
    };

    const handleChange = (name, value) => {
        setFormValues(prevValues => ({ ...prevValues, [name]: value }));
        setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));

        if (name === 'project_parent_id' || name === 'mlstn_parentid') {
            const selectedParent = formConfig.find(field => field.name === name).options.find(option => option.value === value);
            if (selectedParent) {
                setParentProject(selectedParent.name);
                fetchRemainingBudget(selectedParent.value, name === 'project_parent_id' ? 'project' : 'milestone');
            } else {
                resetBudget();
            }
        }
    };

    const fetchRemainingBudget = async (parentId, type) => {
        try {
            const action = type === 'project' ? 'getbudget' : 'getmilestonebudget';
            const queryFields = type === 'project' ? 'tid,project_name,available_budget' : 'milestone,available_budget';

            const data = await populateDataInList(config.ProcessQuery.url, {
                action,
                AndOr: "and",
                proptid: parentId,
                queryFields,
            });

            if (data && data.length > 0 && data[0]['available_budget']) {
                setParentProjectBudget(data[0]['available_budget']);
            } else {
                console.error(`No data available for the given ${type === 'project' ? 'project' : 'milestone'} ID.`);
                setParentProjectBudget(0);
            }
        } catch (error) {
            console.error(`Error fetching remaining budget for ${type === 'project' ? 'project' : 'milestone'}:`, error);
            setParentProjectBudget(0);
        }
    };

    const handleDateChange = (date, name) => {
        const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        setFormValues(prevValues => ({ ...prevValues, [name]: formattedDate }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const requiredFields = formConfig.filter(field => field.isRequired);
        const newErrors = {};
        requiredFields.forEach(field => {
            if (!formValues[field.name]) {
                newErrors[field.name] = `${field.label} is required`;
            }
        });
        if (formValues.budget && parseInt(formValues.budget, 10) > parentProjectBudget) {
            newErrors.budget = `Budget exceeds the available amount of ${parentProjectBudget}`;
        }
        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            onSubmit(formValues);
        }
    };

    const getColumnClass = (fieldValue) => {
        return fieldValue.length > 30 ? 'col-12' : 'col-6';
    };

    return (
        <form onSubmit={handleSubmit} className="container">
            <div className="row">
                {formConfig.map((field) => (
                    <div className={`${getColumnClass(formValues[field.name])} mb-1`} key={field.name}>
                        <label className="form-label" style={{ fontSize: '0.875rem' }}>
                            {field.label}{field.isRequired && <span style={{ color: 'red' }}> *</span>}
                            {field.name === 'budget' && parentProject ? ` (Available: ${parentProjectBudget})` : ''}
                            :
                        </label>

                        {field.type === 'text' && (
                            <>
                                <input
                                    type="text"
                                    className={`form-control form-control-sm ${errors[field.name] && 'is-invalid'}`}
                                    name={field.name}
                                    value={formValues[field.name]}
                                    onChange={(e) => handleChange(field.name, e.target.value)}
                                    disabled={field.isDisabled} // Add disabled attribute based on isDisabled prop
                                />
                                {errors[field.name] && <div className="invalid-feedback">{errors[field.name]}</div>}
                            </>
                        )}

                        {field.type === 'dropdown' && (
                            <>
                                <select
                                    className={`form-control form-control-sm ${errors[field.name] && 'is-invalid'}`}
                                    name={field.name}
                                    value={formValues[field.name]}
                                    onChange={(e) => handleChange(field.name, e.target.value)}
                                    disabled={field.isDisabled} // Add disabled attribute based on isDisabled prop
                                >
                                    <option value="">Select</option>
                                    {field.options.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.name}
                                        </option>
                                    ))}
                                </select>
                                {errors[field.name] && <div className="invalid-feedback">{errors[field.name]}</div>}
                            </>
                        )}

                        {field.type === 'date' && (
                            <>
                                <DatePicker
                                    className={`form-control form-control-sm ${errors[field.name] && 'is-invalid'}`}
                                    selected={formValues[field.name] ? new Date(formValues[field.name] + 'T00:00:00Z') : null}
                                    onChange={(date) => handleDateChange(date, field.name)}
                                    dateFormat="yyyy-MM-dd"
                                    disabled={field.isDisabled} // Add disabled attribute based on isDisabled prop
                                />
                                {errors[field.name] && <div className="invalid-feedback">{errors[field.name]}</div>}
                            </>
                        )}
                    </div>
                ))}
            </div>
            <div className="d-flex justify-content-center mt-2">
                <button type="submit" className="btn btn-primary btn-sm">Submit</button>
            </div>
        </form>
    );
}

export default DynamicForm;
