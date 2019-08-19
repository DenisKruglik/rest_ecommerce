import React, { Component } from 'react';
import Form from "./Form";
import { login } from "../actions";
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toHome: false
        };
    }

    handleSubmit(data) {
        const { dispatch } = this.props;
        dispatch(login(data.username, data.password));
        this.setState({
            toHome: true
        });
    }

    render() {
        if (this.state.toHome) {
            return <Redirect to="/"/>;
        }
        return <Form formTitle="Login" submitLabel="Login" handleSubmit={this.handleSubmit.bind(this)}/>;
    }
}

export default connect()(LoginForm);
