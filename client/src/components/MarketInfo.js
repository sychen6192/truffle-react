import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from 'semantic-ui-react';
import { Field, reduxForm } from 'redux-form';
import history from '../history';
import Market from '../market';
import web3 from '../getWeb3';



class MarketInfo extends Component {
    state = { contract: null, accounts: null, status: null, loading: null, errorMessage: '', errorMessageNo: '', complete: null };

    componentDidMount = async () => {
        try {
            const { address } = this.props.match.params;
            const market =  Market(address);
            const summary = await market.methods.getSummary().call();
            const complete = await market.methods.getState().call();
            this.setState({ contract: market, complete });
            this.setState({
                status: {
                    address: this.props.match.params.address,
                    minimumStack: summary[0],
                    balance: summary[1],
                    BettingCount: summary[2],
                    BetYesCount: summary[3],
                    BetNoCount: summary[4],
                    manager: summary[5],
                    complete: complete
                }
            });

        } catch (error) {
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    };

    renderCards() {
        if (!this.state.status) {
            return
        }
        const {
            balance,
            manager,
            minimumStack,
            BettingCount,
            BetYesCount,
            BetNoCount
        } = this.state.status;
        const items = [
            {
                header: manager,
                meta: 'Address of Manager',
                description:
                    'The manager created this market and can finalize bet market to claim the prize.',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: web3.utils.fromWei(minimumStack, 'ether'),
                meta: 'Minimum Stack (IEBI)',
                description:
                    'You must bet at least this much IEBI to become an bettor'
            },
            {
                header: BetYesCount,
                meta: 'Number of bettors who betted yes',
                description:
                    'Number of people who have already bet yes to this market'
            },
            {
                header: BetNoCount,
                meta: 'Number of bettors who betted no',
                description:
                    'Number of people who have already bet no to this market'
            },
            {
                header: web3.utils.fromWei(balance, 'ether'),
                meta: 'Market Balance (ether)',
                description:
                    'The balance is how much money this market has stacked to bet.'
            },
            {
                header: BettingCount,
                meta: 'Number of betting',
                description:
                    'Number of people who have already bet to this market'
            },
        ];

        return <Card.Group items={items} />;
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
        this.setState({ loading: true, errorMessage: '', errorMessageNo: '' });
        try {
            const accounts = await web3.eth.getAccounts();
            await this.state.contract.methods.betYes().send({
                from: accounts[0],
                value: web3.utils.toWei(formValues.stackYes, 'ether')
            });

            history.push(`/markets/${this.props.match.params.address}`);
        } catch (err) {
            this.setState({ errorMessage: err.message });
        }

        this.setState({ loading: false, value: '' });
    }


    onSubmitNo = async formValues => {
        this.setState({ loading: true, errorMessage: '', errorMessageNo: '' });
        try {
            const accounts = await web3.eth.getAccounts();
            await this.state.contract.methods.betNo().send({
                from: accounts[0],
                value: web3.utils.toWei(formValues.stackYes, 'ether')
            });

            history.push(`/markets/${this.props.match.params.address}`);
        } catch (err) {
            this.setState({ errorMessage: err.message });
        }

        this.setState({ loading: false, value: '' });
    }

    onFinalize = async () => {

        const market = Market(this.props.match.params.address);
        const accounts = await web3.eth.getAccounts();

        await market.methods.finalizeBetting(true).send({
            from: accounts[0]
        });
    };

    onFinalizeNo = async () => {

        const market = Market(this.props.match.params.address);
        const accounts = await web3.eth.getAccounts();

        await market.methods.finalizeBetting(false).send({
            from: accounts[0]
        });
    };

    render() {
        return (
            <div className="ui container">
                <h3>Markets:{this.props.match.params.address}</h3>
                <div className="ui grid">
                    <div className="ui grid row">
                        <div className="ten wide column">
                            {this.renderCards()}

                        </div>
                        <div className="six wide column">
                            <form
                                onSubmit={this.props.handleSubmit(this.onSubmit)}
                                className="ui form error"
                            >
                                <Field name="stackYes" component={this.renderInput} label="Amount to stack on Yes" />
                                <button disabled={this.state.complete} className={`ui button primary ${this.state.loading ? 'loading' : ''}`}>Yes</button>
                            </form>
                            <form
                                onSubmit={this.props.handleSubmit(this.onSubmitNo)}
                                className="ui form error"
                            >
                                <Field name="stackNo" component={this.renderInput} label="Amount to stack on No" />
                                <button disabled={this.state.complete} className={`ui button primary ${this.state.loading ? 'loading' : ''}`}>No</button>
                            </form>
                            <h3>Finalize the market (manager only)</h3>
                            <Button disabled={this.state.complete} onClick={this.onFinalize}>Yes</Button>
                            <Button disabled={this.state.complete} onClick={this.onFinalizeNo}>No</Button>
                            <div>{this.state.errorMessage}</div>
                        </div>
                    </div>
                    <div className="ui grid row">
                        <div className="ui grid column">
                            <Link 
                            to={`/markets/${this.props.match.params.address}/bettors`}
                            className="ui button primary">View Bettors</Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default reduxForm({
    form: 'marketstack',
    // validate
})(MarketInfo);