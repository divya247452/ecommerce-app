import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Card,
  Form,
  Button,
} from "react-bootstrap";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetPaypalClientIdQuery,
} from "../slices/orderApiSlice";
// import {
//   useDeliverOrderMutation,
//   useGetOrderDetailsQuery,
//   useGetPaypalClientIdQuery,
//   usePayOrderMutation,
// } from '../slices/ordersApiSlice';

const Order = () => {
  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPayPal,
  } = useGetPaypalClientIdQuery();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal.clientId) {
      const loadPayPalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": paypal.clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPayPalScript();
        }
      }
    }
  }, [order, paypal, paypalDispatch, loadingPayPal, errorPayPal]);

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success("Order is paid");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    });
  }

  // TESTING ONLY! REMOVE BEFORE PRODUCTION
  //   async function onApproveTest() {
  //     await payOrder({ orderId, details: { payer: {} } });
  //     refetch();

  //     toast.success('Order is paid');
  //   }

  function onError(err) {
    toast.error(err.message);
  }

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order.totalPrice },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  //   const deliverHandler = async () => {
  //     await deliverOrder(orderId);
  //     refetch();
  //   };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error.data.message}</Message>
  ) : (
    <>
      <h1>Order Id: {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p className="d-flex gap-2">
                <strong>Name: </strong> {order.user.name}
              </p>
              <p className="d-flex gap-2">
                <strong>Email:</strong> {order.user.email}
              </p>
              <p className="d-flex gap-2">
                <strong>Address: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
                {order.shippingAddress.postalCode},{" "}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  Delivered on {order.deliveredAt}
                </Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method</strong> {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success">Paid on {order.paidAt}</Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order.Items</h2>
              {order.orderItems.map((item, index) => (
                <Row key={index}>
                  <Col md={1}>
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>
                  <Col>
                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                  </Col>
                  <Col md={4}>
                    {item.qty} x ${item.price} = ${item.qty * item.price}
                  </Col>
                </Row>
              ))}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>$ {order.itemsPrice}</Col>
                </Row>
                <Row>
                  <Col>Shipping</Col>
                  <Col>$ {order.shippingPrice}</Col>
                </Row>
                <Row>
                  <Col>Total</Col>
                  <Col>$ {order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}
                  {isPending ? (
                    <Loader />
                  ) : (
                    <div>
                      {/* <Button onClick={onApproveTest} className='mb-2'> Test Pay Order</Button> */}
                      <div>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        ></PayPalButtons>
                      </div>
                    </div>
                  )}
                </ListGroup.Item>
              )}
              {/* Mark as Delivered Placeholder*/}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Order;
