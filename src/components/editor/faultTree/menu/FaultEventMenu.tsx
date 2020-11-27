import {Button, Divider, Paper, Typography} from "@material-ui/core";
import ShapeToolPane from "./ShapeToolPane";
import {EventType, FaultEvent} from "@models/eventModel";
import * as React from "react";
import FailureModeDialog from "../../../dialog/failureMode/create/FailureModeDialog";
import {useState} from "react";
import {EventFailureModeProvider, useEventFailureMode} from "@hooks/useEventFailureMode";
import EventFailureModeList from "@components/editor/faultTree/menu/failureMode/EventFailureModeList";
import {FailureMode} from "@models/failureModeModel";
import FailureModeShowDialog from "@components/dialog/failureMode/show/FailureModeShowDialog";

interface Props {
    shapeToolData?: FaultEvent,
    onEventUpdated: (faultEvent: FaultEvent) => void,
}

const FaultEventMenu = ({shapeToolData, onEventUpdated}: Props) => {
    const [failureModeDialogOpen, setFailureModeDialogOpen] = useState(false);

    const [failureModeOverviewDialogOpen, setFailureModeOverviewDialogOpen] = useState(false);
    const [failureModeOverview, setFailureModeOverview] = useState<FailureMode | null>(null);

    const handleFailureModeClicked = (failureMode: FailureMode) => {
        setFailureModeOverview(failureMode);
        setFailureModeOverviewDialogOpen(true);
    }

    return (
        <React.Fragment>
            <Typography variant="h5" gutterBottom>Edit Event</Typography>
            <ShapeToolPane data={shapeToolData} onEventUpdated={onEventUpdated}/>
            <Divider/>

            {
                shapeToolData &&
                <EventFailureModeProvider eventIri={shapeToolData?.iri}>
                    <Typography variant="h5" gutterBottom>Failure Mode</Typography>
                    <EventFailureModeList onFailureModeClick={handleFailureModeClicked}/>

                    <Button color="primary" onClick={() => setFailureModeDialogOpen(true)}>
                        Set Failure Mode
                    </Button>

                    <FailureModeDialog open={failureModeDialogOpen && Boolean(shapeToolData)}
                                       onClose={() => setFailureModeDialogOpen(false)}
                                       eventIri={shapeToolData?.iri}/>

                    <FailureModeShowDialog open={failureModeOverviewDialogOpen} failureMode={failureModeOverview}
                                           onClose={() => setFailureModeOverviewDialogOpen(false)}/>
                </EventFailureModeProvider>
            }
        </React.Fragment>
    );
}

export default FaultEventMenu;