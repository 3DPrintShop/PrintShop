import {makeStyles} from "@material-ui/core/styles";
import {
    createStyles, Modal,
    Theme
} from "@material-ui/core";
import React from "react";
// @ts-ignore
import STLViewer from "stl-viewer";

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
    })
)

type Projects = {
    id: string
    name: string
    public: boolean
}

type STLPreviewProps = {
    modalOpen: boolean,
    stlModel: string,
    onClose: {
        bivarianceHack(event: {}, reason: 'backdropClick' | 'escapeKeyDown'): void;
    }['bivarianceHack'];
}

export function STLPreviewModal({modalOpen, onClose, stlModel}: STLPreviewProps){
    const classes = useStyles();

    return (
        <Modal
            open={modalOpen}
            onClose={onClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            <div className={classes.stlPreviewModal}>
                <STLViewer
                    model={stlModel}
                    modelColor='#0288d1'
                    backgroundColor='#EAEAEA'
                    height={800}
                    width={800}
                    rotate={true}
                    orbitControls={true}
                    cameraZ={30}
                    cameraX={0}
                    cameraY={-150}
                    lightX={0}
                    lightY={-30}
                    lightZ={150}
                    lightColor={"#FFFFFF"}
                />
            </div>
        </Modal>
    )
}