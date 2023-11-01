<template>
    <div class="">
        {{ console.log($route) }}
    </div>
</template>

<script>
export default {
    mounted() {
        console.log(this.$route);
    }
}
</script>