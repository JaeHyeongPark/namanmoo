import React from "react";
import axios from "axios";
import { useDrop } from "react-dnd";
import { useParams } from "react-router-dom";
import App from "../../../App";
import ClearIcon from "@mui/icons-material/Clear";
import effectOn from "../../assets/effect_on.png";
import SnackBar from "../RoomHeader/SnackBar";
import { Tooltip } from "@mui/material";
import "./Playlist.css";

const PlaylistMain = (props) => {
  const roomid = useParams().roomId;

  // playlist 드랍존
  const [{ isover }, playlist] = useDrop(() => ({
    accept: ["image", "effect"],
    drop: (item) => {
      if (item.type === "image") {
        sendTourl(item.url);
      } else {
        sendToeffect(item.className);
      }
    },
    collect: (monitor) => ({
      isover: monitor.isOver(),
    }),
  }));

  // 이미지 드랍으로 이미지를 재생목록에 추가
  const sendTourl = (url) => {
    if (App.playlistPermissionState !== 1) {
      SnackBar.playlistEditWarningOpen();
      return;
    }
    axios
      .post(process.env.REACT_APP_expressURL + "/output/postplaylist", {
        url: url,
        idx: props.i,
        roomid: roomid,
      })
      .then((res) => {
        if (res.data.success !== true) {
          console.log("응답에러");
        }
      });
  };

  // 클릭후 삭제 버튼
  const deleteimg = (e) => {
    if (App.playlistPermissionState !== 1) {
      SnackBar.playlistEditWarningOpen();
      return;
    }
    e.preventDefault();
    App.check = false;
    axios
      .post(process.env.REACT_APP_expressURL + "/output/deleteplayurl", {
        idx: props.i,
        roomid: roomid,
      })
      .then((res) => {
        if (res.data.success !== true) {
          console.log("응답에러");
        }
      });
  };

  // 재생목록 사진 클릭시 상황에 맞게 이벤트
  const Clickimg = (e) => {
    if (App.playlistPermissionState !== 1) {
      SnackBar.playlistEditWarningOpen();
      return;
    }
    e.preventDefault();
    if (!App.check) return;
    axios
      .post(process.env.REACT_APP_expressURL + "/output/clickimg", {
        idx: props.i,
        roomid: roomid,
      })
      .then((res) => {
        if (res.data.success !== true) {
          console.log("응답에러");
        }
      });
  };

  // 드래그로 effect 적용
  const sendToeffect = (effect) => {
    if (App.playlistPermissionState !== 1) {
      SnackBar.playlistEditWarningOpen();
      return;
    }
    axios
      .post(process.env.REACT_APP_expressURL + "/output/effect", {
        effect,
        idx: props.i,
        roomid: roomid,
      })
      .then((res) => {
        if (res.data.success !== true) {
          console.log("응답에러");
        }
      });
  };

  // effect 삭제
  const deleffect = (e) => {
    if (App.playlistPermissionState !== 1) {
      SnackBar.playlistEditWarningOpen();
      return;
    }
    // 상위 태그의 이벤트가 실행되는걸 방지
    e.stopPropagation();
    e.preventDefault();
    axios
      .post("http://localhost:5000/output/deleffect", {
        idx: props.i,
        roomid: roomid,
      })
      .then((res) => {
        if (res.data.success !== true) {
          console.log("에러 발생!");
        }
      });
  };

  return (
    <div
      ref={playlist}
      className={props.select ? "selecttoplay_img" : "toplay_img"}
      id={props.i}
      style={{
        width: String((props.duration * 100) / 60) + "%",
        height: "auto",
        backgroundImage: `url(${props.url})`,
        backgroundSize: props.duration <= 6 ? "cover" : "contain",
        backgroundRepeat: "repeat-x",
      }}
      key={props.url}
      onClick={Clickimg}
    >
      {props.select && (
        <ClearIcon className="del" onClick={deleteimg}>
          X
        </ClearIcon>
      )}
      {props.effect && (
          <Tooltip title={props.effect} placement="top" arrow >
          <img
            src={effectOn}
            onClick={deleffect}
            style={{ cursor: "pointer" }}
          />
          </Tooltip>
      )}
    </div>
  );
};

export default PlaylistMain;
