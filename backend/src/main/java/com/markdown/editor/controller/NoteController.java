package com.markdown.editor.controller;

import com.markdown.editor.dto.NoteDTO;
import com.markdown.editor.entity.Note;
import com.markdown.editor.service.NoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = "*")
public class NoteController {
    
    @Autowired
    private NoteService noteService;
    
    @GetMapping
    public List<Note> getAllNotes() {
        return noteService.getAllNotes();
    }
    
    @GetMapping("/search")
    public List<Note> searchNotes(@RequestParam(required = false) String keyword) {
        return noteService.searchNotes(keyword);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Note> getNoteById(@PathVariable Long id) {
        return noteService.getNoteById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public Note createNote(@Valid @RequestBody NoteDTO noteDTO) {
        return noteService.createNote(noteDTO);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Note> updateNote(@PathVariable Long id, @Valid @RequestBody NoteDTO noteDTO) {
        return noteService.updateNote(id, noteDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNote(@PathVariable Long id) {
        if (noteService.deleteNote(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
