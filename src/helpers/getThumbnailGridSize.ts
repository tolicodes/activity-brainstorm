import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import {
  useWindowWidth,
} from '@react-hook/window-size/throttled'

const IMAGE_WIDTH = 300;
const IMAGE_WIDTH_SMALL = 375 / 2; // iphone x
const IMAGE_ASPECT_RATIO = 9 / 16;

export default () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  const windowWidth = useWindowWidth();
  const preferredImageWidth = isMobile ? IMAGE_WIDTH_SMALL : IMAGE_WIDTH;
  const cols = Math.floor(windowWidth / preferredImageWidth);
  const imageWidth = windowWidth / cols;

  const cellHeight = imageWidth * IMAGE_ASPECT_RATIO;

  return {
    imageWidth,
    cellHeight,
    cols,
  }
}