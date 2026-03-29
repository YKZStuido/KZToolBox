#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use base64::engine::general_purpose::STANDARD as BASE64_STANDARD;
use base64::Engine;
use serde::Serialize;
use serde_json::{json, Value};
use std::fs;
#[cfg(windows)]
use std::os::windows::process::CommandExt;
use std::path::PathBuf;
use std::process::{Command, Stdio};
use std::time::{Duration, Instant};
use tauri::{AppHandle, Manager};

#[cfg(windows)]
const CREATE_NO_WINDOW: u32 = 0x08000000;

fn apply_windows_hidden_flags(command: &mut Command) {
    #[cfg(windows)]
    {
        command.creation_flags(CREATE_NO_WINDOW);
    }
}

fn run_cmd_with_timeout(program: &str, args: &[&str], timeout_ms: u64) -> Result<String, String> {
    let mut command = Command::new(program);
    command
        .args(args)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped());
    apply_windows_hidden_flags(&mut command);

    let mut child = command
        .spawn()
        .map_err(|error| format!("执行命令失败: {error}"))?;

    let start = Instant::now();
    loop {
        match child.try_wait() {
            Ok(Some(_)) => {
                let output = child
                    .wait_with_output()
                    .map_err(|error| format!("读取命令输出失败: {error}"))?;

                if output.status.success() {
                    return Ok(decode_bytes(&output.stdout));
                }

                let stderr = decode_bytes(&output.stderr);
                return Err(if stderr.trim().is_empty() {
                    "命令执行失败".to_string()
                } else {
                    stderr
                });
            }
            Ok(None) => {
                if start.elapsed() >= Duration::from_millis(timeout_ms) {
                    let _ = child.kill();
                    let _ = child.wait();
                    return Err(format!("执行命令超时（>{timeout_ms}ms）"));
                }
                std::thread::sleep(Duration::from_millis(100));
            }
            Err(error) => {
                return Err(format!("等待命令结果失败: {error}"));
            }
        }
    }
}

fn decode_bytes(bytes: &[u8]) -> String {
    if bytes.is_empty() {
        return String::new();
    }

    if bytes.len() >= 2 && bytes[0] == 0xFF && bytes[1] == 0xFE {
        let mut words = Vec::new();
        let mut i = 2;
        while i + 1 < bytes.len() {
            words.push(u16::from_le_bytes([bytes[i], bytes[i + 1]]));
            i += 2;
        }
        return String::from_utf16_lossy(&words);
    }

    let zero_count = bytes.iter().filter(|b| **b == 0).count();
    if zero_count > bytes.len() / 4 {
        let mut words = Vec::new();
        let mut i = 0;
        while i + 1 < bytes.len() {
            words.push(u16::from_le_bytes([bytes[i], bytes[i + 1]]));
            i += 2;
        }
        return String::from_utf16_lossy(&words);
    }

    String::from_utf8_lossy(bytes).to_string()
}

fn run_powershell_text(script: &str) -> Result<String, String> {
    run_powershell_text_with_timeout(script, 120_000)
}

fn run_powershell_text_with_timeout(script: &str, timeout_ms: u64) -> Result<String, String> {
    let command = format!("[Console]::OutputEncoding=[System.Text.UTF8Encoding]::new(); {script}");
    run_cmd_with_timeout(
        "powershell",
        &[
            "-NoProfile",
            "-WindowStyle",
            "Hidden",
            "-ExecutionPolicy",
            "Bypass",
            "-Command",
            &command,
        ],
        timeout_ms,
    )
}

fn run_powershell_json(script: &str) -> Result<Value, String> {
    run_powershell_json_with_timeout(script, 120_000)
}

fn run_powershell_json_with_timeout(script: &str, timeout_ms: u64) -> Result<Value, String> {
    let text = run_powershell_text_with_timeout(script, timeout_ms)?;
    let trimmed = text.trim();
    if trimmed.is_empty() {
        return Ok(json!({}));
    }
    serde_json::from_str(trimmed).map_err(|error| format!("解析 PowerShell 输出失败: {error}"))
}

fn collect_msinfo_report() -> String {
    let temp_path: PathBuf = std::env::temp_dir().join("kztoolbox-msinfo-report.txt");
    let path_text = temp_path.to_string_lossy().to_string();

    let mut command = Command::new("msinfo32");
    command.args(["/report", &path_text]);
    apply_windows_hidden_flags(&mut command);

    let mut child = match command.spawn() {
        Ok(result) => result,
        Err(error) => {
            return format!("执行 msinfo32 失败: {error}");
        }
    };

    let start = Instant::now();
    loop {
        match child.try_wait() {
            Ok(Some(_)) => break,
            Ok(None) => {
                if start.elapsed() >= Duration::from_millis(120_000) {
                    let _ = child.kill();
                    let _ = child.wait();
                    let _ = fs::remove_file(&temp_path);
                    return "执行 msinfo32 超时（>120000ms）".to_string();
                }
                std::thread::sleep(Duration::from_millis(100));
            }
            Err(error) => {
                let _ = fs::remove_file(&temp_path);
                return format!("等待 msinfo32 结果失败: {error}");
            }
        }
    }

    let output = match child.wait_with_output() {
        Ok(result) => result,
        Err(error) => {
            let _ = fs::remove_file(&temp_path);
            return format!("读取 msinfo32 输出失败: {error}");
        }
    };

    if !output.status.success() {
        let stderr = decode_bytes(&output.stderr);
        let stdout = decode_bytes(&output.stdout);
        let detail = if !stderr.trim().is_empty() {
            stderr
        } else if !stdout.trim().is_empty() {
            stdout
        } else {
            "未知错误".to_string()
        };
        return format!("执行 msinfo32 失败: {detail}");
    }

    let bytes = fs::read(&temp_path);
    let content = match bytes {
        Ok(data) => decode_bytes(&data),
        Err(error) => format!("读取 msinfo32 报告失败: {error}"),
    };

    let _ = fs::remove_file(&temp_path);
    content
}

#[derive(Serialize)]
struct NotesReadResult {
    exists: bool,
    content: String,
}

#[tauri::command]
fn get_system_overview() -> Result<Value, String> {
    let systeminfo_text = run_powershell_text("systeminfo")
        .unwrap_or_else(|error| format!("systeminfo 获取失败: {error}"));

    let hardware_script = r#"
      $os = Get-CimInstance Win32_OperatingSystem | Select-Object Caption,Version,BuildNumber,OSArchitecture,CSName,LastBootUpTime,InstallDate,SerialNumber
      $computer = Get-CimInstance Win32_ComputerSystem | Select-Object Manufacturer,Model,SystemType,TotalPhysicalMemory,NumberOfProcessors,NumberOfLogicalProcessors,Domain,UserName
      $bios = Get-CimInstance Win32_BIOS | Select-Object Manufacturer,SMBIOSBIOSVersion,ReleaseDate,SerialNumber
      $baseboard = Get-CimInstance Win32_BaseBoard | Select-Object Manufacturer,Product,SerialNumber
      $cpu = Get-CimInstance Win32_Processor | Select-Object Name,Manufacturer,NumberOfCores,NumberOfLogicalProcessors,MaxClockSpeed,ProcessorId
      $memory = Get-CimInstance Win32_PhysicalMemory | Select-Object Manufacturer,PartNumber,Capacity,Speed,ConfiguredClockSpeed,SerialNumber
      $logicalDisk = Get-CimInstance Win32_LogicalDisk -Filter "DriveType=3" | Select-Object DeviceID,VolumeName,FileSystem,Size,FreeSpace
      $network = Get-CimInstance Win32_NetworkAdapterConfiguration -Filter "IPEnabled=True" | Select-Object Description,MACAddress,IPAddress,DefaultIPGateway,DNSServerSearchOrder
      $result = [PSCustomObject]@{
        os = $os
        computer = $computer
        bios = $bios
        baseboard = $baseboard
        cpu = $cpu
        memory = $memory
        logicalDisk = $logicalDisk
        network = $network
      }
      $result | ConvertTo-Json -Depth 8 -Compress
    "#;

    let hardware =
        run_powershell_json(hardware_script).unwrap_or_else(|error| json!({ "error": error }));
    let msinfo32_text = collect_msinfo_report();

    Ok(json!({
      "systeminfoText": systeminfo_text,
      "hardware": hardware,
      "msinfo32Text": msinfo32_text
    }))
}

#[tauri::command]
fn get_network_report() -> Result<Value, String> {
    let script = r#"
      $adapters = @()
      if (Get-Command Get-NetAdapter -ErrorAction SilentlyContinue) {
        $adapters = Get-NetAdapter | Select-Object Name, InterfaceDescription, Status, MacAddress, LinkSpeed, InterfaceIndex
      }

      $ipConfigurations = @()
      if (Get-Command Get-NetIPConfiguration -ErrorAction SilentlyContinue) {
        $ipConfigurations = Get-NetIPConfiguration | ForEach-Object {
          [PSCustomObject]@{
            InterfaceAlias = $_.InterfaceAlias
            IPv4Address = ($_.IPv4Address | ForEach-Object { $_.IPAddress }) -join ", "
            IPv6Address = ($_.IPv6Address | ForEach-Object { $_.IPAddress }) -join ", "
            DefaultGateway = ($_.IPv4DefaultGateway | ForEach-Object { $_.NextHop }) -join ", "
            DnsServer = ($_.DNSServer.ServerAddresses) -join ", "
          }
        }
      }

      $domesticSites = @(
        @{ label = "哔哩哔哩"; host = "www.bilibili.com" },
        @{ label = "百度"; host = "www.baidu.com" },
        @{ label = "Apple 中国"; host = "www.apple.com.cn" },
        @{ label = "微软"; host = "www.microsoft.com" }
      )

      $foreignSites = @(
        @{ label = "谷歌"; host = "www.google.com" },
        @{ label = "油管"; host = "www.youtube.com" },
        @{ label = "维基百科"; host = "www.wikipedia.org" },
        @{ label = "GitHub"; host = "github.com" }
      )

      function Resolve-HostAddress {
        param([string]$HostName)
        try {
          $addresses = [System.Net.Dns]::GetHostAddresses($HostName)
          if ($addresses -and $addresses.Count -gt 0) {
            return $addresses[0].IPAddressToString
          }
        } catch {
          return $null
        }
        return $null
      }

      function Test-Tcp443 {
        param(
          [string]$HostName,
          [int]$TimeoutMs = 1800
        )

        $client = New-Object System.Net.Sockets.TcpClient
        try {
          $async = $client.BeginConnect($HostName, 443, $null, $null)
          if (-not $async.AsyncWaitHandle.WaitOne($TimeoutMs, $false)) {
            return [PSCustomObject]@{ success = $false; remoteAddress = $null }
          }

          $client.EndConnect($async) | Out-Null
          $remoteAddress = $null
          if ($client.Client -and $client.Client.RemoteEndPoint) {
            $remoteAddress = $client.Client.RemoteEndPoint.Address.ToString()
          }

          return [PSCustomObject]@{ success = $true; remoteAddress = $remoteAddress }
        } catch {
          return [PSCustomObject]@{ success = $false; remoteAddress = $null }
        } finally {
          $client.Close()
        }
      }

      function Test-Site {
        param($site)

        $dnsAddress = Resolve-HostAddress -HostName $site.host
        $tcp = Test-Tcp443 -HostName $site.host -TimeoutMs 1800

        $pingSucceeded = $false
        $latency = $null
        $pingError = $null
        try {
          $ping = Test-Connection -ComputerName $site.host -Count 1 -TimeoutSeconds 1 -ErrorAction SilentlyContinue
          if ($ping) {
            $pingSucceeded = $true
            $latency = [int]$ping.ResponseTime
          }
        } catch {
          if ($_.Exception -and $_.Exception.Message) {
            $pingError = $_.Exception.Message
          } else {
            $pingError = "Ping 检测失败"
          }
        }


        [PSCustomObject]@{
          label = $site.label
          host = $site.host
          reachable = [bool]$tcp.success
          pingSucceeded = [bool]$pingSucceeded
          latencyMs = $latency
          pingError = $pingError
          remoteAddress = $tcp.remoteAddress
          dnsAddress = $dnsAddress
        }
      }

      $result = [PSCustomObject]@{
        adapters = $adapters
        ipConfigurations = $ipConfigurations
        domestic = @($domesticSites | ForEach-Object { Test-Site $_ })
        foreign = @($foreignSites | ForEach-Object { Test-Site $_ })
      }

      $result | ConvertTo-Json -Depth 8 -Compress
    "#;

    run_powershell_json_with_timeout(script, 45_000)
}

#[tauri::command]
fn get_display_report() -> Result<Value, String> {
    let script = r#"
      $gpu = Get-CimInstance Win32_VideoController | Select-Object Name,VideoProcessor,AdapterRAM,DriverVersion,CurrentHorizontalResolution,CurrentVerticalResolution,CurrentRefreshRate,PNPDeviceID
      $desktopMonitors = Get-CimInstance Win32_DesktopMonitor | Select-Object Name,MonitorType,ScreenWidth,ScreenHeight,PNPDeviceID,Status

      $monitorIds = @()
      try {
        $monitorIds = Get-CimInstance -Namespace root\wmi -ClassName WmiMonitorID | ForEach-Object {
          $manufacturer = -join ($_.ManufacturerName | Where-Object { $_ -ne 0 } | ForEach-Object {[char]$_})
          $product = -join ($_.ProductCodeID | Where-Object { $_ -ne 0 } | ForEach-Object {[char]$_})
          $serial = -join ($_.SerialNumberID | Where-Object { $_ -ne 0 } | ForEach-Object {[char]$_})
          [PSCustomObject]@{
            Active = $_.Active
            Manufacturer = $manufacturer
            ProductCode = $product
            SerialNumber = $serial
            InstanceName = $_.InstanceName
          }
        }
      } catch {
        $monitorIds = @()
      }

      $result = [PSCustomObject]@{
        gpu = $gpu
        desktopMonitors = $desktopMonitors
        monitorIds = $monitorIds
      }

      $result | ConvertTo-Json -Depth 8 -Compress
    "#;

    run_powershell_json(script)
}

#[tauri::command]
fn query_dns(domain: &str) -> Result<Value, String> {
    let domain = domain.replace("'", "''");

    let script = format!(
        r#"
        $types = @('A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS', 'SRV', 'SOA', 'CAA')
        $rows = @()

        foreach ($t in $types) {{
          try {{
            $records = Resolve-DnsName -Name '{domain}' -Type $t -ErrorAction Stop
            foreach ($r in $records) {{
              $data = if ($r.IPAddress) {{
                $r.IPAddress
              }} elseif ($r.NameHost) {{
                $r.NameHost
              }} elseif ($r.Strings) {{
                ($r.Strings -join ' ')
              }} elseif ($r.NameExchange) {{
                if ($null -ne $r.Preference) {{
                  "Preference=$($r.Preference); Exchange=$($r.NameExchange)"
                }} else {{
                  $r.NameExchange
                }}
              }} elseif ($r.PrimaryServer) {{
                "PrimaryServer=$($r.PrimaryServer); ResponsiblePerson=$($r.ResponsiblePerson); SerialNumber=$($r.SerialNumber)"
              }} elseif ($r.Target) {{
                "Target=$($r.Target); Port=$($r.Port); Priority=$($r.Priority); Weight=$($r.Weight)"
              }} else {{
                "-"
              }}

              $rows += [PSCustomObject]@{{
                Name = $r.Name
                Type = $t
                TTL = $r.TTL
                Data = $data
              }}
            }}
          }} catch {{
            continue
          }}
        }}

        if ($rows.Count -eq 0) {{
          [PSCustomObject]@{{ error = '未查询到可用 DNS 记录。' }} | ConvertTo-Json -Compress
        }} else {{
          $rows | Sort-Object Type, Name | ConvertTo-Json -Compress
        }}
        "#
    );

    run_powershell_json(&script)
}

#[tauri::command]
fn query_ip(ip: &str) -> Result<Value, String> {
    let url = if ip.trim().is_empty() {
        "http://ip-api.com/json/?lang=zh-CN".to_string()
    } else {
        let ip = ip.replace("'", "''");
        format!("http://ip-api.com/json/{}?lang=zh-CN", ip)
    };

    let script = format!(
        r#"
        try {{
            $response = Invoke-RestMethod -Uri '{url}' -Method Get -ErrorAction Stop
            $response | ConvertTo-Json -Compress
        }} catch {{
            $errorMsg = $_.Exception.Message
            [PSCustomObject]@{{ status = "fail"; message = $errorMsg }} | ConvertTo-Json -Compress
        }}
        "#
    );

    run_powershell_json(&script)
}

#[tauri::command]
fn save_image_to_source_dir(
    source_path: &str,
    file_name: &str,
    base64_data: &str,
) -> Result<String, String> {
    let source = PathBuf::from(source_path);
    let parent = source
        .parent()
        .ok_or_else(|| "无法确定原图片所在目录。".to_string())?;

    let clean_base64 = base64_data
        .split(',')
        .next_back()
        .ok_or_else(|| "图片数据为空。".to_string())?
        .trim();

    let bytes = BASE64_STANDARD
        .decode(clean_base64)
        .map_err(|error| format!("解析图片 Base64 失败: {error}"))?;

    let target = parent.join(file_name);
    fs::write(&target, bytes).map_err(|error| format!("保存图片到原目录失败: {error}"))?;

    Ok(target.to_string_lossy().to_string())
}

#[tauri::command]
fn save_png_to_desktop(file_name: &str, base64_data: &str) -> Result<String, String> {
    let user_profile =
        std::env::var("USERPROFILE").map_err(|error| format!("读取 USERPROFILE 失败: {error}"))?;
    let desktop = PathBuf::from(user_profile).join("Desktop");
    if !desktop.exists() {
        return Err("未找到桌面目录。".to_string());
    }

    let clean_base64 = base64_data
        .split(',')
        .next_back()
        .ok_or_else(|| "图片数据为空。".to_string())?
        .trim();

    let bytes = BASE64_STANDARD
        .decode(clean_base64)
        .map_err(|error| format!("解析图片 Base64 失败: {error}"))?;

    let mut final_name = file_name.trim().to_string();
    if final_name.is_empty() {
        final_name = "qrcode.png".to_string();
    }
    if !final_name.to_lowercase().ends_with(".png") {
        final_name.push_str(".png");
    }

    let target = desktop.join(final_name);
    fs::write(&target, bytes).map_err(|error| format!("保存 PNG 到桌面失败: {error}"))?;

    Ok(target.to_string_lossy().to_string())
}

fn resolve_notes_path(app: &AppHandle) -> Result<PathBuf, String> {
    let app_data_dir = app
        .path()
        .app_data_dir()
        .map_err(|error| format!("确定应用数据目录失败: {error}"))?;
    fs::create_dir_all(&app_data_dir).map_err(|error| format!("创建应用数据目录失败: {error}"))?;
    Ok(app_data_dir.join("notes.md"))
}

#[tauri::command]
fn read_notes_md(app: AppHandle) -> Result<NotesReadResult, String> {
    let notes_path = resolve_notes_path(&app)?;
    if !notes_path.exists() {
        return Ok(NotesReadResult {
            exists: false,
            content: String::new(),
        });
    }
    let content =
        fs::read_to_string(&notes_path).map_err(|error| format!("读取 notes.md 失败: {error}"))?;
    Ok(NotesReadResult {
        exists: true,
        content,
    })
}

#[tauri::command]
fn write_notes_md(app: AppHandle, content: &str) -> Result<String, String> {
    let notes_path = resolve_notes_path(&app)?;
    fs::write(&notes_path, content).map_err(|error| format!("写入 notes.md 失败: {error}"))?;
    Ok(notes_path.to_string_lossy().to_string())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_system_overview,
            get_network_report,
            get_display_report,
            query_dns,
            query_ip,
            save_image_to_source_dir,
            save_png_to_desktop,
            read_notes_md,
            write_notes_md,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
