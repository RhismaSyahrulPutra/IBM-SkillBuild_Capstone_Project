import Card from "react-bootstrap/Card";

export function getImageUrl(imageName) {
  return "./images/" + imageName;
}

function OverviewCard(props) {
  return (
    <Card>
      <Card.Body>
        <div className="d-flex align-items-center">
          <div className="mr-3">
            <Card.Img
              variant="top"
              src={getImageUrl(props.cardIcon)}
              alt={props.cardText}
            />
          </div>

          <div>
            <Card.Text>{props.cardText}</Card.Text>
            <Card.Title>${props.cardTitle}</Card.Title>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

export default OverviewCard;
