<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="less">
html, body {
  height: 100vh;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 14px;
  .table-responsive {
    margin-bottom: 1rem;
    .table {
      margin-bottom: 0;
    }
  }
}
label {
  margin-bottom: 0;
}
.el-date-table th {
  text-align: center;
}
.fixed-top {
  z-index: 2100;
}
.swal2-container {
  z-index: 10000 !important;
}
.cke_screen_reader_only {
  height: 0 !important;
}
</style>
