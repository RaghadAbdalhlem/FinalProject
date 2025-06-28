import { Card, CardBody, Col, Row, Container } from "reactstrap";
import { useGetProductByIdQuery } from "../../redux/api/productAPI";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import FullScreenLoader from "../../components/FullScreenLoader";

const AdminProductDetail = () => {
  const { id } = useParams();
  const { data: product, isLoading, refetch } = useGetProductByIdQuery(id);

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (isLoading) return <FullScreenLoader />;

  return (
    <Container className="main-view py-4">
      <Row className="mb-4">
        <Col>
          <h2 className="text-primary">Product Details</h2>
        </Col>
      </Row>
      <Card className="shadow border-0">
        <CardBody>
          <Row className="align-items-center">
            <Col md={5} className="text-center">
              <img
                src={product.image}
                alt={product.title}
                className="img-fluid rounded shadow-sm"
                style={{ maxWidth: "100%", maxHeight: "300px" }}
              />
            </Col>
            <Col md={7}>
              <div className="mb-3">
                <h4 className="text-dark mb-1">{product.title}</h4>
                <span className="badge bg-secondary text-uppercase">{product.category}</span>
              </div>
              <div className="mb-2">
                <strong className="text-muted">Price:</strong>
                <span className="ms-2 text-success fw-bold">${product.price}</span>
              </div>
              <div className="mb-2">
                <strong className="text-muted">Description:</strong>
                <div className="text-dark">{product.description}</div>
              </div>
              <div className="mb-2">
                <strong className="text-muted">Usage Instructions:</strong>
                <div className="text-dark">{product.usageInstructions}</div>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Container>
  );
};

export default AdminProductDetail;