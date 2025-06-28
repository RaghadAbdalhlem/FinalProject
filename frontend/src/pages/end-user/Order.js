/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";
import { Container, Button, Card, Col, Row, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import DataTable from "react-data-table-component";
import { useGetOrdersQuery } from "../../redux/api/orderAPI";
import FullScreenLoader from "../../components/FullScreenLoader";

const Order = () => {
  const { data: orders, isLoading } = useGetOrdersQuery();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const columns = [
    {
      name: "Order ID",
      selector: (row) => row._id,
      sortable: true,
    },
    {
      name: "Total Price",
      selector: (row) => `$${row.totalPrice.toFixed(2)}`,
      sortable: true,
    },
    {
      name: "Created At",
      selector: (row) => new Date(row.createdAt).toLocaleDateString(),
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <Button color="info" size="sm" onClick={() => handleViewDetails(row)}>View Details</Button>
      ),
    },
  ];

  return (
    <Container className="main-view">
      <h4>My Orders</h4>
      {isLoading ? <FullScreenLoader /> : (
        <Row>
          <Col>
            <Card style={{ padding: "10px" }}>
              <DataTable
                title="Order History"
                columns={columns}
                noHeader
                responsive
                data={orders}
                pagination
              />
            </Card>
          </Col>
        </Row>
      )}
      {/* Order Details Modal */}
      <Modal isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)}>
        <ModalHeader toggle={() => setModalOpen(!modalOpen)}>Order Details</ModalHeader>
        <ModalBody>
          {selectedOrder ? (
            <>
              <h5>Order Summary</h5>
              <ul>
                <li>{selectedOrder.product?.title} - {selectedOrder.quantity} x ${selectedOrder.unitPrice.toFixed(2)} = ${(selectedOrder.quantity * selectedOrder.unitPrice).toFixed(2)}</li>
              </ul>
              <strong>Total: ${selectedOrder.totalPrice.toFixed(2)}</strong>
            </>
          ) : (
            <p>Loading order details...</p>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setModalOpen(false)}>Close</Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default Order;
