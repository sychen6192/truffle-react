import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { getMarket } from '../actions/actions-provider';
import Factory from "../factory";
import web3 from '../getWeb3';


class MarketList extends Component {
  state = { contract: null, accounts: null };
  
   componentDidMount = async () => {
    try {
      const accounts = await web3.eth.getAccounts();
      this.setState({ contract: Factory, accounts });
      await this.props.getMarket(Factory);
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };
    

  renderList = () => {
    if (this.props.markets !== undefined) {
      const { markets, descriptions } = this.props.markets;
      const items = markets.map((address, idx) => {
        return {
          header: descriptions[idx],
          description: (
            <Link to={`/markets/${address}`}>View Betting</Link>
          ),
          meta: address,
          fluid: true
        };
      });
      return <Card.Group items={items} />;
    } else {
      return <div>Loading...</div>
    }
  }

  render() {
    return (
      <div className="ui container">
        <h3>Open Betting Markets</h3>
        <Link to="/markets/new"> 
          <Button
            floated="right"
            content="Create Betting Market"
            icon="add circle"
            primary={true}
          />
        </Link>
        {this.renderList(this.props.markets)}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    markets: state.provider.markets
  }
}

export default connect(mapStateToProps, { getMarket })(MarketList);