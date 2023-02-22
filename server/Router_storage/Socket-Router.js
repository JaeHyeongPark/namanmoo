// socket.io 라우터
const express = require("express");
const router = express.Router();
const app = express();
// socket IO용 모듈 import
const socketio = require("socket.io");
const http = require("http");
// express 기반 http server 생성과 socket 연결
const httpServer = http.createServer(app);
const redis = require("./RedisClient");

module.exports = function (io) {
  router.io = io;
  router.io.on("connection", (socket) => {
    socket.on("joinRoom", async (data) => {
      try {
        socket.join(data.roomId);
        console.log("누가 왔어요~", data.roomId, data.Id);
        await redis.v4.rPush(data.roomId + "/user", data.Id);
        let AmIFirst = await redis.v4.set(
          data.roomId + "/playlistPermissionState",
          "true",
          "NX"
        );
        console.log("1");
        if (AmIFirst) {
          console.log("첫번쨰 사람 입장!");
        } else {
          console.log("사람하나 추가요~");
        }
      } catch (e) {
        console.log(e);
      }
    });
    socket.on("pictureUpload", (data) => {
      socket
        .to(data.roomId)
        .emit("upload", { uploaderId: data.Id, upimg: data.upimg });
    });
    // 삭제가 부활할지도 모르니 일단 킵
    // socket.on("pictureDelete", (data) => {
    //   socket.to(data.roomId).emit("delete", { deleterId: data.Id });
    // });
    socket.on("pictureEdited", (data) => {
      socket
        .to(data.roomId)
        .emit("edit", { editorId: data.Id, editedUrl: data.editedUrl });
    });
    socket.on("playlistEditRequest", async (data) => {
      try {
        const oldplaylistPermissionState = await new Promise(
          (resolve, reject) => {
            redis.getset(
              data.roomId + "/playlistPermissionState",
              "false",
              (err, result) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(result);
                }
              }
            );
          }
        );
        console.log(oldplaylistPermissionState);
        console.log("요청왔어요~");
        if (oldplaylistPermissionState === "true") {
          socket.to(data.roomId).emit("playlistEditResponse", { state: 2 });
          io.to(data.Id).emit("playlistEditResponse", { state: 1 });
        } else {
          io.to(data.Id).emit("playlistEditResponse", { state: 2 });
        }
      } catch (e) {
        console.log(e);
      }
    });
    socket.on("playlistEditFinished", async (data) => {
      try {
        console.log("편집끝났데요~");
        await redis.v4.set(data.roomId + "/playlistPermissionState", "true");
        socket.to(data.roomId).emit("playlistEditResponse", { state: 0 });
        io.to(data.Id).emit("playlistEditResponse", { state: 0 });
      } catch (e) {
        console.log(e);
      }
    });
    //==================================playlist 조작 메서드=============================
    // 재생목록에 효과 추가------------수정완
    socket.on("transition", async (data) => {
      try {
        let playlist = JSON.parse(await redis.v4.get("testroom/playlist"));
        const transition = data.transition;
        const idx = data.idx;
        playlist[idx].transition = transition;
        await redis.v4.set("testroom/playlist", JSON.stringify(playlist));
        socket.to(data.roomId).emit("playlistChanged", { playlist });
        io.to(data.Id).emit("playlistChanged", { playlist });
      } catch (e) {
        console.log(e);
      }
    });
    // 재생목록 효과 제거------------수정완
    socket.on("delTransition", async (data) => {
      try {
        let playlist = JSON.parse(await redis.v4.get("testroom/playlist"));
        const idx = data.idx;
        playlist[idx].transition = "";
        socket.to(data.roomId).emit("playlistChanged", { playlist });
        io.to(data.Id).emit("playlistChanged", { playlist });
        await redis.v4.set("testroom/playlist", JSON.stringify(playlist));
      } catch (e) {
        console.log(e);
      }
    });
    // 재생목록 사진 추가------------수정완
    socket.on("postplaylist", async (data) => {
      try {
        let playlist = JSON.parse(await redis.v4.get("testroom/playlist"));
        const url = data.url;
        const idx = data.idx;
        playlist[idx].url = url;
        await redis.v4.set("testroom/playlist", JSON.stringify(playlist));
        socket.to(data.roomId).emit("playlistChanged", { playlist });
        io.to(data.Id).emit("playlistChanged", { playlist });
      } catch (e) {
        console.log(e);
      }
    });
    // 삭제 이벤트 해당 객체 삭제-----------수정완
    socket.on("deleteplayurl", async (data) => {
      try {
        let playlist = JSON.parse(await redis.v4.get("testroom/playlist"));
        const idx = data.idx;
        playlist = playlist.filter((element, i) => {
          if (idx !== i) {
            return element;
          }
        });
        await redis.v4.set("testroom/playlist", JSON.stringify(playlist));
        socket.to(data.roomId).emit("playlistChanged", { playlist });
        io.to(data.Id).emit("playlistChanged", { playlist });
      } catch (e) {
        console.log(e);
      }
    });
    // 클릭 핸들링-----------수정완
    socket.on("clicking", async (d) => {
      try {
        let playlist = JSON.parse(await redis.v4.get("testroom/playlist"));

        const idx = d.idx;
        const url = playlist[idx].url;

        let check = false;
        let time = playlist[idx].duration;
        let totaltime = 0;
        playlist.forEach((data, i) => {
          if (i !== idx && data.select === true) {
            // 0번째 일때 0과 false가 겹쳐서 의도와 다른 결과가 나옴
            check = String(i);
          }
          if (i < idx) {
            time += playlist[i].duration;
          }
          totaltime += data.duration;
        });

        if (check) {
          check = Number(check);
          playlist[idx].url = playlist[check].url;
          playlist[check].url = url;
          playlist[idx].select = false;
          playlist[check].select = false;
          await redis.v4.set("testroom/playlist", JSON.stringify(playlist));
          socket.to(d.roomId).emit("playlistChanged", { playlist });
          io.to(d.Id).emit("clicking", { playlist });
        } else if (playlist[idx].select) {
          playlist[idx].select = false;
          await redis.v4.set("testroom/playlist", JSON.stringify(playlist));
          socket.to(d.roomId).emit("playlistChanged", { playlist });
          io.to(d.Id).emit("clicking", { playlist });
        } else {
          playlist[idx].select = true;
          await redis.v4.set("testroom/playlist", JSON.stringify(playlist));
          io.to(d.Id).emit("clicking", {
            playlist,
            idx,
            time: time,
            duration: playlist[idx].duration,
            totaltime: totaltime,
          });
        }
      } catch (e) {
        console.log(e);
      }
    });
    // 재생목록에 프리셋이 아닌 공간에 새로운 사진을 추가--------수정완
    socket.on("inputnewplay", async (data) => {
      try {
        const url = data.url;
        const newimage = {
          url: url,
          duration: 5,
          select: false,
          transition: "",
        };

        let playlist = JSON.parse(await redis.v4.get("testroom/playlist"));
        if (playlist === null) {
          playlist = [];
        }
        playlist.push(newimage);
        await redis.v4.set("testroom/playlist", JSON.stringify(playlist));

        socket.to(data.roomId).emit("playlistChanged", { playlist });
        io.to(data.Id).emit("playlistChanged", { playlist });
      } catch (e) {
        console.log(e);
      }
    });
    // 이미지 재생 시간 변경------------수정완
    socket.on("changetime", async (data) => {
      try {
        let playlist = JSON.parse(await redis.v4.get("testroom/playlist"));
        const idx = data.idx;
        const time = data.time;
        playlist[idx].select = false;
        playlist[idx].duration += time;
        await redis.v4.set("testroom/playlist", JSON.stringify(playlist));
        socket.to(data.roomId).emit("playlistChanged", { playlist });
        io.to(data.Id).emit("changetime", {
          playlist,
          idx,
          DT: playlist[idx].duration,
        });
      } catch (e) {
        console.log(e);
      }
    });
  });
  return router;
};