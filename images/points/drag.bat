@echo off
REM Drag and drop image files onto this .bat file
REM It will call the Python script and pause for output
python "%~dp0drag.py" %*
pause