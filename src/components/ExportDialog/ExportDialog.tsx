import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';

export interface Props {
  open: boolean
  close: (event: {}, reason: "backdropClick" | "escapeKeyDown") => void
  content: string | undefined
}
export default function ExportDialog({open, close, content}: Props) {

  return (
    <div>
      <Dialog
        open={open}
        onClose={close}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
          fullWidth
        style={{
          paddingRight: 17,
          height: "100%",
          width: "100%",
          boxSizing: "content-box",
          overflow: "scroll"
        }}
      >
        <Typography display = "inline" variant="h6" align="center" paragraph gutterBottom>
          {content}
        </Typography>
      </Dialog>
    </div>
  );
}
