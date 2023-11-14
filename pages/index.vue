<script>
export default {
    data() {
        return {
            activeAccordion: 0,
        }
    },
}
</script>

<template>
    <container fluid v-if="true">
        <Swiper :modules="[SwiperAutoplay, SwiperNavigation, SwiperPagination]" pagination navigation :slides-per-view="1"
            :loop="true" effect="fade" :autoplay="{
                delay: 8000,
                disableOnInteraction: true,
            }">
            <SwiperSlide v-for="slide in 10" :key="slide">
                <NuxtImg src="https://picsum.photos/1200/900" fit="cover" style="max-height: 450px;"
                    class="w-full h-full object-cover object-center" />
            </SwiperSlide>
        </Swiper>
    </container>

    <container title="Service Estimation" subTitle="Calculate your needs!">
        <service-estimation-2 />
    </container>

    <container title="About Us" subTitle="About our store">
        <about-us />
    </container>

    <container title="Costumer Review" subTitle="What peoples say about us?">
        <Swiper :modules="[SwiperEffectCards]" effect="cards" class="mt-10">
            <SwiperSlide v-for="(item, index) in 10" :key="index">
                <figure class="md:flex bg-slate-100 rounded-xl p-8 md:p-0 dark:bg-slate-800 relative overflow-hidden">
                    <img class="w-24 h-24 md:w-48 md:h-auto md:rounded-none rounded-full mx-auto"
                        src="https://picsum.photos/300" alt="" width="384" height="512">
                    <div class="pt-6 md:p-8 text-center md:text-left space-y-4">
                        <blockquote>
                            <p class="text-lg font-medium">
                                “Tailwind CSS is the only framework that I've seen scale
                                on large teams. It’s easy to customize, adapts to any design,
                                and the build size is tiny.”
                            </p>
                        </blockquote>
                        <figcaption class="font-medium">
                            <div class="text-sky-500 dark:text-sky-400">
                                Sarah Dayan
                            </div>
                            <div class="text-slate-700 dark:text-slate-500">
                                Staff Engineer, Algolia
                            </div>
                        </figcaption>
                    </div>
                </figure>
            </SwiperSlide>
        </Swiper>
    </container>

    <container title="Frequently Asked" subTitle="Frequently Asked">
        <div class="demo-collapse">
            <el-collapse v-model="activeAccordion" accordion>
                <el-collapse-item title="Consistency" name="1">
                    <div>
                        Consistent with real life: in line with the process and logic of real
                        life, and comply with languages and habits that the users are used to;
                    </div>
                    <div>
                        Consistent within interface: all elements should be consistent, such
                        as: design style, icons and texts, position of elements, etc.
                    </div>
                </el-collapse-item>
                <el-collapse-item title="Feedback" name="2">
                    <div>
                        Operation feedback: enable the users to clearly perceive their
                        operations by style updates and interactive effects;
                    </div>
                    <div>
                        Visual feedback: reflect current state by updating or rearranging
                        elements of the page.
                    </div>
                </el-collapse-item>
                <el-collapse-item title="Efficiency" name="3">
                    <div>
                        Simplify the process: keep operating process simple and intuitive;
                    </div>
                    <div>
                        Definite and clear: enunciate your intentions clearly so that the
                        users can quickly understand and make decisions;
                    </div>
                    <div>
                        Easy to identify: the interface should be straightforward, which helps
                        the users to identify and frees them from memorizing and recalling.
                    </div>
                </el-collapse-item>
                <el-collapse-item title="Controllability" name="4">
                    <div>
                        Decision making: giving advices about operations is acceptable, but do
                        not make decisions for the users;
                    </div>
                    <div>
                        Controlled consequences: users should be granted the freedom to
                        operate, including canceling, aborting or terminating current
                        operation.
                    </div>
                </el-collapse-item>
            </el-collapse>
        </div>
    </container>
</template>