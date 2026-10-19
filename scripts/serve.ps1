# ============================================================
# PALCOLIVRE - Servidor estatico para desenvolvimento local
# ------------------------------------------------------------
# Uso:
#   powershell -ExecutionPolicy Bypass -File scripts\serve.ps1
#   powershell -ExecutionPolicy Bypass -File scripts\serve.ps1 -Porta 3000
#
# Depois acesse http://localhost:8080 no navegador.
# Ctrl+C encerra o servidor.
# ============================================================

param([int]$Porta = 8080)

$raiz = Join-Path $PSScriptRoot "..\frontend"

$tipos = @{
  ".html"  = "text/html; charset=utf-8"
  ".css"   = "text/css; charset=utf-8"
  ".js"    = "text/javascript; charset=utf-8"
  ".svg"   = "image/svg+xml"
  ".png"   = "image/png"
  ".jpg"   = "image/jpeg"
  ".jpeg"  = "image/jpeg"
  ".ico"   = "image/x-icon"
  ".json"  = "application/json; charset=utf-8"
  ".woff2" = "font/woff2"
}

$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add("http://localhost:$Porta/")

try {
  $listener.Start()
} catch {
  Write-Host "Nao foi possivel iniciar em http://localhost:$Porta/"
  Write-Host "Tente executar o PowerShell como administrador ou use outra porta."
  exit 1
}

Write-Host ""
Write-Host "  PalcoLivre rodando em http://localhost:$Porta"
Write-Host "  Servindo: $raiz"
Write-Host "  Ctrl+C para parar."
Write-Host ""

while ($listener.IsListening) {
  try {
    $ctx = $listener.GetContext()
    $caminho = $ctx.Request.Url.LocalPath.TrimStart("/")
    if ([string]::IsNullOrEmpty($caminho)) { $caminho = "index.html" }

    $arquivo = Join-Path $raiz $caminho

    if ((Test-Path $arquivo -PathType Leaf) -and $arquivo.StartsWith($raiz)) {
      $bytes = [System.IO.File]::ReadAllBytes($arquivo)
      $ext = [System.IO.Path]::GetExtension($arquivo).ToLower()
      $ctx.Response.ContentType = $(if ($tipos[$ext]) { $tipos[$ext] } else { "application/octet-stream" })
      $ctx.Response.ContentLength64 = $bytes.Length
      $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
      $ctx.Response.StatusCode = 404
      $msg = [Text.Encoding]::UTF8.GetBytes("404 - arquivo nao encontrado")
      $ctx.Response.OutputStream.Write($msg, 0, $msg.Length)
    }
    $ctx.Response.Close()
  } catch {
    # Erros de conexao interrompida pelo cliente sao ignorados.
  }
}
