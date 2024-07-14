;===HELLO.ASM=====================================================================================
;just a test

BITS 16
ORG 32768

Main:

.a1:
	mov ax, 0
	mov si, ax
	
	ret
	
%INCLUDE "system.inc"