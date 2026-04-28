package com.markdown.editor.controller;

import com.markdown.editor.service.ExportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@RestController
@RequestMapping("/api/export")
@CrossOrigin(origins = "*")
public class ExportController {
    
    @Autowired
    private ExportService exportService;
    
    @PostMapping("/html")
    public ResponseEntity<byte[]> exportToHtml(@RequestBody Map<String, String> request) {
        String title = request.getOrDefault("title", "Untitled");
        String content = request.getOrDefault("content", "");
        
        byte[] htmlBytes = exportService.exportToHtml(title, content);
        
        String filename = URLEncoder.encode(title, StandardCharsets.UTF_8) + ".html";
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename*=UTF-8''" + filename)
                .contentType(MediaType.TEXT_HTML)
                .body(htmlBytes);
    }
    
    @PostMapping("/pdf")
    public ResponseEntity<byte[]> exportToPdf(@RequestBody Map<String, String> request) {
        String title = request.getOrDefault("title", "Untitled");
        String content = request.getOrDefault("content", "");
        
        byte[] pdfBytes = exportService.exportToPdf(title, content);
        
        String filename = URLEncoder.encode(title, StandardCharsets.UTF_8) + ".pdf";
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename*=UTF-8''" + filename)
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }
    
    @PostMapping("/preview")
    public ResponseEntity<Map<String, String>> previewHtml(@RequestBody Map<String, String> request) {
        String title = request.getOrDefault("title", "Untitled");
        String content = request.getOrDefault("content", "");
        
        String htmlContent = exportService.convertMarkdownToHtml(content);
        
        return ResponseEntity.ok(Map.of(
                "title", title,
                "htmlContent", htmlContent
        ));
    }
}
