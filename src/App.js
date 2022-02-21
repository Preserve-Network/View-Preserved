import React, { useState, useEffect } from "react";
import axios from "axios";

import "./App.css";

function App() {
  const [metadata, setMetadata] = useState();
  const [index, setIndex] = useState();
  const [network, setNetwork] = useState("mainnet");

  useEffect(() => {
    async function fetchList() {
      try {
        const url =
          `http://localhost:3001/?network=${network}` +
          (!!index ? `&index=${index}` : "");

        const resp = await axios.get(url);
        const metadata = resp.data;

        setMetadata(metadata);
      } catch (err) {
        console.error(err);
      }
    }

    fetchList();
  }, [index, network]);

  const changeNetwork = (e) => {
    setIndex(null);
    setNetwork(e.target.value);
  };

  const prevClicked = () => {
    const previous = index ? index - 1 : metadata.indexLength - 2;
    setIndex(previous);
  };

  const nextClicked = () => {
    setIndex(index + 1);
  };

  const createdDate = metadata ? new Date(metadata.created).toString() : "-";
  const maxIndex = metadata ? metadata.indexLength - 1 : 0;

  return (
    <div className="container">
      <h1>View Preserved</h1>
      <select onChange={changeNetwork} value={network}>
        <option value="mainnet">mainnet</option>
        <option value="mumbai">mumbai</option>
      </select>
      <div>{createdDate}</div>
      <div>
        Showing: {index ? index : 0} - {maxIndex}
      </div>
      <div>
        <button onClick={prevClicked}>Prev</button>
        <button onClick={nextClicked}>Next</button>
      </div>
      <ul>
        {metadata &&
          metadata.filenames &&
          metadata.filenames.map((file) => {
            return (
              <li key={file}>
                <a href={file} rel="noreferrer" target="_blank">
                  {file}
                </a>
              </li>
            );
          })}
      </ul>
    </div>
  );
}

export default App;
