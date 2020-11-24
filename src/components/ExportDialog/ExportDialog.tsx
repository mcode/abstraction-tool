import React, { useEffect, useState } from 'react';
import { R4 } from '@ahryman40k/ts-fhir-types';
import executeElm from '../../utils/cql-executor';
import questionnaireUpdater from '../../utils/results-processing';
import { ValueSetMap } from '../../types/valueset';
import Modal from '@material-ui/core/Modal';
import Dialog from '@material-ui/core/Dialog';
import PropTypes from 'prop-types';
import handleClickOpen from '../Abstractor/Abstractor'

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
      >
        {content}
      </Dialog>
    </div>
  );
}