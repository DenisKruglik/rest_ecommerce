import React, { Component } from 'react';
import Form from "./Form";
import { login } from "../actions";
import { connect } from 'react-redux';

class LoginForm extends Component {
    handleSubmit(data) {
        const { dispatch } = this.props;
        dispatch(login(data.username, data.password));
    }

    render() {
        return <Form formTitle="Login" submitLabel="Login" handleSubmit={this.handleSubmit.bind(this)}/>;
    }
}

export default connect()(LoginForm);
