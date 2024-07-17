import { toast } from "react-toastify";
import axios from "axios";
import config from "../common/mis";
import 'react-toastify/dist/ReactToastify.css';

export async function secureAjaxCallWithCallback(
  serviceUrl,
  inputData,
  successFunction,
  failFunction
) {
  try {
    const response = await fetch(serviceUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(inputData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    successFunction(data);
  } catch (error) {
    failFunction(error);
    misAlert("error", `An error has occurred: ${error.message}`);
  }
}

export async function parseJson(data) {
  return data ? (typeof data === "object" ? data : JSON.parse(data)) : data;
}

export async function postData(ApiUrl, inputData) {
  try {
    const response = await axios.post(ApiUrl, inputData, {
      headers: {
        "Content-Type": "application/json",
        "cyient-access-token": sessionStorage.getItem("jwtToken"),
        "CSRF-Token": sessionStorage.getItem("csrfToken"),
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function misAlert(type, message) {
  let toastType;
  switch (type.toLowerCase()) {
    case "info":
      toastType = "info";
      break;
    case "success":
      toastType = "success";
      break;
    case "warning":
      toastType = "warning";
      break;
    case "error":
      toastType = "error";
      break;
    default:
      toastType = "default";
  }
  toast(message, {
    type: toastType,
    theme: "colored",
  });
}

export const populateDataInList = async (serviceUrl, inputdata) => {
  try {
    const response = await fetch(serviceUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "cyient-access-token": sessionStorage.getItem("jwtToken"),
        "CSRF-Token": sessionStorage.getItem("csrfToken"),
      },
      credentials: "include",
      body: JSON.stringify(inputdata),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const generateColumnsWithAction = (columnsConfig) => {
  const columns = columnsConfig.split(",").map((col) => ({
    Header: col.toLowerCase(),
    accessor: col.toLowerCase(),
  }));
  columns.push({
    Header: "Action",
    accessor: "action",
  });
  return columns;
};

export const generateColumns = (columnsConfig) =>
  columnsConfig.split(",").map((col) => ({
    Header: col.toLowerCase(),
    accessor: col.toLowerCase(),
  }));

export const fetchFilterDrops = async (action, queryFields, setData) => {
  try {
    const response = await populateDataInList(config.ProcessQuery.url, {
      action: action,
      AndOr: "and",
      queryFields: queryFields,
    });

    setData(response || []);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const userId =
  parseJson(sessionStorage.getItem("userdata")).uid || 0;
