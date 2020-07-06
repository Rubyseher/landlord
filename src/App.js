import './App.css';
import Add from './Add';
import React from 'react';
import Main from './Main';
import Edit from './Edit';
import Details from './Details';
import { Component } from 'react';
import {BrowserRouter as Router, Route}from'react-router-dom';

function App() {
   return (
      <Router>
      <div className="App">
      <Route exact path="/" component={Main}/>
      <Route path="/Add" component={Add}/>
      <Route path="/Details" render={(props) => <Details {...props} />} />
      <Route path="/Edit" render={(props) => <Edit {...props} />} />
      </div>
      </Router>
   );
}


export default App;
