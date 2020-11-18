import * as React from "react";

import AddIcon from '@material-ui/icons/Add';
import {useState} from "react";
import {Button, List,} from "@material-ui/core";
import useStyles from "@components/drawer/menu/DrawerComponentMenuList.styles";
import {ComponentsProvider} from "@hooks/useComponents";
import {useFaultTrees} from "@hooks/useFaultTrees";
import {useOpenTabs} from "@hooks/useOpenTabs";
import FaultTreeDialog from "@components/dialog/faultTree/FaultTreeDialog";
import FaultTreeListItem from "@components/materialui/FaultTreeListItem";

const DrawerComponentMenuList = () => {
    const classes = useStyles()

    const [createFaultTreeDialogOpen, setCreateFaultTreeDialogOpen] = useState(false)
    const [faultTrees] = useFaultTrees()
    const [_, openTab] = useOpenTabs()

    const closeDialog = () => {
        setCreateFaultTreeDialogOpen(false)
    }

    return (
        <div className={classes.menu}>
            <List>
                {
                    faultTrees.map(value =>
                        <FaultTreeListItem key={value.iri} faultTree={value} onClick={() => openTab(value)}/>
                    )
                }
            </List>
            <Button className={classes.componentButton} variant="contained" color="primary" startIcon={<AddIcon/>}
                    onClick={() => setCreateFaultTreeDialogOpen(true)}>
                New Fault Tree
            </Button>

            <FaultTreeDialog open={createFaultTreeDialogOpen} handleCloseDialog={closeDialog}/>
        </div>
    );
}

export default DrawerComponentMenuList;