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

app.get("/", async (req, res) => {
  const network = req.query.network || "mumbai";
  const index = req.query.index;

  const preserve = new Preserve(network);

  const cid = !!index
    ? await preserve.getValueAtIndex(index)
    : await preserve.getLastValue();

  const metadata = await getMetadataForCID(cid);

  const fileList = metadata.filenames.map((file) => getFileUrl(cid, file));
  const indexLength = await preserve.getIndexLength();

  metadata.filenames = fileList;
  metadata.indexLength = parseInt(indexLength);

  res.setHeader("Content-Type", "application/json");
  res.send(metadata);
});

app.listen(3001, () => console.log("app is listening on port 3001."));