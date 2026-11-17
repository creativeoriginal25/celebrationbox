Add-Type -AssemblyName System.Drawing

$srcPath = (Resolve-Path "public\brand\celebration-box-square.jpg").Path
$srcBmp = New-Object System.Drawing.Bitmap($srcPath)

function Resize-Bitmap($origBmp, $width, $height) {
    $destBmp = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($destBmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    
    # Fill background with milky white #FEFEFE to ensure zero transparency
    $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(254, 254, 254))
    $g.FillRectangle($brush, 0, 0, $width, $height)
    $brush.Dispose()
    
    $g.DrawImage($origBmp, 0, 0, $width, $height)
    $g.Dispose()
    return $destBmp
}

# 1. apple-touch-icon.png (180x180)
$icon180 = Resize-Bitmap $srcBmp 180 180
$icon180.Save((Join-Path (Get-Location) "public\apple-touch-icon.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$icon180.Dispose()
Write-Output "Generated public\apple-touch-icon.png (180x180)"

# 2. favicon.png (192x192)
$icon192 = Resize-Bitmap $srcBmp 192 192
$icon192.Save((Join-Path (Get-Location) "public\favicon.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$icon192.Dispose()
Write-Output "Generated public\favicon.png (192x192)"

# 3. favicon-48x48.png (48x48)
$icon48 = Resize-Bitmap $srcBmp 48 48
$icon48.Save((Join-Path (Get-Location) "public\favicon-48x48.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$icon48.Dispose()
Write-Output "Generated public\favicon-48x48.png (48x48)"

# 4. favicon-32x32.png (32x32)
$icon32 = Resize-Bitmap $srcBmp 32 32
$icon32.Save((Join-Path (Get-Location) "public\favicon-32x32.png"), [System.Drawing.Imaging.ImageFormat]::Png)
Write-Output "Generated public\favicon-32x32.png (32x32)"

# 5. favicon-16x16.png (16x16)
$icon16 = Resize-Bitmap $srcBmp 16 16
$icon16.Save((Join-Path (Get-Location) "public\favicon-16x16.png"), [System.Drawing.Imaging.ImageFormat]::Png)
Write-Output "Generated public\favicon-16x16.png (16x16)"

# 6. Generate multi-resolution favicon.ico containing PNG entries
# Standard ICO header: 0, 1 (ICO type), count
function Build-IcoFile($pngPaths, $icoOutPath) {
    $fs = [System.IO.File]::Create($icoOutPath)
    $bw = New-Object System.IO.BinaryWriter($fs)
    
    # Read all png bytes
    $pngBytesList = @()
    foreach ($p in $pngPaths) {
        $bytes = [System.IO.File]::ReadAllBytes($p)
        $pngBytesList += ,$bytes
    }
    
    $count = $pngPaths.Count
    # Reserved (2 bytes) = 0
    $bw.Write([uint16]0)
    # Type (2 bytes) = 1 (icon)
    $bw.Write([uint16]1)
    # Count (2 bytes)
    $bw.Write([uint16]$count)
    
    $offset = 6 + ($count * 16)
    
    for ($i = 0; $i -lt $count; $i++) {
        $p = $pngPaths[$i]
        $bytes = $pngBytesList[$i]
        $bmpInfo = New-Object System.Drawing.Bitmap($p)
        $w = if ($bmpInfo.Width -ge 256) { [byte]0 } else { [byte]$bmpInfo.Width }
        $h = if ($bmpInfo.Height -ge 256) { [byte]0 } else { [byte]$bmpInfo.Height }
        $bmpInfo.Dispose()
        
        $bw.Write([byte]$w)          # Width
        $bw.Write([byte]$h)          # Height
        $bw.Write([byte]0)           # Color count
        $bw.Write([byte]0)           # Reserved
        $bw.Write([uint16]1)         # Color planes
        $bw.Write([uint16]32)        # Bits per pixel
        $bw.Write([uint32]$bytes.Length) # Image data size in bytes
        $bw.Write([uint32]$offset)   # Image offset
        
        $offset += $bytes.Length
    }
    
    # Write image data
    for ($i = 0; $i -lt $count; $i++) {
        $bytes = $pngBytesList[$i]
        $bw.Write($bytes, 0, $bytes.Length)
    }
    
    $bw.Flush()
    $bw.Close()
    $fs.Close()
    Write-Output "Generated multi-resolution ICO at $icoOutPath"
}

$icoPaths = @(
    (Join-Path (Get-Location) "public\favicon-16x16.png"),
    (Join-Path (Get-Location) "public\favicon-32x32.png"),
    (Join-Path (Get-Location) "public\favicon-48x48.png")
)
Build-IcoFile $icoPaths (Join-Path (Get-Location) "public\favicon.ico")

$icon32.Dispose()
$icon16.Dispose()
$srcBmp.Dispose()
