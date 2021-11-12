import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Accordion, AccordionContext, Card, Col, Form, FormControl, InputGroup, ListGroup, Row, useAccordionButton } from "react-bootstrap";
import { base_url } from "../App";
import useToken from "../auth/Token";

export default function DashboardPage() {
    const [fileData, setFileData] = useState({});
    const [startDate, setStartDate] = useState();
    const [startTime, setStartTime] = useState();
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

    const handleSubmit = async (filename, e) => {
        e.preventDefault();
        console.log(startDate, startTime, filename);
        if (startDate && startTime) {
            scheduleDownload(token?.user, `${location}/${filename}`, startDate, startTime);
        }
    }

    return (
        <div>
            {fileData?.directories?.length > 0 || fileData?.files?.length > 0 ? (
                <Accordion defaultActiveKey="0">
                    <ListGroup>
                        {fileData.directories?.map((directory, key) => {
                            return <ListGroup.Item key={key}>
                                <Card>
                                    <Card.Body>
                                        <a href={`/data/${location}/${directory.name}`}>{directory.name}</a>
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
                                                <ListGroup.Item action>
                                                    <Row>
                                                        <Col xs={6} md={4}>Schedule Download</Col>
                                                        <Col xs={12} md={8}>
                                                            <Form onSubmit={(e) => handleSubmit(file.name, e)}>
                                                                <Row className="align-items-center">
                                                                    <Col xs="auto">
                                                                        <Form.Label htmlFor="inlineFormInput" visuallyHidden>Start Time</Form.Label>
                                                                        <InputGroup className="mb-2">
                                                                            <InputGroup.Text>DATE</InputGroup.Text>
                                                                            <FormControl type="date" placeholder="Start Time" onChange={e => setStartDate(e.target.value)} />
                                                                        </InputGroup>
                                                                    </Col>
                                                                    <Col xs="auto">
                                                                        <Form.Label htmlFor="inlineFormInputGroup" visuallyHidden>End Time</Form.Label>
                                                                        <InputGroup className="mb-2">
                                                                            <InputGroup.Text>TIME</InputGroup.Text>
                                                                            <FormControl type="time" placeholder="End Time" onChange={e => setStartTime(e.target.value)} />
                                                                        </InputGroup>
                                                                    </Col>
                                                                    <Col xs="auto">
                                                                        <button type="submit" className="btn mb-2 btn-sm btn-primary">Schedule</button>
                                                                    </Col>
                                                                </Row>
                                                            </Form>
                                                        </Col>
                                                    </Row>
                                                </ListGroup.Item>
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

async function scheduleDownload(username, filename, startDate, startTime) {
    if (username && filename && startDate && startTime) {
        return axios.get(`${base_url}/schedule?username=${username}&filename=${filename}&day=${startDate}&time=${startTime}`)
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
