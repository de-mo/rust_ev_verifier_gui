<script setup>
import { ref } from 'vue';
import { ask } from '@tauri-apps/plugin-dialog';
import { useTauriCommand } from '../composables/useTauriCommand.js'

const isLoading = ref(false)

const { tauriReset } = useTauriCommand()

const reset = async () => {
    const ok = await ask('All the steps will be reverted. Are you sure?', {
        title: 'Reset',
        kind: 'warning',
    });
    if (ok) {
        isLoading.value = true
        tauriReset().then(() => isLoading.value = false)
    }
}
</script>

<template>
    <button type="submit" class="btn btn-danger" @click="reset">Reset</button>
</template>