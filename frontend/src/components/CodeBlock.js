import React, { useState, useMemo } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs, vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import JsonTreeView from './JsonTreeView';
import { Copy, Check, Code, Eye, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';

const CodeBlock = ({ className, children, ...props }) => {
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';
  const code = String(children || '').replace(/\n$/, '');
  
  const [viewMode, setViewMode] = useState('code');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  
  const isJson = language === 'json' || language === 'javascript';
  
  const parsedJson = useMemo(() => {
    if (!isJson) return null;
    try {
      return JSON.parse(code);
    } catch (e) {
      return null;
    }
  }, [code, isJson]);
  
  const formattedJson = useMemo(() => {
    if (!isJson) return null;
    try {
      const parsed = JSON.parse(code);
      return JSON.stringify(parsed, null, 2);
    } catch (e) {
      return code;
    }
  }, [code, isJson]);
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  
  const handleBeautify = () => {
    if (formattedJson && window.onCodeBeautify) {
      window.onCodeBeautify(formattedJson);
    }
  };
  
  const displayCode = viewMode === 'code' ? code : formattedJson;
  
  return (
    <div className="code-block-wrapper" style={{ margin: '16px 0' }}>
      <div className="code-block-header" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 12px',
        backgroundColor: isDarkTheme ? '#2d2d2d' : '#f5f5f5',
        borderTopLeftRadius: '6px',
        borderTopRightRadius: '6px',
        borderBottom: `1px solid ${isDarkTheme ? '#404040' : '#e0e0e0'}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ 
            fontSize: '12px', 
            fontWeight: '500',
            color: isDarkTheme ? '#888' : '#666',
            textTransform: 'uppercase',
          }}>
            {language || 'text'}
          </span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {isJson && parsedJson && (
            <>
              <button
                onClick={() => setViewMode(viewMode === 'code' ? 'tree' : 'code')}
                title={viewMode === 'code' ? '树形视图' : '代码视图'}
                style={{
                  padding: '4px 8px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  color: isDarkTheme ? '#ccc' : '#666',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '12px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isDarkTheme ? '#404040' : '#e0e0e0';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {viewMode === 'code' ? <Eye size={14} /> : <Code size={14} />}
              </button>
              
              <button
                onClick={handleBeautify}
                title="美化 JSON"
                style={{
                  padding: '4px 8px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  color: isDarkTheme ? '#ccc' : '#666',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '12px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isDarkTheme ? '#404040' : '#e0e0e0';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <RotateCcw size={14} />
              </button>
            </>
          )}
          
          <button
            onClick={handleCopy}
            title="复制代码"
            style={{
              padding: '4px 8px',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              color: isDarkTheme ? '#ccc' : '#666',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '12px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isDarkTheme ? '#404040' : '#e0e0e0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            {copied ? <Check size={14} color="#4ade80" /> : <Copy size={14} />}
          </button>
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? '展开' : '折叠'}
            style={{
              padding: '4px 8px',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              color: isDarkTheme ? '#ccc' : '#666',
              display: 'flex',
              alignItems: 'center',
              fontSize: '12px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isDarkTheme ? '#404040' : '#e0e0e0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>
        </div>
      </div>
      
      {!isCollapsed && (
        <div style={{
          borderBottomLeftRadius: '6px',
          borderBottomRightRadius: '6px',
          overflow: 'hidden',
        }}>
          {viewMode === 'tree' && isJson && parsedJson ? (
            <JsonTreeView data={parsedJson} />
          ) : (
            <SyntaxHighlighter
              style={isDarkTheme ? vscDarkPlus : vs}
              language={language || 'text'}
              PreTag="div"
              customStyle={{
                margin: 0,
                padding: '16px',
                fontSize: '13px',
                lineHeight: '1.5',
                borderRadius: 0,
              }}
              showLineNumbers
              wrapLines
              {...props}
            >
              {displayCode}
            </SyntaxHighlighter>
          )}
        </div>
      )}
    </div>
  );
};

export default CodeBlock;
