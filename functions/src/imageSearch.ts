import * as functions from 'firebase-functions';
const cors = require('cors');

const { ImageSearchClient } = require("@azure/cognitiveservices-imagesearch");
const { CognitiveServicesCredentials } = require("@azure/ms-rest-azure-js");

import { BING_API_KEY } from './env';

interface IImageResult {
  thumbnailUrl: string
  contentUrl: string
}

export default functions.https.onRequest((req, res) => cors()(req, res, async () => {
  const credentials = new CognitiveServicesCredentials(BING_API_KEY);
  const imageSearchApiClient = new ImageSearchClient(credentials);

  try {
    const results = await imageSearchApiClient.images.search(req.query.search);
    const mapped = results.value.map(({ thumbnailUrl, contentUrl }: IImageResult) => ({ thumbnailUrl, contentUrl }));
    res.json(mapped);
  } catch (e) {
    res.json([])
  }
}));