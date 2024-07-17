import React, { Suspense, Fragment, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Loader from './components/Loader/Loader';
import AdminLayout from './layouts/AdminLayout';

import { BASE_URL } from './config/constant';

export const renderRoutes = (routes = []) => (
  <Suspense fallback={<Loader />}>
    <Routes>
      {routes.map((route, i) => {
        const Guard = route.guard || Fragment;
        const Layout = route.layout || Fragment;
        const Element = route.element;

        return (
          <Route
            key={i}
            path={route.path}
            element={
              <Guard>
                <Layout>{route.routes ? renderRoutes(route.routes) : <Element props={true} />}</Layout>
              </Guard>
            }
          />
        );
      })}
    </Routes>
  </Suspense>
);

const routes = [
  {
    exact: 'true',
    path: '/login',
    element: lazy(() => import('./views/auth/signin/SignIn1'))
  },
  {
    exact: 'true',
    path: '/auth/signin-1',
    element: lazy(() => import('./views/auth/signin/SignIn1'))
  },
  {
    exact: 'true',
    path: '/auth/signup-1',
    element: lazy(() => import('./views/auth/signup/SignUp1'))
  },
  {
    exact: 'true',
    path: '/auth/logout',
    element: lazy(() => import('./views/auth/logout'))
  },
  {
    exact: 'true',
    path: '/auth/reset-password-1',
    element: lazy(() => import('./views/auth/reset-password/ResetPassword1'))
  },
  {
    path: '*',
    layout: AdminLayout,
    routes: [
      {
        exact: 'true',
        path: '/tables/projects',
        element: lazy(() => import('./views/tables/projects'))
      },
      {
        exact: 'true',
        path: '/tables/milestone',
        element: lazy(() => import('./views/tables/MilestoneView'))
      },
      {
        exact: 'true',
        path: '/users',
        element: lazy(() => import('./views/tables/users'))
      },
      {
        exact: 'true',
        path: '/userconfiguration',
        element: lazy(() => import('./views/tables/userConfiguration'))
      },
      {
        exact: 'true',
        path: '/monthlymilestones',
        element: lazy(() => import('./views/tables/monthlymilestones'))
      },
      {
        exact: 'true',
        path: '/employeedetails',
        element: lazy(() => import('./views/tables/employeedetails'))
      },
       {
        exact: 'true',
        path: '/taggingdetails',
        element: lazy(() => import('./views/tables/taggingdetails'))
    
      },
      {
        exact: 'true',
        path: '/monthlysummery',
        // element: lazy(() => import('./views/tables/taggingdetails'))
        element: lazy(() => import('./views/Reports/monthlySummeryReport'))
      },
      {
        exact: 'true',
        path: '/totalsummery',
        // element: lazy(() => import('./views/tables/taggingdetails'))
        element: lazy(() => import('./views/Reports/totalMonthlyReport'))
      },
      {
        path: '*',
        exact: 'true',
        element: () => <Navigate to={BASE_URL} />
      }
    ]
  }
];

export default routes;
