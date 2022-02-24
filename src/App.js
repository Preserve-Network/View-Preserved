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
  const [contract, setContract] = useState("");
  const [error, setError] = useState(null);

  const host =
    process.env.NODE_ENV === "development" ? "http://localhost:3001" : "";

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const queryContract = queryParams.get("contract");
    if (!!queryContract) {
      setContract(queryContract);
    }
  }, []);

  useEffect(() => {
    async function fetchList() {
      setError(null);
      try {
        const url =
          `${host}/api?network=${network}&contract=${contract}` +
          (!!index ? `&index=${index}` : "");

        const resp = await axios.get(url);
        const metadata = resp.data;

        setMetadata(metadata);
      } catch (err) {
        setError(
          "Failed to fetch the contract, please double check the network and contract address are correct."
        );
      }
    }

    if (contract.length === 42 && contract.startsWith("0x")) {
      fetchList();
    } else {
      setMetadata(null);
    }
  }, [index, network, host, contract]);

  const changeNetwork = (eventKey, event) => {
    setIndex(null);
    setNetwork(eventKey);
    setContract("");
  };

  const changeIndex = (eventKey, event) => {
    setIndex(eventKey);
  };

  const updateContract = (e) => {
    setContract(e.target.value);
  };

  const selectContract = (eventKey, event) => {
    switch (eventKey) {
      case "sitesnapshot":
        const contractAddress =
          network === "mainnet"
            ? "0x7db36be76c97fdb9d15fdfd7331ef29ed8bcb742"
            : "0x7d6b76E5Ab4e72E872a0E08198eA0c3b7B81E9De";
        setContract(contractAddress);
        break;
      default:
        setContract("");
    }
  };

  const createdDate = metadata ? new Date(metadata.created).toString() : null;
  const maxIndex = metadata ? metadata.indexLength - 1 : 0;

  return (
    <Container className="container">
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
              <Dropdown.Item eventKey="mainnet">Polygon mainnet</Dropdown.Item>
              <Dropdown.Item eventKey="mumbai">Polygon mumbai</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        <Col xs lg="9">
          <Form.Control
            placeholder="Index Contract Address"
            className="contractInput"
            value={contract}
            onChange={updateContract}
          />
          <span className="or">OR</span>
          <Dropdown
            onSelect={selectContract}
            value={network}
            className="contractOptions"
          >
            <Dropdown.Toggle className="dropdown" id="dropdown-basic">
              Offical Contracts
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item eventKey="sitesnapshot">
                Site Snapshots
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>
      <Row className="errorMessage">{error}</Row>
      <hr />

      {!!metadata && (
        <>
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
        </>
      )}
    </Container>
  );
}

export default App;
