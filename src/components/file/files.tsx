import React from "react";
import gql from "graphql-tag";
import { ChildDataProps, graphql } from "react-apollo";
import {Card, CardActions, CardContent, CardMedia, createStyles, Theme, Typography} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import CardHeader from "@material-ui/core/CardHeader";
import Button from "@material-ui/core/Button";
import {red} from "@material-ui/core/colors";
import {makeStyles} from "@material-ui/core/styles";
import {Skeleton} from "@material-ui/lab";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            maxWidth: 345,
        },
        media: {
            height: 0,
            paddingTop: '56.25%', // 16:9
        },
        expand: {
            transform: 'rotate(0deg)',
            marginLeft: 'auto',
            transition: theme.transitions.create('transform', {
                duration: theme.transitions.duration.shortest,
            }),
        },
        expandOpen: {
            transform: 'rotate(180deg)',
        },
        avatar: {
            backgroundColor: red[500],
        },
    }),
);

const PRINTERS_QUERY = gql`
{
  printers(id: "6f0ac064-d3a6-4f14-8a4a-d32282f4b330") {
    files{
      path,
      hash,
      estimatedPrintTime
    }
  }
}
`;


type Printer = {
    name: string;
    id: string;
    endpoint: string;
    state: PrinterState;
    integration: string;
    files: FileInfo[];
}

type FileInfo = {
  path: string;
  hash: string;
  estimatedPrintTime: number;
}

type PrinterState = {
    connection: string;
    state: string;
}

type Response = {
    printers: Printer[]
}

type Variables = {
    id: string
}

type ChildProps = ChildDataProps<{}, Response, Variables>;

const withFiles = graphql<{}, Response, Variables, ChildProps>(PRINTERS_QUERY, {});

const secondsToDHMS = function(seconds: number) {
    seconds = Number(seconds);
    let d = Math.floor(seconds / (3600*24));
    let h = Math.floor(seconds % (3600*24) / 3600);
    let m = Math.floor(seconds % 3600 / 60);
    let s = Math.floor(seconds % 60);

    let dDisplay = d > 0 ? d + (d === 1 ? " day, " : " days, ") : "";
    let hDisplay = h > 0 ? h + (h === 1 ? " hour, " : " hours, ") : "";
    let mDisplay = m > 0 ? m + (m === 1 ? " minute, " : " minutes, ") : "";
    let sDisplay = s > 0 ? s + (s === 1 ? " second" : " seconds") : "";
    return dDisplay + hDisplay + mDisplay + sDisplay;
}

const PlaceholderCard = () => {
    return (
        <Grid item xl={2} lg={4} sm={6} xs={12}>
            <Card>
                <CardHeader
                    avatar={
                        <Avatar aria-label="recipe">
                        </Avatar>
                    }
                    action={
                        <IconButton aria-label="settings">
                            <MoreVertIcon />
                        </IconButton>
                    }
                    title= {<Skeleton variant="text" />}
                    subheader={<Skeleton variant="text" />}
                />
                <CardMedia>
                    <Skeleton variant="rect" height={225}/>
                </CardMedia>
                <CardContent>
                    <Typography>
                        <Skeleton variant="text"/>
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small" color="primary" variant="outlined" disabled>
                        Print
                    </Button>
                </CardActions>
            </Card>
        </Grid>
    )
}

export default withFiles(({ data: { loading, printers, error} }) => {
    const classes = useStyles();

    if(loading) return (
        <Grid
            container
            direction="row"
            spacing={2}>
            <PlaceholderCard/>
            <PlaceholderCard/>
            <PlaceholderCard/>
        </Grid>
    )
    if(error) return <h1>ERROR!</h1>;


    let fileList
    if(printers != null && printers[0] != null && printers[0].files != null){
        fileList = printers[0].files.map((file) =>
             <Grid item key={file.hash} xl={2} lg={4} md={6} sm={12}>
                <Card>
                    <CardHeader
                        avatar={
                            <Avatar aria-label="printer" className={classes.avatar}>
                                {file.hash.charAt(0)}
                            </Avatar>
                        }
                        title={file.path}
                        action={
                            <IconButton aria-label="settings">
                                <MoreVertIcon />
                            </IconButton>
                        }
                    />
                    <CardMedia
                        className={classes.media}
                        image="/Placeholder.png"
                        title="Placeholder"
                    />
                    <CardContent>
                        <Typography>
                            <b>Print Time:</b> {secondsToDHMS(file.estimatedPrintTime)}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small" color="primary" variant="outlined">
                            Print
                        </Button>
                    </CardActions>
                </Card>
            </Grid>
        );
    } else {
        fileList = ""
    }
    return <Grid
        container
        direction="row"
        spacing={2}
    >
        {fileList}
    </Grid>
});