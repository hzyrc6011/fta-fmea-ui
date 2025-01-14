import * as React from "react";
import Login from "@components/login/Login";
import Dashboard from "@components/dashboard/Dashboard";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Logout from "@components/Logout";
import PublicRoute from "@components/routes/PublicRoute";
import PrivateRoute from "@components/routes/PrivateRoute";
import Register from "@components/register/Register";
import {createHashHistory} from "history";
import {LoggedUserProvider} from "@hooks/useLoggedUser";
import {ROUTE_PARAMS, ROUTES} from "@utils/constants";
import FaultTreeDashboard from "@components/dashboard/FaultTreeDashboard";
import SystemDashboard from "@components/dashboard/SystemDashboard";
import FailureModesTableDashboard from "@components/dashboard/FailureModesTableDashboard";
import AdminDashboard from "@components/dashboard/AdminDashboard";
import AdminRoute from "@components/routes/AdminRoute";

export const appHistory = createHashHistory()

const AppRoutes = () => {
    return (
        <LoggedUserProvider>
            <BrowserRouter /*history={appHistory}*/>
                <Routes>
                    {/*TODO: revisit routing, this is hotfix to support react-router v6*/}
                    {process.env.ADMIN_REGISTRATION_ONLY === "true"
                        ? <Route path={ROUTES.REGISTER} element={<AdminRoute><Register/></AdminRoute>}/>
                        : <Route path={ROUTES.REGISTER} element={<PublicRoute restricted={true}><Register/></PublicRoute>}/>
                    }
                    <Route path={ROUTES.LOGIN} element={<PublicRoute path={ROUTES.LOGIN} restricted={true} exact>
                        <Login/>
                    </PublicRoute>}/>
                    <Route path={ROUTES.ADMINISTRATION} element={
                        <AdminRoute>
                            <AdminDashboard/>
                        </AdminRoute>}
                    />

                    <Route path={ROUTES.LOGOUT} element={<PrivateRoute path={ROUTES.LOGOUT} exact><Logout/></PrivateRoute>}/>

                    <Route path={ROUTES.DASHBOARD} element={
                        <PrivateRoute path={ROUTES.DASHBOARD} exact>
                            <Dashboard/>
                        </PrivateRoute>}
                    />

                    <Route path={ROUTES.SYSTEM + ROUTE_PARAMS.SYSTEM_FRAGMENT} element={
                        <PrivateRoute exact>
                            <SystemDashboard/>
                        </PrivateRoute>}
                    />
                    <Route path={ROUTES.FTA + ROUTE_PARAMS.FTA_FRAGMENT} element={
                        <PrivateRoute path={ROUTES.FTA + ROUTE_PARAMS.FTA_FRAGMENT} component={FaultTreeDashboard} exact>
                            <FaultTreeDashboard/>
                        </PrivateRoute>}
                    />
                    <Route path={ROUTES.FMEA + ROUTE_PARAMS.FMEA_FRAGMENT} element={
                        <PrivateRoute path={ROUTES.FMEA + ROUTE_PARAMS.FMEA_FRAGMENT} exact>
                            <FailureModesTableDashboard/>
                        </PrivateRoute>
                    }/>

                    <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace/>}/>
                </Routes>
            </BrowserRouter>
        </LoggedUserProvider>
    );
};

export default AppRoutes;