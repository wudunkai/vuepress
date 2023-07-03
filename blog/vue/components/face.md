---
date: 2023-07-03
category:
  - Vue3
tag:
  - Vue3
  - face-api
  - tracking
---

# 项目中使用人脸识别用户信息

## 实现方法

发现有基于浏览器端的人脸检测库:tracking.js(FAST 和 Brief 算法),clmtrackr.js(CLM 算法)face-api.js 以及 jquery.facedetection.js,这四个是网上热度比较高的

<!-- more -->

### face-api.js 使用方法代码

```npm
npm i face-api.js
```

```vue
<script setup>
import * as faceApi from "face-api.js";
import { ref, onMounted, onBeforeUnmount } from "vue";
const video = ref(null);
const W = window.innerWidth;
const H = window.innerHeight;
const width = Math.min(W, H) * 0.8;
const height = width;
// 获取摄像头
const getCamera = async () => {
  try {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });
    video.value.srcObject = mediaStream;
  } catch (e) {
    console.log(e);
  }
};
const loadModels = async () => {
  // https://github.com/justadudewhohacks/face-api.js/tree/master/weights
  // 引入调用的包 下载放入/public/models
  await faceApi.loadTinyFaceDetectorModel("/models"); // 人脸
  await faceApi.loadFaceLandmarkTinyModel("/models"); // 人脸
  await faceApi.loadFaceExpressionModel("/models"); // 表情
  await faceApi.loadAgeGenderModel("/models"); //年龄
  await getCamera();
};
const detectFace = () => {
  // 检查属性
  // const canvas = faceApi.createCanvasFromMedia(video.value);
  // const ctx = canvas.getContext("2d");
  // const { width, height } = video.value;
  // document.body.append(canvas);
  setInterval(async () => {
    const detections = await faceApi
      .detectAllFaces(video.value, new faceApi.TinyFaceDetectorOptions())
      .withFaceLandmarks(true)
      .withFaceExpressions()
      .withAgeAndGender();
    // const resizedDetections = faceApi.resizeResults(detections, {
    //   width,
    //   height,
    // });
    // ctx.clearRect(0, 0, width, height);
    // faceApi.draw.drawDetections(canvas, resizedDetections);
    // resizedDetections.forEach((result) => {
    //   const { age, gender, genderProbability } = result;
    //   new faceApi.draw.DrawTextField(
    //     [`${age} years`, `${gender} {${genderProbability.toFixed(1)}}`],
    //     result.detection.box.bottomLeft
    //   ).draw(canvas);
    // });
  }, 300);
};
onMounted(() => {
  loadModels();
  video.value.addEventListener("play", detectFace());
});
onBeforeUnmount(() => {
  video.value.srcObject.getVideoTracks().forEach((track) => {
    track.stop();
  });
  video.value.srcObject = null;
});
</script>

<template>
  <div class="face-box-wrap">
    <div class="face-box">
      <div class="video-wrap">
        <video
          ref="video"
          id="video"
          autoplay
          muted
          :width="width"
          :height="height"
          playsinline
          webkit-playsinline="true"
        ></video>
      </div>
      <div class="video-mask"></div>
    </div>
  </div>
</template>

<style lang="scss">
.face-box-wrap {
  position: relative;
  background-color: #fff;
  min-height: 100vh;
}
.face-box {
  text-align: center;
  position: relative;
  background-color: #fff;
  overflow: hidden;
  box-sizing: border-box;
  top: 100px;
  .video-wrap {
    transform: rotateY(180deg);
    padding-top: 1px;
    video {
      object-fit: cover;
    }
  }
  .video-mask {
    position: absolute;
    height: 220px;
    width: 220px;
    left: 50%;
    top: 112px;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    border: 150px solid #fff;
    z-index: 2;
  }
}
</style>
```

### tracking.js 使用方法代码

```npm
npm i tracking
<!-- 这边需要手动引入js -->
```

```vue
<script>
import "@/assets/js/tracking.js";
import "@/assets/js/face-min.js";
import "@/assets/js/eye-min.js";
import { ref, onMounted, onBeforeUnmount } from "vue";
export default {
  name: "FaceTest",
};
</script>
<script setup>
const tra = ref(null);
const faceFlag = ref();
const video = ref(null);
const W = window.innerWidth;
const H = window.innerHeight;
const width = Math.min(W, H) * 0.8;
const height = width;
const constraints = { audio: false, video: { facingMode: "user" } };
const success = (stream) => {
  video.value.srcObject = stream;
  new Promise((res) => {
    video.value.onloadedmetadata = function () {
      video.value.play();
    };
    res();
  }).then(() => {
    const tracker = new window.tracking.ObjectTracker(["face", "eye"]);
    tracker.setInitialScale(4);
    tracker.setStepSize(2);
    tracker.setEdgesDensity(0.1);
    tra.value = window.tracking.track("#video", tracker, { camera: true });
    tracker.on("track", function (event) {
      const people = event.data.length;
      if (!faceFlag.value) {
        switch (people) {
          case 0:
            console.log("未检测到人脸");
            break;
          case 1:
            console.log("请把脸移入圈内");
            faceFlag.value = true;
            break;
          default:
            console.log("只可一人进行人脸识别！");
            break;
        }
      }
    });
  });
};
const MediaUtils = {
  /**
   * 获取用户媒体设备(处理兼容的问题)
   * @param videoEnable {boolean} - 是否启用摄像头
   * @param audioEnable {boolean} - 是否启用麦克风
   * @param callback {Function} - 处理回调
   */
  getUserMedia: function (constraints, callback) {
    const navigator = window.navigator;
    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia ||
      window.getUserMedia;
    const constraint = { video: constraints.video, audio: constraints.audio };
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia(constraint)
        .then(function (stream) {
          success(stream);
        })
        ["catch"](function (err) {
          console.log(err);
          callback(err);
        });
    } else if (navigator.getUserMedia) {
      navigator.getUserMedia(
        constraint,
        function (stream) {
          success(stream);
        },
        function (err) {
          callback(err);
        }
      );
    } else {
      callback(new Error("Not support userMedia"));
    }
  },

  /**
   * 关闭媒体流
   * @param stream {MediaStream} - 需要关闭的流
   */
  closeStream: function (stream) {
    if (typeof stream.stop === "function") {
      stream.stop();
    } else {
      const trackList = [stream.getAudioTracks(), stream.getVideoTracks()];
      for (let i = 0; i < trackList.length; i++) {
        const tracks = trackList[i];
        if (tracks && tracks.length > 0) {
          for (let j = 0; j < tracks.length; j++) {
            const track = tracks[j];
            if (typeof track.stop === "function") {
              track.stop();
            }
          }
        }
      }
    }
  },
};
onMounted(() => {
  MediaUtils.getUserMedia(constraints, success);
});
// 取消关闭
onBeforeUnmount(() => {
  MediaUtils.closeStream(video.value.srcObject);
  tra.value.stop();
});
</script>

<template>
  <div class="face-box-wrap">
    <div class="face-box">
      <div class="video-wrap">
        <video
          ref="video"
          id="video"
          :width="width"
          :height="height"
          playsinline
          webkit-playsinline="true"
        ></video>
      </div>
      <div class="video-mask"></div>
    </div>
  </div>
</template>

<style lang="scss">
.face-box-wrap {
  position: relative;
  background-color: #fff;
  min-height: 100vh;
  .face-box {
    text-align: center;
    position: relative;
    background-color: #fff;
    overflow: hidden;
    box-sizing: border-box;
    top: 100px;
    .video-wrap {
      transform: rotateY(180deg);
      padding-top: 1px;
    }
    video {
      object-fit: cover;
    }
    .video-mask {
      position: absolute;
      height: 220px;
      width: 220px;
      left: 50%;
      top: 112px;
      transform: translate(-50%, -50%);
      border-radius: 50%;
      border: 150px solid #fff;
      z-index: 2;
    }
  }
}
</style>
```
