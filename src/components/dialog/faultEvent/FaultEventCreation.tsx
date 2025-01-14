import * as React from "react";

import {FormControl, InputLabel, MenuItem, Select, TextField, Typography,} from "@mui/material";
import useStyles from "@components/dialog/faultEvent/FaultEventCreation.styles";
import {Controller} from "react-hook-form";
import {EventType, FaultEvent, GateType, gateTypeValues} from "@models/eventModel";
import {useReusableFaultEvents} from "@hooks/useReusableFaultEvents";
import ControlledAutocomplete from "@components/materialui/ControlledAutocomplete";
import {useEffect, useState} from "react";

interface Props {
    useFormMethods: any,
    eventReusing: boolean
}

// TODO: remove ts-ignores and migrate to higher version of react-hook-form
const FaultEventCreation = ({useFormMethods, eventReusing}: Props) => {
    const { classes } = useStyles()

    const {formState: {errors}, control, setValue, reset, watch, register} = useFormMethods

    const faultEvents = useReusableFaultEvents()
    const [selectedEvent, setSelectedEvent] = useState<FaultEvent | null>(null)
    const existingEventSelected = Boolean(selectedEvent)

    const eventTypeWatch = watch('eventType')
    const gateTypeWatch = watch('gateType')

    useEffect(() => {
        if (selectedEvent) {
            setValue('name', selectedEvent.name)
            setValue('description', selectedEvent.description)
            setValue('probability', selectedEvent.probability)
            setValue('eventType', selectedEvent.eventType)
            setValue('gateType', selectedEvent.gateType)
            setValue('sequenceProbability', selectedEvent.sequenceProbability)
        } else {
            reset()
        }
    }, [selectedEvent])

    return (
        <div className={classes.divForm}>
            <Typography variant="subtitle1" gutterBottom>Event:</Typography>
            {eventReusing &&
            <React.Fragment>
                <ControlledAutocomplete
                    control={control}
                    name="existingEvent"
                    options={faultEvents}
                    onChangeCallback={(data: any) => setSelectedEvent(data)}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => <TextField {...params} label="Event" variant="outlined"/>}
                    defaultValue={null}
                />
                <Typography variant="subtitle1" className={classes.newEventTitle}>Create new Event:</Typography>
            </React.Fragment>}

            <FormControl className={classes.formControl}>
                <InputLabel id="event-type-select-label">Type</InputLabel>
                <Controller
                    render={({ field: {onChange, value} }) =>
                        <Select value={value} onChange={onChange} disabled={existingEventSelected} labelId="event-type-select-label" id="event-type-select">
                            {
                                Object.values(EventType).map(value =>
                                    <MenuItem key={`option-${value}`} value={value}>{value}</MenuItem>)
                            }
                        </Select>
                    }
                    name="eventType"
                    control={control}
                    defaultValue={EventType.INTERMEDIATE}
                />
            </FormControl>

             {/*TODO: sort out default value UI bug*/}
            <TextField
                margin="dense"
                label="Event Name" name="name" fullWidth
                error={errors.name} helperText={errors.name?.message}
                disabled={existingEventSelected}
                {...register("name")}
            />

             {/*TODO: sort out default value UI bug*/}
            <TextField control={control} margin="dense"
                       label="Description" name="description" fullWidth
                       min={0} max={1} step={1}
                       error={!!errors.description} helperText={errors.description?.message}
                       defaultValue="" disabled={existingEventSelected} {...register("description")}/>

            {((gateTypeWatch === GateType.PRIORITY_AND || !gateTypeWatch) && (eventTypeWatch === EventType.INTERMEDIATE && gateTypeWatch === GateType.PRIORITY_AND)) &&
                /* TODO: sort out default value UI bug */
                // TODO: The form cannot be submitted if the gate is not priority and
                <TextField label="Sequence Probability"
                           type="number" name="sequenceProbability"
                           min={0} max={1} step={0.01}
                           inputProps={{ min:0, max:1, step: 0.01 }}
                           error={!!errors.sequenceProbability} helperText={errors.sequenceProbability?.message}
                           className={classes.sequenceProbability}
                           defaultValue="" {...register("sequenceProbability")}/>
              }

            {(eventTypeWatch === EventType.INTERMEDIATE || !eventTypeWatch) &&
            <div className={classes.formControlDiv}>
                <FormControl className={classes.formControl}>
                    <InputLabel id="gate-type-select-label">Gate Type</InputLabel>
                    <Controller
                        render={({field: { value, onChange }}) => {
                            //@ts-ignore
                            return <Select value={value} disabled={existingEventSelected} onChange={onChange} labelId="gate-type-select-label" id="gate-type-select" error={!!errors.gateType}>
                                {
                                    gateTypeValues().map(value => {
                                        const [enabled, optionValue] = value
                                        return <MenuItem key={`option-${value}`} value={optionValue}
                                                         disabled={!enabled}>{value}</MenuItem>
                                    })
                                }
                            </Select>
                        }}
                        rules={{ required: eventTypeWatch === EventType.INTERMEDIATE || !eventTypeWatch }}
                        name="gateType"
                        control={control}
                        defaultValue={GateType.OR}/>
                </FormControl>
            </div>}
        </div>
    );
}

export default FaultEventCreation;