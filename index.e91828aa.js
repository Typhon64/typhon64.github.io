import{a1 as p}from"./index.cb658010.js";function $(n){const t=n-1;return t*t*t+1}function C(n,{delay:t=0,duration:a=400,easing:e=$,x:f=0,y:i=0,opacity:s=0}={}){const o=getComputedStyle(n),c=+o.opacity,y=o.transform==="none"?"":o.transform,m=c*(1-s),[u,r]=p(f),[d,_]=p(i);return{delay:t,duration:a,easing:e,css:(l,g)=>`
			transform: ${y} translate(${(1-l)*u}${r}, ${(1-l)*d}${_});
			opacity: ${c-m*g}`}}function S(n,{delay:t=0,duration:a=400,easing:e=$,start:f=0,opacity:i=0}={}){const s=getComputedStyle(n),o=+s.opacity,c=s.transform==="none"?"":s.transform,y=1-f,m=o*(1-i);return{delay:t,duration:a,easing:e,css:(u,r)=>`
			transform: ${c} scale(${1-y*r});
			opacity: ${o-m*r}
		`}}export{C as f,S as s};
