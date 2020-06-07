import {ChildDataProps, graphql} from "react-apollo";
import {gql} from "apollo-boost";
import {Box, ClickAwayListener, Grow, MenuItem, MenuList, Paper, Popper} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import React from "react";

const SELF_QUERY = gql`
query self{
  self {
    id,
    email
  }
}
`;

type UserAccount = {
    loggedIn: boolean,
    email: string,
    id: string
}

type Response = {
    self: UserAccount
}

type Variables = {
    id: string
}

type ChildProps = ChildDataProps<{}, Response, Variables>;

const withAccount = graphql<{}, Response, Variables, ChildProps>(SELF_QUERY, {});

export default withAccount(({ data: { loading, self, error} }) => {
    const [accountMenuOpen, setAccountMenuOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    if(self == null){
        console.log("Account is null")
        self = {
            loggedIn: false,
            email:"",
            id:"",
        }
    } else {
        self.loggedIn = true;
    }

    const handleAccountMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
        setAccountMenuOpen(true);
    }

    const handleAccountMenuClose = (event: React.MouseEvent<EventTarget>) => {
        setAccountMenuOpen(false);
    }

    const handleLogoutClicked = (event: React.MouseEvent<EventTarget>) => {
        console.log("Logout")
        setAccountMenuOpen(false);
    }

    function handleAccountMenuKeyDown(event: React.KeyboardEvent) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setAccountMenuOpen(false);
        }
    }

    return (
        <Box>
            Email: {self.email}
            <IconButton onClick={handleAccountMenuOpen}>
                <AccountCircleIcon/>
            </IconButton>
            <Popper open={accountMenuOpen} anchorEl={anchorEl} role={undefined} transition disablePortal>
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                    >
                        <Paper>
                            <ClickAwayListener onClickAway={handleAccountMenuClose}>
                                <MenuList id="menu-list-grow" onKeyDown={handleAccountMenuKeyDown}>
                                    <MenuItem onClick={handleAccountMenuClose}>Profile</MenuItem>
                                    <MenuItem onClick={handleAccountMenuClose}>My account</MenuItem>
                                    <MenuItem onClick={handleLogoutClicked}>Logout</MenuItem>
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </Box>
    )
});