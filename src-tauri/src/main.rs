#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use tauri::Manager;
use serde::{Serialize, Deserialize};

#[tauri::command]
fn my_command_sync() -> u32 {
  1
}

#[tauri::command]
async fn my_command_async() -> u32 {
  10
}

// the payload type must implement `Serialize`.
// for global events, it also must implement `Clone`.
#[derive(Clone, Debug, Serialize, Deserialize)]
struct Payload {
  message: String,
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![my_command_sync, my_command_async])
    .setup(|app| {
      // listen to the `event-name` (emitted on any window)
      let handle = app.handle();
      let handle2 = app.handle();

      let id = handle.listen_global("click_bar", move |event| {
        let payload = event.payload().map(|str| serde_json::from_str::<Payload>(str));

        if let Some(Ok(payload)) = payload {
          println!("got event-name with payload {:?}", payload);

          // emit the `event-name` event to all webview windows on the frontend
          handle2.emit_all("click_foo", Payload { message: "Tauri is awesome!".into() }).unwrap();
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
