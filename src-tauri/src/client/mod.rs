mod request;
mod response;

use crate::{
    app_state::{AppData, AppDataMutex, VerificationPeriod},
    get_backend_port,
};
use anyhow::{anyhow, Context};
use anyhow_tauri::IntoTAResult;
pub use response::StatusResponse;
use std::{collections::HashMap, path::PathBuf, str::FromStr};
use tauri::{AppHandle, State};
use tauri_plugin_http::reqwest;

const HOST: &str = "127.0.0.1";

pub fn uri(path: &str) -> String {
    format!("http://{}:{}/{}", HOST, get_backend_port(), path)
}

async fn handle_response_with_state(
    response: reqwest::Response,
    app: &AppHandle,
    state: State<'_, AppDataMutex>,
) -> Result<(), String> {
    let st = response
        .json::<StatusResponse>()
        .await
        .map_err(|e| e.to_string())?;
    state.update_with_status_response(st);
    state
        .emit_update_appdata_to_frontend(&app)
        .map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub async fn get_health_check() -> Result<String, String> {
    let res = reqwest::get(uri(""))
        .await
        .context("get root")
        .map_err(|e| e.to_string())?;
    match res.error_for_status() {
        Ok(r) => Ok(r.text().await.unwrap()),
        Err(e) => Err(format!("Error get root; {}", e)),
    }
}

#[tauri::command]
pub async fn get_status(app: AppHandle, state: State<'_, AppDataMutex>) -> Result<(), String> {
    let res = reqwest::get(uri("status"))
        .await
        .map_err(|e| e.to_string())?;
    match res.error_for_status() {
        Ok(r) => handle_response_with_state(r, &app, state).await,
        Err(e) => Err(format!("Error getting status; {}", e)),
    }
}

#[tauri::command(rename_all = "snake_case")]
pub async fn post_init(
    app: AppHandle,
    state: State<'_, AppDataMutex>,
    period: String,
) -> Result<(), String> {
    let mut body = HashMap::new();
    body.insert("period", period.clone());

    let client = reqwest::Client::new();
    let res = client
        .post(uri("init"))
        .json(&body)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    match res.error_for_status() {
        Ok(r) => handle_response_with_state(r, &app, state).await,
        Err(e) => Err(format!("Error posting init; {}", e)),
    }
}

#[tauri::command]
pub async fn post_reset(app: AppHandle, state: State<'_, AppDataMutex>) -> Result<(), String> {
    let client = reqwest::Client::new();
    let res = client
        .post(uri("reset"))
        .send()
        .await
        .map_err(|e| e.to_string())?;

    match res.error_for_status() {
        Ok(r) => handle_response_with_state(r, &app, state).await,
        Err(e) => Err(format!("Error posting reset; {}", e)),
    }
}

async fn post_dataset(
    app: &AppHandle,
    state: State<'_, AppDataMutex>,
    path: PathBuf,
    uri_path: &str,
) -> Result<(), String> {
    let mut body = HashMap::new();
    body.insert("path", path.clone());

    let client = reqwest::Client::new();
    let res = client
        .post(uri(uri_path))
        .json(&body)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    match res.error_for_status() {
        Ok(r) => handle_response_with_state(r, &app, state).await,
        Err(e) => Err(format!("Error posting reset; {}", e)),
    }
}

#[tauri::command(rename_all = "snake_case")]
pub async fn post_context_dataset(
    app: AppHandle,
    state: State<'_, AppDataMutex>,
    path: PathBuf,
) -> Result<(), String> {
    post_dataset(&app, state, path, "context-dataset").await
}

#[tauri::command(rename_all = "snake_case")]
pub async fn post_period_dataset(
    app: AppHandle,
    state: State<'_, AppDataMutex>,
    path: PathBuf,
) -> Result<(), String> {
    post_dataset(&app, state, path, "period-dataset").await
}

#[tauri::command]
pub async fn post_extract(app: AppHandle, state: State<'_, AppDataMutex>) -> Result<(), String> {
    let client = reqwest::Client::new();
    let res = client
        .post(uri("extract"))
        .send()
        .await
        .map_err(|e| e.to_string())?;

    match res.error_for_status() {
        Ok(r) => handle_response_with_state(r, &app, state).await,
        Err(e) => Err(format!("Error posting extract; {}", e)),
    }
}

#[tauri::command]
pub async fn post_run(app: AppHandle, state: State<'_, AppDataMutex>) -> Result<(), String> {
    let client = reqwest::Client::new();
    let res = client
        .post(uri("run"))
        .send()
        .await
        .map_err(|e| e.to_string())?;

    match res.error_for_status() {
        Ok(r) => handle_response_with_state(r, &app, state).await,
        Err(e) => Err(format!("Error running verification; {}", e)),
    }
}
