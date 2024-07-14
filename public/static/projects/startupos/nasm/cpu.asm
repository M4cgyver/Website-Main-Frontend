; ==================================================================================================
; --------------------------------------------------------------------------------------------------
; cpu_shutdown -- shutdowns the os
cpu_shutdown:
	; Connect to APM API
	MOV     AX,5301
	XOR     BX,BX
	INT     15

	; Try to set APM version (to 1.2)
	MOV     AX, 530Eh
	XOR     BX,BX
	MOV     CX,0102
	INT     15

	; Turn off the system
	MOV     AX,5307
	MOV     BX,0001
	MOV     CX,0003
	INT     15

	; Exit (for good measure and in case of failure)
	RET