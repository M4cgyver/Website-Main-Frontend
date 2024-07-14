;===DIR.ASM=========================================================================================
;Shows the directory of the disk

BITS 16
ORG 32768

Main:
	mov si, message
	call os_print_string
	
	call os_get_file_list
	mov [buffer], ax
	mov si, ax
	mov ah, 0eh
	
.a1:
	mov al, '-'
	int 10h
	int 10h
	int 10h
	
.a2:
	lodsb
	cmp al, ','
	je .a3
	cmp al, 0
	je .a4
	
	int 10h
	
	jmp .a2
	
.a3:
	push si
	mov si, enters
	call os_print_string
	pop si
	
	jmp .a1
	
.a4:
	mov si, enters
	call os_print_string
	call os_print_string
	mov si, message2
	call os_print_string
	mov ax, [buffer]
	mov si, ax
	call os_print_string
	
	mov si, enters
	call os_print_string

	ret				; Return to os
	
message 	db	"The total files on the disk:", 0x0a, 0
message2	db	"Buffer: ", 0x00
buffer		dw	0x0000
enters		db	0x0a, 0x00

%INCLUDE "system.inc"