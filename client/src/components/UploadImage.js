// Style
import "../styles/UploadImage.css";

// Autre
import { useState } from "react";
import { DropzoneArea } from "material-ui-dropzone";
import { toast } from "react-toastify";
import request from "superagent";

function UploadImage() {
  const [uploadedFileUrl, setUploadedFileUrl] = useState({
    uploadedFiles: null,
  });

  const CLOUDINARY_UPLOAD_PRESET = "LesRecettesDeSabine";
  const CLOUDINARY_UPLOAD_URL =
    "https://api.cloudinary.com/v1_1/lesrecettesdesabine/upload";

  const onSubmit = (e) => {
    e.preventDefault();
    //setChange(false);
    setUploadedFileUrl({ uploadedFiles: e[0] });
    /*
        I console.log here to check if the onSubmit is grabbing the image.
        */
    console.log(uploadedFileUrl.uploadedFiles);
    handleImageUpload(uploadedFileUrl.uploadedFiles);
  };

  const onImageDrop = (e) => {
    setUploadedFileUrl({ uploadedFiles: e[0] });
  };

  const handleImageUpload = (file) => {
    let upload = request
      .post(CLOUDINARY_UPLOAD_URL)
      .field("upload_preset", CLOUDINARY_UPLOAD_PRESET)
      .field("file", file);
    upload.end((err, response) => {
      if (err) {
        console.error(err);
      }
      if (response.body.secure_url !== "") {
        setUploadedFileUrl({
          uploadedFiles: response.body.secure_url,
        });
        console.log(response.body.secure_url);
      }
    });
  };

  return (
    <div>
      <DropzoneArea onChange={onImageDrop} />
      <button onClick={onSubmit}>OK</button>
    </div>
  );
}

export default UploadImage;
