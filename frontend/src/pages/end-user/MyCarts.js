/* eslint-disable react-hooks/exhaustive-deps */
import {
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import {
  Container,
  Button,
  Card,
  Col,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback,
} from "reactstrap";
import DataTable from "react-data-table-component";
import {
  useCheckoutCartMutation,
  useDeleteCartMutation,
  useGetMyCartsQuery,
} from "../../redux/api/cartAPI";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import FullScreenLoader from "../../components/FullScreenLoader";

const MyCart = () => {
  /* ──────────────────────────────────── API ─────────────────────────────────── */
  const {
    data: mycarts,
    refetch: refetchMyCart,
    isLoading,
  } = useGetMyCartsQuery();
  const [deleteCart] = useDeleteCartMutation();
  const [
    checkoutCart,
    { isSuccess, error, isError, data: checkoutResp },
  ] = useCheckoutCartMutation();

  /* ─────────────────────────────── Local state ─────────────────────────────── */
  const [cartItems, setCartItems] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  /* card-form */
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [formErrors, setFormErrors] = useState({});

  /* ───────────────────────────── Sync cart from API ─────────────────────────── */
  useEffect(() => {
    if (mycarts) setCartItems(mycarts);
    refetchMyCart();
  }, [mycarts, refetchMyCart]);

  /* ───────────────────────────── Helper functions ──────────────────────────── */
  const handleQuantityChange = (cartId, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === cartId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleDelete = (cartId) => {
    setCartItems((prev) => prev.filter((item) => item._id !== cartId));
    deleteCart(cartId);
  };

  /* ───────────── Credit-card validation (front-end only, not stored) ────────── */
  const validateCardForm = useCallback(() => {
    const errors = {};

    /* 16 digits, no spaces/dashes */
    if (!/^\d{16}$/.test(cardNumber)) {
      errors.cardNumber = "Card number must be 16 digits";
    }

    /* MM/YY, must be in the future (end of month inclusive) */
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
      errors.expiry = "Expiry must be in MM/YY format";
    } else {
      const [m, y] = expiry.split("/").map(Number);
      const expDate = new Date(2000 + y, m); // first day of month AFTER expiry
      const now = new Date();
      if (expDate <= now) errors.expiry = "Card is expired";
    }

    /* 3 digits CVV */
    if (!/^\d{3}$/.test(cvv)) {
      errors.cvv = "CVV must be 3 digits";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [cardNumber, expiry, cvv]);

  /* Keep button state in sync */
  const isFormValid = useMemo(
    () => selectedRows.length > 0 && validateCardForm(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedRows, cardNumber, expiry, cvv]
  );

  /* ───────────────────────────── Checkout flow ─────────────────────────────── */
  const handleCheckout = () => {
    setModalOpen(true);
  };

  const resetCardForm = () => {
    setCardNumber("");
    setExpiry("");
    setCvv("");
    setFormErrors({});
  };

  const closeModal = () => {
    resetCardForm();
    setModalOpen(false);
  };

  const confirmCheckout = (e) => {
    if (e) e.preventDefault();
    if (!validateCardForm()) {
      toast.error("Please correct the highlighted fields");
      return;
    }

    const checkedCartItems = selectedRows.map((cart) => ({
      cart: cart._id,
      name: cart.product?.title,
      unitPrice: cart.product?.price,
      quantity: Number(cart.quantity),
      totalPrice: Number(cart.quantity) * Number(cart.product?.price),
      product: cart.product?._id,
      user: cart.user?._id,
    }));

    if (checkedCartItems.length > 0) {
      checkoutCart(checkedCartItems);
      closeModal();
    }
  };

  /* ─────────────────────────── Toast API responses ─────────────────────────── */
  useEffect(() => {
    if (isSuccess) {
      toast.success(checkoutResp?.message || "Order placed");
      refetchMyCart();
    }
    if (isError) {
      toast.error(error?.data?.message || "An error occurred");
    }
  }, [isSuccess, isError, checkoutResp, error, refetchMyCart]);

  /* ────────────────────────────── Table columns ────────────────────────────── */
  const columns = [
    {
      name: "Product Name",
      selector: (row) => row.product?.title,
      sortable: true,
    },
    {
      name: "Item Price",
      selector: (row) => `$${row.product?.price?.toFixed(2)}`,
      sortable: true,
    },
    {
      name: "Quantity",
      cell: (row) => (
        <div className="d-flex align-items-center">
          <Button
            size="sm"
            onClick={() => handleQuantityChange(row._id, row.quantity + 1)}
          >
            +
          </Button>
          <span className="mx-2">{row.quantity}</span>
          <Button
            size="sm"
            onClick={() => handleQuantityChange(row._id, row.quantity - 1)}
          >
            –
          </Button>
        </div>
      ),
    },
    {
      name: "Total Price",
      selector: (row) =>
        `$${(row.quantity * row.product?.price).toFixed(2)}`,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <Button
          color="danger"
          size="sm"
          onClick={() => handleDelete(row._id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  /* ──────────────────────────────── Render ─────────────────────────────────── */
  return (
    <Container className="main-view">
      <h4>My Shopping Cart</h4>

      {isLoading ? (
        <FullScreenLoader />
      ) : (
        <Row>
          <Col>
            <Card style={{ padding: "10px" }}>
              <DataTable
                title="Cart Items"
                columns={columns}
                noHeader
                responsive
                data={cartItems}
                selectableRows
                onSelectedRowsChange={({ selectedRows }) =>
                  setSelectedRows(selectedRows)
                }
                pagination
              />

              <div className="d-flex justify-content-between mt-3">
                <Link to="/user/shop" className="btn btn-primary">
                  Continue Shopping
                </Link>

                {selectedRows.length > 0 && (
                  <Button color="success" onClick={handleCheckout}>
                    Check Out
                  </Button>
                )}
              </div>
            </Card>
          </Col>
        </Row>
      )}

      {/* ───────────────────────────── Checkout Modal ─────────────────────────── */}
      <Modal isOpen={modalOpen} toggle={closeModal}>
        <ModalHeader toggle={closeModal}>Checkout Details</ModalHeader>

        <Form onSubmit={confirmCheckout}>
          <ModalBody>
            {/* Credit-card form */}
            <h5 className="mb-3">Payment Details</h5>

            <FormGroup>
              <Label for="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                name="cardNumber"
                placeholder="1234123412341234"
                maxLength="16"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ""))}
                invalid={Boolean(formErrors.cardNumber)}
              />
              <FormFeedback>{formErrors.cardNumber}</FormFeedback>
            </FormGroup>

            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="expiry">Expiry (MM/YY)</Label>
                  <Input
                    id="expiry"
                    name="expiry"
                    placeholder="08/27"
                    maxLength="5"
                    value={expiry}
                    onChange={(e) =>
                      setExpiry(
                        e.target.value
                          .replace(/[^\d/]/g, "")
                          .slice(0, 5)
                      )
                    }
                    invalid={Boolean(formErrors.expiry)}
                  />
                  <FormFeedback>{formErrors.expiry}</FormFeedback>
                </FormGroup>
              </Col>

              <Col md={6}>
                <FormGroup>
                  <Label for="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    name="cvv"
                    placeholder="123"
                    maxLength="3"
                    value={cvv}
                    onChange={(e) =>
                      setCvv(e.target.value.replace(/\D/g, ""))
                    }
                    invalid={Boolean(formErrors.cvv)}
                  />
                  <FormFeedback>{formErrors.cvv}</FormFeedback>
                </FormGroup>
              </Col>
            </Row>

            {/* Order summary */}
            <h5 className="mt-4">Order Summary</h5>
            <ul className="mb-2">
              {selectedRows.map((item) => (
                <li key={item._id}>
                  {item.product?.title} – {item.quantity} × $
                  {item.product?.price?.toFixed(2)} = $
                  {(item.quantity * item.product.price).toFixed(2)}
                </li>
              ))}
            </ul>

            <strong>
              Total: $
              {selectedRows
                .reduce(
                  (acc, item) =>
                    acc + item.quantity * item.product.price,
                  0
                )
                .toFixed(2)}
            </strong>
          </ModalBody>

          <ModalFooter>
            <Button color="secondary" onClick={closeModal}>
              Cancel
            </Button>

            <Button
              color="success"
              type="submit"
              disabled={!isFormValid}
            >
              Confirm Checkout
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </Container>
  );
};

export default MyCart;
