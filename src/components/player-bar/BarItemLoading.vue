<template>
  <span :class="[ 'bar-item', 'bar-item--disabled' ]">
    <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <g class="spinner"><circle cx="12" cy="12" r="9.5" fill="none" stroke-width="2"></circle></g>
    </svg>
  </span>
</template>

<script>
export default {
  name: 'bar-item-loading'
}
</script>

<style lang="scss">
.spinner {
  stroke: currentColor;
  transform-origin:center;
  animation:spinner_zKoa 2s linear infinite;

  circle {
    stroke-linecap:round;
    animation:spinner_YpZS 1.5s ease-in-out infinite;
  }
}
 @keyframes spinner_zKoa{
  100% {
    transform:rotate(360deg);
  }
}
@keyframes spinner_YpZS{
  0% {
    stroke-dasharray:0 150;
    stroke-dashoffset:0
  }
  47.5% {
    stroke-dasharray:42 150;
    stroke-dashoffset:-16
  }
  95%,100%{
    stroke-dasharray:42 150;
    stroke-dashoffset:-59
  }
}
 
</style>