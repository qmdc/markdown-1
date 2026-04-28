package com.markdown.editor.service;

import com.markdown.editor.dto.NoteDTO;
import com.markdown.editor.entity.Note;
import com.markdown.editor.repository.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class NoteService {
    
    @Autowired
    private NoteRepository noteRepository;
    
    public List<Note> getAllNotes() {
        return noteRepository.findAllByOrderByUpdatedAtDesc();
    }
    
    public List<Note> searchNotes(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getAllNotes();
        }
        return noteRepository.findByTitleContainingIgnoreCaseOrderByUpdatedAtDesc(keyword);
    }
    
    public Optional<Note> getNoteById(Long id) {
        return noteRepository.findById(id);
    }
    
    @Transactional
    public Note createNote(NoteDTO noteDTO) {
        Note note = new Note();
        note.setTitle(noteDTO.getTitle());
        note.setContent(noteDTO.getContent());
        return noteRepository.save(note);
    }
    
    @Transactional
    public Optional<Note> updateNote(Long id, NoteDTO noteDTO) {
        return noteRepository.findById(id).map(note -> {
            note.setTitle(noteDTO.getTitle());
            note.setContent(noteDTO.getContent());
            return noteRepository.save(note);
        });
    }
    
    @Transactional
    public boolean deleteNote(Long id) {
        if (noteRepository.existsById(id)) {
            noteRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
