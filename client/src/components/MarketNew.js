import React, { Component } from 'react';
import Factory from "../factory";
import history from '../history';
import { Field, reduxForm } from 'redux-form';
import web3 from '../getWeb3';


class MarketNew extends Component {
    state = {
        loading: false,
        errorMessage: '',
        web3: null,
        instance: null,
        accounts: null
    };

    async componentDidMount() {
        const accounts = await web3.eth.getAccounts();
        this.setState({accounts: accounts[0]})
    }

    renderError({ error, touched }) {
        if (touched && error) {
            return (
                <div className="ui error message">
                    <div className="header">{error}</div>
                </div>
            );
        }
    }

    renderInput = ({ input, label, meta }) => {
        const className = `field ${meta.error && meta.touched ? 'error' : ''}`;
        return (
            <div className={className}>
                <label>{label}</label>
                <input {...input} autoComplete="off" />
                {this.renderError(meta)}
            </div>
        );
    };

    onSubmit = async formValues => {
        try {
            this.setState({ loading: true });
            await Factory.methods
                .createMarket(formValues.title, web3.utils.toWei(formValues.stack, 'ether'))
                .send({
                    from: this.state.accounts
                });
            console.log(this.state.accounts)
            this.setState({ loading: false });   
            history.push('/');
        } catch (err) {
            console.log(err);
            this.setState({ errorMessage: err.message, loading: false });
        }
    };

    render() {
        return (
            <div>
                <h3>Create a betting market!</h3>
                <form
                    onSubmit={this.props.handleSubmit(this.onSubmit)}
                    className="ui form error"
                >
                    <Field name="title" component={this.renderInput} label="Market Title" />
                    <Field
                        name="stack"
                        component={this.renderInput}
                        label="Minimum Stack"
                    />
                    <button className={`ui button primary ${this.state.loading ? 'loading' : ''}`}>Create</button>
                </form>
                <div>{this.state.errorMessage}</div>
            </div>

        );
    }
}

const validate = formValues => {
    const errors = {};

    if (!formValues.title) {
        errors.title = 'You must enter a title';
    }

    if (!formValues.stack) {
        errors.stack = 'You must enter amount of stack';
    }

    return errors;
};

export default reduxForm({
    form: 'marketnew',
    validate
})(MarketNew);
