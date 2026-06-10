// ./types/tinymce.d.ts
import type { Editor } from 'tinymce';

declare global {
  interface Window {
    tinymce?: {
      activeEditor: Editor;
      // You can add other global tinymce properties here if you need them
    };
  }
}
