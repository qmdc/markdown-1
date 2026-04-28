import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodeBlock from './CodeBlock';

const MarkdownPreview = ({ content, onCodeBeautify }) => {
  React.useEffect(() => {
    window.onCodeBeautify = onCodeBeautify;
    return () => {
      delete window.onCodeBeautify;
    };
  }, [onCodeBeautify]);

  return (
    <div className="markdown-preview">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <CodeBlock
                className={className}
                {...props}
              >
                {children}
              </CodeBlock>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
      <style jsx>{`
        .markdown-preview {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          padding: 24px;
          height: 100%;
          overflow-y: auto;
        }
        
        .markdown-preview :global(h1) {
          font-size: 2em;
          font-weight: 700;
          margin-top: 0.67em;
          margin-bottom: 0.67em;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 0.3em;
        }
        
        .markdown-preview :global(h2) {
          font-size: 1.5em;
          font-weight: 600;
          margin-top: 1.5em;
          margin-bottom: 0.5em;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 0.3em;
        }
        
        .markdown-preview :global(h3) {
          font-size: 1.25em;
          font-weight: 600;
          margin-top: 1.5em;
          margin-bottom: 0.5em;
        }
        
        .markdown-preview :global(h4) {
          font-size: 1.1em;
          font-weight: 600;
          margin-top: 1.5em;
          margin-bottom: 0.5em;
        }
        
        .markdown-preview :global(h5) {
          font-size: 1em;
          font-weight: 600;
          margin-top: 1.5em;
          margin-bottom: 0.5em;
        }
        
        .markdown-preview :global(h6) {
          font-size: 0.9em;
          font-weight: 600;
          margin-top: 1.5em;
          margin-bottom: 0.5em;
          color: #6b7280;
        }
        
        .markdown-preview :global(p) {
          margin-top: 1em;
          margin-bottom: 1em;
        }
        
        .markdown-preview :global(ul),
        .markdown-preview :global(ol) {
          padding-left: 2em;
          margin-top: 1em;
          margin-bottom: 1em;
        }
        
        .markdown-preview :global(li) {
          margin: 0.25em 0;
        }
        
        .markdown-preview :global(ul li) {
          list-style-type: disc;
        }
        
        .markdown-preview :global(ol li) {
          list-style-type: decimal;
        }
        
        .markdown-preview :global(blockquote) {
          border-left: 4px solid #e5e7eb;
          padding-left: 16px;
          color: #6b7280;
          margin: 16px 0;
          font-style: italic;
        }
        
        .markdown-preview :global(pre) {
          margin: 0;
        }
        
        .markdown-preview :global(code:not(pre code)) {
          background-color: #f3f4f6;
          padding: 0.2em 0.4em;
          border-radius: 3px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.85em;
          color: #e11d48;
        }
        
        .markdown-preview :global(table) {
          border-collapse: collapse;
          width: 100%;
          margin: 16px 0;
          font-size: 0.9em;
        }
        
        .markdown-preview :global(th),
        .markdown-preview :global(td) {
          border: 1px solid #e5e7eb;
          padding: 8px 12px;
          text-align: left;
        }
        
        .markdown-preview :global(th) {
          background-color: #f9fafb;
          font-weight: 600;
        }
        
        .markdown-preview :global(tr:nth-child(even)) {
          background-color: #f9fafb;
        }
        
        .markdown-preview :global(a) {
          color: #2563eb;
          text-decoration: none;
        }
        
        .markdown-preview :global(a:hover) {
          text-decoration: underline;
        }
        
        .markdown-preview :global(hr) {
          border: none;
          border-top: 1px solid #e5e7eb;
          margin: 24px 0;
        }
        
        .markdown-preview :global(img) {
          max-width: 100%;
          height: auto;
          border-radius: 6px;
        }
        
        .markdown-preview :global(del) {
          text-decoration: line-through;
          color: #6b7280;
        }
        
        .markdown-preview :global(task-list) {
          list-style-type: none;
          padding-left: 0;
        }
        
        .markdown-preview :global(input[type="checkbox"]) {
          margin-right: 8px;
        }
      `}</style>
    </div>
  );
};

export default MarkdownPreview;
