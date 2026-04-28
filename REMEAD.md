# Markdown 编辑器

一个功能强大的在线 Markdown 编辑器，支持实时预览、代码高亮、JSON 格式化、笔记保存等功能。

## 功能特性

### 核心功能
- **实时预览**: 左侧编辑区，右侧实时预览，所见即所得
- **语法高亮**: 支持多种编程语言的代码块语法高亮
- **响应式设计**: 完美适配手机、平板和电脑端
- **笔记管理**: 支持创建、编辑、删除、搜索笔记
- **导出功能**: 一键导出为 HTML 文件

### 代码块增强
- **JSON 格式化**: 支持 JSON 代码块的美化格式化
- **树形视图**: JSON 代码块可切换为树形结构展示
- **折叠/展开**: 支持代码块的一键折叠和展开
- **复制功能**: 一键复制代码块内容

### Markdown 语法支持
- 标题 (H1-H6)
- 粗体、斜体、删除线
- 有序列表、无序列表、任务列表
- 引用、链接、图片
- 代码块、行内代码
- 表格、分隔线
- GFM (GitHub Flavored Markdown) 语法

## 技术栈

### 后端
- **框架**: Spring Boot 2.7.18
- **数据库**: MySQL 8.0+
- **ORM**: Spring Data JPA
- **工具库**:
  - Lombok (简化代码)
  - CommonMark (Markdown 解析)
  - iText 7 (PDF 导出，可选)

### 前端
- **框架**: React 18
- **构建工具**: Create React App
- **核心依赖**:
  - react-markdown (Markdown 渲染)
  - react-syntax-highlighter (代码高亮)
  - remark-gfm (GFM 语法支持)
  - lucide-react (图标库)
  - axios (HTTP 客户端)

## 项目结构

```
markdown-1/
├── backend/                    # 后端项目
│   ├── pom.xml                # Maven 配置
│   └── src/
│       └── main/
│           ├── java/com/markdown/editor/
│           │   ├── MarkdownEditorApplication.java  # 启动类
│           │   ├── controller/                     # 控制器层
│           │   │   ├── NoteController.java        # 笔记 API
│           │   │   └── ExportController.java      # 导出 API
│           │   ├── service/                        # 服务层
│           │   │   ├── NoteService.java           # 笔记服务
│           │   │   └── ExportService.java         # 导出服务
│           │   ├── repository/                     # 数据访问层
│           │   │   └── NoteRepository.java
│           │   ├── entity/                         # 实体类
│           │   │   └── Note.java
│           │   └── dto/                            # 数据传输对象
│           │       └── NoteDTO.java
│           └── resources/
│               └── application.properties          # 配置文件
│
├── frontend/                   # 前端项目
│   ├── package.json
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── index.js
│       ├── index.css
│       ├── App.js                            # 主应用组件
│       ├── services/
│       │   └── api.js                        # API 服务
│       └── components/
│           ├── MarkdownPreview.js            # Markdown 预览组件
│           ├── CodeBlock.js                  # 代码块组件
│           ├── JsonTreeView.js               # JSON 树形视图组件
│           ├── Toolbar.js                    # 工具栏组件
│           └── NoteList.js                   # 笔记列表组件
│
├── database/
│   └── init.sql               # 数据库初始化脚本
└── REMEAD.md
```

## 快速开始

### 环境要求
- JDK 1.8+
- Node.js 14+
- MySQL 8.0+
- Maven 3.6+

### 1. 数据库配置

1. 创建数据库并执行初始化脚本：
```bash
mysql -u root -p < database/init.sql
```

或者手动执行 `database/init.sql` 中的 SQL 语句。

2. 修改后端配置文件 `backend/src/main/resources/application.properties`：
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/markdown_editor?useUnicode=true&characterEncoding=utf-8&useSSL=false&serverTimezone=Asia/Shanghai
spring.datasource.username=root
spring.datasource.password=你的密码
```

### 2. 启动后端服务

```bash
cd backend

# 使用 Maven 运行
mvn spring-boot:run

# 或者先编译再运行
mvn clean package
java -jar target/markdown-editor-0.0.1-SNAPSHOT.jar
```

后端服务将在 `http://localhost:8080` 启动。

### 3. 启动前端服务

```bash
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm start
```

前端服务将在 `http://localhost:3000` 启动。

### 4. 访问应用

打开浏览器访问 `http://localhost:3000` 即可使用 Markdown 编辑器。

## API 接口

### 笔记管理
| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/notes | 获取所有笔记 |
| GET | /api/notes/search?keyword=xxx | 搜索笔记 |
| GET | /api/notes/{id} | 获取单个笔记 |
| POST | /api/notes | 创建笔记 |
| PUT | /api/notes/{id} | 更新笔记 |
| DELETE | /api/notes/{id} | 删除笔记 |

### 导出功能
| 方法 | 路径 | 描述 |
|------|------|------|
| POST | /api/export/html | 导出为 HTML |
| POST | /api/export/preview | 预览 HTML |

## 使用指南

### 基础编辑
1. **创建笔记**: 点击左侧笔记列表的 "+" 按钮创建新笔记
2. **编辑标题**: 在编辑区顶部输入框修改笔记标题
3. **编辑内容**: 在左侧编辑区输入 Markdown 内容，右侧实时预览
4. **保存笔记**: 点击工具栏的保存按钮保存到数据库

### 工具栏功能
工具栏提供了常用 Markdown 语法的快捷插入按钮：
- 标题: H1, H2, H3
- 文本格式: 粗体、斜体、删除线
- 代码: 行内代码、代码块
- 列表: 无序列表、有序列表
- 其他: 引用、链接、图片

### 代码块操作
对于代码块，特别是 JSON 代码块，提供了增强功能：
1. **切换视图**: 点击眼睛图标在代码视图和树形视图之间切换
2. **美化 JSON**: 点击刷新图标美化格式化 JSON 代码
3. **复制代码**: 点击复制图标复制代码块内容
4. **折叠/展开**: 点击上下箭头折叠或展开代码块

### 响应式布局
- **桌面端**: 左右分栏，左侧编辑，右侧预览
- **移动端**: 单栏模式，通过底部标签切换编辑/预览视图
- **侧边栏**: 移动端可通过汉堡菜单展开/收起笔记列表

### 导出功能
1. **导出 HTML**: 点击工具栏的 HTML 图标导出为完整的 HTML 文件
2. **导出 PDF**: 可使用浏览器打印功能 (Ctrl+P) 选择"保存为 PDF"

## 开发说明

### 后端开发
- 实体类使用 Lombok 简化代码
- 使用 Spring Data JPA 进行数据访问
- 控制器层统一使用 RESTful 风格
- 支持跨域请求 (CORS)

### 前端开发
- 使用 React Hooks 管理状态
- 组件化设计，职责分离
- 使用 CSS-in-JS 方式管理样式
- 响应式设计，支持多种屏幕尺寸

## 后续扩展建议

1. **用户系统**: 添加用户注册、登录、权限管理
2. **实时协作**: 支持多人同时编辑同一篇笔记
3. **图片上传**: 支持图片拖拽上传到服务器
4. **主题切换**: 支持亮/暗主题切换
5. **标签分类**: 为笔记添加标签，支持按标签分类
6. **版本历史**: 记录笔记修改历史，支持版本回退
7. **PDF 导出**: 完善后端 PDF 导出功能
8. **快捷键**: 添加常用操作的键盘快捷键

## 许可证

MIT License
