import React from 'react';
import styled from 'styled-components';
import DeleteIcon from '@material-ui/icons/Delete';

const NameCell = styled('div')`
    display: flex;
    align-items: center;
  `;

const Name = styled('div')`
    flex: 1;
  `;

export default ({ row, column: { key }, deleteFn }: any) => (
  <NameCell>
    <Name>{row[key]}</Name>
    {row.id && <DeleteIcon onClick={() => deleteFn(row.doc)} />}
  </NameCell>
);
