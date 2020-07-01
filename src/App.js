import React from 'react';
import Main from './Main';
import './App.css';
import Edit from './Edit';
import { Component } from 'react';
import {BrowserRouter as Router,Switch,Route}from'react-router-dom';

function App() {
  return (
    <Router>
    <div className="App">
      <Route path="/edit" component={Edit}/>
    </div>
    </Router>
  );
}
ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById('root')
);

export default App;
