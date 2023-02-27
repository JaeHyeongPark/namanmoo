import React from "react";
import { useState } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { SnackbarProvider, useSnackbar } from "@mui/base";
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function SnackBar() {
  const [canvasWarning, setCanvasWarning] = useState(false);
  const [roomUrlSuccess, setRoomUrlSuccess] = useState(false);
  const [playlistEditWarning, setPlaylistEditWarning] = useState(false);
  const [renderWarning, setRenderWarning] = useState(false);
  const vertical = "top";
  const horizontal = "center";
  // 주의 : canvas 예외
  const canvasWarningOpen = () => {
    setCanvasWarning(true);
    setRoomUrlSuccess(false);
    setPlaylistEditWarning(false);
    setRenderWarning(false);
  };
  const canvasWarningClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setCanvasWarning(false);
  };
  SnackBar.canvasWarningOpen = canvasWarningOpen;

  // 성공 : roomUrl 저장 완료 했을 떄
  const roomUrlSuccessOpen = () => {
    setCanvasWarning(false);
    setRoomUrlSuccess(true);
    setPlaylistEditWarning(false);
    setRenderWarning(false);
  };
  const roomUrlSuccessClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setRoomUrlSuccess(false);
  };
  SnackBar.roomUrlSuccessOpen = roomUrlSuccessOpen;
  // 주의 : 권한 없을 때 playlist 조작
  const playlistEditWarningOpen = () => {
    setCanvasWarning(false);
    setRoomUrlSuccess(false);
    setPlaylistEditWarning(true);
    setRenderWarning(false);
  };
  const playlistEditWarningClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setPlaylistEditWarning(false);
  };
  SnackBar.playlistEditWarningOpen = playlistEditWarningOpen;
  // 주의 : 편집 완료를 먼저 누르고 렌더링
  const renderWarningOpen = () => {
    setCanvasWarning(false);
    setRoomUrlSuccess(false);
    setPlaylistEditWarning(false);
    setRenderWarning(true);
  };
  const renderWarningClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setRenderWarning(false);
  };
  SnackBar.renderWarningOpen = renderWarningOpen;
  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      {/* 캔버스에 사진이 없는데 저장을 눌렀을 때만 */}
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={canvasWarning}
        autoHideDuration={2000}
        onClose={canvasWarningClose}
      >
        <Alert
          elevation={6}
          anchorOrigin={{ vertical, horizontal }}
          onClose={canvasWarningClose}
          severity="warning"
          sx={{ width: "100%", fontSize: "20px" }}
        >
          캔버스에 저장할 사진이 없습니다!
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={roomUrlSuccess}
        autoHideDuration={2000}
        onClose={roomUrlSuccessClose}
      >
        <Alert
          elevation={6}
          onClose={roomUrlSuccessClose}
          severity="success"
          sx={{ width: "100%", fontSize: "20px" }}
        >
          클립보드에 초대 URL이 저장되었습니다!
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={playlistEditWarning}
        autoHideDuration={2000}
        onClose={playlistEditWarningClose}
      >
        <Alert
          elevation={6}
          onClose={playlistEditWarningClose}
          severity="warning"
          sx={{ width: "100%", fontSize: "20px" }}
        >
          먼저 플레이리스트 조작권한을 얻어주세요!
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={renderWarning}
        autoHideDuration={2000}
        onClose={renderWarningClose}
      >
        <Alert
          elevation={6}
          onClose={renderWarningClose}
          severity="warning"
          sx={{ width: "100%", fontSize: "20px" }}
        >
          먼저 플레이리스트 조작권한을 반납해주세요!
        </Alert>
      </Snackbar>
    </Stack>
  );
}
export default SnackBar;

// import React, { useState } from "react";
// import Stack from "@mui/material/Stack";
// import Button from "@mui/material/Button";
// import Snackbar from "@mui/material/Snackbar";
// import MuiAlert from "@mui/material/Alert";

// const Alert = React.forwardRef(function Alert(props, ref) {
//   return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
// });

// function SnackBar() {
//   const [open, setOpen] = useState(false);
//   const [message, setMessage] = useState("");
//   const [severity, setSeverity] = useState("success");

//   const handleClose = (event, reason) => {
//     if (reason === "clickaway") {
//       return;
//     }
//     setOpen(false);
//   };

//   const displayMessage = (message, severity) => {
//     setOpen(true);
//     setMessage(message);
//     setSeverity(severity);
//   };

//   const canvasWarningOpen = () => {
//     displayMessage("캔버스에 저장할 사진이 없습니다!", "warning");
//   };
//   SnackBar.canvasWarningOpen = canvasWarningOpen;
//   const roomUrlSuccessOpen = () => {
//     displayMessage("클립보드에 초대 URL이 저장되었습니다!", "success");
//   };
//   SnackBar.roomUrlSuccessOpen = roomUrlSuccessOpen;
//   const playlistEditWarningOpen = () => {
//     displayMessage("먼저 플레이리스트 조작권한을 얻어주세요!", "warning");
//   };
//   SnackBar.playlistEditWarningOpen = playlistEditWarningOpen;
//   const renderWarningOpen = () => {
//     displayMessage("먼저 플레이리스트 조작권한을 얻어주세요!", "warning");
//   };
//   SnackBar.renderWarningOpen = renderWarningOpen;

//   return (
//     <Stack spacing={2} sx={{ width: "100%" }}>
//       <Snackbar
//         open={open && severity === "warning"}
//         autoHideDuration={6000}
//         onClose={handleClose}
//       >
//         <Alert onClose={handleClose} severity="warning" sx={{ width: "100%" }}>
//           {message}
//         </Alert>
//       </Snackbar>
//       <Snackbar
//         open={open && severity === "success"}
//         autoHideDuration={6000}
//         onClose={handleClose}
//       >
//         <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
//           {message}
//         </Alert>
//       </Snackbar>
//     </Stack>
//   );
// }

// export default SnackBar;