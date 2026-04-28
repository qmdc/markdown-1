import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

const COLORS = {
  background: '#1e1e1e',
  text: '#d4d4d4',
  key: '#9cdcfe',
  string: '#ce9178',
  number: '#b5cea8',
  boolean: '#569cd6',
  null: '#569cd6',
  undefined: '#808080',
  bracket: '#ffd700',
  toggle: '#858585',
  toggleHover: '#d4d4d4',
  ellipsis: '#858585',
  comma: '#d4d4d4',
  colon: '#d4d4d4',
};

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

  const [hoveredToggle, setHoveredToggle] = useState(null);

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
      return (
        <span style={{ color: COLORS.null, fontFamily: "'JetBrains Mono', monospace" }}>
          null
        </span>
      );
    }
    
    if (typeof value === 'object') {
      const isArray = Array.isArray(value);
      const isCollapsed = collapsedNodes.has(fullKey);
      const entries = isArray ? value : Object.entries(value);
      const hasChildren = entries.length > 0;
      
      return (
        <div style={{ display: 'inline' }}>
          <span 
            onClick={() => hasChildren && toggleNode(fullKey)}
            onMouseEnter={() => setHoveredToggle(fullKey)}
            onMouseLeave={() => setHoveredToggle(null)}
            style={{ 
              cursor: hasChildren ? 'pointer' : 'default',
              display: 'inline-flex',
              alignItems: 'center',
              marginRight: '4px',
              color: hoveredToggle === fullKey ? COLORS.toggleHover : COLORS.toggle,
              transition: 'color 0.2s',
            }}
          >
            {hasChildren ? (
              isCollapsed ? 
                <ChevronRight size={14} style={{ verticalAlign: 'middle' }} /> : 
                <ChevronDown size={14} style={{ verticalAlign: 'middle' }} />
            ) : null}
          </span>
          <span style={{ 
            color: COLORS.bracket, 
            fontFamily: "'JetBrains Mono', monospace" 
          }}>
            {isArray ? '[' : '{'}
          </span>
          {!isCollapsed && hasChildren && (
            <div style={{ marginLeft: '24px' }}>
              {entries.map((item, index) => {
                const [childKey, childValue] = isArray ? [index, item] : item;
                const isLast = index === entries.length - 1;
                return (
                  <div key={childKey} style={{ display: 'block' }}>
                    {!isArray && (
                      <span style={{ 
                        color: COLORS.key, 
                        fontFamily: "'JetBrains Mono', monospace" 
                      }}>
                        "{childKey}"
                      </span>
                    )}
                    {!isArray && (
                      <span style={{ 
                        color: COLORS.colon, 
                        fontFamily: "'JetBrains Mono', monospace" 
                      }}>
                        : 
                      </span>
                    )}
                    {renderValue(childValue, childKey, fullKey)}
                    {!isLast && (
                      <span style={{ 
                        color: COLORS.comma, 
                        fontFamily: "'JetBrains Mono', monospace" 
                      }}>
                        ,
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          {isCollapsed && hasChildren && (
            <span style={{ 
              color: COLORS.ellipsis, 
              padding: '0 4px',
              fontFamily: "'JetBrains Mono', monospace" 
            }}>
              ...
            </span>
          )}
          <span style={{ 
            color: COLORS.bracket, 
            fontFamily: "'JetBrains Mono', monospace" 
          }}>
            {isArray ? ']' : '}'}
          </span>
        </div>
      );
    }
    
    if (typeof value === 'string') {
      return (
        <span style={{ 
          color: COLORS.string, 
          fontFamily: "'JetBrains Mono', monospace" 
        }}>
          "{value}"
        </span>
      );
    }
    
    if (typeof value === 'number') {
      return (
        <span style={{ 
          color: COLORS.number, 
          fontFamily: "'JetBrains Mono', monospace" 
        }}>
          {value}
        </span>
      );
    }
    
    if (typeof value === 'boolean') {
      return (
        <span style={{ 
          color: COLORS.boolean, 
          fontFamily: "'JetBrains Mono', monospace" 
        }}>
          {value.toString()}
        </span>
      );
    }
    
    return (
      <span style={{ 
        color: COLORS.undefined, 
        fontFamily: "'JetBrains Mono', monospace" 
      }}>
        undefined
      </span>
    );
  };

  return (
    <div style={{
      fontFamily: "'JetBrains Mono', 'SFMono-Regular', Consolas, monospace",
      fontSize: '13px',
      lineHeight: '1.5',
      padding: '16px',
      background: COLORS.background,
      color: COLORS.text,
      borderRadius: '6px',
      overflowX: 'auto',
      width: '100%',
      boxSizing: 'border-box',
    }}>
      {renderValue(data, '', '')}
    </div>
  );
};

export default JsonTreeView;
