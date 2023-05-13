import { Container, Row, Col, Card } from 'react-bootstrap';
import './Home.css';

function Home() {
    return (
        <Container className="container mt-5">
            <header className="app-header text-center">
                <h1>Bookie</h1>
                <h3>Kurk ir būk pastebėtas</h3>
            </header>

            <Row className="justify-content-md-center mt-5">
                <Col xs lg="6">
                    <img src="homepage.png" className="img-fluid rounded mx-auto d-block" alt="Library" />
                </Col>
            </Row>

            <Row className="justify-content-md-center mt-5">
                <Col xs lg="6">
                    <Card className="text-center">
                        <Card.Body>
                            <Card.Title>Apie mus</Card.Title>
                            <Card.Text>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ac consectetur lorem, at sagittis nisl. Quisque feugiat tellus nec ante semper, eget posuere neque aliquet.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default Home;