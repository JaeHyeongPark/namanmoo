import axios from "axios";
import trash from "../../../assets/trash.svg";
import { useContext } from "react";
import ImageContext from "./ImageContext";

const ImageDel = (props) => {
  const ToCanvas = useContext(ImageContext);
  const mode = props.mode

  const deleteImage = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/photoBox/deleteimage", { mode:mode })
      .then((res) => {
        ToCanvas.setView(res.data)
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="delete_button" onClick={deleteImage}>
      <img src={trash} className="img.trash" alt="a" />
    </div>
  );
};
export default ImageDel;
