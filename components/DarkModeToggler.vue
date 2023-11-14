<script>
import { UseDark } from '@vueuse/components';

export default {
    components: { UseDark },
}
</script>

<template>
    <ClientOnly>
        <UseDark v-slot="{ isDark, toggleDark }">
            <el-button @click="toggleDark()" link class="!h-full ">
                <Icon v-if="isDark" size="24" name="line-md:sunny-filled-loop-to-moon-filled-loop-transition" />
                <Icon v-else size="24" name="line-md:moon-filled-to-sunny-filled-loop-transition" />
            </el-button>
        </UseDark>
    </ClientOnly>
</template>