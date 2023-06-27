---
date: 2023-06-15
category:
  - Vue
tag:
  - Vue3
  - Nodejs
---

# 项目中大文件的上传实现原理

## 大文件上传需要怎么做？

1. 秒传

   - 通俗的说，你把要上传的东西上传，服务器会先做 MD5 校验，如果服务器上有一样的东西，它就直接给你个新地址，其实你下载的都是服务器上的同一个文件，想要不秒传，其实只要让 MD5 改变，就是对文件本身做一下修改（改名字不行），例如一个文本文件，你多加几个字，MD5 就变了，就不会秒传了。

2. 分片上传：

   - 分片上传，就是将所要上传的文件，按照一定的大小，将整个文件分隔成多个数据块（我们称之为 Part）来进行分别上传，上传完之后再由服务端对所有上传的文件进行汇总整合成原始的文件。
   - ⭐ 网络环境环境不好，存在需要`重传风险`的场景。

3. 断点续传：

   - 断点续传是在下载或上传时，将下载或上传任务（一个文件或一个压缩包）人为的划分为几个部分，每一个部分采用一个线程进行上传或下载，如果碰到网络故障，可以从已经上传或下载的部分开始继续上传或者下载未完成的部分，而没有必要从头开始上传或者下载。本文的断点续传主要是针对断点上传场景。
   - 断点续传可以看成是分片上传的一个衍生，因此可以使用分片上传的场景，都可以使用断点续传。

<!-- more -->

## 大文件上传实现代码

### 前端页面代码

```vue
<script setup lang="ts">
import { computed, reactive, watch, ref } from "vue";
import axios from "axios";
import _ from "lodash";
const CancelToken = axios.CancelToken;
let source = CancelToken.source();
function axiosRequest({
  url,
  data,
  headers = {},
  onUploadProgress = (e: any) => e, // 进度回调
}: any) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, data, {
        headers,
        onUploadProgress, // 传入监听进度回调
        cancelToken: source.token,
      })
      .then((res: any) => {
        resolve(res);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
}
// 暂停
const pauseUpload = () => {
  source.cancel("中断上传");
  source = CancelToken.source();
};

const fileObj: any = reactive({ file: null, chunkList: [] });
// 继续传
const keepUpload = async () => {
  const { uploadedList } = await verifyUpload(fileObj.file.name);
  uploadChunks(uploadedList);
};
const totalPercent = computed(() => {
  const fileObjList = fileObj;
  if (fileObjList.chunkList.length === 0) return 0;
  const loaded = fileObjList.chunkList
    .map(({ size, percent }: any) => size * percent)
    .reduce((pre: any, next: any) => pre + next);
  return parseInt((loaded / fileObj.file.size).toFixed(2));
});
// 进度条
const tempPercent = ref(0);
watch(
  () => totalPercent.value,
  (newVal) => {
    if (newVal > tempPercent.value) tempPercent.value = newVal;
  }
);
const handleFileChange = (e: any) => {
  const [file] = e.target.files;
  if (!file) return;
  fileObj.file = file;
};
const handleUpload = async () => {
  const fileObjList: any = fileObj;
  if (!fileObjList.file) return;
  const { shouldUpload } = await verifyUpload(fileObj.file.name);
  if (!shouldUpload) {
    alert("秒传：上传成功");
    return;
  }
  const chunkList = createChunk(fileObjList.file);
  fileObj.chunkList = chunkList.map(({ file }, index) => ({
    file,
    size: file.size,
    percent: 0,
    chunkName: `${fileObjList.file.name}-${index}`,
    fileName: fileObjList.file.name,
    index,
  }));
  uploadChunks([]); // 执行上传切片的操作
};
const verifyUpload = async (fileName: string) => {
  const { data }: any = await axiosRequest({
    url: "http://localhost:3001/verify",
    headers: {
      "content-type": "application/json",
    },
    data: JSON.stringify({ fileName }),
  });
  return data;
};
const uploadChunks = async (uploadedList: Array<any>[]) => {
  const keepList = uploadedList.map(
    (item: any) =>
      (item = {
        chunkName: item,
      })
  );
  const requestList = _.differenceBy(fileObj.chunkList, keepList, "chunkName");
  const requestLists = requestList
    .map(({ file, fileName, index, chunkName }: any) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", fileName);
      formData.append("chunkName", chunkName);
      return { formData, index };
    })
    .map(({ formData, index }: any) =>
      axiosRequest({
        url: "http://localhost:3001/upload",
        data: formData,
        onUploadProgress: createProgressHandler(fileObj.chunkList[index]), // 传入监听上传进度回调
      })
    );
  await Promise.all(requestLists); // 使用Promise.all进行请求
  mergeChunks();
};
const mergeChunks = (size = 5 * 1024 * 1024) => {
  axiosRequest({
    url: "http://localhost:3001/merge",
    headers: {
      "content-type": "application/json",
    },
    data: JSON.stringify({
      size,
      fileName: fileObj.file.name,
    }),
  });
};
const createProgressHandler = (item: any) => {
  return (e: any) => {
    // 设置每一个切片的进度百分比
    item.percent = parseInt(String((e.loaded / e.total) * 100));
  };
};
const createChunk = (file: any, size = 5 * 1024 * 1024) => {
  const chunkList = [];
  let cur = 0;
  while (cur < file.size) {
    // 使用slice方法切片
    chunkList.push({ file: file.slice(cur, cur + size) });
    cur += size;
  }
  return chunkList;
};
</script>

<template>
  <input type="file" @change="handleFileChange" />
  <el-button @click="handleUpload">上传</el-button>
  <el-button @click="pauseUpload">暂停</el-button>
  <el-button @click="keepUpload">续传</el-button>
  <div style="width: 300px">
    总进度：
    <el-progress :percentage="totalPercent"></el-progress>切片进度：
    <div v-for="item in fileObj.chunkList" :key="item">
      <span>{{ item.chunkName }}：</span>
      <el-progress :percentage="item.percent"></el-progress>
    </div>
  </div>
  {{ tempPercent }}
  <el-progress :percentage="tempPercent"></el-progress>
</template>
```

### 后端代码实现

```js
// 后端代码
const http = require("http");
const path = require("path");
const fse = require("fs-extra");
const multiparty = require("multiparty");

const server = http.createServer();
const UPLOAD_DIR = path.resolve(__dirname, ".", `qiepian`); // 切片存储目录

server.on("request", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") {
    res.status = 200;
    res.end();
    return;
  }
  console.log(req.url);

  if (req.url === "/upload") {
    const multipart = new multiparty.Form();

    multipart.parse(req, async (err, fields, files) => {
      if (err) {
        console.log("error", err);
        return;
      }
      const [file] = files.file;
      const [fileName] = fields.fileName;
      const [chunkName] = fields.chunkName;
      // 保存切片的文件夹的路径，比如  张远-嘉宾.flac-chunks
      const chunkDir = path.resolve(UPLOAD_DIR, `${fileName}-chunks`);
      // // 切片目录不存在，创建切片目录
      if (!fse.existsSync(chunkDir)) {
        await fse.mkdirs(chunkDir);
      }
      // 把切片移动到切片文件夹
      await fse.move(file.path, `${chunkDir}/${chunkName}`);
      res.end(
        JSON.stringify({
          code: 0,
          message: "切片上传成功",
        })
      );
    });
  }
  // 接收请求的参数
  const resolvePost = (req) =>
    new Promise((res) => {
      let chunk = "";
      req.on("data", (data) => {
        chunk += data;
      });
      req.on("end", () => {
        res(JSON.parse(chunk));
      });
    });
  const pipeStream = (path, writeStream) => {
    console.log("path", path);
    return new Promise((resolve) => {
      const readStream = fse.createReadStream(path);
      readStream.on("end", () => {
        fse.unlinkSync(path);
        resolve();
      });
      readStream.pipe(writeStream);
    });
  };

  // 合并切片
  const mergeFileChunk = async (filePath, fileName, size) => {
    // filePath：你将切片合并到哪里，的路径
    const chunkDir = path.resolve(UPLOAD_DIR, `${fileName}-chunks`);
    let chunkPaths = null;
    // 获取切片文件夹里所有切片，返回一个数组
    chunkPaths = await fse.readdir(chunkDir);
    // 根据切片下标进行排序
    // 否则直接读取目录的获得的顺序可能会错乱
    chunkPaths.sort((a, b) => a.split("-")[1] - b.split("-")[1]);
    const arr = chunkPaths.map((chunkPath, index) => {
      return pipeStream(
        path.resolve(chunkDir, chunkPath),
        // 指定位置创建可写流
        fse.createWriteStream(filePath, {
          start: index * size,
          end: (index + 1) * size,
        })
      );
    });
    await Promise.all(arr);
    fse.rmdirSync(chunkDir); // 合并后删除保存切片的目录
  };
  if (req.url === "/merge") {
    const data = await resolvePost(req);
    const { fileName, size } = data;
    const filePath = path.resolve(UPLOAD_DIR, fileName);
    await mergeFileChunk(filePath, fileName, size);
    res.end(
      JSON.stringify({
        code: 0,
        message: "文件合并成功",
      })
    );
  }
  if (req.url === "/verify") {
    const createUploadedList = async (fileName) =>
      fse.existsSync(path.resolve(UPLOAD_DIR, fileName))
        ? await fse.readdir(path.resolve(UPLOAD_DIR, fileName))
        : [];
    const data = await resolvePost(req);
    const { fileName } = data;
    const filePath = path.resolve(UPLOAD_DIR, fileName);
    if (fse.existsSync(filePath)) {
      res.end(
        JSON.stringify({
          shouldUpload: false,
        })
      );
    } else {
      res.end(
        JSON.stringify({
          shouldUpload: true,
          uploadedList: await createUploadedList(`${fileName}-chunks`),
        })
      );
    }
  }
});

server.listen(3001, () => console.log("正在监听 3001 端口"));
```

<!-- 项目链接 https://github.com/wudunkai/cases/vue/vue项目/pinia -->
