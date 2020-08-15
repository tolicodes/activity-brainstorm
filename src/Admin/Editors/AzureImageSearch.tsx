import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

import getValue from '../Editors/getValue';

const ROW_HEIGHT = 100;
const SuggestedImages = styled('div')`
  display: flex;
`;

const SuggestedImage = styled('img')`
  height: 100px;
`;

const Editor = ({
  row,
  editorProps: {
    imageKey,
    thumbnailKey,
    saveImageUrl,
    searchImageUrl,
    searchImageKey
  },
  doCommit,
}: any) => {
  const [uploading, setUploading] = useState(false);
  const [suggestedImagesLoading, setSuggestedImagesLoading] = useState(false);
  const [suggestedImages, setSuggestedImages] = useState([]);

  useEffect(() => {
    (async () => {
      setSuggestedImagesLoading(true);
      const images = (await axios.get(
        `${searchImageUrl}${row[searchImageKey]}`
      )).data;

      setSuggestedImages(images);

      setSuggestedImagesLoading(false);
    })()
  }, []);

  const uploadImage = async ({ imageUrl, thumbnailImageUrl }: any) => {
    setUploading(true);

    const { data: { url: uploadedImageUrl } } = await axios.put(saveImageUrl, {
      imageUrl,
    });

    const { data: { url: uploadedThumbnailImageUrl } } = await axios.put(saveImageUrl, {
      imageUrl: thumbnailImageUrl,
    });

    doCommit({
      [imageKey]: uploadedImageUrl,
      [thumbnailKey]: uploadedThumbnailImageUrl
    });

    setUploading(false);
  }

  if (suggestedImagesLoading) {
    // if we are loading suggestions or we are being rate limited and this isn't a new row
    return <div>Loading suggested images...</div>;
  } else if (uploading) {
    return <div>Uploading...</div>
  } else if (suggestedImages) {
    return (
      <SuggestedImages>{suggestedImages.map(({
        thumbnailUrl,
        contentUrl
      }: any) => (
          <SuggestedImage
            key={thumbnailUrl}
            onClick={() => uploadImage({
              thumbnailImageUrl: thumbnailUrl,
              imageUrl: contentUrl
            })}
            src={thumbnailUrl}
          />
        ))}
      </SuggestedImages>
    );
  }
}

export const Formatter = (props: any) => {
  const imageUrl = getValue(props, null);

  return (
    imageUrl && <img height={ROW_HEIGHT} src={imageUrl} />
  );
}

export default {
  editor: Editor,
  formatter: Formatter,
  editable: true,
  defaultEditorProps: {
    imageKey: 'imageUrl',
    thumbnailKey: 'thumbnailUrl',
    saveImageUrl: `${process.env.REACT_APP_API_BASE}saveImage`,
    searchImageUrl: `${process.env.REACT_APP_API_BASE}imageSearch?search=`,
    searchImageKey: 'name',
    saveToRoot: true,
  }
};