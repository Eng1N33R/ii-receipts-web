import React, { Component } from 'react';
import FileSaver from 'file-saver';
import { apiRequest } from '../../data/requests';
import { connect } from 'react-redux';
import { Table, Button } from 'semantic-ui-react';

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

  render() {
    return (
      <div className='order-list__table-container'>
        <Table celled>
          <Table.Header>
            <Table.Row>
                <Table.HeaderCell width={1}>ID</Table.HeaderCell>
                <Table.HeaderCell width={13}>Date</Table.HeaderCell>
                <Table.HeaderCell width={2}>Receipt</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
  
          <Table.Body>
            {
              this.props.orders.map((order, i) =>
                <Table.Row key={i}>
                  <Table.Cell>{order.id}</Table.Cell>
                  <Table.Cell>{order.order.date}</Table.Cell>
                  <Table.Cell><Button onClick={() => this.downloadPdf(order.order.pdfUri)}>Download PDF</Button></Table.Cell>
                </Table.Row>
              )
            }
          </Table.Body>
        </Table>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return { orders: state.orders.session };
}

export default connect(mapStateToProps)(OrderList);