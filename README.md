# KZToolBox（Tauri 桌面版示例）

这是一个面向 Windows 10/11 的工具箱桌面应用原型，目前已完成前端界面与 Tauri 工程接入。

## 已实现的系统能力（Tauri 模式）

- 系统概览：聚合 `msinfo32 /report`、`systeminfo`、`Get-CimInstance` 等信息
- 网络检查：展示网卡/IP 配置，并检测国内外目标网站连通性
- 屏幕显示管理：展示显卡信息、显示器信息和显示器厂商识别数据

## 功能内容

- 左侧分类导航：系统、文本、文档、图片、视频、数学、开发者
- 顶部全局搜索：按工具名称和描述实时筛选
- 中央工具卡片区：展示工具状态（可用/规划中）
- 右侧工作面板：根据工具切换对应交互
- 已接入的示例功能：
  - 系统概览（浏览器环境模拟）
  - 网络检查（浏览器环境模拟）
  - 文本转换
  - JSON 格式化
  - Base64 编解码
  - 时间戳转换
  - 进制转换

## 项目结构

- `index.html`、`styles.css`、`app.js`：前端界面与交互
- `src-tauri/`：Tauri 2 Rust 壳层工程
- `package.json`：Tauri CLI 脚本与依赖

## 运行方式（浏览器）

直接双击 `index.html` 即可预览界面。

## 运行方式（Tauri 桌面版）

1. 安装 Rust 工具链（需要 `rustup`、`rustc`、`cargo`）：
   - https://rustup.rs/
2. 安装 JavaScript 依赖：
   - `npm install`
3. 启动桌面版：
   - `npm run dev`

## 与参考代码的对应关系

- 对应 `参考代码/windows/main.py` 的主界面结构：左侧功能导航 + 主显示区
- 对应 `参考代码/windows/system.py` 的系统信息方向：硬件/网络/时间等入口
- 本示例仅包含界面与交互原型，不包含真实 Windows 系统 API 调用

## 后续计划

后续可将“系统概览/网络检查”等模块替换为真实 Windows 能力层命令：

- `systeminfo`、`wmic`（或 PowerShell `Get-CimInstance`）
- `ipconfig /all`、端口占用查询
- 文件与日志能力（本地持久化）
