import React from "react";
import {useMutation} from "@apollo/react-hooks";
import {createStyles, Fab, TextField, Theme} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import {gql} from "apollo-boost";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        fab: {
            margin: 0,
            top: 'auto',
            left: 'auto',
            position: 'fixed',
            bottom: theme.spacing(2),
            right: theme.spacing(2),
        },
    }),
);

const CREATE_PROJECT = gql`
    mutation createProject($name: String!) {
        createProject(name: $name){
            id,
            name
        }
    }
`

type CreateProjectVariables = {
    name: string
}

export default function AddProjectFab(){
    const classes = useStyles();

    const [open, setOpen] = React.useState(false)
    const [name, setName] = React.useState( "")

    const [createProject] = useMutation<{},
        CreateProjectVariables>(CREATE_PROJECT, {
        refetchQueries: ["projects"],
        variables: {name: name}
    });

    const OpenDialog = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value)
    }

    const createClicked = () => {
        createProject()
        setOpen(false)
    }

    return (
        <div>
            <Fab className={classes.fab} color="primary" onClick={OpenDialog}>
                <AddIcon />
            </Fab>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Create New Projects"}</DialogTitle>
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
                    </DialogContent>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary" autoFocus variant="outlined">
                        Cancel
                    </Button>
                    <Button onClick={createClicked} color="secondary" variant="outlined">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}