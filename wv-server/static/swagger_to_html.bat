@ECHO OFF
CALL bootprint openapi swagger.json target
CALL html-inline -i target/index.html -o apiDoc.html
@RD /S /Q %cd%\target