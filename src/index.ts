import { fetch as fetchPolyfill } from "whatwg-fetch";
import * as fs from "@cuberqaq/fs-side";
import { fileTypeFromBuffer } from "../lib/file-type/index";

namespace Downloader {
  export declare type Options = {
    /**
     * File URL. 文件 URL
     */
    url: string;
    /**
     * timeout. 超时时间
     */
    timeout: number;
    /**
     * Customizing the HTTP Request Header field. 自定义 HTTP Request Header 字段
     */
    headers?: object;
    /**
     * File download path, if not specified, defaults to the Side Service's ·data://download· path. 文件下载路径，如果没有指定，默认在伴生服务的 `data://download` 路径下
     */
    filePath?: string;
  };
}

export function _parseHmPath(path: string) {
  path = path.trim();
  let isAssets: boolean;
  if (path.startsWith("assets://")) {
    path = path.substring("assets://".length);
    isAssets = true;
  } else if (path.startsWith("data://")) {
    path = path.substring("data://".length);
    isAssets = false;
  } else throw new Error("[@cuberqaq/transfer-file] Unexpected arg fileName");
  return {
    path,
    isAssets,
  };
}

class Downloader {
  /**
   * @param options see Downloader.Options
   * @returns `DownloadTask` object. 返回 DownloadTask 对象
   */
  downloadFile(options: Downloader.Options): DownloadTask {
    const downloadTask = new DownloadTask();
    const hasReturned: boolean = false;
    (typeof options.headers === "undefined"
      ? fetchPolyfill(options.url)
      : fetchPolyfill(options.url, { headers: options.headers })
    )
      .then(async (res: any) => {
        let resBuf = await res.arrayBuffer()
        // let data =
        //   typeof res.body === "string" ? JSON.parse(res.body) : res.body;
        console.warn(
          "[@cuberqaq/download-side]",
          "Fetch Success:",
          resBuf,
          "File type:",
          await fileTypeFromBuffer(resBuf)
        );
        
        // defer.resolve(data);
        if (hasReturned || downloadTask._canceled) return;
        let filePath: string;
        if (typeof options.filePath !== "undefined")
          filePath = options.filePath;
        else {
          let tempFileNumber: number;
          do {
            tempFileNumber = ~~(Math.random() * 11451419) + 10000000;
          } while (
            typeof fs.statSync({path: "$TMP_" + tempFileNumber + "$"}) !== "undefined"
          );
          filePath = "data://" + "$TMP_" + tempFileNumber + "$";
        }
        let parsed = _parseHmPath(filePath);
        let fileHandle: number;
        if (parsed.isAssets)
          fileHandle = fs.openAssetsSync({
            path: parsed.path,
            flag: fs.O_RDWR | fs.O_CREAT,
          });
        else
          fileHandle = fs.openSync({
            path: parsed.path,
            flag: fs.O_RDWR | fs.O_CREAT,
          });
        fs.writeSync({ fd: fileHandle, buffer: resBuf });

        downloadTask.onSuccess({
          statusCode: res.status,
          filePath:
            typeof options.filePath !== "undefined"
              ? options.filePath
              : undefined,
          tempFilePath:
            typeof options.filePath === "undefined" ? filePath : undefined,
        });
      })
      .catch((e) => {
        console.error("[@cuberqaq/download-side]", "Fetch Error:", e);
        // defer.reject(e);
        downloadTask.onFail({
          code: 1, // TODO
          message: "" + e,
        });
      });
    return downloadTask;
  }
}

class DownloadTask {
  constructor() {
    this.onComplete = () => {};
    this.onSuccess = () => {};
    this.onFail = () => {};
    this.onProgress = () => {};
    this._canceled = false;
  }
  _canceled: boolean;
  /**
   * Cancel the current download task. 取消当前下载任务
   */
  cancel(): void {}
  /**
   * Specify the download progress callback function via the `onProgress` attribute to return the progress of the download task. 通过 onProgress 属性指定下载文件进度回调函数，返回下载任务进度
   */
  onProgress: (event: ProgressEvent) => void;
  /**
   * Specify the download success callback function via the onSuccess attribute to return the progress of the download task. 通过 onSuccess 属性指定下载文件成功回调函数，返回下载任务进度
   */
  onSuccess: (event: SuccessEvent) => void;
  onFail: (event: FailEvent) => void;
  /**
   * This callback function is called regardless of the success of the download task. 不论下载任务是否成功，都会调用这个回调函数
   */
  onComplete: () => void;
}

declare interface ProgressEvent {
  /**
   * Progress in downloading the file, values 1 - 100. 下载文件进度，值 1 - 100
   */
  progress: number;
  /**
   * Total file size in bytes. 文件总大小，单位字节
   */
  total: number;
  /**
   * Size of downloaded file in bytes. 已经下载文件大小，单位字节
   */
  loaded: number;
}
declare interface SuccessEvent {
  /**
   * Returns `filePath` if `filePath` is passed in `downloadFile`, or `tempFilePath` if no path is specified. 如果在 downloadFile 中传入 filePath，此处返回 filePath，未指定路径则返回 tempFilePath
   */
  filePath?: string; // TODO 此处官方文档为:stirng
  /**
   * Temporary file path for downloaded files. 下载文件的临时文件路径
   */
  tempFilePath?: string; // TODO 此处官方文档为:stirng
  /**
   * HTTP Status Code. HTTP 状态码
   */
  statusCode: number;
}
declare interface FailEvent {
  /**
   * Error code. 错误码
   */
  code: number;
  /**
   * Detailed error contents. 错误详细内容
   */
  message: string;
}

export const network = {
  downloader: new Downloader(),
};
