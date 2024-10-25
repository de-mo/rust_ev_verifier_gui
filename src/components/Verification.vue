<script setup>
const props = defineProps({
    verification: {
        type: Object,
    },
    result: {
        type: Object,
    },
})
</script>

<template>
    <li class="list-group-item container">
        <div class="row">
            <div class="col-1">{{ verification.id }}</div>
            <div class="col-2">{{ verification.category }}</div>
            <div class="col-7">{{ verification.name }}</div>
            <div class="col">{{ result.status }}</div>
        </div>
    </li>
</template>