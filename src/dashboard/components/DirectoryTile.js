import { Card, ListGroup } from "react-bootstrap";

export default function DirectoryTile({ key, location, name }) {
    return (
        <ListGroup.Item key={key}>
            <Card>
                <Card.Body>
                    <a href={`/data/${location}/${name}`}>{name}</a>
                </Card.Body>
            </Card>
        </ListGroup.Item>
    )
}
