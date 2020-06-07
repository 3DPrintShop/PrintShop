import React, {ChangeEvent} from "react";
import {
    Box,
    createStyles,
    Dialog,
    Grid,
    GridList,
    GridListTile, InputLabel,
    isWidthUp,
    Paper, TextField,
    Theme,
    withWidth
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import Project from "./project";
import {Breakpoint} from "@material-ui/core/styles/createBreakpoints";
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import {useMutation} from "@apollo/react-hooks";
import {gql} from "apollo-boost";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        stlPreviewModal: {
            position: "absolute",
            left: "CALC(50% - 400px)",
            top: "CALC(50% - 400px)",
            width: "800",
            height: "800",
            backgroundColor: "white",
            borderRadius: "4px",
        },
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
        projectImage: {
            [theme.breakpoints.down('xl')]: {
                width: "532px",
                height: "532px",
            },
            [theme.breakpoints.down('lg')]: {
                width: "360px",
                height: "360px",
            },
            [theme.breakpoints.down('sm')]: {
                width: "300px",
                height: "300px",
            },

            backgroundImage: "url('/Placeholder.png')",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "cover",
        },
        thumbnailList:{
            // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
            transform: 'translateZ(0)',
            width: "100%",
        },
        projectThumbnail: {
            width: "100%",
            [theme.breakpoints.down('xl')]: {
                height: "132px",
            },
            [theme.breakpoints.down('lg')]: {
                height: "120px",
            },
            [theme.breakpoints.down('sm')]: {
                height: "146px",
            },
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            transition: "all .5s",
            filter: "grayscale(90%)",
            '&:hover': {
                filter: "grayscale(20%)",
                transform: "scale(1.2)",
            },
        },
        selectedThumbnail: {
            width: "100%",
            [theme.breakpoints.down('xl')]: {
                height: "132px",
            },
            [theme.breakpoints.down('lg')]: {
                height: "120px",
            },
            [theme.breakpoints.down('sm')]: {
                height: "146px",
            },
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            transition: "transform .5s",
            '&:hover': {
                transform: "scale(1.2)",
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
        addIcon: {
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            margin: 'auto',
            display: 'flex',
        }
    }),
);

const CREATE_IMAGE = gql`
    mutation uploadImage($projectId: ID!, $request: UploadImageRequest!){
        uploadImageToProject(projectId: $projectId, request: $component)
    }
`


type Image = {
    url: string
}

type ProjectGalleryProps = {
    images: Image[]
    projectId: string
    width: Breakpoint
}

let fileUpload : File

function ProjectGallery({images, projectId, width}: ProjectGalleryProps) {
    const classes = useStyles();

    const [imageIndex, setImageIndex] = React.useState(0)
    const [isDialogOpen, setIsDialogOpen] = React.useState(false)
    const [fileName, setFileName] = React.useState("")
    const [file, setFile] = React.useState(fileUpload)

    const [createImage, {loading: mutationLoading, error: mutationError}] = useMutation(CREATE_IMAGE)

    const closeDialog = () => {
        setIsDialogOpen(false)
        setFile(fileUpload)
        setFileName("")
    }

    const uploadImage = () => {
        console.log("Attempting to post file")
        console.log(file)
        console.log(projectId)
        createImage({variables: {request: {image: file, altText: 'Alt Text'}, projectId: projectId}})
        setIsDialogOpen(false)
    }

    const openDialog = () => {
        setIsDialogOpen(true)
    }

    const getCellHeight = () => {
        if (isWidthUp('xl', width)) {
            return 131;
        }

        if (isWidthUp('lg', width)) {
            return 120;
        }

        if (isWidthUp('md', width)) {
            return 120;
        }

        if (isWidthUp('sm', width)) {
            return 146;
        }

        return 1;
    }

    const getCols = () => {
        if (isWidthUp('xl', width)) {
            return 4;
        }

        if (isWidthUp('lg', width)) {
            return 3;
        }

        if (isWidthUp('md', width)) {
            return 3;
        }

        if (isWidthUp('sm', width)) {
            return 2;
        }

        return 1;
    }

    const getThumbnailClass = (index: number) => {
        if(index == imageIndex){
            return classes.selectedThumbnail
        }
        return classes.projectThumbnail
    }

    const updateImageIndex = (index: number) => {
        setImageIndex(index)
    }

    const fileDialogChanged = (e: ChangeEvent<HTMLInputElement>) => {
        const target= e.target as HTMLInputElement;
        const uploadFile: File = (target.files as FileList)[0];
        setFileName(uploadFile.name)
        setFile(uploadFile)
        console.log(uploadFile)
        console.log("Uploaded a file:", uploadFile.name)
    };

    return (
        <Grid
            container
            spacing={1}>
            <Dialog
                open={isDialogOpen}
                onClose={closeDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"New Image:"}</DialogTitle>
                <DialogContent>
                    <DialogContent>
                        <DialogContentText>
                            Upload an image to add it to the project gallery.
                        </DialogContentText>
                        <input
                            accept="model/stl"
                            style={{ display: 'none' }}
                            id="raised-button-file"
                            multiple
                            type="file"
                            onChange={fileDialogChanged}
                        />
                        <Grid container alignContent={"flex-start"}>
                            <Grid item xs={8}>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="name"
                                    label="Image"
                                    type="text"
                                    value={fileName}
                                    fullWidth
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={4} >
                                <label  htmlFor="raised-button-file" style={{marginTop:'18px', position:'fixed'}}>
                                    <Button component="span" style={{bottom: "0px"}}>
                                        Choose File
                                    </Button>
                                </label >
                            </Grid>
                        </Grid>
                    </DialogContent>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog} color="primary" autoFocus variant="outlined">
                        Cancel
                    </Button>
                    <Button onClick={uploadImage} color="primary" variant="outlined">
                        CREATE
                    </Button>
                </DialogActions>
            </Dialog>

            <Grid item xs={12}>
                <Paper elevation={3} className={classes.projectImage} style={{backgroundImage: "url("+images[imageIndex].url+")"}}>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <GridList spacing={4} cols={getCols()} cellHeight={getCellHeight()} className={classes.thumbnailList}>
                    {images.map((image, index) => (
                        <GridListTile className={classes.tile} onClick={() => updateImageIndex(index)}>
                            <Paper elevation={3} className={getThumbnailClass(index)} style={{backgroundImage: "url("+image.url+")"}}>
                            </Paper>
                        </GridListTile>
                    ))}
                        <GridListTile className={classes.tile} onClick={() => openDialog()}>
                            <Paper elevation={3} className={classes.projectThumbnail}>
                                <Box className={classes.addIcon}>
                                    <AddCircleOutlineIcon style={{ fontSize: 52 }}/>
                                </Box>
                            </Paper>
                        </GridListTile>
                </GridList>
            </Grid>
        </Grid>
    )
}

export default withWidth()(ProjectGallery)