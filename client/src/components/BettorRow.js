import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';
import web3 from '../getWeb3';
class BettorRow extends Component {

    render() {
        const { Row, Cell } = Table;
        const { id, gambler, manager } = this.props;
        return (
            <Row>
                <Cell>{id} </Cell>
                <Cell>{gambler[0]} </Cell>
                <Cell>{web3.utils.fromWei(gambler[1], 'ether')} IEBI</Cell>
                <Cell>{gambler[2] ? "Yes": "No"} </Cell>
                <Cell>
                    {gambler[0] === manager ? "Manager" : null}
                </Cell>
            </Row>
        )
    }
}

export default BettorRow;