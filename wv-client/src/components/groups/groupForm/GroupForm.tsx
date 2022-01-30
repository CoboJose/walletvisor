import React, { useEffect, useState } from 'react';
import logger from 'utils/logger';

import TextField from '@mui/material/TextField/TextField';
import { Alert } from '@mui/material';

import style from './GroupForm.module.scss';
import { Group } from 'types/types';

type GroupFormProps = {
  group: Group,
  setGroup : (arg0: Group) => void,
  formErrors: Record<string, string>,
  serverError: string
}

const GroupForm = ({ group, setGroup, formErrors, serverError }: GroupFormProps): JSX.Element => {
  logger.rendering();

  ///////////
  // STATE //
  ///////////
  const [name, setName] = useState<string>(group.name);
  const [color, setColor] = useState<string>(group.color);

  ////////////////
  // USE EFFECT //
  ////////////////
  useEffect(() => {
    //Update the group when some input is updated
    setGroup({ ...group, name, color });
  }, [name, color]);

  /////////
  // JSX //
  /////////
  return (
    <div className={style.groupForm}>

      { serverError.length > 0 && (
        <Alert severity="error">{serverError}</Alert>
      ) }

      <form className={style.groupFormForm}>
        
        <TextField
          type="text"
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Name"
          autoFocus={name === ''}
          value={name} 
          onChange={(e) => setName(e.target.value)}
          error={formErrors.name != null}
          helperText={formErrors.name}
        />

        <TextField
          type="color"
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Color"
          value={color} 
          onChange={(e) => setColor(e.target.value)}
          error={formErrors.color != null}
          helperText={formErrors.color}
        />

      </form>

    </div>
  );
};

export default GroupForm;
