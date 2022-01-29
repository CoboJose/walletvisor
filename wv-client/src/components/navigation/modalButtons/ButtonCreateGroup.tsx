import React, { useState } from 'react';
import logger from 'utils/logger';

import { Button, useMediaQuery, useTheme } from '@mui/material';
import { SvgIcons } from 'types/types';
import SVG from 'components/ui/svg/SVG';
import GroupFormModal from 'components/groups/groupForm/GroupFormModal';

const ButtonCreateGroup = (): JSX.Element => {
  logger.rendering();

  ///////////
  // HOOKS //
  ///////////
  const theme = useTheme();
  const isPhone = useMediaQuery(theme.breakpoints.only('xs'));

  ///////////
  // STATE //
  ///////////
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  //////////////
  // HANDLERS //
  //////////////
  const onCloseModal = () => {
    setIsModalOpen(false);
  };
    
  return (
    <div>
      {isPhone ? (
        <Button
          variant="outlined"
          onClick={() => setIsModalOpen(true)}
          size="small"
          startIcon={<SVG name={SvgIcons.Add} style={{ fill: 'currentColor', width: '15px', height: '15px', stroke: 'currentColor', strokeWidth: '15px' }} />}
        >
          Create
        </Button>
      ) : (
        <Button
          variant="text"
          onClick={() => setIsModalOpen(true)}
          size="medium"
          startIcon={<SVG name={SvgIcons.Add} style={{ fill: 'currentColor', width: '15px', height: '15px', stroke: 'currentColor', strokeWidth: '15px' }} />}
        >
          Create Group
        </Button>
      )}

      {isModalOpen && <GroupFormModal groupToUpdate={null} onClose={onCloseModal} />}
    </div>
  );
};

export default ButtonCreateGroup;
