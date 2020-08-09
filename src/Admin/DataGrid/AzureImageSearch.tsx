import React, { useState } from 'react';
import useAxios from 'axios-hooks'
import styled from 'styled-components';
import { updateActivity } from '../../apiHelpers';
import { truncateSync } from 'fs';

const ROW_HEIGHT = 100;

interface IProps {
  onCommit: (image: string) => void
  row: any
  column: any
}

interface IState {
  image: string;
  editorRef: any
}

const SuggestedImages = styled('div')`
  display: flex;
`;

const SuggestedImage = styled('img')`
  height: 100px;
`;

let lastSuggestionsRequest: Date;

export const AzureImageFormatter = ({ row, column: { key }, onCommit, prioritizeSuggestions }: any) => {
  const [suggestionsMode, setSuggestionsMode] = useState(false);
  const image = row[key];
  const thumbnailUrl = row.thumbnailUrl;

  const isRateLimited = () => !prioritizeSuggestions && (+new Date() - +lastSuggestionsRequest < 200);

  const [{ data: suggestedImages, loading: suggestionsLoading }, loadSuggestions] = useAxios(`${process.env.REACT_APP_API_BASE}imageSearch?search=${row.name}`, {
    manual: true
  });

  const loadSuggestionsWrap = () => {
    if (isRateLimited() || suggestionsLoading) return;

    lastSuggestionsRequest = new Date();
    loadSuggestions();
    setSuggestionsMode(true);
  }

  // don't load if we have an image or if it's a blank row
  if (row.name && !suggestionsMode && !image) {
    if (isRateLimited()) {
      setTimeout(loadSuggestionsWrap, 1000);
    } else {
      loadSuggestionsWrap();
    }
  }

  const [{ data: uploadImageData, loading: uploadLoading }, uploadImage] = useAxios({
    url: `${process.env.REACT_APP_API_BASE}saveImage`,
    method: 'PUT'
  }, {
    manual: true,
  });

  const [{ data: uploadThumbnailImageData, loading: uploadThumbnailLoading }, uploadThumbnailImage] = useAxios({
    url: `${process.env.REACT_APP_API_BASE}saveImage`,
    method: 'PUT'
  }, {
    manual: true,
  });

  const uploadedImageUrl = uploadImageData && uploadImageData.url;
  const uploadedThumbnailImageUrl = uploadThumbnailImageData && uploadThumbnailImageData.url;

  if (uploadedImageUrl) {
    updateActivity(row.doc, {
      image: uploadedImageUrl
    }).then(() => {
      onCommit && onCommit(uploadedImageUrl);
    });
  }

  if (uploadedThumbnailImageUrl) {
    updateActivity(row.doc, {
      thumbnailUrl: uploadedThumbnailImageUrl
    });
  }

  const setImage = async (thumbnailUrl: string, contentUrl: string) => {
    uploadImage({
      data: {
        imageUrl: contentUrl
      }
    });

    uploadThumbnailImage({
      data: {
        imageUrl: thumbnailUrl
      }
    });

    setSuggestionsMode(false);
  };

  const loading = uploadLoading || uploadThumbnailLoading || suggestionsLoading;
  const smallestImage = thumbnailUrl || image;

  return (
    <div>
      {
        (!loading && smallestImage && !suggestionsMode) && <img height={ROW_HEIGHT} src={smallestImage} />
      }
      {
        // if we are loading suggestions or we are being rate limited and this isn't a new row
        (!suggestedImages && !image && row.id) && <div>Loading suggested images...</div>
      }
      {
        (uploadLoading || uploadThumbnailLoading) && <div>Uploading...</div>
      }
      {
        suggestedImages && !loading && !uploadedImageUrl && (
          <SuggestedImages>{suggestedImages.map(({ thumbnailUrl, contentUrl }: { thumbnailUrl: string, contentUrl: string }) => (
            <SuggestedImage key={thumbnailUrl} onClick={() => setImage(thumbnailUrl, contentUrl)} src={thumbnailUrl} />
          ))}
          </SuggestedImages>)
      }
    </div>
  )
}

export class AzureImageEditor extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = { image: props.value, editorRef: React.createRef() };
  }

  getValue() {
    return this.state.image;
  }

  getInputNode() {
    // @ts-ignore
    return this.ref;
  }

  render() {
    const withoutImage = {
      ...this.props.row,
      image: '',
    };

    return (
      <AzureImageFormatter row={withoutImage} column={this.props.column} onCommit={this.props.onCommit} prioritizeSuggestions={true} />
    );
  }
}