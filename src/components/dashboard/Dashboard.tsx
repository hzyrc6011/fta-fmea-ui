import * as React from "react";
import AppBar from "@components/appBar/AppBar";
import DashboardContentProvider from "@hooks/DashboardContentProvider";
import DashboardContent from "@components/dashboard/content/DashboardContent";
import {CssBaseline} from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import useStyles from "@components/dashboard/Dashboard.styles";

const Dashboard = () => {
    const { classes } = useStyles();

    return (
        <DashboardContentProvider>
            <div className={classes.root}>
                <CssBaseline/>
                <AppBar title={'Dashboard'}/>
                <Toolbar/>

                <DashboardContent/>
            </div>
        </DashboardContentProvider>
    );
}

export default Dashboard;