;===INSTALL.ASM===================================================================================
;Will install the OS onto another disk

BITS 16
ORG 32768

Main:
	mov si, message
	call os_print_string
	ret				; Return to os
	
message 	db	"================================================================================", 0

%INCLUDE "system.inc"