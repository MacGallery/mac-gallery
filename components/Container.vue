<script>
export default {
    props: {
        constrained: String,
        padding: String,
        base: String,
        fluid: Boolean,

        image: String,
        textClass: String,

        title: String,
        subTitle: String,
    },
    setup(props) {
        const base = "mx-auto";
        const padding = "px-4 sm:px-6 lg:px-8 pb-12"
        const constrained = "max-w-7xl";

        const wrapperClass = `${base} ${props.fluid ? '' : padding} ${props.fluid ? '' : (props.constrained ?? constrained)}`

        return {
            wrapperClass
        }
    }
}
</script>

<template>
    <div :class="wrapperClass">
        <div class="relative" v-if="image">
            <NuxtImg :src="image" class="object-cover w-full h-full  max-h-96" />
            <div class="absolute left-0 top-0 w-full h-full flex justify-center items-center flex-col bg-black/50"
                :class="textClass">
                <h2 v-if="title" class="text-xl font-bold uppercase">{{ title }}</h2>
                <h5 v-if="subTitle" class="text-sm uppercase">{{ subTitle }}</h5>
            </div>
        </div>
        <div class="flex flex-col text-center py-12" v-else-if="title">
            <h2 v-if="title" class="text-xl font-bold uppercase">{{ title }}</h2>
            <h5 v-if="subTitle" class="text-sm uppercase">{{ subTitle }}</h5>
        </div>
        <slot />
    </div>
</template>