// function mooc_8_play() {
//   function sleep(time) {
//     return new Promise((resolve, reject) => {
//       setTimeout(() => {
//         resolve(time)
//       }, time);
//     })
//   }

// 获取
function getVideo_ID() {
  return document.querySelector("video");
}

function videoPlay() {
  var video_Btn = getVideo_ID();
  video_Btn.play();
  video_Btn.playbackRate = 8;
}
setInterval(videoPlay, 1000);


// (async () => {
//   let videoh_5 = getVideo_ID();
//   while (videoh_5 !== null) {
//     videoh_5.play();
//     videoh_5.playbackRate = 4;
//     await sleep(500);
//   }
// })();