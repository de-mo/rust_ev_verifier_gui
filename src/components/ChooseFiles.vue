<script setup>
import ChooseOneFileVue from './ChooseOneFile.vue';
import { computed, ref } from 'vue';
import { PERIOD_SETUP, PERIOD_TALLY } from '../consts/period.js'
import { useTauriCommand } from '../composables/useTauriCommand'

const props = defineProps({
    period: {
        type: String,
        required: true
    },
    contextZipFile: {
        type: String,
    },
    periodZipFile: {
        type: String,
    }
})

const textPeriodFile = computed(() => {
    return `Dataset path for Period (${props.period})`
})

let contextFile = ref(null)
let periodFile = ref(null)

const isLoading = ref(false)
</script>

<template>
    <ChooseOneFileVue v-model="contextFile" :zip-file="contextZipFile" form-id="formFileContext"
        text="Dataset path for Context" :disabled="false" />
    <ChooseOneFileVue v-model="periodFile" :zip-file="periodZipFile" form-id="formFilePeriod" :text="textPeriodFile"
        :disabled="false" />
    <button type="button" class="btn btn-primary" :disabled="!(contextFile && periodFile)">Extract</button>
</template>