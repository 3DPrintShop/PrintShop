import React, {Component} from "react";
import Grid from "@material-ui/core/Grid";
import {Card, TextField} from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import CardActions from "@material-ui/core/CardActions";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {gql} from "apollo-boost";
import {useApolloClient, useMutation} from "@apollo/react-hooks";

const DELETE_PRINTER = gql`
    mutation deletePrinter($printerId: ID!) {
        deletePrinter(id: $printerId)
    }
`

interface DeleteVariables {
    printerId: string
}

type Printer = {
    name: string;
    id: string;
    endpoint: string;
    integration: string;
}

type PrinterSettingProps =  {
    printer: Printer
}

export default function PrinterSettings({printer}: PrinterSettingProps){
    const [deletePrinter, { error, data }] = useMutation<
        {},
        DeleteVariables
        >(DELETE_PRINTER, {
        refetchQueries: ["printers"],
        variables: { printerId: printer.id}
    });

    const [name, setName] = React.useState(printer.name)
    const [endpoint, setEndpoint] = React.useState(printer.endpoint)
    const [integration, setIntegration] = React.useState("Mock")
    const [apiKey, setApiKey] = React.useState('')
    const [open, setOpen] = React.useState(false)

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value)
    };

    const handleEndpointChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEndpoint(event.target.value)
    }

    const handleAPIKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setApiKey(event.target.value)
    }

    const handleIntegrationChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setIntegration(event.target.value ? event.target.value as string : "Mock")
    }

    const handleClickOpen = () => {
        setOpen(true)
    };

    const handleClose = () => {
        setOpen(false)
    };

    const deleteClicked = () => {
        setOpen(false)
        deletePrinter()
        console.log("Deleting: " + printer.id)
    };

    return (
        <Grid item xl={6} sm={12} key={printer.id}>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Delete: " + printer.name}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        By clicking DELETE you are confirming you wish to delete the configuration for this printer.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary" autoFocus variant="outlined">
                        Cancel
                    </Button>
                    <Button onClick={deleteClicked} color="secondary" variant="outlined">
                        DELETE
                    </Button>
                </DialogActions>
            </Dialog>
            <Card>
                <CardHeader
                    avatar={
                        <Avatar aria-label="printer">
                            {name.charAt(0)}
                        </Avatar>
                    }
                    title={name}
                    subheader={"Id: " + printer.id}
                    action={
                        <IconButton aria-label="settings">
                            <MoreVertIcon/>
                        </IconButton>
                    }
                />
                <CardContent>
                    <Grid container spacing={4}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id={printer.id + "-name"}
                                label="Name"
                                value={name}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Select
                                fullWidth
                                labelId="demo-simple-select-label"
                                id={printer.id + "-integration"}
                                value={integration}
                                onChange={handleIntegrationChange}
                            >
                                <MenuItem value="Mock">Mock</MenuItem>
                                <MenuItem value="Octoprint">Octoprint</MenuItem>
                            </Select>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id={printer.id + "-endpoint"}
                                label="Endpoint"
                                value={endpoint}
                                onChange={handleEndpointChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id={printer.id + "-apikey"}
                                label="API Key"
                                value={apiKey}
                                onChange={handleAPIKeyChange}
                            />
                        </Grid>
                    </Grid>
                </CardContent>
                <CardActions>
                    <Button size="small" color="primary" variant="outlined">
                        Update
                    </Button>
                    <Button size="small" color="secondary" onClick={handleClickOpen} variant="outlined">
                        Delete
                    </Button>
                </CardActions>
            </Card>
        </Grid>
    )
}