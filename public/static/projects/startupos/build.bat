@echo off

echo Prepairing...
copy src\include\*.asm nasm 
copy src\include\*.inc nasm
rmdir /q build
md build\system 

echo.
echo Building boot.asm...
cd nasm
nasm -f bin ..\src\boot\boot.asm -o ..\build\boot.bin
copy ..\build\boot.bin ..\build\system.img
cd ..\

echo.
echo Building kernel.asm...
cd nasm
nasm -f bin ..\src\kernel\kernel.asm -o ..\build\kernel.bin
copy ..\build\kernel.bin ..\build\system\kernel.bin 
cd ..\

echo.
echo Building external programs...
cd nasm
	for %%i in (..\src\system\*.asm) do nasm -f bin %%i
	
	cd ..\src\system\
	for %%i in (*.) do copy %%i ..\..\build\system\%%i.bin
	
cd ..\

echo.
echo Mounting disk image...
cd imdisk
imdisk -a -f ..\build\system.img -s 1440K -m B:

echo.
echo Copying neccessary files...
copy ..\build\system b:\

echo.
echo Dismounting disk image...
imdisk -D -m B:

echo.
echo Cleaning...
	for %%i in (..\src\system\*.bin) do del %%i
echo.

echo Done!

pause