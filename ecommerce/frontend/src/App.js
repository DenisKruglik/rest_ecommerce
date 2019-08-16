import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from "./components/Header";
import { Provider } from 'react-redux';
import configureStore from "./configureStore";
import WelcomePage from "./components/WelcomePage";
import CategoryPage from "./components/CategoryPage";
import ProductPage from "./components/ProductPage";
import LoginForm from "./components/LoginForm";

const store = configureStore();

class App extends Component {
  render() {
    return (
        <Provider store={store}>
          <Router>
            <Header/>
            <div className="container">
              <Switch>
                <Route exact path="/" component={WelcomePage}/>
                <Route path="/category/:category" component={CategoryPage}/>
                <Route path="/product/:product" component={ProductPage}/>
                <Route path="/login" component={LoginForm}/>
              </Switch>
            </div>
          </Router>
        </Provider>
    );
  }
}

export default App;
