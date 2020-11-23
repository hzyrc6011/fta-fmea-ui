import * as React from "react";
import {useEffect} from "react";
import {cloneDeep} from "lodash";
import {Button, TextField} from "@material-ui/core";
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {Component} from "@models/componentModel";
import {schema} from "../../../../dialog/component/Component.schema";

interface Props {
    component: Component,
    onComponentUpdated: (component: Component) => void,
}

const ComponentEditMenu = ({component, onComponentUpdated}: Props) => {

    const {control, register, errors, handleSubmit, formState, reset} = useForm({
        resolver: yupResolver(schema),
    });
    const {isSubmitting, isDirty} = formState;

    const defaultValues = {
        name: component.name,
    }

    const handleComponentUpdate = async (values: any) => {
        let componentClone = cloneDeep(component) as Component
        componentClone.name = values.name
        onComponentUpdated(componentClone)
    }


    useEffect(() => {
        // @ts-ignore
        reset(defaultValues)
    }, [component])

    return (
        <React.Fragment>
            <Controller as={TextField} autoFocus margin="dense" id="component-name-edit" label="Component Name"
                        type="text" fullWidth name="name" control={control} defaultValue="" error={!!errors.name}/>
            {isDirty &&
            <Button disabled={isSubmitting} color="primary" onClick={handleSubmit(handleComponentUpdate)}>
                Save
            </Button>
            }
        </React.Fragment>
    );
}

export default ComponentEditMenu;