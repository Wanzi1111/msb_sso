<template>
  <div>
    <basics-title v-bind="$attrs">
      <slot name="note" />
    </basics-title>
    <slot />
  </div>
</template>

<script>
import BasicsTitle from '../BasicsTitle'

export default {
  name: 'BasicsBlock',
  components: { BasicsTitle }
}
</script>
