;===TODO============================================================================================
;Make applications executable
;
;===DATA============================================================================================
[bits 	16]
[org 	0h]

%DEFINE MIKEOS_VER '1.0'	; OS version number
%DEFINE MIKEOS_API_VER 1	; API version for programs to check

;===VECTORS=========================================================================================
vectors:
	jmp boot			; 0000h -- Called from bootloader
	jmp os_print_string		; 0003h
	jmp os_move_cursor		; 0006h
	jmp os_clear_screen		; 0009h
	jmp os_print_horiz_line		; 000Ch
	jmp os_print_newline		; 000Fh
	jmp os_wait_for_key		; 0012h
	jmp os_check_for_key		; 0015h
	jmp os_int_to_string		; 0018h
	jmp os_speaker_tone		; 001Bh
	jmp os_speaker_off		; 001Eh
	jmp os_load_file		; 0021h
	jmp os_pause			; 0024h
	jmp os_fatal_error		; 0027h
	jmp os_draw_background		; 002Ah
	jmp os_draw_background		; 002Dh
	jmp os_draw_background		; 0030h
	jmp os_string_lowercase		; 0033h
	jmp os_input_string		; 0036h
	jmp os_string_copy		; 0039h
	jmp os_dialog_box		; 003Ch
	jmp os_string_join		; 003Fh
	jmp os_get_file_list		; 0042h
	jmp os_string_compare		; 0045h
	jmp os_string_chomp		; 0048h
	jmp os_string_strip		; 004Bh
	jmp os_string_truncate		; 004Eh
	jmp os_bcd_to_int		; 0051h
	jmp os_bcd_to_int		; 0054h
	jmp os_get_api_version		; 0057h
	jmp os_file_selector		; 005Ah
	jmp os_file_selector		; 005Dh
	jmp os_send_via_serial		; 0060h
	jmp os_get_via_serial		; 0063h
	jmp os_find_char_in_string	; 0066h
	jmp os_get_cursor_pos		; 0069h
	jmp os_print_space		; 006Ch
	jmp os_dump_string		; 006Fh
	jmp os_print_digit		; 0072h
	jmp os_print_1hex		; 0075h
	jmp os_print_2hex		; 0078h
	jmp os_print_4hex		; 007Bh
	jmp os_long_int_to_string	; 007Eh
	jmp os_long_int_negate		; 0081h
	jmp os_long_int_negate		; 0084h
	jmp os_long_int_negate		; 0087h
	jmp os_show_cursor		; 008Ah
	jmp os_hide_cursor		; 008Dh
	jmp os_dump_registers		; 0090h
	jmp os_string_strincmp		; 0093h
	jmp os_write_file		; 0096h
	jmp os_file_exists		; 0099h
	jmp os_create_file		; 009Ch
	jmp os_remove_file		; 009Fh
	jmp os_rename_file		; 00A2h
	jmp os_get_file_size		; 00A5h
	jmp os_input_dialog		; 00A8h
	jmp os_list_dialog		; 00ABh
	jmp os_string_reverse		; 00AEh
	jmp os_string_to_int		; 00B1h
	jmp os_draw_block		; 00B4h
	jmp os_get_random		; 00B7h
	jmp os_string_charchange	; 00BAh
	jmp os_serial_port_enable	; 00BDh
	jmp os_sint_to_string		; 00C0h
	jmp os_string_parse		; 00C3h
	jmp os_run_basic		; 00C6h
	jmp os_port_byte_out		; 00C9h
	jmp os_port_byte_in		; 00CCh
	jmp os_string_tokenize		; 00CFh

;===CODE============================================================================================
boot:
	; set segment register:
	mov     ax, 0b800h
	mov     ds, ax

	; print "hello world"
	; first byte is ascii code, second byte is color code.

	mov [00h], byte ' '
	mov [02h], byte 'B'
	mov [04h], byte 'O'
	mov [06h], byte 'O'
	mov [08h], byte 'T'
	mov [0ah], byte 'I'
	mov [0ch], byte 'N'
	mov [0eh], byte 'G' 
	mov [10h], byte '.'
	mov [12h], byte '.'
	mov [14h], byte '.'
	mov [16h], byte ' '
	mov [18h], byte 219
	
	mov ax, 0
	mov ss, ax			; Set stack segment and pointer
	mov sp, 0FFFFh
	sti				; Restore interrupts

	cld				; The default direction for string operations
					; will be 'up' - incrementing address in RAM

	mov ax, 2000h			; Set all segments to match where kernel is loaded
	mov ds, ax			; After this, we don't need to bother with
	mov es, ax			; segments ever again, as MikeOS and its programs
	mov fs, ax			; live entirely in 64K
	mov gs, ax

	cmp dl, 0
	je no_change
	mov [bootdev], dl		; Save boot device number
	push es
	mov ah, 8			; Get drive parameters
	int 13h
	pop es
	and cx, 3Fh			; Maximum sector number
	mov [SecsPerTrack], cx		; Sector numbers start at 1
	movzx dx, dh			; Maximum head number
	add dx, 1			; Head numbers start at 0 - add 1 for total
	mov [Sides], dx
	mov ah, [bootdev]
	mov [currdrive], ah
	
no_change:
	mov ax, 1003h			; Set text output with certain attributes
	mov bx, 0			; to be bright, and not blinking
	int 10h
	
kernel:
	xor ax, ax
	mov al, 03h
	int 10h
	
.a1:							; Get the status of all disks w/ bios
	mov si, drivemsg
	call os_print_string
	
	mov dl, 00h					; Drive A
	call os_get_disk_status
	inc ah						; Display
	mov al, ah
	mov ah, 0eh
	int 10h						
	
	mov dl, 01h					; Drive B
	call os_get_disk_status
	inc ah
	mov al, ah
	mov ah, 0eh
	int 10h						
	
	mov dl, 80h					; Drive C
	call os_get_disk_status
	inc ah						; Display
	mov al, ah
	mov ah, 0eh
	int 10h		
	
	mov dl, 81h					; Drive D
	call os_get_disk_status
	inc ah						; Display
	mov al, ah
	mov ah, 0eh
	int 10h						
	
	mov dl, 81h					; Drive E
	call os_get_disk_status
	inc ah						; Display
	mov al, ah
	mov ah, 0eh
	int 10h				
	
	mov si, enterchr
	call os_print_string
	call os_print_string
	
run:

.a1:							; Display the current character of the current drive
	cmp [currdrive], byte 00h			; Floppy A
	je .a2
	cmp [currdrive], byte 01h			; Floppy B
	je .a3
	cmp [currdrive], byte 80h			; Hard Drive C
	je .a4
	cmp [currdrive], byte 81h			; Hard Drive D
	je .a5
	cmp [currdrive], byte 00h			; CD/DVD Rom E
	je .a6
	
	; Error all floppy drives goto b1
	jmp .b1
	
.a2:
	mov ah, 0eh
	mov al, 'A'
	int 10h
	jmp .b1
	
.a3:
	mov ah, 0eh
	mov al, 'B'
	int 10h
	jmp .b1
	
.a4:
	mov ah, 0eh
	mov al, 'C'
	int 10h
	jmp .b1
	
.a5:
	mov ah, 0eh
	mov al, 'D'
	int 10h
	jmp .b1
	
.a6:
	mov ah, 0eh
	mov al, 'E'
	int 10h
	jmp .b1
	
.b1:
	mov si, inputchr
	call os_print_string
	
	mov ax, command
	call os_input_string
	
load:
	mov ax, command
	mov bx, 0
	mov cx, 32768
	call os_load_file
	jnc execute
	
.a1:
	mov ax, command
	call os_string_length
	add ax, command
	mov si, ax
	mov [si+0], byte '.'
	mov [si+1], byte 'B'
	mov [si+2], byte 'I'
	mov [si+3], byte 'N'
	
	mov ax, command
	mov bx, 0
	mov cx, 32768
	call os_load_file
	jc failure
	
	mov si, enterchr
	call os_print_string
	
	jmp execute
	
failure:
	mov si, notfoundmsg
	call os_print_string
	
	mov si, enterchr
	call os_print_string
	
	jmp run
	
execute:
	call 32768
	
	mov si, enterchr
	call os_print_string
	
	jmp run
	
;===VARIALBLES======================================================================================
inputchr	db	'] ', 0x00
notfoundmsg	db	0x0a, 'ERROR: COMMAND NOT FOUND!', 0x00
enterchr	db	0x0a, 0x00
dircmd		db	'DIR', 0x00
drivemsg	db	'DRIVE STATUS: ', 0x0a, 0x00
currdrive	db	01h

;===INCLUDES========================================================================================
%INCLUDE "basic.asm"
%INCLUDE "cli.asm"
%INCLUDE "disk.asm"
%INCLUDE "keyboard.asm"
%INCLUDE "math.asm"
%INCLUDE "misc.asm"
%INCLUDE "ports.asm"
%INCLUDE "screen.asm"
%INCLUDE "sound.asm"
%INCLUDE "string.asm"