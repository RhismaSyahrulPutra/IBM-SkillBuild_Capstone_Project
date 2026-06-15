import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function Header() {
  return (
    <header className="header">
      <Container fluid="lg">
        <Row>
          <Col md="6">
            <div className="title">FinLogger</div>
          </Col>
          <Col md="6">
            <div className="tagline">Your financial diary!</div>
          </Col>
        </Row>
      </Container>
    </header>
  );
}

export default Header;
