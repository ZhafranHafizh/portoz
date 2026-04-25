<template>
  <div class="rich-text-editor" :class="{ 'is-focused': isFocused }">
    <!-- Toolbar -->
    <div v-if="editor" class="editor-toolbar" role="toolbar">
      <!-- Text formatting -->
      <div class="toolbar-group">
        <button 
          type="button"
          @click="editor.chain().focus().toggleBold().run()" 
          :class="{ 'is-active': editor.isActive('bold') }"
          title="Bold (Ctrl+B)"
        >
          <i class="fas fa-bold"></i>
        </button>
        <button 
          type="button"
          @click="editor.chain().focus().toggleItalic().run()" 
          :class="{ 'is-active': editor.isActive('italic') }"
          title="Italic (Ctrl+I)"
        >
          <i class="fas fa-italic"></i>
        </button>
        <button 
          type="button"
          @click="editor.chain().focus().toggleUnderline().run()" 
          :class="{ 'is-active': editor.isActive('underline') }"
          title="Underline (Ctrl+U)"
        >
          <i class="fas fa-underline"></i>
        </button>
        <button 
          type="button"
          @click="editor.chain().focus().toggleStrike().run()" 
          :class="{ 'is-active': editor.isActive('strike') }"
          title="Strikethrough"
        >
          <i class="fas fa-strikethrough"></i>
        </button>
      </div>

      <!-- Headings -->
      <div class="toolbar-group">
        <select 
          @change="setHeading($event)" 
          :value="currentHeading"
          title="Heading"
          class="toolbar-select"
        >
          <option value="paragraph">Paragraph</option>
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
          <option value="4">Heading 4</option>
        </select>
      </div>

      <!-- Font family -->
      <div class="toolbar-group">
        <select 
          @change="setFontFamily($event)" 
          :value="currentFontFamily"
          title="Font Family"
          class="toolbar-select"
        >
          <option value="default">Font</option>
          <option value="Poppins">Poppins</option>
          <option value="Arial">Arial</option>
          <option value="Georgia">Georgia</option>
          <option value="Courier New">Courier New</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Verdana">Verdana</option>
        </select>
      </div>

      <!-- Font size -->
      <div class="toolbar-group">
        <select 
          @change="setFontSize($event)" 
          :value="currentFontSize"
          title="Font Size"
          class="toolbar-select"
        >
          <option value="">Size</option>
          <option value="12px">12px</option>
          <option value="14px">14px</option>
          <option value="16px">16px</option>
          <option value="18px">18px</option>
          <option value="20px">20px</option>
          <option value="24px">24px</option>
          <option value="28px">28px</option>
          <option value="32px">32px</option>
          <option value="36px">36px</option>
          <option value="48px">48px</option>
        </select>
      </div>

      <!-- Text color -->
      <div class="toolbar-group">
        <input 
          type="color" 
          :value="textColor" 
          @input="setTextColor($event)"
          title="Text Color"
          class="color-picker"
        />
      </div>

      <!-- Alignment -->
      <div class="toolbar-group">
        <button 
          type="button"
          @click="editor.chain().focus().setTextAlign('left').run()" 
          :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }"
          title="Align Left"
        >
          <i class="fas fa-align-left"></i>
        </button>
        <button 
          type="button"
          @click="editor.chain().focus().setTextAlign('center').run()" 
          :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }"
          title="Align Center"
        >
          <i class="fas fa-align-center"></i>
        </button>
        <button 
          type="button"
          @click="editor.chain().focus().setTextAlign('right').run()" 
          :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }"
          title="Align Right"
        >
          <i class="fas fa-align-right"></i>
        </button>
      </div>

      <!-- Lists -->
      <div class="toolbar-group">
        <button 
          type="button"
          @click="editor.chain().focus().toggleBulletList().run()" 
          :class="{ 'is-active': editor.isActive('bulletList') }"
          title="Bullet List"
        >
          <i class="fas fa-list-ul"></i>
        </button>
        <button 
          type="button"
          @click="editor.chain().focus().toggleOrderedList().run()" 
          :class="{ 'is-active': editor.isActive('orderedList') }"
          title="Numbered List"
        >
          <i class="fas fa-list-ol"></i>
        </button>
      </div>

      <!-- Insert -->
      <div class="toolbar-group">
        <button 
          type="button"
          @click="addLink"
          title="Insert Link"
        >
          <i class="fas fa-link"></i>
        </button>
        <button 
          type="button"
          @click="editor.chain().focus().unsetAllMarks().run()"
          title="Clear Formatting"
        >
          <i class="fas fa-eraser"></i>
        </button>
      </div>
    </div>

    <!-- Editor Content -->
    <editor-content 
      :editor="editor" 
      class="editor-content"
      :style="{ minHeight: height + 'px' }"
    />
  </div>
</template>

<script>
import { Editor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import TextAlign from '@tiptap/extension-text-align';
import FontFamily from '@tiptap/extension-font-family';

export default {
  name: 'RichTextEditor',
  components: {
    EditorContent
  },
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: 'Type something...'
    },
    height: {
      type: Number,
      default: 200
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      editor: null,
      isFocused: false,
      textColor: '#000000'
    };
  },
  computed: {
    currentHeading() {
      if (!this.editor) return 'paragraph';
      if (this.editor.isActive('heading', { level: 1 })) return '1';
      if (this.editor.isActive('heading', { level: 2 })) return '2';
      if (this.editor.isActive('heading', { level: 3 })) return '3';
      if (this.editor.isActive('heading', { level: 4 })) return '4';
      return 'paragraph';
    },
    currentFontFamily() {
      if (!this.editor) return 'default';
      return this.editor.getAttributes('textStyle').fontFamily || 'default';
    },
    currentFontSize() {
      if (!this.editor) return '';
      return this.editor.getAttributes('textStyle').fontSize || '';
    }
  },
  watch: {
    modelValue(value) {
      const isSame = this.editor?.getHTML() === value;
      if (isSame) return;
      this.editor?.commands.setContent(value, false);
    }
  },
  mounted() {
    this.editor = new Editor({
      content: this.modelValue,
      extensions: [
        StarterKit.configure({
          heading: {
            levels: [1, 2, 3, 4]
          }
        }),
        Underline,
        TextStyle,
        Color,
        TextAlign.configure({
          types: ['heading', 'paragraph'],
          alignments: ['left', 'center', 'right', 'justify']
        }),
        FontFamily.configure({
          types: ['textStyle']
        })
      ],
      editorProps: {
        attributes: {
          class: 'tiptap-editor-inner',
          placeholder: this.placeholder
        }
      },
      onUpdate: ({ editor }) => {
        this.$emit('update:modelValue', editor.getHTML());
      },
      onFocus: () => {
        this.isFocused = true;
      },
      onBlur: () => {
        this.isFocused = false;
      }
    });
  },
  beforeUnmount() {
    this.editor?.destroy();
  },
  methods: {
    setHeading(event) {
      const level = parseInt(event.target.value);
      if (isNaN(level)) {
        this.editor.chain().focus().setParagraph().run();
      } else {
        this.editor.chain().focus().toggleHeading({ level }).run();
      }
    },
    setFontFamily(event) {
      const fontFamily = event.target.value;
      if (fontFamily === 'default') {
        this.editor.chain().focus().unsetFontFamily().run();
      } else {
        this.editor.chain().focus().setFontFamily(fontFamily).run();
      }
    },
    setFontSize(event) {
      const fontSize = event.target.value;
      if (fontSize) {
        this.editor.chain().focus().setFontSize(fontSize).run();
      }
    },
    setTextColor(event) {
      const color = event.target.value;
      this.textColor = color;
      this.editor.chain().focus().setColor(color).run();
    },
    addLink() {
      const url = prompt('Enter URL:');
      if (url) {
        this.editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
      }
    }
  }
};
</script>

<style scoped>
.rich-text-editor {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  transition: border-color 0.2s;
  background: white;
}

.rich-text-editor.is-focused {
  border-color: #8b5a2b;
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
}

/* Toolbar */
.editor-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 8px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  align-items: center;
}

.toolbar-group {
  display: flex;
  gap: 2px;
  padding: 0 6px;
  border-right: 1px solid #d1d5db;
}

.toolbar-group:last-child {
  border-right: none;
}

.editor-toolbar button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
  padding: 6px 8px;
  background: white;
  border: 1px solid transparent;
  border-radius: 4px;
  color: #374151;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.15s;
}

.editor-toolbar button:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
}

.editor-toolbar button.is-active {
  background: #ffedd5;
  border-color: #8b5a2b;
  color: #6b4423;
}

.editor-toolbar button:active {
  background: #fed7aa;
}

.toolbar-select {
  height: 32px;
  padding: 4px 8px;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 13px;
  color: #374151;
  cursor: pointer;
}

.toolbar-select:hover {
  border-color: #8b5a2b;
}

.toolbar-select:focus {
  outline: none;
  border-color: #8b5a2b;
  box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.1);
}

.color-picker {
  width: 32px;
  height: 32px;
  padding: 0;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  cursor: pointer;
}

.color-picker:hover {
  border-color: #8b5a2b;
}

.color-picker:focus {
  outline: none;
  border-color: #8b5a2b;
  box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.1);
}

/* Editor Content */
.editor-content {
  min-height: 200px;
  max-height: 500px;
  overflow-y: auto;
  padding: 16px;
}

.tiptap-editor-inner {
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  line-height: 1.6;
  color: #1f2937;
  outline: none;
}

.tiptap-editor-inner p.is-editor-empty:first-child::before {
  content: attr(placeholder);
  float: left;
  color: #9ca3af;
  pointer-events: none;
  height: 0;
}

.tiptap-editor-inner h1 {
  font-size: 2em;
  font-weight: 700;
  margin: 0.5em 0;
}

.tiptap-editor-inner h2 {
  font-size: 1.5em;
  font-weight: 600;
  margin: 0.5em 0;
}

.tiptap-editor-inner h3 {
  font-size: 1.25em;
  font-weight: 600;
  margin: 0.5em 0;
}

.tiptap-editor-inner a {
  color: #8b5a2b;
  text-decoration: underline;
}

.tiptap-editor-inner ul,
.tiptap-editor-inner ol {
  padding-left: 1.5em;
  margin: 0.5em 0;
}

.tiptap-editor-inner blockquote {
  border-left: 4px solid #8b5a2b;
  padding-left: 1em;
  margin: 0.5em 0;
  color: #6b7280;
}

.tiptap-editor-inner code {
  background: #f3f4f6;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
}

/* Responsive */
@media (max-width: 768px) {
  .editor-toolbar {
    padding: 6px;
    gap: 2px;
  }

  .toolbar-group {
    padding: 0 4px;
  }

  .editor-toolbar button {
    min-width: 28px;
    height: 28px;
    padding: 4px 6px;
    font-size: 12px;
  }

  .toolbar-select {
    height: 28px;
    font-size: 12px;
  }
}
</style>
