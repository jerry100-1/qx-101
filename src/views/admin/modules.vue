<template>
  <iframe width="100%" height="100%" class="position-absolute border-0" :src="'http://test.admingx.meite.com/data/modules' + $route.fullPath" :key="'http://test.admingx.meite.com/data/modules' + $route.path"></iframe>
</template>

<script>
export default {
  name: 'modules'
}
</script>
