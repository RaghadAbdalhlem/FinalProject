/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { Container, Row, Col, Card, CardBody, Progress, Button } from "reactstrap";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Home, ShoppingCart, User, Heart, Droplet, CheckCircle } from "react-feather";
import { useWaterReminder } from "../../context/WaterReminderContext";
import { useGetAIRecommendQuery } from "../../redux/api/recommendAPI";
import FullScreenLoader from "../../components/FullScreenLoader";

const EndUserDashboard = () => {
    const { drinkCount, recordDrink } = useWaterReminder();
    const user = useSelector((state) => state.userState.user);
    const { data, refetch, isLoading } = useGetAIRecommendQuery();
    const totalWater = 8;
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    useEffect(() => {
        refetch();
    }, [refetch]);

    if (isLoading) {
        return (<FullScreenLoader />);
    }

    const handleRecordDrink = () => {
        recordDrink();
    }

    return (
        <div className="main-view">
            <Container>
                <Row className="mb-4 text-center">
                    <Col>
                        <h2 className="welcome-text">Hello, {user?.fullName || "User"}! 👋</h2>
                        <p className="sub-text">Your progress for <strong>{formattedDate}</strong></p>
                    </Col>
                </Row>

                {/* AI Quick Recommendations */}
                <Row>
                    <Col md={6}>
                        <Card className="ai-card equal-height">
                            <CardBody>
                                <h5 className="section-title"><CheckCircle size={18} /> AI Quick Product Recommendations</h5>
                                <ul className="recommendation-list list-group">
                                    {data.data?.aiRecommendation?.products.map((product, index) => (
                                        <li key={index} className="list-group-item d-flex align-items-start p-3 border-0 shadow-sm rounded-3 mb-2 bg-light">
                                            <span className="fs-5 me-2">🥗</span>
                                            <div>
                                                <span className="fw-bold text-primary">{product.name}</span>
                                                <small className="d-block text-muted">{product.category}</small>
                                                <p className="mb-0 text-secondary">{product.benefits}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>

                            </CardBody>
                        </Card>
                    </Col>
                    <Col md={6}>
                        <Card className="ai-card equal-height">
                            <CardBody>
                                <h5 className="section-title"><CheckCircle size={18} /> AI Quick Recipe Recommendations</h5>
                                <ul className="recommendation-list list-group">
                                    {data.data?.aiRecommendation?.recipes.map((recipe, index) => (
                                        <li key={index} className="list-group-item d-flex align-items-start p-3 border-0 shadow-sm rounded-3 mb-2 bg-light">
                                            <span className="fs-5 me-2">🍓</span>
                                            <div>
                                                <span className="fw-bold text-primary">{recipe.title}</span>
                                                <p className="mb-0 text-secondary">{recipe.instructions}</p>
                                            </div>
                                            {/* <h6 className="text-muted">Ingredients:</h6>
                                            <ul className="list-group list-group-flush mb-2">
                                                {recipe.ingredients.map((ingredient, i) => (
                                                    <li key={i} className="list-group-item border-0 ps-3">{ingredient}</li>
                                                ))}
                                            </ul> */}
                                        </li>
                                    ))}
                                </ul>


                            </CardBody>
                        </Card>
                    </Col>

                </Row>
                <Row className="mt-3">
                    <Col md={6}>
                        <Card className="equal-height h-100 d-flex flex-column">
                            <CardBody className="text-center d-flex flex-column justify-content-between">
                                <h5 className="section-title"><Droplet size={18} /> Water Intake</h5>
                                <p>{drinkCount} / {totalWater} cups</p>
                                <div style={{ height: '40px', width: '100%' }}>
                                    <Progress color="info" style={{ height: '100%' }} striped value={(drinkCount / totalWater) * 100} />
                                </div>
                                <div className="mt-3">
                                    <button className="btn-sm btn-primary btn" disabled={drinkCount > 7} onClick={handleRecordDrink}>
                                        Add to Cup
                                    </button>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>

                    <Col md={6}>
                        <Card className="equal-height h-100 d-flex flex-column">
                            <CardBody className="d-flex flex-column justify-content-center">
                                <h5 className="section-title"><CheckCircle size={18} /> Motivation</h5>
                                <p className="motivation-text text-center">
                                    {drinkCount < totalWater ? "“Stay consistent! Small progress each day leads to big results! 🚀”" : "“🚀 Great job on following your plan today!”"}
                                </p>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

                {/* Shortcut Buttons */}
                <Row className="mt-4 text-center">
                    {[
                        { path: "/user/recipes", icon: <Home size={16} />, label: "View Recipes" },
                        { path: "/user/shop", icon: <ShoppingCart size={16} />, label: "Open Shop" },
                        { path: "/user/profile", icon: <User size={16} />, label: "Update Profile" },
                        { path: "/user/favorites", icon: <Heart size={16} />, label: "Favorites" }
                    ].map((item, index) => (
                        <Col key={index} md={3} xs={6} className="mb-3">
                            <Link to={item.path}>
                                <Button className="dashboard-btn">{item.icon} {item.label}</Button>
                            </Link>
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    );
};

export default EndUserDashboard;
