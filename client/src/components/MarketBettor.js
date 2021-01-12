import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import Market from '../market';
import BettorRow from './BettorRow';

class BettorIndex extends Component {
    state = { gamblers: null, gamblersCount: null, address: null, manager: null }

    async componentDidMount() {
        const { address } = this.props.match.params;
        const market = Market(address);
        const manager = await market.methods.manager().call();
        const gamblersCount = await market.methods.getGamblersCount().call();
        const gamblers = await Promise.all(
            Array(parseInt(gamblersCount))
                .fill()
                .map((element, index) => {
                    return market.methods.gamblers(index).call();
                })
        );
        this.setState({ gamblers, gamblersCount, address, manager })
    }

    renderRows() {
        if (!this.state.gamblers) {
            return;
        }

        return this.state.gamblers.map((gambler, index) => {
            return (
                <BettorRow
                    key={index}
                    id={index}
                    gambler={gambler}
                    manager={this.state.manager}
                    address={this.state.address}
                />
            );
        });
    }

    render() {
        const { Header, Row, HeaderCell, Body } = Table;

        return (
            <div>
                <h3>Prizing Candidate</h3>
                <Link
                    to={`/markets/${this.state.address}`}
                    className="ui button primary right floated"
                    style={{ marginBottom: 10 }}
                    >
                    Stack on market
                </Link>
                <Table>
                    <Header>
                        <Row>
                            <HeaderCell>ID</HeaderCell>
                            <HeaderCell>Address</HeaderCell>
                            <HeaderCell>Amount</HeaderCell>
                            <HeaderCell>Bet on</HeaderCell>
                            <HeaderCell>Manager</HeaderCell>
                        </Row>
                    </Header>
                    <Body>{this.renderRows()}</Body>

                </Table>
                <div>Found {this.state.gamblersCount} gamblers.</div>
            </div>
        );
    }
}

export default BettorIndex;