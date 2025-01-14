import * as React from "react";

import {Button, Dialog, TextField,} from "@mui/material";
import {DialogTitle} from "@components/materialui/dialog/DialogTitle";
import {DialogContent} from "@components/materialui/dialog/DialogContent";
import {useForm} from "react-hook-form";
import {DialogActions} from "@components/materialui/dialog/DialogActions";
import {yupResolver} from "@hookform/resolvers/yup";
import {schema} from "./FailureModesTableDialog.schema";
import {CreateFailureModesTable} from "@models/failureModesTableModel";
import * as faultTreeService from "@services/faultTreeService";
import * as failureModesTableService from "@services/failureModesTableService";
import {SnackbarType, useSnackbar} from "@hooks/useSnackbar";
import FaultTreePaths from "@components/dialog/faultTree/paths/FaultTreePaths";
import {FaultTreePathsProvider} from "@hooks/useFaultTreePaths";
import {FaultEvent} from "@models/eventModel";
import {RiskPriorityNumber} from "@models/rpnModel";

interface Props {
    open: boolean,
    faultTreeIri: string,
    onCreated: (tableIri: string) => void,
    onClose: () => void,
}

const FailureModesTableDialog = ({open, onClose, onCreated, faultTreeIri}: Props) => {
    const [showSnackbar] = useSnackbar();
    const useFormMethods = useForm({resolver: yupResolver(schema)});
    const {handleSubmit, register, formState: { errors }, formState} = useFormMethods;
    const {isSubmitting} = formState;

    const selectedPathsMap = new Map<number, FaultEvent[]>();
    const selectedRPNsMap = new Map<number, RiskPriorityNumber>();

    const handleCreate = (values: any) => {
        const tableRows = failureModesTableService.eventPathsToRows(selectedPathsMap, selectedRPNsMap);

        const table = {
            name: values.fmeaName,
            rows: tableRows,
        } as CreateFailureModesTable

        failureModesTableService.createAggregate(table)
            .then(value => {
                onCreated(value.iri)
                onClose()
            })
            .catch(reason => showSnackbar(reason, SnackbarType.ERROR))
    }

    const updatePaths = (rowId: number, path: FaultEvent[]) => {
        selectedPathsMap.set(rowId, path);
    }

    const updateRpn = (rowId: number, rpn: RiskPriorityNumber) => {
        selectedRPNsMap.set(rowId, rpn);
    }

    return (
        <div>
            <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title" maxWidth="md"
                    fullWidth scroll="paper">
                <DialogTitle id="form-dialog-title" onClose={onClose}>Convert To FMEA</DialogTitle>
                <DialogContent dividers>
                    <TextField autoFocus margin="dense" label="FMEA Name" name="fmeaName" type="text"
                               fullWidth error={!!errors.fmeaName} {...register("fmeaName")}
                               helperText={errors.fmeaName?.message}/>
                    <FaultTreePathsProvider faultTreeIri={faultTreeIri}>
                        <FaultTreePaths updatePaths={updatePaths} updateRpn={updateRpn}/>
                    </FaultTreePathsProvider>
                </DialogContent>
                <DialogActions>
                    <Button disabled={isSubmitting} color="primary" onClick={handleSubmit(handleCreate)}>
                        Convert
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default FailureModesTableDialog;