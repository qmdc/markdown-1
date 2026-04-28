package com.markdown.editor.service;

import com.itextpdf.html2pdf.HtmlConverter;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.property.TextAlignment;
import org.commonmark.node.Node;
import org.commonmark.parser.Parser;
import org.commonmark.renderer.html.HtmlRenderer;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class ExportService {
    
    private final Parser parser = Parser.builder().build();
    private final HtmlRenderer renderer = HtmlRenderer.builder().build();
    
    public String convertMarkdownToHtml(String markdown) {
        if (markdown == null || markdown.isEmpty()) {
            return "";
        }
        Node document = parser.parse(markdown);
        return renderer.render(document);
    }
    
    public byte[] exportToHtml(String title, String content) {
        String htmlContent = convertMarkdownToHtml(content);
        
        String fullHtml = "<!DOCTYPE html>\n" +
                "<html lang=\"zh-CN\">\n" +
                "<head>\n" +
                "    <meta charset=\"UTF-8\">\n" +
                "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
                "    <title>" + escapeHtml(title) + "</title>\n" +
                "    <style>\n" +
                "        body { \n" +
                "            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;\n" +
                "            line-height: 1.6;\n" +
                "            max-width: 800px;\n" +
                "            margin: 0 auto;\n" +
                "            padding: 40px 20px;\n" +
                "            color: #333;\n" +
                "        }\n" +
                "        h1, h2, h3, h4, h5, h6 { \n" +
                "            margin-top: 1.5em;\n" +
                "            margin-bottom: 0.5em;\n" +
                "            font-weight: 600;\n" +
                "        }\n" +
                "        h1 { font-size: 2em; border-bottom: 1px solid #eee; padding-bottom: 0.3em; }\n" +
                "        h2 { font-size: 1.5em; border-bottom: 1px solid #eee; padding-bottom: 0.3em; }\n" +
                "        h3 { font-size: 1.25em; }\n" +
                "        pre { \n" +
                "            background-color: #f6f8fa;\n" +
                "            padding: 16px;\n" +
                "            border-radius: 6px;\n" +
                "            overflow-x: auto;\n" +
                "        }\n" +
                "        code { \n" +
                "            background-color: #f6f8fa;\n" +
                "            padding: 0.2em 0.4em;\n" +
                "            border-radius: 3px;\n" +
                "            font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;\n" +
                "            font-size: 0.85em;\n" +
                "        }\n" +
                "        pre code { \n" +
                "            background-color: transparent;\n" +
                "            padding: 0;\n" +
                "        }\n" +
                "        blockquote { \n" +
                "            border-left: 4px solid #dfe2e5;\n" +
                "            padding-left: 16px;\n" +
                "            color: #6a737d;\n" +
                "            margin: 16px 0;\n" +
                "        }\n" +
                "        table { \n" +
                "            border-collapse: collapse;\n" +
                "            width: 100%;\n" +
                "            margin: 16px 0;\n" +
                "        }\n" +
                "        th, td { \n" +
                "            border: 1px solid #dfe2e5;\n" +
                "            padding: 8px 12px;\n" +
                "            text-align: left;\n" +
                "        }\n" +
                "        th { background-color: #f6f8fa; }\n" +
                "        ul, ol { padding-left: 2em; }\n" +
                "        li { margin: 0.25em 0; }\n" +
                "        img { max-width: 100%; height: auto; }\n" +
                "        a { color: #0366d6; text-decoration: none; }\n" +
                "        a:hover { text-decoration: underline; }\n" +
                "        hr { border: none; border-top: 1px solid #dfe2e5; margin: 24px 0; }\n" +
                "    </style>\n" +
                "</head>\n" +
                "<body>\n" +
                "    <h1>" + escapeHtml(title) + "</h1>\n" +
                "    <hr>\n" +
                htmlContent +
                "</body>\n" +
                "</html>";
        
        return fullHtml.getBytes(StandardCharsets.UTF_8);
    }
    
    public byte[] exportToPdf(String title, String content) {
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            String htmlContent = generatePdfHtml(title, content);
            
            PdfWriter writer = new PdfWriter(outputStream);
            PdfDocument pdfDoc = new PdfDocument(writer);
            
            Document document = new Document(pdfDoc);
            
            Paragraph titlePara = new Paragraph(title)
                    .setFontSize(20)
                    .setBold()
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(20);
            document.add(titlePara);
            
            String dateStr = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
            Paragraph datePara = new Paragraph("生成时间: " + dateStr)
                    .setFontSize(10)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(30);
            document.add(datePara);
            
            document.close();
            
            ByteArrayOutputStream pdfOutputStream = new ByteArrayOutputStream();
            PdfWriter pdfWriter = new PdfWriter(pdfOutputStream);
            PdfDocument pdfDocument = new PdfDocument(pdfWriter);
            
            try {
                HtmlConverter.convertToPdf(htmlContent, pdfOutputStream);
                return pdfOutputStream.toByteArray();
            } catch (Exception e) {
                return generateSimplePdf(title, content);
            }
            
        } catch (Exception e) {
            return generateSimplePdf(title, content);
        }
    }
    
    private byte[] generateSimplePdf(String title, String content) {
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(outputStream);
            PdfDocument pdfDoc = new PdfDocument(writer);
            Document document = new Document(pdfDoc);
            
            Paragraph titlePara = new Paragraph(title)
                    .setFontSize(20)
                    .setBold()
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(20);
            document.add(titlePara);
            
            String dateStr = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
            Paragraph datePara = new Paragraph("生成时间: " + dateStr)
                    .setFontSize(10)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(30);
            document.add(datePara);
            
            String plainText = content
                    .replaceAll("```[\\s\\S]*?```", "[代码块]")
                    .replaceAll("`[^`]+`", "[行内代码]")
                    .replaceAll("#+\\s+", "")
                    .replaceAll("\\*\\*([^*]+)\\*\\*", "$1")
                    .replaceAll("\\*([^*]+)\\*", "$1")
                    .replaceAll("~~([^~]+)~~", "$1")
                    .replaceAll("!\\[([^\\]]*)\\]\\([^)]+\\)", "[$1]")
                    .replaceAll("\\[([^\\]]+)\\]\\([^)]+\\)", "$1")
                    .replaceAll("^-\\s\\[x\\]\\s", "✓ ", "")
                    .replaceAll("^-\\s\\[\\s\\]\\s", "☐ ", "")
                    .replaceAll("^[-*]\\s", "• ", "")
                    .replaceAll("^\\d+\\.\\s", "");
            
            Paragraph contentPara = new Paragraph(plainText)
                    .setFontSize(12)
                    .setMultipliedLeading(1.5f);
            document.add(contentPara);
            
            document.close();
            return outputStream.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("PDF 生成失败", e);
        }
    }
    
    private String generatePdfHtml(String title, String content) {
        String htmlContent = convertMarkdownToHtml(content);
        String dateStr = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        
        return "<!DOCTYPE html>\n" +
                "<html lang=\"zh-CN\">\n" +
                "<head>\n" +
                "    <meta charset=\"UTF-8\">\n" +
                "    <style>\n" +
                "        body { \n" +
                "            font-family: 'Microsoft YaHei', 'SimHei', sans-serif;\n" +
                "            font-size: 12px;\n" +
                "            line-height: 1.6;\n" +
                "            padding: 20px;\n" +
                "        }\n" +
                "        h1 { font-size: 24px; font-weight: bold; text-align: center; margin-bottom: 10px; }\n" +
                "        h2 { font-size: 18px; font-weight: bold; margin-top: 20px; margin-bottom: 10px; }\n" +
                "        h3 { font-size: 16px; font-weight: bold; margin-top: 15px; margin-bottom: 8px; }\n" +
                "        .header-info { text-align: center; color: #666; font-size: 10px; margin-bottom: 30px; }\n" +
                "        pre { background-color: #f5f5f5; padding: 10px; border-radius: 4px; overflow-x: auto; }\n" +
                "        code { font-family: 'Courier New', monospace; background-color: #f5f5f5; padding: 2px 4px; border-radius: 2px; }\n" +
                "        blockquote { border-left: 4px solid #ddd; padding-left: 15px; color: #666; margin: 10px 0; }\n" +
                "        table { border-collapse: collapse; width: 100%; margin: 10px 0; }\n" +
                "        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }\n" +
                "        th { background-color: #f5f5f5; }\n" +
                "        ul, ol { padding-left: 20px; }\n" +
                "        hr { border: none; border-top: 1px solid #ddd; margin: 20px 0; }\n" +
                "    </style>\n" +
                "</head>\n" +
                "<body>\n" +
                "    <h1>" + escapeHtml(title) + "</h1>\n" +
                "    <div class=\"header-info\">生成时间: " + dateStr + "</div>\n" +
                "    <hr>\n" +
                htmlContent +
                "</body>\n" +
                "</html>";
    }
    
    private String escapeHtml(String text) {
        if (text == null) return "";
        return text.replace("&", "&amp;")
                   .replace("<", "&lt;")
                   .replace(">", "&gt;")
                   .replace("\"", "&quot;")
                   .replace("'", "&#39;");
    }
}
