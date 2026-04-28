package com.markdown.editor.service;

import org.commonmark.node.Node;
import org.commonmark.parser.Parser;
import org.commonmark.renderer.html.HtmlRenderer;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;

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
    
    private String escapeHtml(String text) {
        if (text == null) return "";
        return text.replace("&", "&amp;")
                   .replace("<", "&lt;")
                   .replace(">", "&gt;")
                   .replace("\"", "&quot;")
                   .replace("'", "&#39;");
    }
}
