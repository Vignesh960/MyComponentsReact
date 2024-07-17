import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';
import config from '../../../common/mis';
import { secureAjaxCallWithCallback } from '../../../common/common';

const Signin1 = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [alert, setAlert] = useState({ visible: false, message: '', variant: '' });
    const [redirectToDashboard, setRedirectToDashboard] = useState(false);
    const navigate = useNavigate();

    const loginSuccess = (data) => {
        if (data.success === true) {
            const userActive = JSON.parse(data.userdata).isactive === true;
            if (userActive) {
                sessionStorage.setItem('loginid', username);
                sessionStorage.setItem('jwtToken', data.token);
                sessionStorage.setItem('refreshToken', data.refreshToken);
                sessionStorage.setItem('csrfToken', data.csrftoken);
                sessionStorage.setItem('userdata', data.userdata);
                const userRole = JSON.parse(data.userdata).role;
                sessionStorage.setItem('role', userRole);
                const accessLevel = userRole === 'Xcel Lead' || userRole === 'Xcel User' ? 'Xcel' : 'CYIENT';
                sessionStorage.setItem('access_level', accessLevel);
                sessionStorage.setItem('access_type', accessLevel);
                sessionStorage.setItem('sessionid', Date.now().toString());
                setRedirectToDashboard(true);
            } else {
                setAlert({ visible: true, message: 'User is not in an active state', variant: 'danger' });
            }
        } else {
            setAlert({ visible: true, message: data.message !== undefined ? data.message : data, variant: 'danger' });
        }
    };

    const loginFail = (err) => {
        setAlert({ visible: true, message: err.responseText !== '' ? err.responseText : 'Error occurred while login', variant: 'danger' });
    };

    const handleLogin = () => {
        if (!username.trim() || !password.trim()) {
            setAlert({ visible: true, message: 'Username and Password cannot be empty!', variant: 'danger' });
            return;
        }
        sessionStorage.setItem('ssUserName', username);
        sessionStorage.setItem('User_Name', username);
        const loginData = {
            Source: undefined,
            action: 'login',
            propusername: username,
            proppassword: password,
        };
        const { LoginURL } = config.Login;
        secureAjaxCallWithCallback(LoginURL, loginData, loginSuccess, loginFail);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    if (redirectToDashboard) {
        // return navigate('/app/dashboard/default');
        return navigate('/tables/projects');
    }

    return (
        <React.Fragment>
            <Breadcrumb />
            <div className="auth-wrapper">
                <div className="auth-content">
                    <div className="auth-bg">
                        <span className="r" />
                        <span className="r s" />
                        <span className="r s" />
                        <span className="r" />
                    </div>
                    <div className="card">
                        <div className="card-body text-center">
                            <div className="mb-4">
                                <i className="feather icon-unlock auth-icon" />
                            </div>
                            <h3 className="mb-4">Login</h3>
                            {alert.visible && (
                                <Alert variant={alert.variant} onClose={() => setAlert({ visible: false })} dismissible>
                                    {alert.message}
                                </Alert>
                            )}
                            <div className="input-group mb-3">
                                <input
                                    // type="email"
                                    className="form-control"
                                    placeholder="Userid"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                />
                            </div>
                            <div className="input-group mb-4">
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                />
                            </div>
                            <button className="btn btn-primary shadow-2 mb-4" onClick={handleLogin}>
                                Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Signin1;
