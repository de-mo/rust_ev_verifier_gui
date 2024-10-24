<script setup>
import { APP_DATA_PROP_STATUS, APP_DATA_PROP_PERIOD } from "../consts/appDataProperties.js"

const props = defineProps({
    appData: {
        type: Object,
        Required: true
    }
})
</script>

<template>
    <ul class="list-unstyled">
        <li class="fst-italic fw-light">App Status: {{ appData[APP_DATA_PROP_STATUS] }}</li>
        <li class="fst-italic fw-light">period: {{ appData[APP_DATA_PROP_PERIOD] }}</li>
    </ul>
</template>