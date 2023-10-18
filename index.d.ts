declare namespace Downloader {
  type Options = {
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

declare class Downloader {
  /**
   * @param options see Downloader.Options
   * @returns `DownloadTask` object. 返回 DownloadTask 对象
   */
  downloadFile(options: Downloader.Options): DownloadTask;
}

export const network: {
  downloader: Downloader;
};

declare class DownloadTask {
  /**
   * Cancel the current download task. 取消当前下载任务
   */
  cancel(): void;
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
