import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import RoomHeader from "../components/RoomHeader/RoomHeader";
import Contents from "./Contents";
import SnackBar from "../components/RoomHeader/SnackBar";
import App from "../../App";
import "./Room.css";
import RenderButton from "../components/Output/RenderButton";
import EditPermissionButton from "../components/Output/EditPermissionButton";
import { DraggingProvider } from "./DraggingContext";

const Room = () => {
  const navigate = useNavigate();
  const roomId = useParams().roomId;

  // 생성된 방에만 들어가게 하기 위한 조건(처음 랜더링될때 실행)
  useEffect(() => {
    App.roomId = roomId;
    setTimeout(() => {
      App.mainSocket.emit("joinRoom", {
        Id: App.mainSocket.id,
        roomId: roomId,
      });
    }, 1000);

    App.mainSocket.on("welcome", (data) => {
      if (data.ans === "NO") {
        navigate("/");
        if (data.reason === "full") {
          alert("방에 남은 자리가 없습니다.");
        }
      }

      RenderButton.setActiveStep(Number(data.renderVoteState));
      RenderButton.changeNumPeople(data.numUsers);

      if (data.playlistPermissionState !== -1) {
        App.playlistPermissionState = data.playlistPermissionState;
        EditPermissionButton.setRefresh();
      }
    });
  }, []);

  return (
    <React.Fragment>
      <div className="ROOM-MAIN">
        <RoomHeader />
        <div
          className="ROOM-BODYandFOOTER"
          style={{ height: `calc(100% - 60px)` }}
        >
          <DraggingProvider>
            <Contents />
            <SnackBar />
          </DraggingProvider>
        </div>
      </div>
    </React.Fragment>
  );
};
export default Room;
