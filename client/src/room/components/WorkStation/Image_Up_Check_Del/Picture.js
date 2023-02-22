import { useDrag } from "react-dnd";
import { useContext } from "react";
import ImageContext from "./ImageContext";
import axios from "axios";

const Picture = (props) => {
  const ToCanvas = useContext(ImageContext);
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "image",
      item: { url: props.url, type: "image" },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [props.url]
  );

  const selectimage = async (url) => {
    // axios
    //   .post("http://localhost:5000/photoBox/clickimage", {
    //     url: props.url,
    //     mode: props.mode,
    //   })
    //   .then((res) => {
    //     ToCanvas.setView(res.data);
    //   });
    if (props.mode === "Original"){
      const origin = {...ToCanvas.origin}
      origin[url] = origin[url] ? 0 : 1
      ToCanvas.setorigin(origin)
    }else{
      const effect = {...ToCanvas.effect}
      effect[url] = effect[url] ? 0 : 1
      ToCanvas.seteffect(effect)
    }
  };

  return (
    <img
      ref={drag}
      key={props.url}
      className={props.className}
      src={props.url}
      alt="a"
      style={{ border: isDragging && "5px solid pink" }}
      onClick={() => selectimage(props.url)}
    />
  );
};
export default Picture;