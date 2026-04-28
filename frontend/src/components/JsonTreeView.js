import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

const JsonTreeView = ({ data, initialCollapsed = false }) => {
  const [collapsedNodes, setCollapsedNodes] = useState(() => {
    if (!initialCollapsed) return new Set();
    const collapsed = new Set();
    const collectKeys = (obj, prefix = '') => {
      if (typeof obj === 'object' && obj !== null) {
        const keys = Array.isArray(obj) ? obj.keys() : Object.keys(obj);
        for (const key of keys) {
          const value = Array.isArray(obj) ? obj[key] : obj[key];
          const fullKey = prefix ? `${prefix}.${key}` : String(key);
          if (typeof value === 'object' && value !== null) {
            collapsed.add(fullKey);
            collectKeys(value, fullKey);
          }
        }
      }
    };
    collectKeys(data);
    return collapsed;
  });

  const toggleNode = (key) => {
    setCollapsedNodes(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const renderValue = (value, key, path) => {
    const fullKey = path ? `${path}.${key}` : String(key);
    
    if (value === null) {
      return <span className="json-null">null</span>;
    }
    
    if (typeof value === 'object') {
      const isArray = Array.isArray(value);
      const isCollapsed = collapsedNodes.has(fullKey);
      const hasChildren = isArray ? value.length > 0 : Object.keys(value).length > 0;
      
      return (
        <div className="json-object">
          <span 
            className="json-toggle" 
            onClick={() => hasChildren && toggleNode(fullKey)}
            style={{ cursor: hasChildren ? 'pointer' : 'default' }}
          >
            {hasChildren ? (isCollapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />) : null}
          </span>
          <span className="json-bracket">{isArray ? '[' : '{'}</span>
          {!isCollapsed && hasChildren && (
            <div className="json-children">
              {(isArray ? value : Object.entries(value)).map((item, index) => {
                const [childKey, childValue] = isArray ? [index, item] : item;
                return (
                  <div key={childKey} className="json-item">
                    {!isArray && (
                      <span className="json-key">"{childKey}"</span>
                    )}
                    {!isArray && <span className="json-colon">: </span>}
                    {renderValue(childValue, childKey, fullKey)}
                    {(isArray ? index < value.length - 1 : index < Object.entries(value).length - 1) && (
                      <span className="json-comma">,</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          {isCollapsed && hasChildren && (
            <span className="json-ellipsis">...</span>
          )}
          <span className="json-bracket">{isArray ? ']' : '}'}</span>
        </div>
      );
    }
    
    if (typeof value === 'string') {
      return <span className="json-string">"{value}"</span>;
    }
    
    if (typeof value === 'number') {
      return <span className="json-number">{value}</span>;
    }
    
    if (typeof value === 'boolean') {
      return <span className="json-boolean">{value.toString()}</span>;
    }
    
    return <span className="json-undefined">undefined</span>;
  };

  return (
    <div className="json-tree-view">
      {renderValue(data, '', '')}
      <style jsx>{`
        .json-tree-view {
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          line-height: 1.5;
          padding: 16px;
          background: #1e1e1e;
          color: #d4d4d4;
          border-radius: 6px;
          overflow-x: auto;
        }
        
        .json-object {
          display: inline;
        }
        
        .json-toggle {
          display: inline-flex;
          align-items: center;
          margin-right: 4px;
          color: #858585;
          transition: color 0.2s;
        }
        
        .json-toggle:hover {
          color: #d4d4d4;
        }
        
        .json-children {
          margin-left: 24px;
        }
        
        .json-item {
          display: block;
        }
        
        .json-key {
          color: #9cdcfe;
        }
        
        .json-string {
          color: #ce9178;
        }
        
        .json-number {
          color: #b5cea8;
        }
        
        .json-boolean {
          color: #569cd6;
        }
        
        .json-null {
          color: #569cd6;
        }
        
        .json-undefined {
          color: #808080;
        }
        
        .json-bracket {
          color: #ffd700;
        }
        
        .json-colon {
          color: #d4d4d4;
        }
        
        .json-comma {
          color: #d4d4d4;
        }
        
        .json-ellipsis {
          color: #858585;
          padding: 0 4px;
        }
      `}</style>
    </div>
  );
};

export default JsonTreeView;
