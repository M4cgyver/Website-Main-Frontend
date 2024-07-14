;===HELLO.ASM=====================================================================================
;just a test

BITS 16
ORG 32768

Main:
	mov si, message
	call os_print_string
	ret				; Return to os
	
message 	db	"Hello world!", 0

%INCLUDE "system.inc"