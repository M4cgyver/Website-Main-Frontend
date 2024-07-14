;===DEFAULT.ASM=====================================================================================
;Defaut asm file for external programs

BITS 16
ORG 32768

Main:
	mov ah, 0
    mov al, 13h 
    int 10h
	
	mov ah, 0ch
	mov bh, 0
	mov dx, 0
	mov cx, 0
	mov al, 0000b
	int 10h
	
	mov ah, 0ch
	mov bh, 0
	mov dx, 1
	mov cx, 0
	mov al, 0001b
	int 10h
	
	mov ah, 0ch
	mov bh, 0
	mov dx, 2
	mov cx, 0
	mov al, 0010b
	int 10h
	
	mov ah, 0ch
	mov bh, 0
	mov dx, 3
	mov cx, 0
	mov al, 0100b
	int 10h
	
	mov ah, 0ch
	mov bh, 0
	mov dx, 4
	mov cx, 0
	mov al, 1000b
	int 10h
	
	mov ah, 0ch
	mov bh, 0
	mov dx, 5
	mov cx, 0
	mov al, 1100b
	int 10h
	
	
	mov ah, 0ch
	mov bh, 0
	mov dx, 6
	mov cx, 0
	mov al, 1111b
	int 10h
	
	jmp $
	
;===INCLUDE=========================================================================================
%INCLUDE "system.inc"