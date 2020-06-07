import React from "react";
import {
    Avatar,
    Card,
    CardActionArea,
    CardActions,
    CardHeader,
    CardMedia,
    createStyles,
    Grid,
    IconButton, Theme
} from "@material-ui/core";
import {Link} from "react-router-dom";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import StarIcon from "@material-ui/icons/Star";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import LockIcon from "@material-ui/icons/Lock";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
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
    })
)

type Projects = {
    id: string
    name: string
    public: boolean
}

type ProjectCardProps = {
    project: Projects
}

export function ProjectCard({project}: ProjectCardProps){
    const classes = useStyles();

    const [liked, setLike] = React.useState(false)
    const [starred, setStar] = React.useState(false)
    const [locked, setLock] = React.useState(!project.public)

    const toggleStar = () => {
        setStar(!starred)
    }

    const toggleLike = () => {
        setLike(!liked)
    }

    return (
        <Grid item xl={2} lg={4} sm={6} xs={12} key={project.id}>
            <Card>
                <CardActionArea component={Link} to={"/Project/" + project.id}>
                    <CardHeader
                        avatar={
                            <Avatar aria-label="recipe">
                                V
                            </Avatar>
                        }
                        action={
                            <IconButton aria-label="settings">
                                <MoreVertIcon />
                            </IconButton>
                        }
                        title={project.name}
                        subheader="Authored by: Vitiock"
                    />
                    <CardMedia
                        className={classes.media}
                        image="/Placeholder.png"
                        title="Placeholder"
                    />
                </CardActionArea>
                <CardActions>
                    <IconButton size='small' onClick={toggleStar}>
                        {starred
                            ? <StarIcon className={classes.liked} color="primary"/>
                            : <StarBorderIcon/>
                        }
                    </IconButton>
                    <IconButton size='small' onClick={toggleLike}>
                        {liked
                            ? <FavoriteIcon className={classes.favorited} color="primary"/>
                            : <FavoriteBorderIcon/>
                        }
                    </IconButton>
                    <div className={classes.grow}/>
                    {locked &&
                    <IconButton size='small'>
                        <LockIcon/>
                    </IconButton>}
                </CardActions>
            </Card>
        </Grid>
    )
}