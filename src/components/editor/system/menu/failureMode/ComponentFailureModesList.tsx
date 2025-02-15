import * as React from "react";
import { useFailureMode } from "@hooks/useFailureModes";
import {
  Box,
  FormControl,
  FormGroup,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import FailureModesList from "@components/editor/failureMode/FailureModesList";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {FailureMode, FailureModeType} from "@models/failureModeModel";
import { BehaviorType } from "@models/behaviorModel";
import useStyles from "../failureMode/ComponentFailureModesList.styles";
import { schema } from "@components/dialog/failureMode/FailureMode.schema";
import { useState } from "react";
import { useConfirmDialog } from "@hooks/useConfirmDialog";
import ComponentFailureModesEdit from "@components/editor/system/menu/failureMode/ComponentFailureModesEdit";
import { Autocomplete } from "@mui/lab";
import { SnackbarType, useSnackbar } from "@hooks/useSnackbar";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import {simplifyReferencesOfReferences} from "@utils/utils";
import SafeAutocomplete from "@components/materialui/SafeAutocomplete";

const ComponentFailureModesList = ({ component }) => {
  const { classes } = useStyles();
  const [
      allFailureModes,
      createFailureMode,
      ,
      ,
      ,
      ,
      componentFailureModes,
      ,
      ,
      removeFailureMode,
      addExistingFailureMode,
  ] = useFailureMode();
  const [failureModeParts, setFailureModeParts] = useState<FailureMode[]>([]);
  const [showSnackbar] = useSnackbar();
  const [showEdit, setShowEdit] = useState(false);
  const [requiredFailureModes, setRequiredFailureModes] = useState<FailureMode[]>([]);
  const [behaviorType, setBehaviorType] = useState<BehaviorType>(BehaviorType.ATOMIC);
  const [failureModeType, setFMtype] = useState<FailureModeType>(FailureModeType.FailureMode);
  const [selectedFailureMode, setSelectedFailureMode] = useState<FailureMode>();
  const [requestConfirmation] = useConfirmDialog();
  const [failureModeToAdd, setFailureModeToAdd] = useState<FailureMode>();
  const [dialog, showDialog] = useState<boolean>(false);

    const showEditForm = (fm: FailureMode) => {
      setSelectedFailureMode(fm);
      setShowEdit(true);
  };

  const handleClickOpen = () => {
      showDialog(true);
  };

  const closeDialogWindow = () => {
      setFailureModeToAdd(null);
      showDialog(false);
  };

  const { register, handleSubmit, formState: { errors }, control, reset } = useForm({
      resolver: yupResolver(schema),
  });

  const handleBehaviorTypeChange = (event) => {
      setBehaviorType(event.target.value);
      if (event.target.value === BehaviorType.ATOMIC) {
          setFailureModeParts([]);
      }
  };

    const handleFMTypeChange = (event) => {
        setFMtype(event.target.value);
        if(failureModeType === FailureModeType.FailureMode){
            setBehaviorType(BehaviorType.ATOMIC);
            setFailureModeParts([]);
        }
    };

  const _handleCreateFailureMode = (values: any) => {
      let failureMode: FailureMode = {
          name: values.name as string,
          behaviorType: behaviorType,
          failureModeType: failureModeType,
          component: component,
          requiredBehaviors: [],
          childBehaviors: [],
      };
      failureMode = simplifyReferencesOfReferences(failureMode)
      createFailureMode(failureMode, requiredFailureModes, failureModeParts);
      reset(values);
      setFailureModeParts([]);
      setRequiredFailureModes([]);
      setBehaviorType(BehaviorType.ATOMIC);
      setFMtype(FailureModeType.FailureMode);
  };

  const handleAddExistingFM = () => {
      addExistingFailureMode(failureModeToAdd);
      closeDialogWindow();
  };

  const handleDeleteFunction = (failureMode: FailureMode) => {
      requestConfirmation({
          title: "Delete Failure Mode?",
          explanation: "Are you sure you want to delete the failure mode?",
          onConfirm: () => removeFailureMode(failureMode),
      });
  };

  return (
      <React.Fragment>
          <Typography variant="h6" gutterBottom>
              Failure Modes
          </Typography>

          {showEdit ? (
              <ComponentFailureModesEdit
                  selectedFailureMode={selectedFailureMode}
                  setShowEdit={setShowEdit}
                  setSelectedFailureMode={setSelectedFailureMode}
              />
          ) : (
              <Box>
                  <List>
                      <Box>
                          {componentFailureModes.map((fm) => (
                              <ListItem key={fm.iri}>
                                  <ListItemText primary={fm.name} />
                                  <ListItemSecondaryAction>
                                      <IconButton
                                          className={classes.actionButton}
                                          onClick={() => showEditForm(fm)}
                                          size="large">
                                          <Edit />
                                      </IconButton>
                                      <IconButton
                                          className={classes.actionButton}
                                          onClick={() => handleDeleteFunction(fm)}
                                          size="large">
                                          <DeleteIcon />
                                      </IconButton>
                                  </ListItemSecondaryAction>
                              </ListItem>
                          ))}
                      </Box>
                  </List>

                  <Box>
                      <FormGroup>
                          <FormControl>
                              <TextField autoFocus
                                         margin="dense"
                                         id="name"
                                         label="Failure mode name"
                                         type="text"
                                         fullWidth
                                         name="name"
                                         defaultValue=""
                                         error={!!errors.name}
                                         helperText={errors.name?.message} {...register("name")}/>
                          </FormControl>

                          <FormControl fullWidth>
                              <InputLabel id="failure-mode-type">Failure Mode Type</InputLabel>
                              <Select
                                  labelId="failure-mode-type"
                                  id="failure-mode-type-select"
                                  value={failureModeType}
                                  label="Failure Mode Type"
                                  onChange={handleFMTypeChange}
                              >
                                  <MenuItem value={FailureModeType.FailureMode}>Failure Mode</MenuItem>
                                  <MenuItem value={FailureModeType.FailureModeCause}>Failure Mode Cause</MenuItem>
                              </Select>
                          </FormControl>
                          {failureModeType === FailureModeType.FailureMode
                              && (
                                  <React.Fragment>
                                      <FormControl fullWidth>
                                          <InputLabel id="demo-simple-select-label">Behavior Type</InputLabel>
                                          <Select
                                              labelId="demo-simple-select-label"
                                              id="demo-simple-select"
                                              value={behaviorType}
                                              label="Behavior type"
                                              onChange={handleBehaviorTypeChange}
                                          >
                                              <MenuItem value={BehaviorType.ATOMIC}>Atomic</MenuItem>
                                              <MenuItem value={BehaviorType.AND}>And</MenuItem>
                                              <MenuItem value={BehaviorType.OR}>Or</MenuItem>
                                          </Select>
                                      </FormControl>

                                      {behaviorType != BehaviorType.ATOMIC && (
                                          <FormControl fullWidth>
                                              <FailureModesList
                                                  label={"Parts: "}
                                                  functionIri={""}
                                                  selectedFailureModes={failureModeParts}
                                                  setSelectedFailureModes={setFailureModeParts}
                                                  setCurrentFailureModes={() => {
                                                  }}
                                                  transitiveClosure={[]}
                                                  allowCauses={false}
                                              />
                                          </FormControl>
                                      )}
                                      <FormControl fullWidth>
                                          <FailureModesList
                                              label={"Required Failure Modes: "}
                                              functionIri={""}
                                              selectedFailureModes={requiredFailureModes}
                                              setSelectedFailureModes={setRequiredFailureModes}
                                              setCurrentFailureModes={() => {
                                              }}
                                              transitiveClosure={[]}
                                              allowCauses
                                          />
                                      </FormControl>
                                  </React.Fragment>
                              )
                          }
                          <Box className={classes.actionButton}>
                              <Button color="primary" variant="outlined" onClick={handleClickOpen}
                                      component="span">
                                  Add existing
                              </Button>
                              <IconButton
                                  className={classes.actionButton}
                                  color="primary"
                                  component="span"
                                  onClick={handleSubmit(_handleCreateFailureMode)}
                                  size="large">
                                  <AddIcon/>
                              </IconButton>
                          </Box>
                      </FormGroup>
                  </Box>

                  <Dialog open={dialog} onClose={closeDialogWindow} fullWidth maxWidth="sm">
                      <DialogTitle>Add existing failure mode </DialogTitle>
                      <DialogContent>
                          <SafeAutocomplete
                              id="add-existing-failure-mode"
                              useSafeOptions={true}
                              options={[...allFailureModes]
                                  .filter(([fmIri, fm]) => ((fm.component && fm.component.iri) || "") !== component.iri)
                                  .map((value) => value[1])}
                              onChangeCallback={(event: any, newValue: any) => {
                                  setFailureModeToAdd(newValue);
                                  showSnackbar("Failure mode's component will be changed", SnackbarType.INFO);
                              }}
                              getOptionLabel={(option) => {
                                  // TODO: Find out what the hell is going on here according to docs this has different signature https://mui.com/material-ui/api/autocomplete/
                                    const failureMode = option as FailureMode;
                                    return failureMode.name + " (" + (failureMode.component == null ? "None" : failureMode.component.name) + ")"
                              }}
                              fullWidth
                              renderInput={(params) => <TextField {...params} label="Existing failure modes" />}
                          />
                      </DialogContent>
                      <DialogActions>
                          <Button color="primary" onClick={closeDialogWindow}>Cancel</Button>
                          <Button color="primary" onClick={handleAddExistingFM}>Add</Button>
                      </DialogActions>
                  </Dialog>
              </Box>
          )}
      </React.Fragment>
  );
};

export default ComponentFailureModesList;
