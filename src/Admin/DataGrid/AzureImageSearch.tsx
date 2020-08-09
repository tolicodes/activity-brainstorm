import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { updateActivity } from '../../apiHelpers';

const ROW_HEIGHT = 100;

interface IProps {
  onCommit: (imageUrl: string) => void
  row: any
  column: any
}

interface IState {
  imageUrl: string;
  editorRef: any
}

const SuggestedImages = styled('div')`
  display: flex;
`;

const SuggestedImage = styled('img')`
  height: 100px;
`;

let lastSuggestionsRequest: Date;

export const AzureImageFormatter = ({ row, onCommit, prioritizeSuggestions }: any) => {
  const [suggestionsMode, setSuggestionsMode] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [suggestedImagesLoading, setSuggestedImagesLoading] = useState(false);

  const [suggestedImages, setSuggestedImages] = useState([]);

  const { thumbnailUrl, imageUrl } = row;

  const isRateLimited = () => !prioritizeSuggestions && (+new Date() - +lastSuggestionsRequest < 200);

  const loadSuggestions = async () => {
    setSuggestedImagesLoading(true);
    setSuggestedImages((await axios.get(`${process.env.REACT_APP_API_BASE}imageSearch?search=${row.name}`)).data);
    setSuggestedImagesLoading(false);
  }

  const loadSuggestionsWrap = () => {
    if (isRateLimited() || suggestedImagesLoading) return;

    lastSuggestionsRequest = new Date();
    loadSuggestions();
  }

  // don't load if we have an image or if it's a blank row
  if (row.name && !suggestionsMode && !imageUrl) {
    setSuggestionsMode(true);

    if (isRateLimited()) {
      setTimeout(loadSuggestionsWrap, 1000);
    } else {
      loadSuggestionsWrap();
    }
  }

  const uploadImage = async ({ imageUrl, thumbnailImageUrl }: any) => {
    setUploading(true);
    setSuggestionsMode(false);

    const { data: { url: uploadedImageUrl } } = await axios.put(`${process.env.REACT_APP_API_BASE}saveImage`, {
      imageUrl,
    });

    const { data: { url: uploadedThumbnailImageUrl } } = await axios.put(`${process.env.REACT_APP_API_BASE}saveImage`, {
      imageUrl: thumbnailImageUrl,
    });

    await updateActivity(row.doc, {
      imageUrl: uploadedImageUrl,
      thumbnailUrl: uploadedThumbnailImageUrl
    });

    onCommit && onCommit(uploadedImageUrl);

    setUploading(false);
  }

  const loading = uploading || suggestedImagesLoading;

  return (
    <div>
      {
        (!loading && thumbnailUrl && !suggestionsMode) && <img height={ROW_HEIGHT} src={thumbnailUrl} />
      }
      {
        // if we are loading suggestions or we are being rate limited and this isn't a new row
        !suggestedImages.length && suggestionsMode && <div>Loading suggested images...</div>
      }
      {
        uploading && <div>Uploading...</div>
      }
      {
        suggestedImages && suggestionsMode && !uploading && (
          <SuggestedImages>{suggestedImages.map(({ thumbnailUrl, contentUrl }: { thumbnailUrl: string, contentUrl: string }) => (
            <SuggestedImage key={thumbnailUrl} onClick={() => uploadImage({ thumbnailImageUrl: thumbnailUrl, imageUrl: contentUrl })} src={thumbnailUrl} />
          ))}
          </SuggestedImages>)
      }
    </div>
  )
}

export class AzureImageEditor extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = { imageUrl: props.value, editorRef: React.createRef() };
  }

  getValue() {
    return this.state.imageUrl;
  }

  getInputNode() {
    // @ts-ignore
    return this.ref;
  }

  render() {
    const withoutImage = {
      ...this.props.row,
      imageUrl: '',
    };

    return (
      <AzureImageFormatter row={withoutImage} column={this.props.column} onCommit={this.props.onCommit} prioritizeSuggestions={true} />
    );
  }
}