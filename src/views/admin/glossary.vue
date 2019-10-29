<template>
  <b-container fluid>
    <b-row>
      <b-form method="post" action="" enctype="multipart/form-data">
        <!-- <table class="table table-bordered table-striped" align="center">
          <tbody>
          <tr>
            <td colspan="3"><h5>{if $info['AlbumId']}编辑{else}添加{/if}专辑</h5></td>
          </tr>

          <tr>
            <td>管理员后台名词解释：</td>
            <td>
              <textarea rows="3" class="form-control" id="editor1"
                        name="admin_main_glossary">{$data['admin_main_glossary']}</textarea>
            </td>
          </tr>

          <tr>
            <td>合伙人后台名词解释：</td>
            <td>
              <textarea rows="3" class="form-control" id="editor2"
                        name="agent_main_glossary">{$data['agent_main_glossary']}</textarea>
            </td>
          </tr>

          <tr>
            <td colspan="2">
              <div id="div_btn" class="div_btn">
                <input type="submit" id="add_btn" class="btn btn-primary" value="保存"/>
                <input type="reset" class="btn btn-warning" value="重置"/>
              </div>
            </td>
          </tr>
          </tbody>
        </table> -->



        <div class="border mb-3">
          <h6 class="bg-light mb-0 p-2 border-bottom">
            <span v-if="albumId">编辑专辑</span>
            <span v-else>添加专辑</span>
          </h6>
          <b-container fluid>
            <b-row class="border-bottom">
              <b-col cols="12" md="3" class="px-2 pt-2">
                管理员后台名词解释：
              </b-col>
              <b-col cols="12" md="9" class="border-left p-2 border-collapse-left">
                <textarea ref="editor1" :value="content1"></textarea>
              </b-col>
            </b-row>
            <b-row class="border-bottom">
              <b-col cols="12" md="3" class="px-2 pt-2">
                合伙人后台名词解释：
              </b-col>
              <b-col cols="12" md="9" class="border-left p-2 border-collapse-left">
                <!-- <textarea rows="3" class="form-control" id="editor2" name="agent_main_glossary">{$data['agent_main_glossary']}</textarea> -->
                <textarea ref="editor2" v-model="content2"></textarea>
              </b-col>
            </b-row>
          </b-container>
          <div class="p-2 text-center">
            <b-button type="submit" variant="primary" class="mr-5">保存</b-button>
            <b-button type="reset" variant="warning" class="text-white">重置</b-button>
          </div>
        </div>


      </b-form>
    </b-row>
  </b-container>
</template>

<script>
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
// import Table from '@ckeditor/ckeditor5-table/src/table';
// import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';
// import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials'
// import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph'
// import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold'
// import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic'
// import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment'
// import ClassicEditor from '@/plugins/ckeditor'


// import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
// import EssentialsPlugin from '@ckeditor/ckeditor5-essentials/src/essentials';
// import UploadAdapterPlugin from '@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter';
// import AutoformatPlugin from '@ckeditor/ckeditor5-autoformat/src/autoformat';
// import BoldPlugin from '@ckeditor/ckeditor5-basic-styles/src/bold';
// import ItalicPlugin from '@ckeditor/ckeditor5-basic-styles/src/italic';
// import BlockQuotePlugin from '@ckeditor/ckeditor5-block-quote/src/blockquote';
// import EasyImagePlugin from '@ckeditor/ckeditor5-easy-image/src/easyimage';
// import HeadingPlugin from '@ckeditor/ckeditor5-heading/src/heading';
// import ImagePlugin from '@ckeditor/ckeditor5-image/src/image';
// import ImageCaptionPlugin from '@ckeditor/ckeditor5-image/src/imagecaption';
// import ImageStylePlugin from '@ckeditor/ckeditor5-image/src/imagestyle';
// import ImageToolbarPlugin from '@ckeditor/ckeditor5-image/src/imagetoolbar';
// import ImageUploadPlugin from '@ckeditor/ckeditor5-image/src/imageupload';
// import LinkPlugin from '@ckeditor/ckeditor5-link/src/link';
// import ListPlugin from '@ckeditor/ckeditor5-list/src/list';
// import ParagraphPlugin from '@ckeditor/ckeditor5-paragraph/src/paragraph';

// import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
// import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
// import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
// import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
// import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';

const CKEDITOR = window.CKEDITOR

export default {
  name: 'glossary',
  data () {
    return {
      albumId: null,
      content1: 'dadadad',
      content2: 'xxx',
    }
  },
  mounted () {
    // console.log(ClassicEditor)
    // console.log(document.querySelector( '#editor1' ))
    // ClassicEditor
    //   .create(document.querySelector('#editor1'))
    //   .then(editor => {
    //     console.log(editor)
    //   })
    //   .catch(error => {
    //     console.error(error)
    //   })
    // console.log(ClassicEditor)
    // console.log(Essentials)
    // console.log(Paragraph)
    // console.log(Bold)
    // console.log(Italic)
    // ClassicEditor
    // .create( document.querySelector( '#editor1' ), {
    //   language: 'zh-cn',
    //   plugins: [ Table, TableToolbar ],
    //   toolbar: ['insertTable' ],
    //   table: {
    //       toolbar: [ 'tableColumn', 'tableRow', 'mergeTableCells' ]
    //   }
    //     // plugins: [ Essentials, Paragraph, Bold, Italic ],
    //     // toolbar: [ 'bold', 'italic' ]
    // } )
    // .then( editor => {
    //     console.log( 'Editor was initialized', editor );
    // } )
    // .catch( error => {
    //     console.error( error.stack );
    // } );



    CKEDITOR.replace(this.$refs.editor1, {
      language: 'zh-cn',
      customConfig: '',
      height: '300px',
      // allowedContent: 'p[*];br',
      extraPlugins: 'justify,panelbutton,colorbutton,colordialog,font',
      image_previewText: ' ', // 预览区域显示内容
      removeDialogTabs: 'image:advanced;image:Link;',
      allowedContent: true,
      toolbar: [
        [
          'Source', 'Save', 'DocProps', 'Preview',
          '-', 'Templates', 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord',
          '-', 'Undo', 'Redo',
          '-', 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript',
          '-', 'RemoveFormat', 'NumberedList', 'BulletedList',
          '-', 'Outdent', 'Indent',
          '-', 'Blockquote', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock',
          '-', 'Link', 'Unlink', 'Anchor', 'Table', 'HorizontalRule', 'SpecialChar', 'Styles',
          'Format', 'Font', 'FontSize', 'TextColor', 'BGColor', 'Maximize', 'ShowBlocks'
        ]
      ]
    })

    CKEDITOR.replace(this.$refs.editor2, {
      language: 'zh-cn',
      customConfig: '',
      height: '300px',
      // allowedContent: 'p[*];br',
      extraPlugins: 'justify,panelbutton,colorbutton,colordialog,font',
      image_previewText: ' ', // 预览区域显示内容
      removeDialogTabs: 'image:advanced;image:Link;',
      allowedContent: true,
      toolbar: [
        [
          'Source', 'Save', 'DocProps', 'Preview',
          '-', 'Templates', 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord',
          '-', 'Undo', 'Redo',
          '-', 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript',
          '-', 'RemoveFormat', 'NumberedList', 'BulletedList',
          '-', 'Outdent', 'Indent',
          '-', 'Blockquote', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock',
          '-', 'Link', 'Unlink', 'Anchor', 'Table', 'HorizontalRule', 'SpecialChar', 'Styles',
          'Format', 'Font', 'FontSize', 'TextColor', 'BGColor', 'Maximize', 'ShowBlocks'
        ]
      ]
    })


   // ClassicEditor
   //  .create( document.querySelector( '#editor1'), {
   //      // The plugins are now passed directly to .create().
   //      plugins: [
   //          EssentialsPlugin,
   //          AutoformatPlugin,
   //          BoldPlugin,
   //          ItalicPlugin,
   //          BlockQuotePlugin,
   //          HeadingPlugin,
   //          ImagePlugin,
   //          ImageCaptionPlugin,
   //          ImageStylePlugin,
   //          ImageToolbarPlugin,
   //          LinkPlugin,
   //          ListPlugin,
   //          ParagraphPlugin
   //      ],

   //      // So is the rest of the default configuration.
   //      toolbar: [
   //          'heading',
   //          'bold',
   //          'italic',
   //          'link',
   //          'bulletedList',
   //          'numberedList',
   //          'imageUpload',
   //          'blockQuote',
   //          'undo',
   //          'redo'
   //      ],
   //      image: {
   //          toolbar: [
   //              'imageStyle:full',
   //              'imageStyle:side',
   //              '|',
   //              'imageTextAlternative'
   //          ]
   //      }
   //  } )
   //  .then( editor => {
   //      console.log( editor );
   //  } )
   //  .catch( error => {
   //      console.error( error );
   //  } );
  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
// .file-drop-zone {
//   min-height: 198px;
// }

// .file-thumbnail-footer {
//   display: none;
// }

// .audio .file-preview-frame {
//   height: 28px !important;
// }

// .audio .file-drop-zone {
//   min-height: 92px;
// }

// .div_btn {
//   text-align: center;
//   width: 100%;
// }

// .div_btn input {
//   width: 7%;
//   margin: auto 20px;
// }

.border-collapse-left {
  margin-left: -1px;
}
// .editor {
//   width: 500px;
//   height: 300px;
// }
</style>
