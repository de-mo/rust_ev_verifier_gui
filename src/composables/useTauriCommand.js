import { invoke } from '@tauri-apps/api/core';
import {
    TAURI_COMMAND_HEALTH_CHECK,
    TAURI_COMMAND_STATUS,
    TAURI_COMMAND_INIT,
    TAURI_COMMAND_RESET,
    TAURI_COMMAND_CONTEXT_DATASET,
    TAURI_COMMAND_PERIOD_DATASET,
    TAURI_COMMAND_EXTRACT,
    TAURI_COMMAND_RUN
} from "../consts/tauri.js"

export function useTauriCommand() {
    const tauriHealthCheck = async () => {
        console.log("healthCheck")
        return new Promise((resolve, reject) => {
            invoke(TAURI_COMMAND_HEALTH_CHECK)
                .then((response) => {
                    console.log("Healthcheck response", response);
                    resolve()
                })
                .catch((error) => {
                    console.log("Healthcheck error", error);
                    reject(error)
                })
        })
    }

    const tauriStatus = async () => {
        console.log("status")
        return new Promise((resolve, reject) => {
            invoke(TAURI_COMMAND_STATUS)
                .then((response) => resolve())
                .catch((error) => {
                    console.log("status error", error)
                    reject(error)
                })
        })
    }

    const tauriInit = async (period) => {
        console.log("init", period)
        return new Promise((resolve, reject) => {
            invoke(TAURI_COMMAND_INIT, { period: period })
                .then((response) => resolve())
                .catch((error) => {
                    console.log("init error", error)
                    reject(error)
                })
        })
    }

    const tauriReset = async () => {
        console.log("reset")
        return new Promise((resolve, reject) => {
            invoke(TAURI_COMMAND_RESET)
                .then((response) => resolve())
                .catch((error) => {
                    console.log("reset error", error)
                    reject(error)
                })
        })
    }

    const tauriContextDataset = async (path) => {
        console.log("context_dataset", path)
        return new Promise((resolve, reject) => {
            invoke(TAURI_COMMAND_CONTEXT_DATASET, { path: path })
                .then((response) => resolve())
                .catch((error) => {
                    console.log("context_dataset error", error)
                    reject(error)
                })
        })
    }

    const tauriPeriodDataset = async (path) => {
        console.log("period_dataset", path)
        return new Promise((resolve, reject) => {
            invoke(TAURI_COMMAND_PERIOD_DATASET, { path: path })
                .then((response) => resolve())
                .catch((error) => {
                    console.log("period_dataset error", error)
                    reject(error)
                })
        })
    }

    const tauriExtract = async () => {
        console.log("extract")
        return new Promise((resolve, reject) => {
            invoke(TAURI_COMMAND_EXTRACT)
                .then((response) => resolve())
                .catch((error) => {
                    console.log("extract error", error)
                    reject(error)
                })
        })
    }

    const tauriRun = async () => {
        console.log("run")
        return new Promise((resolve, reject) => {
            invoke(TAURI_COMMAND_RUN)
                .then((response) => resolve())
                .catch((error) => {
                    console.log("extract error", error)
                    reject(error)
                })
        })
    }

    return {
        tauriHealthCheck,
        tauriStatus,
        tauriInit,
        tauriReset,
        tauriContextDataset,
        tauriPeriodDataset,
        tauriExtract,
        tauriRun
    }
}