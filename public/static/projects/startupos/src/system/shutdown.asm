;===DIR.ASM=========================================================================================
;Shows the directory of the disk

BITS 16
ORG 32768

Main:
	mov ah, 53h            ;this is an APM command
	mov al, 00h            ;installation check command
	xor bx, bx             ;device id (0 = APM BIOS)
	int 15h               ;call the BIOS function through interrupt 15h
	jc .error1
	
	mov ah, 53h
	mov al, 07h
	mov bx, 0001h
	mov cx, 03h
	int 15h
	
.error1:
	mov si, message
	call os_print_string
	jmp $
	
message	db 'It is now safe to turn of your computer...', 0
	
%INCLUDE "system.inc"