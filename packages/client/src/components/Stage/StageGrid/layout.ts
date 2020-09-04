export interface Size {
  width: number;
  height: number;
}

export interface Layout {
  type: "vertical" | "horizontal";
  main: Size;
  rest: Size;
}

function getRatio(size: Size): number {
  return size.height === 0 ? 0 : size.width / size.height;
}

function getProportionalWidth(targetHeight: number, ratio: number): number {
  return targetHeight * ratio;
}

function getProportionalHeight(targetWidth: number, ratio: number): number {
  return targetWidth / ratio;
}

function getSurface(layout: Layout): number {
  return (
    layout.main.width * layout.main.height +
    layout.rest.width * layout.rest.height
  );
}

function getSingleVideoLayout(box: Size, originalVideo: Size): Layout {
  const boxRatio = getRatio(box);
  const videoRatio = getRatio(originalVideo);

  if (boxRatio < videoRatio) {
    return {
      type: "horizontal",
      main: {
        height: getProportionalHeight(box.width, videoRatio),
        width: box.width,
      },
      rest: { height: 0, width: 0 },
    };
  }

  return {
    type: "horizontal",
    main: {
      height: box.height,
      width: getProportionalWidth(box.height, videoRatio),
    },
    rest: { height: 0, width: 0 },
  };
}

function getTwoVideosHorizontalLayout(
  box: Size,
  originalVideo1: Size,
  originalVideo2: Size
): Layout {
  return {
    type: "horizontal",
    main: getSingleVideoLayout(
      { height: box.height, width: box.width * 0.75 },
      originalVideo1
    ).main,
    rest: getSingleVideoLayout(
      { height: box.height, width: box.width * 0.25 },
      originalVideo2
    ).main,
  };
}

function getTwoVideosVerticalLayout(
  box: Size,
  originalVideo1: Size,
  originalVideo2: Size
): Layout {
  return {
    type: "vertical",
    main: getSingleVideoLayout(
      { height: box.height * 0.75, width: box.width },
      originalVideo1
    ).main,
    rest: getSingleVideoLayout(
      { height: box.height * 0.25, width: box.width },
      originalVideo2
    ).main,
  };
}

function getTwoVideosLayout(
  box: Size,
  originalVideo1: Size,
  originalVideo2: Size
): Layout {
  const vertical = getTwoVideosVerticalLayout(
    box,
    originalVideo1,
    originalVideo2
  );
  const horizontal = getTwoVideosHorizontalLayout(
    box,
    originalVideo1,
    originalVideo2
  );

  // Maximize display surface with a preference for horizontal
  return getSurface(vertical) > getSurface(horizontal) * 1.1
    ? vertical
    : horizontal;
}

export function getLayout(box: Size, videoSizes: Size[]): Layout {
  if (videoSizes.length === 0) {
    return {
      type: "horizontal",
      main: {
        width: 0,
        height: 0,
      },
      rest: {
        width: 0,
        height: 0,
      },
    };
  }

  if (videoSizes.length === 1) {
    return getSingleVideoLayout(box, videoSizes[0]);
  }

  return getTwoVideosLayout(box, videoSizes[0], videoSizes[1]);
}
