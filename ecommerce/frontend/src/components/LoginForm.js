import React, { Component } from 'react';
import Form from "./Form";

class LoginForm extends Component {
    handleSubmit(data) {

    }

    render() {
        return <Form formTitle="Login" submitLabel="Login" handleSubmit={this.handleSubmit.bind(this)}/>;
    }
}

export default LoginForm;
