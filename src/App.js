import React, { useState, useEffect } from "react";
import axios from "axios";

import "./App.css";

import ListGroup from "react-bootstrap/ListGroup";
import Dropdown from "react-bootstrap/Dropdown";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";

function App() {
  const [metadata, setMetadata] = useState();
  const [index, setIndex] = useState();
  const [network, setNetwork] = useState("mainnet");

  const host =
    process.env.NODE_ENV === "development" ? "http://localhost:3001" : "";

  useEffect(() => {
    async function fetchList() {
      try {
        const url =
          `${host}/api?network=${network}` + (!!index ? `&index=${index}` : "");

        const resp = await axios.get(url);
        const metadata = resp.data;

        setMetadata(metadata);
      } catch (err) {
        console.error(err);
      }
    }

    fetchList();
  }, [index, network, host]);

  const changeNetwork = (eventKey, event) => {
    setIndex(null);
    setNetwork(eventKey);
  };

  const changeIndex = (eventKey, event) => {
    setIndex(eventKey);
  };

  const createdDate = metadata ? new Date(metadata.created).toString() : "-";
  const maxIndex = metadata ? metadata.indexLength - 1 : 0;

  return (
    <Container>
      <Row>
        <h1>View Preserved Files</h1>
        <p>
          This page will allow you to view the files stored on a{" "}
          <b>preserve index</b>.
        </p>
      </Row>
      <Row className="controls">
        <Col xs lg="3">
          <Dropdown onSelect={changeNetwork} value={network}>
            <Dropdown.Toggle className="dropdown" id="dropdown-basic">
              Network: Polygon {network}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item eventKey="mainnet">mainnet</Dropdown.Item>
              <Dropdown.Item eventKey="mumbai">mumbai</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        <Col xs lg="4">
          <Form.Control
            placeholder="
            Index Contract Address"
          />
        </Col>
      </Row>
      <hr />
      <Row>
        <Col xs lg="3">
          <Dropdown onSelect={changeIndex} value={index}>
            <Dropdown.Toggle
              className="dropdown"
              variant="success"
              id="dropdown-basic"
            >
              Index Entry: {index || `${maxIndex}`}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {Array.from(Array(maxIndex + 1), (e, i) => {
                return (
                  <Dropdown.Item key={i} eventKey={i}>
                    {i}
                  </Dropdown.Item>
                );
              }).reverse()}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        <Col>
          <b>Indexed on:</b> {createdDate}
        </Col>
      </Row>
      <Row className="table">
        <ListGroup>
          {metadata &&
            metadata.filenames &&
            metadata.filenames.map((file) => {
              return (
                <ListGroup.Item key={file.name}>
                  <a href={file.url} rel="noreferrer" target="_blank">
                    {file.name}
                  </a>
                </ListGroup.Item>
              );
            })}
        </ListGroup>
      </Row>
    </Container>
  );
}

export default App;
