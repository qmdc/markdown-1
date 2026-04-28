import React, { useState, useEffect } from 'react';
import { noteApi } from '../services/api';
import { Plus, Search, Trash2, Edit3, FileText } from 'lucide-react';

const NoteList = ({ 
  onSelectNote, 
  selectedNoteId, 
  onNewNote,
  onDeleteNote,
  isOpen,
  isMobile 
}) => {
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = searchTerm 
        ? await noteApi.searchNotes(searchTerm)
        : await noteApi.getAllNotes();
      setNotes(response.data);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [searchTerm]);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('确定要删除这篇笔记吗？')) {
      try {
        await noteApi.deleteNote(id);
        fetchNotes();
        if (onDeleteNote) {
          onDeleteNote(id);
        }
      } catch (error) {
        console.error('Failed to delete note:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return '刚刚';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} 分钟前`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} 小时前`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)} 天前`;
    
    return date.toLocaleDateString('zh-CN');
  };

  return (
    <div 
      className="note-list"
      style={{
        width: isMobile ? '100%' : '300px',
        height: '100%',
        backgroundColor: '#f9fafb',
        borderRight: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        position: isMobile ? 'absolute' : 'relative',
        left: isMobile ? (isOpen ? '0' : '-100%') : '0',
        top: '0',
        zIndex: '100',
        transition: isMobile ? 'left 0.3s ease' : 'none',
      }}
    >
      <div style={{
        padding: '16px',
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: '#ffffff',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px',
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#1f2937',
          }}>
            我的笔记
          </h2>
          <button
            onClick={onNewNote}
            title="新建笔记"
            style={{
              padding: '8px',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#1d4ed8';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#2563eb';
            }}
          >
            <Plus size={18} />
          </button>
        </div>
        
        <div style={{ position: 'relative' }}>
          <Search 
            size={16} 
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9ca3af',
            }}
          />
          <input
            type="text"
            placeholder="搜索笔记..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px 10px 36px',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '14px',
              outline: 'none',
              transition: 'all 0.15s',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#2563eb';
              e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e5e7eb';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>
      </div>
      
      <div style={{
        flex: '1',
        overflowY: 'auto',
      }}>
        {loading ? (
          <div style={{
            padding: '40px 20px',
            textAlign: 'center',
            color: '#9ca3af',
          }}>
            加载中...
          </div>
        ) : notes.length === 0 ? (
          <div style={{
            padding: '40px 20px',
            textAlign: 'center',
            color: '#9ca3af',
          }}>
            <FileText 
              size={48} 
              style={{ 
                margin: '0 auto 16px', 
                opacity: '0.5' 
              }} 
            />
            <p>暂无笔记</p>
            <p style={{ fontSize: '13px', marginTop: '8px' }}>
              点击上方 + 按钮创建新笔记
            </p>
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              onClick={() => onSelectNote(note)}
              style={{
                padding: '16px',
                borderBottom: '1px solid #e5e7eb',
                cursor: 'pointer',
                backgroundColor: selectedNoteId === note.id ? '#eff6ff' : 'transparent',
                transition: 'background-color 0.15s',
              }}
              onMouseEnter={(e) => {
                if (selectedNoteId !== note.id) {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedNoteId !== note.id) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '8px',
              }}>
                <div style={{ flex: '1', minWidth: '0' }}>
                  <h3 style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#1f2937',
                    marginBottom: '4px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {note.title || '无标题'}
                  </h3>
                  <p style={{
                    fontSize: '13px',
                    color: '#6b7280',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    lineHeight: '1.4',
                  }}>
                    {note.content ? note.content.replace(/[#*`\[\]()\-!]/g, '').substring(0, 100) : '无内容'}
                  </p>
                  <p style={{
                    fontSize: '12px',
                    color: '#9ca3af',
                    marginTop: '8px',
                  }}>
                    {formatDate(note.updatedAt || note.createdAt)}
                  </p>
                </div>
                
                <button
                  onClick={(e) => handleDelete(e, note.id)}
                  title="删除笔记"
                  style={{
                    padding: '4px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    color: '#9ca3af',
                    opacity: '0',
                    transition: 'all 0.15s',
                    flexShrink: '0',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.color = '#ef4444';
                    e.currentTarget.style.backgroundColor = '#fef2f2';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '0';
                    e.currentTarget.style.color = '#9ca3af';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NoteList;
