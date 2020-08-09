import React from 'react';
import styled from 'styled-components';
import DeleteIcon from '@material-ui/icons/Delete';

import { deleteActivity } from '../../apiHelpers'

const NameCell = styled('div')`
    display: flex;
    align-items: center;
  `;

const Name = styled('div')`
    flex: 1;
  `;

export default ({ row, column: { key } }: any) => (
  <NameCell>
    <Name>{row[key]}</Name>
    {row.id && <DeleteIcon onClick={() => deleteActivity(row.doc)} />}
  </NameCell>
);
