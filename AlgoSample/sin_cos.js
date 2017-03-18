
//#input:sin=0
//#input:cos=0
//#input:i=0
//#output:sin
//#output:cos
sin=Math.sin(i)
cos=Math.cos(i)
i=Number(i)+0.4
pause(100)
function pause(milliseconds) {
	var dt = new Date();
	while ((new Date()) - dt <= milliseconds) { /* Do nothing */ }
}
