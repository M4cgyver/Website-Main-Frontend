; --------------------------------------------------------------------------------------------------
; ram_main -- the main on the ram
ram_main:
	; Setup

	mov si, .command
	mov al, 0x00
	mov cx, 64
.a1:
	mov [si], al
	inc si
	
	loop .a1
	
	; Create a new line
	mov si, newlinemessage
	call console_print_string
	mov si, ramprompt
	call console_print_string
	
	; Get the string
	mov ax, .command
	call console_get_string
	
	mov ax, .command
	call string_to_upper
	
	cli
	
	; Create a new line
	mov si, newlinemessage
	call console_print_string
	
	; Check for command
	mov si, .command
	mov di, daignostic
	call string_compare
	je .b1
	
	mov si, .command
	mov di, kernelret
	call string_compare
	je boot
	
	mov si, ramerrormsg
	call console_print_string
	
	jmp ram_main
	
.b1:
	call console_clear
	call ram_diagnose
	call keyboard_wait
	call console_clear
	
	xor dx, dx
	call console_mov_cursor
	
	jmp ram_main
	
.command 	times 64 db 0x00


; --------------------------------------------------------------------------------------------------
; ram_diagnose -- diagnose ram
ram_diagnose:

 ;FS will be used to write into the text buffer
 push 0b800h
 pop fs

 ;SI is the pointer in the text buffer 
 xor si, si 

 ;These are for the INT 15 service
 mov di, baseAddress                    ;Offset in ES where to save the result
 xor ebx, ebx                           ;Start from beginning
 mov ecx, 18h                           ;Length of the output buffer (One descriptor at a time)

 ;EBP will count the available memory 
 xor ebp, ebp 

_get_memory_range:
 ;Set up the rest of the registers for INT 15 
 mov eax, 0e820h 
 mov edx, 534D4150h
 int 15h
 jc _error 

 ;Has somethig been returned actually?
 test ecx, ecx
 jz _next_memory_range

 ;Add length (just the lower 32 bits) to EBP if type = 1 or 3 
 mov eax, DWORD [length]

 ;Avoid a branch (just for the sake of less typing)

 mov edx, DWORD [type]         ;EDX = 1        | 2        | 3        | 4   (1 and 3 are available memory)
 and dx, 01h                   ;EDX = 1        | 0        | 1        | 0 
 dec edx                       ;EDX = 0        | ffffffff | 0        | ffffffff 
 not edx                       ;EDX = ffffffff | 0        | ffffffff | 0 
 and eax, edx                  ;EAX = length   | 0        | length   | 0 

 add ebp, eax

 ;Show current memory descriptor 
 call show_memory_range

_next_memory_range:
 test ebx, ebx 
 jnz _get_memory_range

 ;Print empty line
 push WORD strNL 
 call print 

 ;Print total memory available 
 push ebp 
 push WORD strTotal
 call print 

 cli
 ret

_error:
 ;Print error
 push WORD strError
 call print

 cli 
 ret

 ;This function just show the string strFormat with the appropriate values 
 ;taken from the mem descriptor 
 show_memory_range:
  push bp
  mov bp, sp

  ;Extend SP into ESP so we can use ESP in memory operanda (SP is not valid in any addressing mode)
  movzx esp, sp 

  ;Last percent
  push DWORD [type]

  ;Last percents pair
  push DWORD [length]
  push DWORD [length + 04h]

  ;Add baseAddress and length (64 bit addition)
  push DWORD [baseAddress]
  mov eax, DWORD [length]
  add DWORD [esp], eax               ;Add (lower DWORD)
  push DWORD [baseAddress + 04h]
  mov eax, DWORD [length + 04h]
  adc DWORD [esp], 0                 ;Add with carry (higher DWORD)

  ;First percents pair
  push DWORD [baseAddress]
  push DWORD [baseAddress + 04h]

  push WORD strFormat
  call print

  mov sp, bp                         ;print is a mixed stdcall/cdecl, remove the arguments

  pop bp
  ret

 ;Show a 32 bit hex number
 itoa16:
  push cx
  push ebx

  mov cl, 28d

 .digits:
   mov ebx, eax
   shr ebx, cl
   and bx, 0fh                     ;Get current nibble

   ;Translate nibble (digit to digital)
   mov bl, BYTE [bx + hexDigits]

   ;Show it 
   mov bh, 0ch
   mov WORD [fs:si], bx
   add si, 02h   

   sub cl, 04h
  jnc .digits

  pop ebx
  pop cx
  ret

  hexDigits db "0123456789ABCDEF"

  ;This function is a primitive printf, where the only format is % to show a 32 bit 
  ;hex number 
  ;The "cursor" is kept by SI.
  ;SI is always aligned to lines, so 1) never print anything bigger than 80 chars
  ;2) successive calls automatically print into their own lines 
  ;3) SI is assumed at the beginning of a line 

  ;Args
  ;Format
  print:
   push bp
   mov bp, sp

   push di
   push cx

   mov di, WORD [bp+04h]      ;String 
   mov cx, 80*2               ;How much to add to SI to reach the next line 

   add bp, 06h                ;Pointer to var arg 

  .scan:

    ;Read cur char 
    mov al, [di]
    inc di

    ;Format?
    cmp al, '%'
    jne .print

    ;Get current arg and advance index 
    mov eax, DWORD [bp]
    add bp, 04h
    ;Show the number 
    call itoa16

    ;We printed 8 chars (16 bytes) 
    sub cx, 10h

   jmp .scan    

  .print:
    ;End of string?
    test al, al
    je .end

    ;Normal char, print it 
    mov ah, 0ch
    mov WORD [fs:si], ax
    add si, 02h
    sub cx, 02h

   jmp .scan   


  .end:
   add si, cx

   pop cx
   pop di

   pop bp
   ret
   
; ==================================================================================================
ramprompt		db	"? ", 0x00
kernelret		db	">", 0x00
daignostic 		db	"DIAGNOSE", 0x00

ramerrormsg		db 	"/SYNTAX ERROR!", 0x00

;Memory descriptor returned by INT 15 
baseAddress 	dq 0
length      	dq 0
type        	dd 0
extAttr     	dd 0

;Strings, here % denote a 32 bit argument printed as hex 
strFormat	 	db "%% - %% (%%) - %", 0
strError  		db "/ERROR TRY AGAIN OR RESET CPU/", 0
strTotal  		db "Total amount of memory: %", 0 
;This is tricky, see below 
strNL     		db 0

