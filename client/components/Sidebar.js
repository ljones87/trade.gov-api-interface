import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Link to={'/'} >
        <div className="logo" />
      </Link>
      <h4 className="heading--sidebar">
        Search Consolidated Screening List By: </h4>
        <div className="link__box">
          <Link
            to={'/keyword'}
            className="link"
          >Keyword
          </Link>
        </div>
        <div className="link__box">
          <Link
            to={'/address'}
            className="link"
          >Address
          </Link>
        </div>
        <hr />
        <div className="link__box">
        <a
          href='https://www.export.gov/csl-search'
          className="link"
          target="_blank"
          rel="noopener noreferrer"
        >To export.gov GUI
        </a>
      </div>
    </div>
  );
};

export default Sidebar;
