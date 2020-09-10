<template>
  <ul>
    <li v-for="todo in todos">
      {{ todo.text }}
    </li>
  </ul>
</template>

<script>
export default {
  data: {
    foo: 'bar',
  },
  methods: {
    bar() {
      return this.shit == 0
    },
  },
}
</script>
