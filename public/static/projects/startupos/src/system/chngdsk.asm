;===CHNGDSK.ASM==================================================================================
;Will change the disk

main:
	mov dl, 00h					; Drive A
	call os_get_disk_status
	mov [drivea], ah
	
	mov dl, 01h					; Drive B
	call os_get_disk_status
	mov [driveb], ah	
	
	mov dl, 80h					; Drive C
	call os_get_disk_status
	mov [drivec], ah
	
	mov dl, 81h					; Drive D
	call os_get_disk_status
	mov [drived], ah			
	
	mov dl, 81h					; Drive E
	call os_get_disk_status
	mov [drivee], ah
	
choose:
	
	
drivea		db 0
driveb		db 0
drivec		db 0
drived		db 0
drivee		db 0
	
%INCLUDE "system.inc"