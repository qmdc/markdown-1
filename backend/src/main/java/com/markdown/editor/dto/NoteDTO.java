package com.markdown.editor.dto;

import lombok.Data;
import javax.validation.constraints.NotBlank;

@Data
public class NoteDTO {
    
    private Long id;
    
    @NotBlank(message = "标题不能为空")
    private String title;
    
    private String content;
}
