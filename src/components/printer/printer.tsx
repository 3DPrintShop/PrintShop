import React from "react";
import gql from "graphql-tag";
import {ChildDataProps,  useQuery} from "react-apollo";
import Grid from "@material-ui/core/Grid";
import {useParams} from "react-router-dom";
import {Card} from "@material-ui/core";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";


const PRINTER_QUERY = gql`
query getPrinter($printerId: ID) {
  printers(id: $printerId) {
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

type PrinterList = {
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
    printers: PrinterList[]
}

type Variables = {
    printerId: string
}

export default function Printer() {
    let { id } = useParams();

    const { loading, data } = useQuery<Response, Variables>(
        PRINTER_QUERY,
        { variables: { printerId: id } }
    );

    if(loading) return <div>Loading!</div>;
    if(data == null || data.printers[0] == null) return <div>ERROR!</div>;

    let printer = data.printers[0]

    return <Grid
            container
            direction="column"
            spacing={2}
        >
            <Grid item xl={4} xs={12} md={8} zeroMinWidth>
                <Card>
                    <CardHeader
                        avatar={
                            <Avatar aria-label="printer">
                                {printer.name.charAt(0)}
                            </Avatar>
                        }
                        title="Webcam"
                        action={
                            <IconButton aria-label="settings">
                                <MoreVertIcon />
                            </IconButton>
                        }
                    />
                    <CardActionArea>
                        <img src={printer.endpoint + "/webcam/?action=stream&1590388938406"}/>
                    </CardActionArea>
                </Card>
            </Grid>
        {printer.name}
        </Grid>
};