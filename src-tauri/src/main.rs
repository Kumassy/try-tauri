#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use tauri::Manager;
use serde::{Serialize, Deserialize};

#[tauri::command]
fn command_sync() -> String {
  "command_sync invoked".to_string()
}

#[tauri::command]
async fn command_async() -> String {
  "command_async invoked".to_string()
}

// the payload type must implement `Serialize`.
// for global events, it also must implement `Clone`.
#[derive(Clone, Debug, Serialize, Deserialize)]
struct Payload {
  message: String,
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![command_sync, command_async])
    .setup(|app| {
      let handle_rx = app.handle();
      let handle_tx = app.handle();

      let id = handle_rx.listen_global("js2rust_message", move |event| {
        let payload = event.payload().map(|str| serde_json::from_str::<Payload>(str));

        if let Some(Ok(payload)) = payload {
          println!("got js2rust_message {:?}", payload);
          handle_tx.emit_all("rust2js_message", Payload { message: "Sending message from rust".into() }).unwrap();
        } else {
          println!("some error {:?}", payload);
        }
      });
      // unlisten to the event using the `id` returned on the `listen_global` function
      // an `once_global` API is also exposed on the `App` struct
      // app.unlisten(id);
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
