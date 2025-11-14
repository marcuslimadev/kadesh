<?php
namespace App\Backend\Core;

class Logger {
    private static string $logFile = __DIR__ . '/../../../app.log';

    public static function log(string $level, string $message, array $context = []) {
        $timestamp = date('Y-m-d H:i:s');
        $logEntry = "[{$timestamp}] [{$level}] {$message}";
        if (!empty($context)) {
            $logEntry .= " " . json_encode($context);
        }
        $logEntry .= PHP_EOL;
        file_put_contents(self::$logFile, $logEntry, FILE_APPEND);
    }

    public static function info(string $message, array $context = []) {
        self::log('INFO', $message, $context);
    }

    public static function error(string $message, array $context = []) {
        self::log('ERROR', $message, $context);
    }
}
