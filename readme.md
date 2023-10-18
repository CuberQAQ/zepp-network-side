# network-side

Polyfill of network.download API for ZeppOS 1.0/2.0/2.1 app-side.

This project includes @cuberqaq/fs-side module. It uses settings storage api to storage data, not a true file system, so don't save many big files. Welcome to send issues and PR to make this project better!

Corrently not support segmented download, timeout and onProgress event. Some of the functions have not been tested yet,

Using whatwg-fetch(polyfill of fetch) as fetch api, which uses XMLHttpRequest to access the network.

Based to @cuberqaq/fs-side module to storage files, you should also access the files by it. see [CuberQAQ/zepp-fs-side: Simple Lib for ZeppOS 1.0/2.0/2.1 app-side to build a vitual file system.](https://github.com/CuberQAQ/zepp-fs-side#readme)

## 1. Install

Use Command `npm i @cuberqaq/network-side --save` to install network-side in your ZeppOS Miniapp project.

## 2. Import & Use

The network-side module export a download object, not global one.

In your app-side JavaScript source file, use this to import network-side:

```js
import { network } from "@cuberqaq/network-side";
```

Then you can use the methods in the same way you do with ZeppOS 3.0 network.download. API Document see [Zepp OS Developers Documentation](https://docs.zepp.com/docs/reference/side-service-api/download-file/)
For example:

```js
const downloadTask = network.downloader.downloadFile({
  url: "https://docs.zepp.com/img/logo.png",
  filePath: "data://test.png",
});

downloadTask.onSuccess = (event) => {
  console.log(event.filePath); // data://test.png
  console.log(event.tempFilePath); // undefined
  console.log(event.statusCode); // 200
};
```
