import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Accordion, AccordionContext, Card, Col, ListGroup, Row, useAccordionButton } from "react-bootstrap";
import { base_url } from "../App";
import useToken from "../auth/Token";

export default function DashboardPage() {
    const [fileData, setFileData] = useState({});
    const { token } = useToken();
    let location = decodeURI(window.location.pathname.substr(6));
    console.log(location);

    useEffect(() => {
        if (token?.user) {
            getUserDirectories(token.user, location)
                .then(response => {
                    setFileData(response.data);
                }).catch(error => {
                    console.error(error);
                });
        }
    }, []);

    return (
        <div>
            {fileData?.directories?.length > 0 || fileData?.files?.length > 0 ? (
                <Accordion defaultActiveKey="0">
                    <ListGroup>
                        {fileData.directories?.map((directory, key) => {
                            return <ListGroup.Item key={key}>
                                <Card>
                                    <Card.Body>
                                        <a href={`/data/${location}/${directory.name}`}>{directory.name}</a> ({directory.size})
                                    </Card.Body>
                                </Card>
                            </ListGroup.Item>
                        })}
                        {fileData.files?.map((file, key) => {
                            return <ListGroup.Item key={key}>
                                <Card>
                                    <Card.Body>
                                        <Row>
                                            <Col xs={12} md={8}>{file.name} ({file.size})</Col>
                                            <Col xs={6} md={4}>
                                                <CustomToggle eventKey={key}>Download Options</CustomToggle>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                    <Accordion.Collapse eventKey={key}>
                                        <Card.Footer>
                                            <ListGroup>
                                                <ListGroup.Item action onClick={() => downloadFile(token?.user, `${location}/${file.name}`)}>Download Now</ListGroup.Item>
                                                <ListGroup.Item action onClick={alertClicked}>Overnight Download</ListGroup.Item>
                                                <ListGroup.Item action onClick={alertClicked}>Schedule Download</ListGroup.Item>
                                            </ListGroup>
                                        </Card.Footer>
                                    </Accordion.Collapse>
                                </Card>
                            </ListGroup.Item>
                        })}
                    </ListGroup>
                </Accordion>
            ) : (
                <p>No data found!</p>
            )}
        </div>
    );
}

async function downloadFile(username, filename) {
    if (username && filename) {
        return axios.get(`${base_url}/download?username=${username}&filename=${filename}`)
            .then(response => {
                console.log(response.data);
                return response.data;
            })
            .catch(error => {
                console.error(error);
                return error;
            });
    }
}

function alertClicked() {
    alert('Clicked !');
}

function CustomToggle({ children, eventKey, callback }) {
    const { activeEventKey } = useContext(AccordionContext);

    const decoratedOnClick = useAccordionButton(
        eventKey,
        () => callback && callback(eventKey),
    );

    const isCurrentEventKey = activeEventKey === eventKey;

    return <button
        className={isCurrentEventKey ? "btn btn-sm btn-primary" : 'btn btn-sm btn-secondary'}
        onClick={decoratedOnClick}
    >
        {children}
    </button>
}

async function getUserDirectories(username, location) {
    let url = `${base_url}/data?username=${username}`;
    if (location) {
        url += `&location=${location}`;
    }
    return axios.get(url)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error(error);
            return error;
        });
}
