import { Container, Row, Col, Card } from 'react-bootstrap';
import './Home.css';

function Home() {
  return (
    <Container className="mt-5" >
      <header className="app-header text-center">
        <h1>Bookie</h1>
        <h3>Kurk ir būk pastebėtas</h3>
      </header>


      <Row className="justify-content-md-center mt-5">
        <Col xs="12" lg="6">
          <img
            src="homepage.png"
            className="img-fluid rounded mx-auto d-block"
            alt="Library"
          />
        </Col>
        <Col xs="12" lg="6">
          <Card className="text-center about-card">
            <Card.Body>
              <Card.Title>Apie mus</Card.Title>
              <Card.Text>
                Bookie - tai sistema, leidžianti rašytojams publikuoti ir monetizuoti savo kūrybą, o skaitytojams remti rašytojus ir pirkti parašytas knygas ir tekstus bei prenumeruoti dar rašomas knygas.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

    </Container>
  );
}

export default Home;