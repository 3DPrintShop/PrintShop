import {useParams} from "react-router-dom";
import {useQuery} from "react-apollo";
import {gql} from "apollo-boost";
import React, {ChangeEvent} from "react";
import {
    Card, CardContent, CardHeader, CardMedia,
    createStyles,
    Grid,
    IconButton,
    Paper, Table, TableBody, TableCell, TableContainer, TableRow,
    Theme,
    Typography,
    withWidth
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {Breakpoint} from "@material-ui/core/styles/createBreakpoints";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import {useMutation} from "@apollo/react-hooks";
import ProjectGallery from "./projectGallery";
import {STLPreviewModal} from "./stlPreviewModal";
import AuthorCard from "./projectAuthorCard";

const CDN = "http://localhost:8000/assets/"

const PRINTER_QUERY = gql`
query getProject($projectId: ID) {
  projects(id: $projectId) {
    name,
    id,
    public,
    components {
        id,
        name
    },
    images {
        id,
        type,
        path
    }
  }
}
`;

const CREATE_COMPONENT = gql`
    mutation createComponent($projectId: ID!, $component: Upload!){
        uploadComponent(projectId: $projectId, component: $component)
    }
`

interface CreateComponentVariables {
    projectId: string,
    component: File,
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        stlRoot: {
            display: "flex",
            [theme.breakpoints.down('xl')]: {
                height: 151,
            },
            [theme.breakpoints.down('lg')]: {
                height: 100,
            },
        },
        stlThumbnail: {
            [theme.breakpoints.down('xl')]: {
                width: 151,
            },
            [theme.breakpoints.down('lg')]: {
                width: 100,
            },
        },
        gutterLeft: {
            width: "CALC((100%-1080px)/2)",
            float: "left",
        },
        mainContainer: {
            [theme.breakpoints.down('xl')]: {
                width: "1080px",
                marginLeft:"CALC(50% - 540px)",
            },
            [theme.breakpoints.down('lg')]: {
                width: "720px",
                marginLeft:"CALC(50% - 360px)",
            },
            [theme.breakpoints.down('sm')]: {
                width: "600px",
                marginLeft:"CALC(50% - 300px)",
            },
        },
        tile: {
            borderRadius: "8px",
            overflow: "hidden",

            [theme.breakpoints.down('xl')]: {
                height: "132px",
            },
            [theme.breakpoints.down('lg')]: {
                height: "120px",
            },
            [theme.breakpoints.down('sm')]: {
                height: "146px",
            },
        },
        stlContent: {
            flex: '1 0 auto',
        },
    }),
);

type Variables = {
    projectId: string
}

type ProjectImage = {
    id: string,
    type: string,
    path: string,
}

type UserProfile = {
    displayName: string
}

type Component = {
    id: string,
    name: string
}

type Project = {
    name: string,
    id: string,
    public: boolean
    images: ProjectImage[]
    author: UserProfile
    lastUpdated: string
    creationDate: string
    totalUpdates: number
    totalLikes: number
    components: Component[]
}

type Response = {
    projects: Project[]
}

let fileUpload : File

function Project(props: {width: Breakpoint}) {


    const [imageIndex, setImageIndex] = React.useState(0)
    const [modalOpen, setModalOpen] = React.useState(false)
    const [stlModel, setSTLModel] = React.useState("/TestSTL.stl")
    const [showNewComponentDialog, setShowNewComponentDialog] = React.useState(false)
    const [fileName, setFileName] = React.useState("")
    const [file, setFile] = React.useState(fileUpload)

    const { width } = props
    let { id } = useParams();
    const classes = useStyles();

    const { loading, data } = useQuery<Response, Variables>(
        PRINTER_QUERY,
        { variables: { projectId: id } }
    );

    const [createComponent, {loading: mutationLoading, error: mutationError}] = useMutation(CREATE_COMPONENT)

    const handleClose = () => {
        setModalOpen(false);
    };

    const openSTLPreview = (filename: string) => {
        setSTLModel(filename)
        setModalOpen(true);
    }

    const openNewComponentDialog = () => {
        setShowNewComponentDialog(true)
    };

    const closeNewComponentDialog = () => {
        setShowNewComponentDialog(false)
    };

    const fileDialogChanged = (e: ChangeEvent<HTMLInputElement>) => {
        const target= e.target as HTMLInputElement;
        const uploadFile: File = (target.files as FileList)[0];
        setFileName(uploadFile.name)
        setFile(uploadFile)
        console.log(uploadFile)
        console.log("Uploaded a file:", uploadFile.name)
    };

    const submitNewComponentDialog = () => {
        console.log("Attempting to post file")
        console.log(file)
        createComponent({variables: {projectId: id, component: file}})
        setShowNewComponentDialog(false)

    };

    if(loading) return <div>Loading!</div>;
    if(data == null || data.projects[0] == null) return <div>ERROR!</div>;

    let project = data.projects[0]

    if(project.images.length == 0){
        let image : ProjectImage = {
            id: "Placeholder",
            path: "/Placeholder.png",
            type: ".png"
        };
        project.images.push(image)
    }

    project.author = {displayName: "3DPrintShop"}
    project.lastUpdated = "5/22/2020 12:30PM UTC"
    project.creationDate = "1/1/2020 3:30AM UTC"
    project.totalUpdates = 147
    project.totalLikes = 57

    return (
            <div>
                <Dialog
                    open={showNewComponentDialog}
                    onClose={closeNewComponentDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"New Component:"}</DialogTitle>
                    <DialogContent>
                        <DialogContent>
                            <DialogContentText>
                                To create a new component please fill in the required fields.
                            </DialogContentText>
                            <input
                                accept="model/stl"
                                style={{ display: 'none' }}
                                id="raised-button-file"
                                multiple
                                type="file"
                                onChange={fileDialogChanged}
                            />
                            <label htmlFor="raised-button-file">
                                <Button component="span">
                                    Upload
                                </Button>
                            </label>
                        </DialogContent>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeNewComponentDialog} color="primary" autoFocus variant="outlined">
                            Cancel
                        </Button>
                        <Button onClick={submitNewComponentDialog} color="primary" variant="outlined">
                            CREATE
                        </Button>
                    </DialogActions>
                </Dialog>
                <STLPreviewModal modalOpen={modalOpen} stlModel={stlModel} onClose={handleClose}/>
                <div className={classes.gutterLeft}>
                </div>

                <div className={classes.mainContainer}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <ProjectGallery images={project.images} projectId={project.id} />
                        </Grid>
                        <Grid item xs={6}>
                            <Grid container spacing={1}>
                                <Grid item xs={12}>
                                    <AuthorCard author={project.author}/>
                                </Grid>
                                <Grid item xs={12}>
                                    <TableContainer component={Paper}>
                                        <Table aria-label="simple table">
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell align="left">Creation Date</TableCell>
                                                    <TableCell align="right">{project.creationDate}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell align="left">Last Updated</TableCell>
                                                    <TableCell align="right">{project.lastUpdated}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell align="left">Total Updates</TableCell>
                                                    <TableCell align="right">{project.totalUpdates}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell align="left">Total Likes</TableCell>
                                                    <TableCell align="right">{project.totalLikes}</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>
                                <Grid item xs={12}>
                                    <Card>
                                        <CardHeader
                                            title="Components"
                                            action={
                                                        <IconButton aria-label="settings" onClick={openNewComponentDialog}>
                                                            <AddCircleIcon />
                                                        </IconButton>
                                                    }/>
                                    </Card>
                                </Grid>
                                {project.components.map((component, index) => (
                                    <Grid item xs={12}>
                                        <Card className={classes.stlRoot}>
                                            <CardMedia
                                                className={classes.stlThumbnail}
                                                image="/Placeholder.png"
                                                onClick={() => openSTLPreview("http://localhost:8000/assets/"+component.id+".stl")}
                                            />
                                            <CardContent className={classes.stlContent}>
                                                <Typography>
                                                    Filename: {component.name}
                                                </Typography>
                                                <Typography>
                                                    Has GCode: Yes
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            </div>
    )
}

export default withWidth()(Project)