import {Link, useParams} from "react-router-dom";
import React from "react";
import {gql} from "apollo-boost";
import {ChildDataProps, graphql} from "react-apollo";
import {
    Avatar, Box,
    Card, CardActionArea,
    CardActions,
    CardHeader,
    CardMedia,
    createStyles, Fab,
    Grid,
    IconButton, TextField,
    Theme
} from "@material-ui/core";
import StarBorderIcon from '@material-ui/icons/StarBorder';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import FavoriteIcon from '@material-ui/icons/Favorite';
import StarIcon from '@material-ui/icons/Star';
import {makeStyles} from "@material-ui/core/styles";
import {pink, red, yellow} from "@material-ui/core/colors";
import LockIcon from '@material-ui/icons/Lock';
import {Skeleton} from "@material-ui/lab";
import AddProjectFab from "./addProjectFab";
import {ProjectCard} from "./projectCard";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            maxWidth: 345,
        },
        liked: {
            color: '#FFDF00',
        },
        favorited: {
            color: '#a83f39',
        },
        grow: {
            flexGrow: 1,
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

const PROJECTS_QUERY = gql`
query projects{
  projects {
    id,
    name,
    public
  }
}
`;

type Projects = {
    id: string
    name: string
    public: boolean
}

type ProjectResponse = {
    projects: Projects[]
}

type Variables = {
}



type ChildProps = ChildDataProps<{}, ProjectResponse, Variables>;

const withProjects = graphql<{}, ProjectResponse, Variables, ChildProps>(PROJECTS_QUERY, {});

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
            <CardActions>
                <IconButton size='small'>
                    <StarBorderIcon/>
                </IconButton>
                <IconButton size='small'>
                    <FavoriteBorderIcon/>
                </IconButton>
            </CardActions>
        </Card>
    </Grid>
    )
}



export default withProjects(({ data: { loading, projects, error} }) => {
    if(loading){
        return (
            <Grid
                container
                direction="row"
                spacing={2}>
                <PlaceholderCard/>
                <PlaceholderCard/>
                <PlaceholderCard/>
            </Grid>
        )
    }

    let projectList
    if(projects != null){
        projectList = projects.map((project) =>
            <ProjectCard project={project} key={project.id}/>
        );
    }

    return (
        <Box>
            <Grid
                container
                direction="row"
                spacing={2}>
                {projectList}
            </Grid>
            <AddProjectFab/>
        </Box>
    );
});