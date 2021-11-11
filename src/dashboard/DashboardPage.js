import axios from "axios";
import { useEffect, useState } from "react";
import { ListGroup } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { base_url } from "../App";
import useToken from "../auth/Token";

export default function DashboardPage() {
    const base_directory = useParams();
    const [fileData, setFileData] = useState({});
    const { token } = useToken();

    useEffect(() => {
        if (token?.user) {
            getUserDirectories(token.user)
                .then(response => {
                    setFileData(response.data);
                }).catch(error => {
                    console.error(error);
                });
        }
    }, []);

    return (
        <div>
            <h3>Dashboard</h3>
            <ListGroup>
                {fileData.directories?.map((directory, key) => {
                    return <ListGroup.Item key={key}><Link to={`/data/${directory.name}`}>{directory.name}</Link> ({directory.size})</ListGroup.Item>
                })}
                {fileData.files?.map((file, key) => {
                    return <ListGroup.Item key={key}>{file.name} ({file.size})</ListGroup.Item>
                })}
            </ListGroup>
        </div>
    );
}

async function getUserDirectories(username) {
    return axios.get(`${base_url}/data?username=${username}`)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error(error);
            return error;
        });
}
