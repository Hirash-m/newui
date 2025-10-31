# ExportMyCode.ps1
# خروجی کل پروژه در 9 فایل + 1 فایل درخت (مجموع 10 فایل)
# فایل‌های تمپلیت CoreUI و فایل‌های بیلد/کش حذف شده‌اند

param()

$rootDir = $PSScriptRoot
$outDir  = Join-Path $rootDir "ExportedCode"
$include = @("*.ts", "*.html", "*.scss", "*.css", "*.json", "*.js", "*.config", "*.md")
$excludeDirs = @(".angular", "dist", "node_modules", "coverage", "e2e",
                 ".git", ".vs", ".vscode", "bin", "obj", "packages")

# حذف و ساخت پوشه خروجی
if (Test-Path $outDir) { Remove-Item -Path $outDir -Recurse -Force }
$null = New-Item -ItemType Directory -Path $outDir -Force

# جمع‌آوری فایل‌های مدنظر (بدون فایل‌های تمپلیت CoreUI)
$files = Get-ChildItem -Path $rootDir -Include $include -Recurse -File |
         Where-Object {
             $full = $_.FullName
             # اگر مسیر شامل پوشه‌های excluded باشد حذف شود
             $skipDir = $excludeDirs | ForEach-Object { $full -like "*\$_\*" }
             if ($skipDir -contains $true) { return $false }

             # حذف کامل پوشه‌های template و components (تمپلیت CoreUI)
             if ($full -like "*\src\app\views\template\*") { return $false }
             if ($full -like "*\src\components\*")        { return $false }

             $true
         }

# خروجی لیست فایل‌ها در کنسول
Write-Host "Found $($files.Count) source files to export:"
$files | ForEach-Object {
    Write-Host "  - $($_.FullName.Substring($rootDir.Length).TrimStart('\'))"
}

# محاسبه تعداد فایل در هر خروجی (9 فایل نهایی)
$totalParts  = 9
$chunkSize   = [math]::Ceiling($files.Count / $totalParts)
$part        = 1
$buffer      = @()

for ($i = 0; $i -lt $files.Count; $i++) {
    $file    = $files[$i]
    $relPath = $file.FullName.Substring($rootDir.Length).TrimStart('\')
    $header  = "===== FILE: $relPath ====="
    $content = Get-Content $file.FullName -Raw
    $buffer += "$header`n$content`n"

    # هرگاه به اندازه chunkSize رسیدیم، بنویس
    if ($buffer.Count -ge $chunkSize -or $i -eq $files.Count - 1) {
        $outFile = Join-Path $outDir ("Part_{0:D2}.txt" -f $part)
        $buffer | Out-File -FilePath $outFile -Encoding UTF8
        $buffer = @()
        $part++
    }
}

# ساخت فایل درخت (فایل دهم)
$treeLines = @()
foreach ($file in $files) {
    $rel   = $file.FullName.Substring($rootDir.Length).TrimStart('\')
    $parts = $rel.Split([IO.Path]::DirectorySeparatorChar)
    for ($j = 0; $j -lt $parts.Count; $j++) {
        $prefix = if ($j -eq 0) { "" } else { ("|   " * ($j - 1)) + "+-- " }
        $line   = $prefix + $parts[$j]
        if ($treeLines -notcontains $line) { $treeLines += $line }
    }
}
$treeFile = Join-Path $outDir "project_tree.txt"
$treeLines | Out-File -FilePath $treeFile -Encoding UTF8

Write-Host "Export completed. Total files created: $($totalParts + 1)"
