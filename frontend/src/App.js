import React, { useState, useEffect, useRef, useCallback } from 'react';
import MarkdownPreview from './components/MarkdownPreview';
import Toolbar from './components/Toolbar';
import NoteList from './components/NoteList';
import { noteApi, exportApi } from './services/api';
import { Edit, Eye, Menu, X } from 'lucide-react';

const App = () => {
  const [title, setTitle] = useState('未命名笔记');
  const [content, setContent] = useState(`# 欢迎使用 Markdown 编辑器

这是一个功能强大的在线 Markdown 编辑器，支持实时预览、代码高亮、JSON 格式化等功能。

## 功能特性

- **实时预览**: 左侧编辑，右侧实时预览
- **代码高亮**: 支持多种编程语言的语法高亮
- **JSON 格式化**: 支持 JSON 代码块的树形视图、折叠展开
- **导出功能**: 一键导出为 HTML
- **笔记功能**: 保存和管理你的笔记
- **响应式设计**: 完美适配手机和电脑端

## 代码块示例

\`\`\`json
{
  "name": "markdown-editor",
  "version": "1.0.0",
  "features": ["实时预览", "代码高亮", "JSON 格式化"],
  "config": {
    "theme": "dark",
    "autoSave": true
  }
}
\`\`\`

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
  return {
    message: "Welcome to Markdown Editor",
    timestamp: new Date()
  };
}
\`\`\`

## 表格示例

| 功能 | 描述 | 状态 |
|------|------|------|
| 实时预览 | 编辑时即时预览 | ✅ |
| 代码高亮 | 支持多种语言 | ✅ |
| JSON 格式化 | 树形视图展示 | ✅ |
| 导出 HTML | 一键导出 | ✅ |
| 笔记保存 | 持久化存储 | ✅ |

## 引用示例

> 这是一段引用文本。
> Markdown 让写作变得简单而优雅。

## 任务列表

- [x] 完成编辑器基础功能
- [x] 实现实时预览
- [ ] 添加更多主题
- [ ] 支持图片上传

---

开始你的创作之旅吧！ 🚀
`);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [viewMode, setViewMode] = useState('split');
  const [activePanel, setActivePanel] = useState('edit');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  
  const editorRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setViewMode('single');
      } else {
        setViewMode('split');
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const insertMarkdown = useCallback((type) => {
    if (!editorRef.current) return;
    
    const textarea = editorRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let prefix = '';
    let suffix = '';
    let newLine = false;
    
    switch (type) {
      case 'bold':
        prefix = '**';
        suffix = '**';
        break;
      case 'italic':
        prefix = '*';
        suffix = '*';
        break;
      case 'strikethrough':
        prefix = '~~';
        suffix = '~~';
        break;
      case 'inlineCode':
        prefix = '`';
        suffix = '`';
        break;
      case 'codeBlock':
        prefix = '\n```\n';
        suffix = '\n```\n';
        newLine = true;
        break;
      case 'quote':
        prefix = '> ';
        newLine = true;
        break;
      case 'unorderedList':
        prefix = '- ';
        newLine = true;
        break;
      case 'orderedList':
        prefix = '1. ';
        newLine = true;
        break;
      case 'heading1':
        prefix = '# ';
        newLine = true;
        break;
      case 'heading2':
        prefix = '## ';
        newLine = true;
        break;
      case 'heading3':
        prefix = '### ';
        newLine = true;
        break;
      case 'link':
        prefix = '[';
        suffix = '](url)';
        break;
      case 'image':
        prefix = '![alt](';
        suffix = ')';
        break;
      default:
        return;
    }
    
    let newContent = content;
    let newCursorPos = start + prefix.length;
    
    if (newLine && start > 0 && content[start - 1] !== '\n') {
      prefix = '\n' + prefix;
      newCursorPos += 1;
    }
    
    if (selectedText) {
      newContent = content.substring(0, start) + prefix + selectedText + suffix + content.substring(end);
      newCursorPos = start + prefix.length + selectedText.length + suffix.length;
    } else {
      newContent = content.substring(0, start) + prefix + suffix + content.substring(end);
    }
    
    setContent(newContent);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  }, [content]);

  const handleCodeBeautify = useCallback((formattedCode) => {
    if (!editorRef.current) return;
    
    const textarea = editorRef.current;
    const currentContent = content;
    
    const codeBlockRegex = /```json[\s\S]*?```/g;
    const blocks = [...currentContent.matchAll(codeBlockRegex)];
    
    for (const block of blocks) {
      const blockStart = block.index;
      const blockEnd = block.index + block[0].length;
      const blockContent = block[0];
      
      const lines = blockContent.split('\n');
      lines.shift();
      lines.pop();
      const codeContent = lines.join('\n').trim();
      
      try {
        const parsed = JSON.parse(codeContent);
        const originalFormatted = JSON.stringify(parsed, null, 2);
        
        let currentParsed;
        try {
          currentParsed = JSON.parse(formattedCode);
        } catch {
          continue;
        }
        
        if (JSON.stringify(parsed) === JSON.stringify(currentParsed)) {
          const newBlock = '```json\n' + formattedCode + '\n```';
          const newContent = currentContent.substring(0, blockStart) + newBlock + currentContent.substring(blockEnd);
          setContent(newContent);
          break;
        }
      } catch {
        continue;
      }
    }
  }, [content]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveMessage('');
      
      if (selectedNoteId) {
        await noteApi.updateNote(selectedNoteId, { title, content });
        setSaveMessage('保存成功！');
      } else {
        const response = await noteApi.createNote({ title, content });
        setSelectedNoteId(response.data.id);
        setSaveMessage('创建成功！');
      }
      
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Failed to save:', error);
      setSaveMessage('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  const handleSelectNote = (note) => {
    setSelectedNoteId(note.id);
    setTitle(note.title);
    setContent(note.content || '');
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleNewNote = () => {
    setSelectedNoteId(null);
    setTitle('未命名笔记');
    setContent('');
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleDeleteNote = (id) => {
    if (selectedNoteId === id) {
      setSelectedNoteId(null);
      setTitle('未命名笔记');
      setContent('');
    }
  };

  const handleExportHtml = async () => {
    try {
      const response = await exportApi.exportToHtml(title, content);
      const blob = new Blob([response.data], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title || 'untitled'}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export HTML:', error);
      alert('导出失败，请重试');
    }
  };

  const handleExportPdf = () => {
    alert('PDF 导出功能需要后端 iText 支持，请确保后端服务已启动。\n\n或者您可以使用浏览器的打印功能 (Ctrl+P) 选择"保存为 PDF"来实现导出。');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderEditorPanel = () => (
    <div 
      className="editor-panel"
      style={{
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        minWidth: '0',
        backgroundColor: '#ffffff',
      }}
    >
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid #e5e7eb',
      }}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="输入笔记标题..."
          style={{
            width: '100%',
            fontSize: '18px',
            fontWeight: '600',
            border: 'none',
            outline: 'none',
            backgroundColor: 'transparent',
            color: '#1f2937',
          }}
        />
      </div>
      
      <textarea
        ref={editorRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="开始编写 Markdown 内容..."
        style={{
          flex: '1',
          padding: '16px',
          fontSize: '14px',
          lineHeight: '1.6',
          border: 'none',
          outline: 'none',
          resize: 'none',
          fontFamily: "'JetBrains Mono', 'SFMono-Regular', Consolas, monospace",
          backgroundColor: '#ffffff',
          color: '#374151',
        }}
      />
    </div>
  );

  const renderPreviewPanel = () => (
    <div 
      className="preview-panel"
      style={{
        flex: '1',
        minWidth: '0',
        backgroundColor: '#fafafa',
        overflow: 'hidden',
      }}
    >
      <MarkdownPreview 
        content={content} 
        onCodeBeautify={handleCodeBeautify}
      />
    </div>
  );

  return (
    <div 
      className="app"
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        backgroundColor: '#f5f5f5',
        position: 'relative',
      }}
    >
      <Toolbar
        onInsert={insertMarkdown}
        onSave={handleSave}
        onExportHtml={handleExportHtml}
        onExportPdf={handleExportPdf}
        onToggleSidebar={toggleSidebar}
        sidebarOpen={sidebarOpen}
        isMobile={isMobile}
      />
      
      {saveMessage && (
        <div style={{
          position: 'absolute',
          top: '60px',
          right: '20px',
          padding: '12px 20px',
          backgroundColor: saveMessage.includes('失败') ? '#fef2f2' : '#f0fdf4',
          color: saveMessage.includes('失败') ? '#dc2626' : '#16a34a',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          fontSize: '14px',
          fontWeight: '500',
          zIndex: '1000',
          animation: 'fadeIn 0.3s ease',
        }}>
          {saveMessage}
        </div>
      )}
      
      <div 
        className="main-content"
        style={{
          flex: '1',
          display: 'flex',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <NoteList
          onSelectNote={handleSelectNote}
          selectedNoteId={selectedNoteId}
          onNewNote={handleNewNote}
          onDeleteNote={handleDeleteNote}
          isOpen={sidebarOpen}
          isMobile={isMobile}
        />
        
        {isMobile && sidebarOpen && (
          <div
            onClick={toggleSidebar}
            style={{
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              bottom: '0',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: '99',
            }}
          />
        )}
        
        <div 
          className="editor-area"
          style={{
            flex: '1',
            display: 'flex',
            flexDirection: 'column',
            minWidth: '0',
            overflow: 'hidden',
          }}
        >
          {isMobile && (
            <div style={{
              display: 'flex',
              backgroundColor: '#ffffff',
              borderBottom: '1px solid #e5e7eb',
            }}>
              <button
                onClick={() => setActivePanel('edit')}
                style={{
                  flex: '1',
                  padding: '12px 16px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  fontSize: '14px',
                  fontWeight: activePanel === 'edit' ? '600' : '400',
                  color: activePanel === 'edit' ? '#2563eb' : '#6b7280',
                  borderBottom: activePanel === 'edit' ? '2px solid #2563eb' : '2px solid transparent',
                  transition: 'all 0.15s',
                }}
              >
                <Edit size={16} />
                编辑
              </button>
              <button
                onClick={() => setActivePanel('preview')}
                style={{
                  flex: '1',
                  padding: '12px 16px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  fontSize: '14px',
                  fontWeight: activePanel === 'preview' ? '600' : '400',
                  color: activePanel === 'preview' ? '#2563eb' : '#6b7280',
                  borderBottom: activePanel === 'preview' ? '2px solid #2563eb' : '2px solid transparent',
                  transition: 'all 0.15s',
                }}
              >
                <Eye size={16} />
                预览
              </button>
            </div>
          )}
          
          <div 
            className="editor-preview-container"
            style={{
              flex: '1',
              display: 'flex',
              overflow: 'hidden',
            }}
          >
            {!isMobile ? (
              <>
                {renderEditorPanel()}
                <div style={{
                  width: '1px',
                  backgroundColor: '#e5e7eb',
                  flexShrink: '0',
                }} />
                {renderPreviewPanel()}
              </>
            ) : (
              activePanel === 'edit' ? renderEditorPanel() : renderPreviewPanel()
            )}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default App;
