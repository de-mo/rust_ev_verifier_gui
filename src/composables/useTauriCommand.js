import { invoke } from '@tauri-apps/api/core';
import {
    TAURI_COMMAND_HEALTH_CHECK,
    TAURI_COMMAND_STATUS,
    TAURI_COMMAND_INIT,
    TAURI_COMMAND_RESET
} from "../consts/tauri.js"

export function useTauriCommand() {
    const tauri_healthCheck = async () => {
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

    const tauri_status = async () => {
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

    const tauri_init = async (period) => {
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

    const tauri_reset = async () => {
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

    return { tauri_healthCheck, tauri_status, tauri_init, tauri_reset }
}