import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Symbol from './components/Symbol';
import InputForm from './components/InputForm';
import MyNavbar from './components/MyNavbar';
import { Component } from 'react';
import './App.css'
import { Router, Route, Switch } from 'react-router-dom'
import HomePage from './components/HomePage';
import Contact from './components/Contact';
import PriceList from './components/PriceList';
import history from './history';


class App extends Component {
  // state = {
  //   items: [{ id: 1, value: 0 }, { id: 2, value: 0 }, { id: 3, value: 0 }]
  // };

  // handleIncrement = item => {
  //   const items = [...this.state.items];
  //   const index = items.indexOf(item);
  //   items[index] = { ...item };
  //   items[index].value++;
  //   this.setState({ items });
  // };

  // handleReset = () => {
  //   const items = this.state.items.map(i => {
  //     i.value = 0;
  //     return i;
  //   });
  //   this.setState({ items });
  // };

  // handleDelete = itemId => {
  //   const items = this.state.items.filter(item => item.id !== itemId);
  //   this.setState({ items: items });
  // };

  render() {
    return (

      <div>
        <MyNavbar></MyNavbar>
        <Router history={history}>
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/search" component={InputForm} />
            <Route exact path="/symbol" component={Symbol} />
            <Route exact path="/contact" component={Contact} />
            <Route path="/PriceList/:id" component={PriceList} />

          </Switch>
        </Router>

      </div >


    );
  };




}



export default App;
