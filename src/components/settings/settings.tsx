import React from "react";
import gql from "graphql-tag";
import { ChildDataProps, graphql } from "react-apollo";
import Grid from "@material-ui/core/Grid";
import PrinterSettings from "./printerSettings";

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
    integration: string;
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
        printerList = printers.map((printer) =>
            <PrinterSettings printer={printer} key={printer.id}/>
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