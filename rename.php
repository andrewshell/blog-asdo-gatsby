<?php
$files = glob('*/**/*.markdown');

foreach ($files as $filename) {
    if (preg_match('!^node_modules!isU', $filename)) {
        continue;
    }

    $dirpath = dirname($filename);
    $oldname = basename($filename);
    $newname = preg_replace('!^\d{4}-\d{2}-\d{2}-!is', '', $oldname);
    $newname = preg_replace('!\.markdown$!is', '.md', $newname);
    rename(
        $dirpath . '/' . $oldname,
        $dirpath . '/' . $newname
    );
}