import React from "react";
import gql from "graphql-tag";
import InputLabel from '@material-ui/core/InputLabel';
import IconButton from "@material-ui/core/IconButton";
import PrintIcon from '@material-ui/icons/Print';
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import {TextField} from "@material-ui/core";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {useMutation} from "@apollo/react-hooks";

const CREATE_PRINTER = gql`
    mutation createPrinter($name: String!, $endpoint: String!, $apiKey: String!) {
        createPrinter(name: $name, apiKey: $apiKey, endpoint: $endpoint){
            id,
            name
        }
    }
`

interface CreatePrinterVariables {
    name: string,
    endpoint: string,
    apiKey: string,
    integration: string
}

export default function Printer() {
    const [showDialog, setShowDialog] = React.useState(false)
    const [integration, setIntegration] = React.useState("Mock")
    const [name, setName] = React.useState('')
    const [endpoint, setEndpoint] = React.useState('')
    const [apiKey, setApiKey] = React.useState('')

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

    const openNewPrinterDialog = () => {
        setShowDialog(true)
    };

    const closeNewPrinterDialog = () => {
        setShowDialog(false)
    };

    const submitNewPrinterDialog = () => {
        createPrinter()
        setShowDialog(false)
        setName("")
        setApiKey("")
        setEndpoint("")
        setIntegration("")
    };

    const [createPrinter] = useMutation<{},
        CreatePrinterVariables>(CREATE_PRINTER, {
        refetchQueries: ["printers"],
        variables: {name: name, apiKey: apiKey, endpoint: endpoint, integration: integration}
    });

    return (
        <div>
            <Dialog
                open={showDialog}
                onClose={closeNewPrinterDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"New Printer: " + name}</DialogTitle>
                <DialogContent>
                    <DialogContent>
                        <DialogContentText>
                            To create a new printer please fill in the required fields.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Name"
                            type="text"
                            fullWidth
                            required
                            onChange={handleNameChange}
                        />
                        <InputLabel id="demo-simple-select-label">Integration Type</InputLabel>
                        <Select
                            fullWidth
                            labelId="demo-simple-select-label"
                            id={"integration"}
                            value={integration}
                            onChange={handleIntegrationChange}
                        >
                            <MenuItem value="Mock">Mock</MenuItem>
                            <MenuItem value="Octoprint">Octoprint</MenuItem>
                        </Select>
                        <TextField
                            fullWidth
                            id={"endpoint"}
                            label="Endpoint"
                            value={endpoint}
                            onChange={handleEndpointChange}
                        />
                        <TextField
                            fullWidth
                            id={"apikey"}
                            label="API Key"
                            value={apiKey}
                            onChange={handleAPIKeyChange}
                        />
                    </DialogContent>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeNewPrinterDialog} color="primary" autoFocus variant="outlined">
                        Cancel
                    </Button>
                    <Button onClick={submitNewPrinterDialog} color="primary" variant="outlined">
                        CREATE
                    </Button>
                </DialogActions>
            </Dialog>

            <IconButton onClick={openNewPrinterDialog}>
                <PrintIcon/>
            </IconButton>
        </div>
    )
};