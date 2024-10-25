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
    },
    isExtracting: {
        type: Boolean,
        required: true
    },
    isExtracted: {
        type: Boolean,
        required: true
    },
    error: {
        type: String,
    },
    location: {
        type: String,
    }
})

const emit = defineEmits(['extract'])

const textPeriodFile = computed(() => {
    return `Dataset path for Period (${props.period})`
})

const hideExtractButton = computed(() => {
    return props.isExtracted || props.isExtracting || props.error
})

let contextFile = ref(null)
let periodFile = ref(null)

const isLoading = ref(false)

const { tauriContextDataset, tauriPeriodDataset } = useTauriCommand()

let onClick = async () => {
    isLoading.value = true
    await tauriContextDataset(contextFile.value);
    await tauriPeriodDataset(periodFile.value);
    isLoading.value = false
    emit('extract')
}
</script>

<template>
    <ChooseOneFileVue v-model="contextFile" :zip-file="contextZipFile" form-id="formFileContext"
        text="Dataset path for Context" :disabled="false" />
    <ChooseOneFileVue v-model="periodFile" :zip-file="periodZipFile" form-id="formFilePeriod" :text="textPeriodFile"
        :disabled="false" />
    <button v-if="!hideExtractButton" type="button" class="btn btn-primary" :disabled="!(contextFile && periodFile)"
        @click="onClick">Extract</button>
    <button v-if="isExtracting || isLoading" class="btn btn-primary" type="button" disabled>
        <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
        <span role="status">Extracting...</span>
    </button>
    <div v-if="isExtracted" class="alert alert-success" role="alert">
        The data sets are successfully extracted in {{ location }}
    </div>
    <div v-if="error" class="alert alert-danger" role="alert">
        Error: {{ error }}
    </div>
</template>