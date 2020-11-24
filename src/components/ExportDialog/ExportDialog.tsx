import React, { useEffect, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';

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
        maxWidth='lg'
      >
        {content}
      </Dialog>
    </div>
  );
}