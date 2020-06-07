import {Avatar, Card, CardHeader} from "@material-ui/core";
import React from "react";

type Author = {
    displayName: string
}

type AuthorCardProps = {
    author: Author
}

export default function AuthorCard({author}: AuthorCardProps) {
    return (
        <Card>
            <CardHeader
                avatar={
                    <Avatar aria-label="recipe">
                        V
                    </Avatar>
                }
                title={"Author: " + author.displayName}
            />
        </Card>
    )
}