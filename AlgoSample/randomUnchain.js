//#output:v
//#output:c
i=0
v=Math.random();
c=Math.random();
pause(3000)
function pause(milliseconds) {
	var dt = new Date();
	while ((new Date()) - dt <= milliseconds) { /* Do nothing */ }
}
