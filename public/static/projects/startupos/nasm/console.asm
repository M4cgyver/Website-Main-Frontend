; ==================================================================================================
; --------------------------------------------------------------------------------------------------
; console_clear -- Clears console

console_clear:
	pusha 
	
	mov ah, 00h
	mov al, 03h
	int 10h
	
	popa
	ret
	
; --------------------------------------------------------------------------------------------------
; console_print_string -- prints onto console screen
; IN/OUT: 

console_print_string:
	
.a1:
	mov ah, 0Eh
	mov bh, 00h
	
	lodsb
	
	cmp al, 0x00
	je .b1
	
	cmp al, 0x0A
	je .c1
	
	int 10h
	
	jmp .a1
	
.b1:
	ret
	
.c1:
	mov ah, 03h
	mov bh, 00h
	int 10h
	
	mov dl, 00h
	inc dh
	mov ah, 02h
	int 10h
	
	jmp .a1
	
.col	db	0x00

; --------------------------------------------------------------------------------------------------
; console_print_intro: prints the intro.
; IN/OUT: 

console_print_intro:
	mov ah, 02h
	mov bh, 02h
	mov dh, 00h
	mov dl, 00h
	int 10h
	
	mov si, intromessage
	
.a1:
	lodsb
	cmp al, 0x00
	je .c1
	
	cmp al, 0x0A
	je .b1
	
	mov ah, 0Eh
	int 10h
	jmp .a1
	
.b1:
	mov ah, 03h
	mov bh, 00h
	int 10h
	
	mov ah, 02h
	inc dh
	mov dl, 00h
	int 10h
	
	jmp .a1
	
.c1:
	ret
	
; --------------------------------------------------------------------------------------------------
; console_get_string: Gets the string
; IN/OUT: ax = location
console_get_string:
	pusha
	
	mov di, ax			; DI is where we'll store input (buffer)
	mov cx, 0			; Character received counter for backspace


.more:					; Now onto string getting
	call keyboard_wait

	cmp al, 13			; If Enter key pressed, finish
	je .done

	cmp al, 8			; Backspace pressed?
	je .backspace			; If not, skip following checks

	cmp al, ' '			; In ASCII range (32 - 126)?
	jb .more			; Ignore most non-printing characters

	cmp al, '~'
	ja .more

	jmp .nobackspace


.backspace:
	cmp cx, 0			; Backspace at start of string?
	je .more			; Ignore it if so

	call console_get_cursor_pos		; Backspace at start of screen line?
	cmp dl, 0
	je .backspace_linestart

	pusha
	mov ah, 0Eh			; If not, write space and move cursor back
	mov al, 8
	int 10h				; Backspace twice, to clear space
	mov al, 32
	int 10h
	mov al, 8
	int 10h
	popa

	dec di				; Character position will be overwritten by new
					; character or terminator at end

	dec cx				; Step back counter

	jmp .more


.backspace_linestart:
	dec dh				; Jump back to end of previous line
	mov dl, 79
	call console_mov_cursor

	mov al, ' '			; Print space there
	mov ah, 0Eh
	int 10h

	mov dl, 79			; And jump back before the space
	call console_mov_cursor

	dec di				; Step back position in string
	dec cx				; Step back counter

	jmp .more


.nobackspace:
	pusha
	mov ah, 0Eh			; Output entered, printable character
	int 10h
	popa

	stosb				; Store character in designated buffer
	inc cx				; Characters processed += 1
	cmp cx, 63			; Make sure we don't exhaust buffer
	jae near .done

	jmp near .more			; Still room for more


.done:
	mov ax, 0
	stosb

	popa
	ret

; ------------------------------------------------------------------
; console_mov_cursor -- Moves cursor in text mode
; IN: DH, DL = row, column; OUT: Nothing (registers preserved)

console_mov_cursor:
	pusha

	mov bh, 0
	mov ah, 2
	int 10h				; BIOS interrupt to move cursor

	popa
	ret

; ------------------------------------------------------------------
; console_get_cursor_pos -- Return position of text cursor
; OUT: DH, DL = row, column

console_get_cursor_pos:
	pusha

	mov bh, 0
	mov ah, 3
	int 10h				; BIOS interrupt to get cursor position

	mov [.tmp], dx
	popa
	mov dx, [.tmp]
	ret


	.tmp dw 0
	
; ------------------------------------------------------------------
; console_compair -- Compairs the place
; IN: SI / DI = location
; OUT: flags

console_compair:
	pusha

.more:
	mov al, [si]			; Retrieve string contents
	mov bl, [di]

	cmp al, bl			; Compare characters at current location
	jne .not_same

	cmp al, 0x00		; End of first string? Must also be end of second
	je .terminated

	inc si
	inc di
	jmp .more


.not_same:				; If unequal lengths with same beginning, the byte
	popa				; comparison fails at shortest string terminator
	clc				; Clear carry flag
	ret


.terminated:				; Both strings terminated at the same position
	popa
	stc				; Set carry flag
	ret

; ------------------------------------------------------------------
; console_print_digit -- Displays contents of AX as a single digit
; Works up to base 37, ie digits 0-Z
; IN: AX = "digit" to format and print

console_print_digit:
	pusha

	cmp ax, 9			; There is a break in ASCII table between 9 and A
	jle .digit_format

	add ax, 'A'-'9'-1		; Correct for the skipped punctuation

.digit_format:
	add ax, '0'			; 0 will display as '0', etc.	

	mov ah, 0Eh			; May modify other registers
	int 10h

	popa
	ret

	
; ------------------------------------------------------------------
; console_print_1hex -- Displays low nibble of AL in hex format
; IN: AL = number to format and print

console_print_1hex:
	pusha

	and ax, 0Fh			; Mask off data to display
	call console_print_digit

	popa
	ret


; ------------------------------------------------------------------
; console_print_2hex -- Displays AL in hex format
; IN: AL = number to format and print

console_print_2hex:
	pusha

	push ax				; Output high nibble
	shr ax, 4
	call console_print_1hex

	pop ax				; Output low nibble
	call console_print_1hex

	popa
	ret


; ------------------------------------------------------------------
; console_print_4hex -- Displays AX in hex format
; IN: AX = number to format and print

console_print_4hex:
	pusha

	push ax				; Output high byte
	mov al, ah
	call console_print_2hex

	pop ax				; Output low byte
	call console_print_2hex

	popa
	ret

	
; ===VARIABLE=======================================================================================
enterchar			db	0x0A, 0x00
commandinput		db 	"> ", 0x00
intromessage:
	db 221, "Welcome to Startup OS! The verry basic operating system. [ V ", VERSION, " ]", 222, 0x0A,
	db	0x00