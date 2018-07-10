import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Sidebar from './Sidebar';
import Home from './Home';
import KeywordSearch from './KeywordSearch';
import AddressSearch from './AddressSearch';

const Routes = () => {
  const routeData = years.concat(states);
  return (
    <div className="container">

      <Sidebar />
      <Switch>
        <Route exact path="/keyword" component={KeywordSearch} />
        <Route exact path="/address" component={AddressSearch} />
        <Route exact path='/' component={Home} />
      </Switch>
    </div>
  );
};


export default Routes;

