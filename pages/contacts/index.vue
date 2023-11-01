<template>
    <container image="https://picsum.photos/1200/900" fluid title="Contacts" subTitle="Our contacts" textClass="" />

    <container class="mt-12 justify-center">
        <div class="flex flex-col w-fit gap-10 mx-auto">
            <el-text size="large" type="info" class="grayscale hover:grayscale-0 cursor-pointer">
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
            </el-text>
        </div>
    </container>
    <container title="Location" fluid>
        <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.898000604199!2d106.75171997573345!3d-6.407139562664123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69ef5e9a65cdf1%3A0xdb48a10467eeae74!2sDelissdin%20Green%20Residence!5e0!3m2!1sen!2sid!4v1698639159249!5m2!1sen!2sid"
            width="100%" height="450" style="border:0;" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
    </container>
</template>