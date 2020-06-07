import React from "react";
import gql from "graphql-tag";
import { ChildDataProps, graphql } from "react-apollo";
import { Card } from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Grid from "@material-ui/core/Grid";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import {Link} from "react-router-dom";

const PRINTERS_QUERY = gql`
query printers{
  printers{
    name,
    id,
    endpoint,
    state{
      connection,
      state
    }
  }
}
`;

type PrinterCardList = {
    name: string;
    id: string;
    endpoint: string;
    state: PrinterState;
}

type PrinterState = {
    connection: string;
    state: string;
}

type Response = {
    printers: PrinterCardList[]
}

type Variables = {
    id: string
}

type ChildProps = ChildDataProps<{}, Response, Variables>;

const withPrinters = graphql<{}, Response, Variables, ChildProps>(PRINTERS_QUERY, {});

export default withPrinters(({ data: { loading, printers, error} }) => {
    if(loading) return <div>Loading</div>;
    if(error) return <h1>ERROR!</h1>;


    let printerList
    if(printers != null){
        printerList = printers.map((printer, key) =>
            <Grid item xl={6} sm={12} key={printer.id}>
                <Card>
                    <CardHeader
                        avatar={
                            <Avatar aria-label="printer">
                                {printer.name.charAt(0)}
                            </Avatar>
                        }
                        title={printer.name}
                        subheader={"Connection: " + printer.state.connection}
                        action={
                            <IconButton aria-label="settings">
                                <MoreVertIcon />
                            </IconButton>
                        }
                    />
                    <CardContent>
                        <Typography color="textPrimary" gutterBottom>
                            {printer.name} : {printer.endpoint}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Link to={"/printer/" + printer.id}>
                            <Button size="small" color="primary">
                                View
                            </Button>
                        </Link>
                    </CardActions>
                </Card>
            </Grid>
        );
    } else {
        printerList = ""
    }
    return <Grid
        container
        direction="column"
        spacing={2}
    >
        {printerList}
    </Grid>
});