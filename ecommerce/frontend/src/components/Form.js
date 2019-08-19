import React, { Component, Fragment } from 'react';

class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        const name = e.target.name;
        const value = e.target.value;
        this.setState(prevState => {
            const newState = { ...prevState };
            newState[name] = value;
            return newState;
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.handleSubmit(this.state);
    }

    render() {
        return (
            <Fragment>
                <h1>{this.props.formTitle}</h1>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input type="text" required={true}
                               className="form-control"
                               id="username"
                               name="username"
                               aria-describedby="emailHelp"
                               onChange={this.handleChange}
                               placeholder="Enter username"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" required={true}
                               className="form-control"
                               id="password"
                               name="password"
                               onChange={this.handleChange}
                               placeholder="Password"/>
                    </div>
                    <button type="submit" className="btn btn-primary">{this.props.submitLabel}</button>
                </form>
            </Fragment>
        );
    }
}

export default Form;
