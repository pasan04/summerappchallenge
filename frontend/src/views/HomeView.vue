<!-- eslint-disable-next-line vue/multi-word-component-names -->
<template>
    <div class="rvt-layout">
        <HeaderComponent/>
        <main id="main-content" class="rvt-layout__wrapper rvt-layout__wrapper--single rvt-container-sm">
            <div class="rvt-layout__content">
                <div class="rvt-empty-state">
                    <div class="rvt-empty-state__content">
                        <p>Enter your page content here.<br>This layout supports all built-in Rivet components and utility classes.</p>
                    </div>
                    <div class="rvt-empty-state__actions">
                        <a href="https://rivet.iu.edu/components/" class="rvt-button">See Rivet components</a>
                    </div>
                </div>
            </div>
        </main>
        <FooterComponent/>
    </div>
</template>

<script>
import HeaderComponent from "@/components/Header.vue";
import FooterComponent from "@/components/Footer.vue";

export default {
    name: 'PageLayout',
    components: {FooterComponent, HeaderComponent},
    props: {
        msg: String
    }
}

</script>