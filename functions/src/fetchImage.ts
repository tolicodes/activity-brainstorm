import axios from 'axios';

export default async (imageUrl: string, { toBuffer } = { toBuffer: false }) => {
  const split = imageUrl.split('.');
  const extension = split[split.length - 1];

  const { data: body } = toBuffer ? await axios({
    url: imageUrl,
    responseType: "arraybuffer"
  }) : await axios({
    url: imageUrl,
    responseType: 'stream'
  });

  return {
    body,
    extension
  };
}