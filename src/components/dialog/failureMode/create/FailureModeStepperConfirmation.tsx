import * as React from "react";

import {Component} from "../../../../models/componentModel";
import {Function} from "../../../../models/functionModel";
import {FailureMode} from "../../../../models/failureModeModel";
import {FaultEvent} from "../../../../models/eventModel";
import useStyles from "./FailureModeStepperConfirmation.styles";
import {Grid, List, ListItem, ListItemText, Paper, Typography} from "@material-ui/core";

interface Props {
    component: Component,
    componentFunction: Function
    failureMode: FailureMode,
    effects: FaultEvent[],
}

const FailureModeStepperConfirmation = ({component, componentFunction, failureMode, effects}: Props) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <Typography variant="h6">Component:</Typography>
                        <Typography variant="body1">{component.name}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <Typography variant="h6">Function:</Typography>
                        <Typography variant="body1">{componentFunction.name}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <Typography variant="h6">Failure Mode:</Typography>
                        <Typography variant="body1">{failureMode.name}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <Typography variant="h6">Effects:</Typography>
                        <List>
                            {effects.map(effect => <ListItem><ListItemText primary={effect.name}/></ListItem>)}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
}

export default FailureModeStepperConfirmation;