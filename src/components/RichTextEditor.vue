<template>
  <div class="rich-text-editor">
    <Editor
      v-model="editorContent"
      :init="editorConfig"
      @input="updateContent"
    />
  </div>
</template>

<script>
import Editor from '@tinymce/tinymce-vue';

export default {
  name: 'RichTextEditor',
  components: {
    Editor
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
      default: 300
    },
    menubar: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      editorContent: this.modelValue,
      editorConfig: {
        height: this.height,
        menubar: this.menubar,
        branding: false,
        statusbar: true,
        license_key: 'gpl', // Use GPL license (self-hosted, no API key needed)
        plugins: [
          'advlist',
          'autolink',
          'lists',
          'link',
          'image',
          'charmap',
          'preview',
          'anchor',
          'searchreplace',
          'visualblocks',
          'code',
          'fullscreen',
          'insertdatetime',
          'media',
          'table',
          'code',
          'help',
          'wordcount',
          'textcolor'
        ],
        toolbar: [
          'undo redo | blocks | fontfamily fontsize | bold italic underline strikethrough | forecolor backcolor',
          'alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | removeformat code fullscreen help'
        ].join(' | '),
        toolbar_mode: 'sliding',
        font_family_formats: 'Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Poppins=poppins; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva',
        font_size_formats: '8px 10px 12px 14px 16px 18px 20px 24px 28px 32px 36px 48px 64px 72px',
        content_style: `
          body { 
            font-family: 'Poppins', sans-serif; 
            font-size: 14px; 
            line-height: 1.6;
          }
          img { 
            max-width: 100%; 
            height: auto; 
          }
          a { 
            color: #f97316; 
          }
          blockquote {
            border-left: 4px solid #f97316;
            padding-left: 16px;
            margin-left: 0;
            color: #6b7280;
          }
        `,
        placeholder: this.placeholder,
        skin: 'oxide',
        content_css: 'default',
        style_formats: [
          { title: 'Heading 1', format: 'h1' },
          { title: 'Heading 2', format: 'h2' },
          { title: 'Heading 3', format: 'h3' },
          { title: 'Paragraph', format: 'p' },
          { title: 'Blockquote', format: 'blockquote' },
          { title: 'Code', format: 'code' },
          { title: 'Bold', icon: 'bold', format: 'bold' },
          { title: 'Italic', icon: 'italic', format: 'italic' },
          { title: 'Underline', icon: 'underline', format: 'underline' },
          { title: 'Strikethrough', icon: 'strikethrough', format: 'strikethrough' },
          {
            title: 'Colors',
            items: [
              { title: 'Orange Text', inline: 'span', styles: { color: '#f97316' } },
              { title: 'Dark Text', inline: 'span', styles: { color: '#1f2937' } },
              { title: 'Gray Text', inline: 'span', styles: { color: '#6b7280' } },
              { title: 'Orange Background', inline: 'span', styles: { background: '#f97316', color: '#ffffff' } },
              { title: 'Yellow Background', inline: 'span', styles: { background: '#fef3c7' } }
            ]
          }
        ],
        images_upload_handler: (blobInfo) => new Promise((resolve) => {
          // For now, return blob URL. Can be integrated with Supabase storage later
          resolve('data:' + blobInfo.blob().type + ';base64,' + blobInfo.base64());
        }),
        setup: (editor) => {
          editor.on('init', () => {
            this.$emit('update:modelValue', this.editorContent);
          });
        }
      }
    };
  },
  watch: {
    modelValue(newValue) {
      if (newValue !== this.editorContent) {
        this.editorContent = newValue;
      }
    }
  },
  methods: {
    updateContent() {
      this.$emit('update:modelValue', this.editorContent);
    }
  }
};
</script>

<style scoped>
.rich-text-editor {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
}

.rich-text-editor :deep(.tox-tinymce) {
  border-radius: 8px !important;
  border: 1px solid #e5e7eb !important;
}

.rich-text-editor :deep(.tox-editor-header) {
  border-bottom: 1px solid #e5e7eb !important;
}

.rich-text-editor :deep(.tox-statusbar) {
  border-top: 1px solid #e5e7eb !important;
}

/* Custom orange theme for toolbar icons on hover */
.rich-text-editor :deep(.tox .tox-tbtn:hover) {
  background-color: #fff7ed !important;
}

.rich-text-editor :deep(.tox .tox-tbtn--enabled) {
  background-color: #ffedd5 !important;
}

.rich-text-editor :deep(.tox .tox-tbtn--enabled svg) {
  color: #f97316 !important;
}

/* Active toolbar button */
.rich-text-editor :deep(.tox .tox-tbtn:active) {
  background-color: #fed7aa !important;
}

/* Dropdown menu hover */
.rich-text-editor :deep(.tox .tox-collection__item--active) {
  background-color: #fff7ed !important;
}

/* Button focus */
.rich-text-editor :deep(.tox .tox-tbtn:focus) {
  background-color: #ffedd5 !important;
}
</style>
