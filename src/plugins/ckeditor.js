// The editor creator to use.
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor'
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials'
import UploadAdapter from '@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter'
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat'
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold'
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic'
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline'
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough'
import Code from '@ckeditor/ckeditor5-basic-styles/src/code'
import Font from '@ckeditor/ckeditor5-font/src/font'
// import FontFamily from '@ckeditor/ckeditor5-font/src/fontfamily';
import Highlight from '@ckeditor/ckeditor5-highlight/src/highlight'
import Table from '@ckeditor/ckeditor5-table/src/table'
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar'
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote'
import EasyImage from '@ckeditor/ckeditor5-easy-image/src/easyimage'
import Heading from '@ckeditor/ckeditor5-heading/src/heading'
import Image from '@ckeditor/ckeditor5-image/src/image'
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption'
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle'
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar'
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload'
import Link from '@ckeditor/ckeditor5-link/src/link'
import List from '@ckeditor/ckeditor5-list/src/list'
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph'
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment'

// export default class ClassicEditor extends ClassicEditorBase {}

// Plugins to include in the build.
ClassicEditor.builtinPlugins = [
  Essentials,
  UploadAdapter,
  Autoformat,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Font,
  Highlight,
  Table,
  TableToolbar,
  BlockQuote,
  EasyImage,
  Heading,
  Image,
  ImageCaption,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  Link,
  List,
  Paragraph,
  Alignment
]

// Editor configuration.
ClassicEditor.defaultConfig = {
  toolbar: {
    items: [
      'heading',
      '|',
      'fontSize', 'fontFamily',
      'highlight',
      'alignment',
      'bold', 'italic', 'underline', 'strikethrough', 'code',
      'insertTable',
      'link',
      'bulletedList',
      'numberedList',
      'imageUpload',
      'blockQuote',
      'undo',
      'redo'
    ]
  },
  table: {
    toolbar: [ 'tableColumn', 'tableRow', 'mergeTableCells' ]
  },
  highlight: {
    options: [
      { model: 'yellowMarker', class: 'marker-yellow', title: 'Yellow Marker', color: 'var(--ck-highlight-marker-yellow)', type: 'marker' },
      { model: 'greenMarker', class: 'marker-green', title: 'Green marker', color: 'var(--ck-highlight-marker-green)', type: 'marker' },
      { model: 'pinkMarker', class: 'marker-pink', title: 'Pink marker', color: 'var(--ck-highlight-marker-pink)', type: 'marker' },
      { model: 'blueMarker', class: 'marker-blue', title: 'Blue marker', color: 'var(--ck-highlight-marker-blue)', type: 'marker' },
      { model: 'redPen', class: 'pen-red', title: 'Red pen', color: 'var(--ck-highlight-pen-red)', type: 'pen' },
      { model: 'greenPen', class: 'pen-green', title: 'Green pen', color: 'var(--ck-highlight-pen-green)', type: 'pen' }
      // {
      //     model: 'whiteMarker',
      //     class: '',
      //     title: '白色背景',
      //     color: 'rgb(255,255,255)',
      //     type: 'marker'
      // },
      // {
      //     model: 'redPen1',
      //     class: 'pen-red',
      //     title: 'Red pen',
      //     color: 'var(--ck-highlight-pen-red)',
      //     type: 'pen'
      // },
      // {
      //     model: 'greenMarker11',
      //     class: 'marker-green',
      //     title: 'Green marker',
      //     color: 'rgb(25, 156, 25)',
      //     type: 'marker'
      // },
      // {
      //     model: 'yellowMarker1',
      //     class: 'marker-yellow',
      //     title: 'Yellow marker',
      //     color: '#cac407',
      //     type: 'marker'
      // },
      // {
      //     model: 'redPen11',
      //     class: 'pen-red',
      //     title: 'Red pen',
      //     color: 'hsl(343, 82%, 58%)',
      //     type: 'pen'
      // }
    ]
  },
  image: {
    toolbar: [
      'imageStyle:full',
      'imageStyle:side',
      '|',
      'imageTextAlternative'
    ]
  },
  // This value must be kept in sync with the language defined in webpack.config.js.
  language: 'zh-cn'
}

export default ClassicEditor
