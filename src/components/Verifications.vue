<script setup>
import { computed } from 'vue';
import VerificationVue from './Verification.vue';

const props = defineProps({
    verificationList: {
        type: Array,
    },
    verificationResult: {
        type: Object,
    },
    isRunning: {
        type: Boolean,
        required: true
    },
    isFinished: {
        type: Boolean,
        required: true
    },
    error: {
        type: String,
    }
})

const emit = defineEmits(['run'])

const hideAction = computed(() => {
    return props.isRunning || props.isFinished || props.error
})

const verificationRes = computed(() => (id) => {
    return props.verificationResult[id]
})

let onClick = async () => {
    emit('run')
}

</script>

<template>
    <button v-if="!hideAction" type="button" class="btn btn-primary" @click="onClick">Run Verifications</button>
    <button v-if="isRunning" class="btn btn-primary" type="button" disabled>
        <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
        <span role="status">Verifications running...</span>
    </button>
    <div v-if="isFinished" class="alert alert-success" role="alert">
        Verifications finished
    </div>
    <div v-if="error" class="alert alert-danger" role="alert">
        Error: {{ error }}
    </div>
    <ul v-if="hideAction" class="list-group">
        <VerificationVue v-for="verif in verificationList" :verification="verif"
            :result="verificationResult[verif.id]" />
    </ul>
</template>