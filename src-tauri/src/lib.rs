pub mod app_state;
mod client;

use std::sync::Mutex;

use anyhow::{anyhow, Context};
use app_state::{AppData, AppDataMutex};
use tauri::Manager;

fn get_backend_port() -> String {
    match dotenvy::var("APP_PORT") {
        Ok(s) => s,
        Err(e) => panic!("Problem getting port from .env: {}", e),
    }
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    match dotenvy::dotenv() {
        Ok(_) => (),
        Err(e) => panic!("Error reading .env file: {e}"),
    };

    tauri::Builder::default()
        .manage(AppDataMutex::default())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
            let _ = app
                .get_webview_window("main")
                .expect("no main window")
                .set_focus();
        }))
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            client::get_health_check,
            client::get_status,
            client::post_init,
            client::post_reset
        ])
        .setup(|app| {
            start_backend();
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn start_backend() {
    use std::{os::windows::process::CommandExt, process::Command};

    const CREATE_NEW_CONSOLE: u32 = 0x00000010;

    let mut command = Command::new("cmd");
    command.current_dir("..");
    command.args(&["/C", "start", "rust_ev_verifier_gui_backend.exe"]);
    command.creation_flags(CREATE_NEW_CONSOLE);
    tauri::async_runtime::spawn(async move {
        let _ = command.output().expect("error while running the server");
    });
    println!("tauri::async_runtime::spawn() done");
}
