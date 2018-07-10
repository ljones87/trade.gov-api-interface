import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="col-3">
      <h2>Search Consolodated Screening List By: </h2>
        <div className="link">
          <Link to={'/keyword'}>Keyword</Link>
        </div>
        <div>
          <Link to={'/address'}>Address</Link>
        </div>
    </div>
  );
};

export default Sidebar;
