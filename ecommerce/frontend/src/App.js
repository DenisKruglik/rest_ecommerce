import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from "./components/Header";
import { Provider } from 'react-redux';
import configureStore from "./configureStore";
import WelcomePage from "./components/WelcomePage";
import CategoryPage from "./components/CategoryPage";

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
              </Switch>
            </div>
          </Router>
        </Provider>
    );
  }
}

export default App;
