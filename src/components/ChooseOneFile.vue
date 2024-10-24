<script setup>
import { computed } from 'vue';
import { open } from '@tauri-apps/plugin-dialog';

const props = defineProps({
    modelValue: {
        type: String,
    },
    zipFile: {
        type: String,
    },
    formId: {
        type: String,
        Required: true
    },
    text: {
        type: String,
        Required: true
    },
    disabled: {
        type: Boolean,
        default: true
    },
})

const emit = defineEmits(['update:modelValue'])

const onClick = (async () => {
    const file = await open({
        multiple: false,
        directory: false,
        extensions: ['zip']
    });
    if (file) {
        emit('update:modelValue', file)
    }
})
</script>

<template>
    <div class="row mb-3 align-items-center">
        <label :for="formId" class="col-sm-3 col-form-label">{{ text }}</label>
        <div class="col-sm-9">
            <div class="input-group">
                <button v-if="!zipFile" class="btn btn-outline-secondary" type="button" @click="onClick">Choose</button>
                <input type="text" class="form-control" :value="modelValue" readonly>
            </div>
        </div>
    </div>
</template>