import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addItemToBag } from '../../redux/user/user.action';
import { message, Button, Alert, Row, Col, Avatar} from 'antd';

class Bugs extends Component {

  constructor() {
    super();
    this.state = {
        error: null,
        bugs: [],
        loading: true   
    }
  }

  componentDidMount() {

    this.loadBugs();
  }

  renderList(bugs) {
      return (
        <div>
            <Row gutter={16} justify="start" style={{ textAlign: 'left'}}>
                <Col span={6}>
                    Name
                </Col>
                <Col span={4}>
                    Price
                </Col>
                <Col span={6}>
                    Image
                </Col>
                <Col span={6}>
                    Action
                </Col>
            </Row>

            {bugs.map(bug =>
                <Row gutter={16} justify="start" style={{ textAlign: 'left'}} key={bug.id}>
                    <Col span={6}>
                        {bug.name["name-USen"]}
                    </Col>
                    <Col span={4}>
                        {bug["price"]}
                    </Col>
                    <Col span={6}>
                        <Avatar src={bug["image_uri"]} />
                    </Col>
                    <Col span={6}>
                        <Button type="primary" value="1" onClick={()=> this.onAdd(bug)}>Catch</Button>
                    </Col>
                </Row>
            )
            }
        </div>
      );
  }

  onAdd(item) {

    var obj = {
        id: "bug-" + item.id,
        name: item.name["name-USen"],
        price: item.price,
        imageUri: item["image_uri"]
    };
    this.props.addItemToBag(obj);

    message.success("Added " + obj.name + "!");
  }

  render () {
      let errorAlert=<span/>;
      if (this.state.error && this.state.error !== '') {
          errorAlert = <Alert type="error">this.state.error</Alert>
      }

    let contents = this.state.loading
    ? <p><em>Loading...</em></p>
    : this.renderList(this.state.bugs);
      
    return (
      <div align="center">
            {errorAlert}
            {contents}
      </div>
    );
  }
  
  loadBugs() {

    var me = this;

    fetch('https://acnhapi.com/v1a/bugs')
    .then(
        function(response) {
        if (response.status !== 200) {

            me.setState({ error: 'Something went wrong. Status code: ' + response.status});
            console.log('Looks like there was a problem. Status Code: ' +
            response.status);
            return;
        }

        response.json().then(function(data) {
            me.setState({ bugs: data, loading: false, error: null});
        });
        }
    )
    .catch(function(err) {
        console.log('Fetch Error :-S', err);
        me.setState({ error: 'Fetch error'});
    });
  }
  
}


const mapStateToProps = state => ({
    inventory: state.user.inventory
  });

export default connect(mapStateToProps, {addItemToBag})(Bugs);