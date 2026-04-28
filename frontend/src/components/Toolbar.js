import React from 'react';
import { 
  Bold, 
  Italic, 
  Strikethrough, 
  Code, 
  Quote, 
  List, 
  ListOrdered, 
  Link, 
  Image,
  Heading1,
  Heading2,
  Heading3,
  FileCode,
  FileText,
  Save,
  Download,
  Menu,
  X
} from 'lucide-react';

const Toolbar = ({ 
  onInsert, 
  onSave, 
  onExportHtml, 
  onExportPdf,
  onToggleSidebar,
  sidebarOpen,
  isMobile 
}) => {
  const buttons = [
    { icon: Heading1, label: 'H1', action: () => onInsert('heading1') },
    { icon: Heading2, label: 'H2', action: () => onInsert('heading2') },
    { icon: Heading3, label: 'H3', action: () => onInsert('heading3') },
    { icon: Bold, label: '粗体', action: () => onInsert('bold') },
    { icon: Italic, label: '斜体', action: () => onInsert('italic') },
    { icon: Strikethrough, label: '删除线', action: () => onInsert('strikethrough') },
    { icon: Code, label: '行内代码', action: () => onInsert('inlineCode') },
    { icon: FileCode, label: '代码块', action: () => onInsert('codeBlock') },
    { icon: Quote, label: '引用', action: () => onInsert('quote') },
    { icon: List, label: '无序列表', action: () => onInsert('unorderedList') },
    { icon: ListOrdered, label: '有序列表', action: () => onInsert('orderedList') },
    { icon: Link, label: '链接', action: () => onInsert('link') },
    { icon: Image, label: '图片', action: () => onInsert('image') },
  ];

  return (
    <div className="toolbar" style={{
      display: 'flex',
      alignItems: 'center',
      padding: '8px 16px',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e5e7eb',
      gap: '4px',
      flexWrap: 'wrap',
    }}>
      {isMobile && (
        <button
          onClick={onToggleSidebar}
          style={{
            padding: '8px',
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            marginRight: '8px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f3f4f6';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      )}
      
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '4px',
        flexWrap: 'wrap',
      }}>
        {buttons.map((btn, index) => (
          <button
            key={index}
            onClick={btn.action}
            title={btn.label}
            style={{
              padding: '8px',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              color: '#4b5563',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
              e.currentTarget.style.color = '#1f2937';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#4b5563';
            }}
          >
            <btn.icon size={18} />
          </button>
        ))}
      </div>
      
      <div style={{ 
        marginLeft: 'auto', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px' 
      }}>
        <button
          onClick={onSave}
          title="保存笔记"
          style={{
            padding: '8px 16px',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#1d4ed8';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#2563eb';
          }}
        >
          <Save size={16} />
          保存
        </button>
        
        <button
          onClick={onExportHtml}
          title="导出 HTML"
          style={{
            padding: '8px',
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            color: '#4b5563',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f3f4f6';
            e.currentTarget.style.color = '#1f2937';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#4b5563';
          }}
        >
          <FileText size={18} />
        </button>
        
        <button
          onClick={onExportPdf}
          title="导出 PDF"
          style={{
            padding: '8px',
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            color: '#4b5563',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f3f4f6';
            e.currentTarget.style.color = '#1f2937';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#4b5563';
          }}
        >
          <Download size={18} />
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
