import React from 'react';
import { Link } from 'react-router-dom';

export default () => {
  return (
    <p>
      I'm another page! <Link to="/">Go back!</Link>
    </p>
  );
};
