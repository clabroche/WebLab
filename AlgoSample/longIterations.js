//#output:v
//#output:c
i=0
v=Math.random();
c=Math.random();
pause(1000)

function pause(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}
