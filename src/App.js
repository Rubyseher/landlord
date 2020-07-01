import React from 'react';
import Main from './Main';
import './App.css';
import Details from './Details';
import Edit from './Edit';
import { Component } from 'react';
import {BrowserRouter as Router, Route}from'react-router-dom';

function App() {
  return (
    <Router>
    <div className="App">
    <Route exact path="/" component={Main}/>
    <Route path="/Edit" component={Edit}/>
    <Route path="/Details" render={(props) => <Details {...props} />} />
    </div>
    </Router>
  );
}


export default App;
