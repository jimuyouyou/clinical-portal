import React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';

const propTypes = {
  onSignOut: PropTypes.func.isRequired,
};

type Props = PropTypes.InferProps<typeof propTypes>;

export default function Dashboard(props: Props) {

  return (
    <Button onClick={props.onSignOut}>
      Logout
    </Button>
  );
}
