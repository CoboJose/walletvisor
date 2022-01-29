import React, { useEffect, useState } from 'react';
import logger from 'utils/logger';

import TextField from '@mui/material/TextField/TextField';
import { Alert } from '@mui/material';

import style from './GroupForm.module.scss';

type GroupFormProps = {
  group: string,
  setGroup : (arg0: string) => void,
  formErrors: Record<string, string>,
  serverError: string
}

const GroupForm = ({ group, setGroup, formErrors, serverError }: GroupFormProps): JSX.Element => {
  logger.rendering();

  ///////////
  // STATE //
  ///////////
  const [name, setName] = useState<string>(group);

  ////////////////
  // USE EFFECT //
  ////////////////
  useEffect(() => {
    //Update the group when some input is updated
    setGroup('a');
  }, [name]);

  //////////////
  // HANDLERS //
  //////////////

  /////////
  // JSX //
  /////////
  return (
    <div className={style.groupForm}>

      { serverError.length > 0 && (
        <Alert severity="error">{serverError}</Alert>
      ) }

      <form>
        
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

      </form>

    </div>
  );
};

export default GroupForm;
