<template>
  <div class="about">
    <h1>This is an about2 page, timestamp: {{Date.now()}}</h1>
  </div>
</template>

<script>
export default {
  name: 'about2',
  created () {
    console.log('create about2')
  }
}
</script>
