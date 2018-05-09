import React, { Component } from 'react';
import FileSaver from 'file-saver';
import { apiRequest } from '../../data/requests';
import { Table, Button, Loader } from 'semantic-ui-react';

class OrderList extends Component {
  constructor(props) {
    super(props);
    this.downloadPdf = this.downloadPdf.bind(this);
  }

  downloadPdf(uri) {
    apiRequest(uri, { props: { responseType: 'arraybuffer' } }).then((res) => {
      const blob = new Blob([res.data], {type: 'application/pdf'});
      FileSaver.saveAs(blob, 'receipt.pdf');
    });
  }

  getOrders() {
    if (this.props.orders === undefined) {
      return null;
    }
    return typeof this.props.orders.map === 'function' ? this.props.orders : [];
  }

  render() {
    return (
      <div className="order-list__table-container">
        <Table celled>
          <Table.Header>
            <Table.Row>
                <Table.HeaderCell width={1}>ID</Table.HeaderCell>
                <Table.HeaderCell width={6}>Date</Table.HeaderCell>
                <Table.HeaderCell width={7}>Price</Table.HeaderCell>
                <Table.HeaderCell width={2}>Receipt</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
  
          <Table.Body>
            {
              this.getOrders() === null ?
                <Table.Row key={0}>
                  <Table.Cell colSpan={4}>
                    <Loader active inline="centered">Loading orders</Loader>
                  </Table.Cell>
                </Table.Row>
              :
                this.getOrders().length === 0 ?
                  <Table.Row key={0}>
                    <Table.Cell colSpan={4} textAlign="center">
                      No orders this session.
                    </Table.Cell>
                  </Table.Row>
                :
                  this.getOrders().map((order, i) =>
                    <Table.Row key={i}>
                      <Table.Cell>{order.id}</Table.Cell>
                      <Table.Cell>{order.date}</Table.Cell>
                      <Table.Cell>£{order.price.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</Table.Cell>
                      <Table.Cell><Button onClick={() => this.downloadPdf(order.pdfUri)}>Download PDF</Button></Table.Cell>
                    </Table.Row>
                  )
            }
          </Table.Body>
        </Table>
      </div>
    );
  }
}

export default OrderList;