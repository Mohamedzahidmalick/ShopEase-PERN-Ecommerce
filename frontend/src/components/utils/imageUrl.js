export const getImageUrl = (image) => {
  if (!image) {
    return "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
  }

  if (image.startsWith("http")) {
    return image;
  }

  return `${process.env.REACT_APP_API_URL}${
    image.startsWith("/") ? image : "/" + image
  }`;
};