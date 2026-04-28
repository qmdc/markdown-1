-- 创建数据库
CREATE DATABASE IF NOT EXISTS markdown_editor 
DEFAULT CHARACTER SET utf8mb4 
DEFAULT COLLATE utf8mb4_unicode_ci;

-- 使用数据库
USE markdown_editor;

-- 创建笔记表
CREATE TABLE IF NOT EXISTS notes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL DEFAULT '未命名笔记',
    content TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_updated_at (updated_at),
    INDEX idx_title (title)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 插入示例数据
INSERT INTO notes (title, content) VALUES (
    '欢迎使用 Markdown 编辑器',
    '# 欢迎使用 Markdown 编辑器\n\n这是一个功能强大的在线 Markdown 编辑器。\n\n## 功能特点\n\n- 实时预览\n- 代码高亮\n- JSON 格式化\n- 笔记保存\n\n开始你的创作吧！'
);
