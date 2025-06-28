/* eslint-disable react-hooks/exhaustive-deps */
import { Card, CardBody, Col, Row, Button, Badge } from "reactstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useGetProductByIdQuery } from "../../redux/api/productAPI";
import { ChevronLeft, ShoppingCart } from "react-feather";
import FullScreenLoader from "../../components/FullScreenLoader";
import { useCreateCartMutation } from "../../redux/api/cartAPI";
import { useState } from "react";
import { toast } from "react-toastify";

const ShopDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: product, isLoading } = useGetProductByIdQuery(id);
  const [createCart] = useCreateCartMutation();
  const [quantity, setQuantity] = useState(1);

  if (isLoading) return (<FullScreenLoader />);

  const handleCart = async () => {
    try {
      const data = {
        'quantity': quantity,
        'product': id,
      }
      const response = await createCart(data).unwrap();
      console.log(response)
      toast.success(response.message);
    } catch(error) {
      toast.error(error.message, { position: "top-right" })
    }
  }

  const handleDecrement = () => {
    setQuantity(prevQuantity => Math.max(prevQuantity - 1, 1));
  };

  const handleIncrement = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  return (
    <div className="container main-view">
      {/* Back Button */}
      <Row className="my-3">
        <Col>
          <Button color="primary" className="mb-3" onClick={() => navigate(-1)}>
            <ChevronLeft size={16} className="mr-1" /> Back to Shop
          </Button>
        </Col>
      </Row>

      {/* Single Card Layout */}
      <Card className="p-3">
        <CardBody>
          <Row>
            {/* Product Image */}
            <Col md={5} className="text-center">
              {product.image && (
                <img
                  src={product.image}
                  alt={product.title}
                  className="img-fluid rounded"
                  style={{ maxWidth: "100%", maxHeight: "350px" }}
                />
              )}
            </Col>

            {/* Product Details */}
            <Col md={7}>
              <h3 className="mb-2">{product.title}</h3>
              <h4 className="text-primary">${product.price}</h4>
              <Badge color="info" className="mb-2">{product.category}</Badge>

              {/* Full Description */}
              <h6 className="mt-3">Full Description</h6>
              <p>{product.description}</p>

              {/* Ingredients */}
              {product.ingredients && product.ingredients.length > 0 && (
                <>
                  <h6 className="mt-3">Ingredients</h6>
                  <ul>
                    {product.ingredients.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </>
              )}

              {/* Usage Instructions */}
              <h6 className="mt-3">Usage Instructions</h6>
              <p>{product.usageInstructions}</p>

              {/* Health Benefits */}
              {product.healthBenefits && product.healthBenefits.length > 0 && (
                <>
                  <h6 className="mt-3">Health Benefits</h6>
                  <ul>
                    {product.healthBenefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </>
              )}

              {/* Action Buttons */}
              <div className="row mt-4">
                <div className="col-md-6">
                  <div className="input-group mb-3">
                    <div className="input-group-prepend">
                      <button className="btn btn-outline-secondary btn-minus" type="button" onClick={handleDecrement}>-</button>
                    </div>
                    <input type="number" className="form-control quantity text-center" value={quantity} onChange={(e) => setQuantity(Math.max(0, parseInt(e.target.value) || 0))} />
                    <div className="input-group-append">
                      <button className="btn btn-outline-secondary btn-plus" type="button" onClick={handleIncrement}>+</button>
                    </div>
                  </div>
                  <Button color="success" className="mx-1" onClick={handleCart}>
                    <ShoppingCart size={16} className="mx-1" /> Add to Cart
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </div>
  );
};

export default ShopDetail;
