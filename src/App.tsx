import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MailIcon from '@material-ui/icons/Mail';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import FolderIcon from '@material-ui/icons/Folder';
import DashboardIcon from '@material-ui/icons/Dashboard';
import SettingsIcon from '@material-ui/icons/Settings';
import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloProvider } from "react-apollo";
import {
    BrowserRouter as Router,
    Switch,
    Route, Link, useParams
} from "react-router-dom";

import PrinterCardList from "./components/printerList/PrinterCardList"
import Printer from "./components/printer/printer"
import Settings from "./components/settings/settings"
import Files from "./components/file/files"
import Projects from "./components/project/projects"
import AccountIcon from "./components/account/account"
import CreatePrinterButton from "./components/printer/createPrinter"
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import {
    Badge,
    ClickAwayListener,
    Grow,
    MenuItem,
    MenuList,
    Paper,
    Popper,
    Tooltip,
    useMediaQuery
} from "@material-ui/core";
import purple from "@material-ui/core/colors/purple";
import lightBlue from "@material-ui/core/colors/lightBlue";
import {gql} from "apollo-boost";
import Project from "./components/project/project";
import { createUploadLink} from "apollo-upload-client"

export const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: createUploadLink({
        uri: "http://localhost:8000/graphql",
        credentials: "include",
    }),
});

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    grow: {
        flexGrow: 1,
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
}));

export default function MiniDrawer() {


    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    const theme = React.useMemo(
        () =>
            createMuiTheme({
                palette: {
                    primary: lightBlue,
                    secondary: {
                        main: '#ff6f00',
                    },
                    type: 'dark',
                },
            }),
        [prefersDarkMode],
    );

    return (
        <ThemeProvider theme={theme}>
        <Router>
        <ApolloProvider client={client}>
        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, {
                            [classes.hide]: open,
                        })}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        Print Shop
                    </Typography>
                    <CreatePrinterButton/>
                    <div className={classes.grow}>
                    </div>
                    <div className={classes.sectionDesktop}>
                        <AccountIcon/>
                        <IconButton aria-label="show 1 new notifications" color="inherit">
                            <Badge badgeContent={1} color="secondary">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                    </div>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                })}
                classes={{
                    paper: clsx({
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    }),
                }}
            >
                <div className={classes.toolbar}>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </div>
                <Divider />
                <List>
                    {[{Title:'Dashboard', Icon:<DashboardIcon/>, Link: "/"}, {Title:'Settings',Icon:<SettingsIcon/>, Link: "/Settings"}].map((text, index) => (
                        <Tooltip title={text.Title} placement="right">
                            <ListItem button component={Link} to={text.Link} key={text.Title}>
                                <ListItemIcon>{text.Icon}</ListItemIcon>
                                <ListItemText primary={text.Title} />
                            </ListItem>
                        </Tooltip>
                    ))}
                </List>
                <Divider />
                <List>
                    {[{Title:'Files', Icon:<FolderIcon/>, Link: "/Files"}, {Title: 'Projects', Icon:<LibraryBooksIcon/>, Link: "/Projects"}].map((text, index) => (
                        <Tooltip title={text.Title} placement="right">
                            <ListItem button component={Link} to={text.Link} key={text.Title}>
                                <ListItemIcon>{text.Icon}</ListItemIcon>
                                <ListItemText primary={text.Title} />
                            </ListItem>
                        </Tooltip>
                    ))}
                </List>
            </Drawer>
            <main className={classes.content}>
                <div className={classes.toolbar} />
                <Switch>
                    <Route exact path="/">
                      <PrinterCardList />
                    </Route>
                    <Route path="/printer/:id">
                        <Printer />
                    </Route>
                    <Route path="/Settings">
                        <Settings />
                    </Route>
                    <Route path="/Files">
                        <Files />
                    </Route>
                    <Route path="/Projects">
                        <Projects />
                    </Route>
                    <Route path="/Project/:id">
                        <Project />
                    </Route>
                    <Route path="/Home">
                        <Home/>
                    </Route>
                </Switch>
            </main>
        </div>
        </ApolloProvider>
        </Router>
        </ThemeProvider>
    );
}

function Home() {
    let { id } = useParams();

    return (
        <div>
            <h2>Printer: { id }</h2>
        </div>
    );
}