import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from "./components/Header";
import WelcomePage from "./components/WelcomePage";
import CategoryPage from "./components/CategoryPage";
import ProductPage from "./components/ProductPage";
import LoginForm from "./components/LoginForm";
import FlashMessage from "./components/FlashMessage";
import { connect } from 'react-redux';
import {fetchUserIfNeeded} from "./actions";

class App extends Component {
  componentDidMount() {
    this.props.dispatch(fetchUserIfNeeded());
  }

  render() {
    return (
      <Router>
        <Header/>
        <div className="container pt-2">
          <FlashMessage/>
          <Switch>
            <Route exact path="/" component={WelcomePage}/>
            <Route path="/category/:category" component={CategoryPage}/>
            <Route path="/product/:product" component={ProductPage}/>
            <Route path="/login" component={LoginForm}/>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default connect()(App);
