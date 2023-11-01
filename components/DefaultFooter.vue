<template>
    <el-footer class="p-0 w-full">
        <el-divider class="m-0 mt-4" />
        <div class="px-2 py-6 mx-auto max-w-5xl lg:px-0 overflow-hidden">
            <div class="flex flex-col justify-between lg:flex-row">
                <a href="https://element-plus.org/en-US/" target="_blank" class="mb-10 lg:mb-0">
                    <!-- <img src="https://element-plus.org/images/element-plus-logo.svg" alt="Element Plus" class="block"
                        width="120" height="28" /> -->
                    MacGallery
                </a>
                <div>
                    <div class="grid grid-cols-1  place-content-end">
                        <div class="flex flex-col gap-3">
                            <el-text class="!self-start">Contacts</el-text>
                            <a href="#" class="flex items-center ">
                                <el-text size="large" type="info" class="grayscale hover:grayscale-0 cursor-pointer">
                                    <Icon name="logos:google-gmail" />
                                    mail@mail.com
                                </el-text>
                            </a>
                            <a href="#" class="flex items-center">
                                <el-text size="large" type="info" class="grayscale hover:grayscale-0 cursor-pointer">
                                    <Icon name="logos:google-maps" />
                                    Location
                                </el-text>
                            </a>
                            <a href="#" class="flex items-center">
                                <el-text size="large" type="info" class="grayscale hover:grayscale-0 cursor-pointer">
                                    <Icon name="logos:whatsapp-icon" />
                                    080213231
                                </el-text>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </el-footer>
    <!-- <el-text size="large" type="info" class="grayscale hover:grayscale-0 cursor-pointer">
        <Icon name="logos:google-gmail" size="30" />
        mail@mail.com
    </el-text>
    <el-text size="large" type="info" class="grayscale hover:grayscale-0 cursor-pointer">
        <Icon name="logos:google-maps" size="30" />
        Location
    </el-text>
    <el-text size="large" type="info" class="grayscale hover:grayscale-0 cursor-pointer">
        <Icon name="logos:whatsapp-icon" size="30" />
        080213231
    </el-text> -->
</template>