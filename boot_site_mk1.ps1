<#  boot_site_mk1.ps1 — FORGE_site_dev local boot
    Starts a localhost static server for this repo, prints the address, auto-opens the browser.

    Usage:   .\boot_site_mk1.ps1              # scan up from 8000, auto-open
             .\boot_site_mk1.ps1 -Port 8123   # pin a port
             .\boot_site_mk1.ps1 -NoOpen      # start server, skip the browser launch

    First run after download:  Unblock-File .\boot_site_mk1.ps1
    Stop:  Ctrl+C  (the server is shut down for you)
#>
param(
  [int]$Port = 0,          # 0 = scan up from 8000
  [switch]$NoOpen
)
$ErrorActionPreference = 'Stop'
function Say([string]$msg,[string]$color='Gray'){ Write-Host $msg -ForegroundColor $color }

Set-Location -Path $PSScriptRoot
Say ''
Say '  FORGE // SITE BOOT' 'Yellow'
Say '  ------------------' 'DarkYellow'

# ---- [1/4] python ----------------------------------------------------------
$py = $null
foreach($cand in @('py','python')){
  $cmd = Get-Command $cand -ErrorAction SilentlyContinue
  if($cmd){ $py = $cand; break }
}
if(-not $py){ Say '  [1/4] python  : NOT FOUND - install Python or add it to PATH' 'Red'; exit 1 }
Say ("  [1/4] python  : {0}" -f $py) 'Gray'

# ---- [2/4] port ------------------------------------------------------------
function Test-PortFree([int]$p){
  try{ $l=[System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback,$p); $l.Start(); $l.Stop(); $true }
  catch{ $false }
}
if($Port -gt 0){
  if(-not (Test-PortFree $Port)){ Say ("  [2/4] port    : {0} is BUSY - pick another or omit -Port to scan" -f $Port) 'Red'; exit 1 }
}else{
  for($p=8000; $p -le 8020; $p++){ if(Test-PortFree $p){ $Port=$p; break } }
  if($Port -eq 0){ Say '  [2/4] port    : none free in 8000-8020' 'Red'; exit 1 }
}
Say ("  [2/4] port    : {0}  (127.0.0.1 bind - clear of the 5000-range turf war)" -f $Port) 'Gray'

# ---- [3/4] server ----------------------------------------------------------
$log = Join-Path $env:TEMP ("forge_site_{0}.log" -f $Port)   # http.server request log (stderr)
$out = Join-Path $env:TEMP ("forge_site_{0}.out" -f $Port)   # startup banner (stdout)
Remove-Item $log,$out -ErrorAction SilentlyContinue
$proc = Start-Process -FilePath $py -ArgumentList @('-m','http.server',"$Port",'--bind','127.0.0.1') `
        -WorkingDirectory $PSScriptRoot -WindowStyle Hidden -PassThru `
        -RedirectStandardError $log -RedirectStandardOutput $out

$up = $false
for($i=0; $i -lt 40; $i++){
  Start-Sleep -Milliseconds 150
  if($proc.HasExited){ break }
  try{ $c=[System.Net.Sockets.TcpClient]::new(); $c.Connect('127.0.0.1',$Port); $c.Close(); $up=$true; break }catch{}
}
if(-not $up){
  Say '  [3/4] server  : FAILED to come up - python said:' 'Red'
  foreach($f in @($log,$out)){ if(Test-Path $f){ Get-Content $f | ForEach-Object { Say ("          {0}" -f $_) 'DarkGray' } } }
  if(-not $proc.HasExited){ Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue }
  exit 1
}
Say ("  [3/4] server  : UP  (pid {0})" -f $proc.Id) 'Gray'

$url = "http://127.0.0.1:$Port/"
Say ''
Say ("  >>  {0}  <<" -f $url) 'Yellow'
Say ("      splash -> ENTER -> holo deck   (deck direct: {0}dash1.html)" -f $url) 'DarkGray'
Say ''

# ---- [4/4] browser ---------------------------------------------------------
if($NoOpen){ Say '  [4/4] browser : skipped (-NoOpen)' 'Gray' }
else{ Start-Process $url | Out-Null; Say '  [4/4] browser : opened' 'Gray' }

Say ''
Say '  serving - request log below | Ctrl+C stops the server' 'DarkYellow'
Say '  -----------------------------------------------------' 'DarkYellow'
try{
  Get-Content -Path $log -Wait -Tail 0 | ForEach-Object { Say ("  {0}" -f $_) 'DarkGray' }
}finally{
  if($proc -and -not $proc.HasExited){ Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue }
  Say ''
  Say '  server stopped - deck powered down.' 'Yellow'
}
