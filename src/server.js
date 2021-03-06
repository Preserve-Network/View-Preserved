const axios = require("axios").default;
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const Preserve = require("../../preserve");

const app = express();

const gateway = "ipfs.infura-ipfs.io";

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.options("*", cors());

const getMetadataForCID = async (cid) => {
  const url = `https://${cid}.${gateway}/metadata.json`;
  const response = await axios.get(url);
  return response.data;
};

const getFileUrl = (cid, filename) => {
  return `https://${cid}.${gateway}/${filename}`;
};

app.get("/api", async (req, res) => {
  const network = req.query.network;
  const index = req.query.index;
  const contract = req.query.contract;

  if (!network || !contract) {
    return res.status(400).send({
      status: 400,
      error: "Network and contract are required.",
    });
  }

  const preserve = new Preserve(network, contract);

  const cid = !!index
    ? await preserve.getValueAtIndex(index)
    : await preserve.getLastValue();

  if (!cid) {
    return res.status(404).send({
      status: 404,
      error: "We could not get the index, check the contract address",
    });
  }

  const metadata = await getMetadataForCID(cid);

  const fileList = metadata.filenames.map((file) => {
    return {
      name: file,
      url: getFileUrl(cid, file),
    };
  });
  const indexLength = await preserve.getIndexLength();

  metadata.filenames = fileList;
  metadata.indexLength = parseInt(indexLength);

  res.setHeader("Content-Type", "application/json");
  res.send(metadata);
});

app.listen(3001, () => console.log("app is listening on port 3001."));
