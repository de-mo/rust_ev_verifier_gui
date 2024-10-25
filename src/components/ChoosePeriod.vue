<script setup>
import { computed, ref } from 'vue';
import { PERIOD_SETUP, PERIOD_TALLY } from '../consts/period.js'
import { useTauriCommand } from '../composables/useTauriCommand'

const props = defineProps({
    period: {
        type: String,
    }
})

const is_period_defined = computed(() => {
    if (props.period) {
        return true
    } else {
        return false
    }
})

const is_setup = computed(() => {
    return props.period == PERIOD_SETUP
})

const is_tally = computed(() => {
    return props.period == PERIOD_TALLY
})

const selectedValue = ref(null)
const isLoading = ref(false)

const { tauriInit } = useTauriCommand()

const choose_period = () => {
    isLoading.value = true
    tauriInit(selectedValue.value).then(() => isLoading.value = false)
}
</script>

<template>
    <div v-if="is_period_defined" class="row align-items-center">
        <div class="col-auto">
            period chosen:
        </div>
        <div class="col-auto">
            <button type="button" class="btn btn-secondary" disabled>{{ period }}</button>
        </div>
    </div>
    <div v-else class="row align-items-center">
        <div class="col-auto">
            Choose the period:
        </div>
        <div class="col-auto">
            <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlinePeriodOptions" id="inlinePerdio1"
                    :value="PERIOD_SETUP" v-model="selectedValue" :disabled="isLoading">
                <label class="form-check-label" for="inlinePerdio1">Setup</label>
            </div>
            <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlinePeriodOptions" id="inlinePerdio2"
                    :value="PERIOD_TALLY" v-model="selectedValue" :disabled="isLoading">
                <label class="form-check-label" for="inlinePerdio2">Tally</label>
            </div>
        </div>
        <div class="col-auto">
            <button type="submit" class="btn btn-primary" :disabled="selectedValue == null || isLoading"
                @click="choose_period">Choose</button>
        </div>
    </div>
</template>