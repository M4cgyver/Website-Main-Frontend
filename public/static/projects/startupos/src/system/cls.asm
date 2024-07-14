;===DIR.ASM=========================================================================================
;Shows the directory of the disk

BITS 16
ORG 32768

Main:
	call os_clear_screen
	ret

%INCLUDE "system.inc"