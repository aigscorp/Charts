let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');
let canvas2 = document.getElementById('tablo');
let context2 = canvas2.getContext('2d');

let dayMode = true;
let opacity = "#f3f3f394";

let counter = 1;
let max_y;
let arr = [];
let charts = [];
context.lineWidth = 1;
const x = canvas.width;
const y = canvas.height; 
const x0 = 50;
const y0 = y - x0;
const tablo_x = canvas2.width;
const tablo_y = canvas2.height;
const animMove = 6;
let widthRunner = 250;
let heightRunner = 100;

let mode = document.getElementsByClassName('mode')[0];
mode.addEventListener('click', dayModeSwitch);

function dayModeSwitch(){
  dayMode = !dayMode;
  let span = document.querySelectorAll('div.main>span');
  let color;
  if(dayMode){
    canvas.style.backgroundColor = '';
    canvas2.style.backgroundColor = '';
    select.style.backgroundColor = '';
    panel.style.backgroundColor = '';
    opacity = "#f3f3f394";
    color = "#000000";
  }else{
    canvas.style.backgroundColor = '#242f3e';
    canvas2.style.backgroundColor = '#242f3e';
    select.style.backgroundColor = '#242f3e';
    panel.style.backgroundColor = '#242f3e';
    opacity = "#1f2a3894";
    color = '#ffffff';
  }
  for(let i = 0; i < span.length; i++){
    span[i].style.color = color;
  }
  updateCharts();
};

function Runner(x, y, w, h){
  this.x = x;
  this.y = y;
  this.width = w;
  this.height = h;
  this.isDragging = false;
  this.dd = {drag: null, drop: null};
  this.oldX = 0;
  this.borderWidth = 10;
  this.isDraggingBorder = false;
};
Runner.prototype.draw = function(ctx){
  ctx.strokeStyle =  "#b9dff99c"; 
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(this.x, this.y);
  ctx.lineTo(this.x+this.width, this.y);
  ctx.closePath();
  ctx.stroke();

  ctx.lineWidth = this.borderWidth;
  ctx.beginPath();
  ctx.moveTo(this.x+this.width, this.y);
  ctx.lineTo(this.x+this.width, this.y+this.height);
  ctx.closePath();
  ctx.stroke();

  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(this.x+this.width, this.y+this.height);
  ctx.lineTo(this.x, this.y+this.height);
  ctx.closePath();
  ctx.stroke();

  ctx.lineWidth = this.borderWidth;
  ctx.beginPath();
  ctx.moveTo(this.x, this.y+this.height);
  ctx.lineTo(this.x, this.y);
  ctx.closePath();
  ctx.stroke();
  ctx.fillStyle = "#ffffff01";
  ctx.rect(this.x, this.y, this.width, this.height);
  ctx.fill();
};
Runner.prototype.drawCircle = function(ctx){
  ctx.fillStyle = "rgba(125,125,125, .2)";
  let x, y;
  let r = Math.floor(this.height/2 + 20);
  y = Math.floor(this.height/2 + this.y);
  if(this.isDragging){
    x = Math.floor(this.width/2 + this.x);
  }else if(this.isDraggingBorder){
    x = Math.floor(this.x);
  }else {
    return;
  }
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.fill();
  ctx.closePath();
};
Runner.prototype.drag = function(run, ev){
  let size;
  counter++;
  if(run.isDragging){//
    if(run.x <= x0){
      run.x = x0;
    }
    if(run.x + run.width > canvas2.width){
      run.x = canvas2.width - run.width;
    }
    size = run.width;    
    run.x +=ev.clientX - run.oldX; 
    run.oldX = ev.clientX;
    context.clearRect(0,0,x,y);
    drawGrid(context, max_y);
    drawCharts(context, run.x-x0, size, max_y, charts);
    
  }
  if(run.isDraggingBorder){
    if(run.x <= x0){
      run.x = x0;
    }
    if(run.x + run.width > canvas2.width){
      run.x = canvas2.width - run.width;
    }
    size = run.width;
    run.x += ev.clientX - run.oldX;
    run.width -= ev.clientX - run.oldX;
    run.oldX = ev.clientX;
    if(counter % (animMove+2) == 0){
      context.clearRect(0,0,x,y);
      drawGrid(context, max_y);
      drawCharts(context, run.x-x0, size, max_y, charts);
        
    }
   
  }
  context2.clearRect(0,0,canvas2.width, canvas2.height);
  drawChart(context2, charts);
  drawBackground(context2, run, opacity);
  run.draw(context2);
  run.drawCircle(context2);
};
Runner.prototype.drop = function(){
  let self = this;
  self.isDragging = false;
  self.isDraggingBorder = false;
  if(self.x < x0) self.x = x0;
  canvas2.style.cursor = "";
  context2.clearRect(0,0,canvas2.width, canvas2.height);
  canvas2.removeEventListener('mousemove', self.dd.drag); //
  canvas2.removeEventListener('mouseup', self.dd.drop);
  drawChart(context2, charts);
  drawBackground(context2, self, opacity);
  this.draw(context2);
};
Runner.prototype.init = function(){
  let self = this;
  self.dd.drag = self.drag.bind(null, self);
  self.dd.drop = self.drop.bind(self);
  
  canvas.addEventListener('mousedown', (ev)=>{
    let offsetLeft = canvas.getClientRects()[0].left;
    let coordx = ev.clientX-offsetLeft;
    let show = 0;
    for(let j = 0; j < charts.length; j++){
      if(charts[j].render) show++;
    }
    
    if(show == 0) return;
    if(coordx +0.1 < x0) return;
    context.clearRect(0,0,x,y);
    let sx = runner.x-x0;
    
    let range = (runner.width)/(x - x0);
    let arr_count = arr.length
    let f = Math.floor((arr_count/(x-x0)) * (sx + (coordx-x0) * range));
    drawGrid(context, max_y);
    drawCharts(context, runner.x-x0, runner.width, max_y, charts);
        
    let arcs = [];
    let rgb = context.getImageData(coordx, 10, 1, 360);
    let pixel = rgb.data;
    let liney = [];

    for(let j = 0; j < charts.length; j++){
      let hex = hexToRgb(charts[j].color);
      let arc = {};
      for(let i = 0, len = pixel.length; i < len; i = i+4){
        if((pixel[i] == hex[0]) && (pixel[i+1] == hex[1]) && (pixel[i+2] == hex[2]) && (pixel[i+3] == hex[3])){
          arc.x = coordx;
          arc.y = i/4;
          arc.name = j;
          arc.color = charts[j].color;
          liney.push(arc.y);
          arcs.push(arc);
          break;
        }
      }
    }
    let yy = getMinOfArray(liney);
    let xx = arcs[0].x;
    let mul = 1;
    if(charts.length == 4) mul = 2;
    
    let wx = 150; //100*(show-1)+100; 
    let lx = 50;
    let vy = hy = 70;
    
    if(yy-vy < 0){
      xx = 795;
      vy = arcs[0].y+5;
    }
    
    if(canvas.width - xx < wx && mul == 1) xx = canvas.width-wx+x0-5;
    if(canvas.width - xx < mul*wx && mul == 2) xx = canvas.width-wx*mul+x0-5;     
        
    context.strokeStyle = "#8f8f8fc7"
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(coordx, vy);//vy
    context.lineTo(coordx, y0);
    context.stroke();
    context.closePath();

    context.fillStyle = '#FFFFFF';
    for(let i = 0; i < arcs.length; i++){
      context.beginPath();
      context.strokeStyle = arcs[i].color;
      context.arc(arcs[i].x, arcs[i].y+10, 5, 0, 2*Math.PI);
      context.fill();
      context.stroke();
      context.closePath();
    }

    context.strokeStyle = "#8f8f8fc7"
    context.lineWidth = 1;
    context.roundRect(xx-lx, 5, wx*mul, hy, 5);
    roundRectText(context, xx-lx, 5, wx, f);
    context.stroke();
  });

  canvas2.addEventListener('mousedown', (ev)=>{
    canvas2.style.cursor = 'none';
    let offsetLeft = canvas2.getClientRects()[0].left;
    
    if(this.x+offsetLeft + this.borderWidth <= ev.clientX && this.x + this.width+offsetLeft-8 >= ev.clientX){
      self.isDragging = true;
    }else if(this.x+offsetLeft-this.borderWidth <= ev.clientX && this.x + offsetLeft+this.borderWidth >= ev.clientX ){
      self.isDraggingBorder = true;
    }
    context2.clearRect(0,0,canvas2.width, canvas2.height);
    drawChart(context2, charts);
    drawBackground(context2, self, opacity);
    self.draw(context2);
    self.drawCircle(context2);
    this.oldX = ev.clientX;
    canvas2.addEventListener('mousemove', self.dd.drag);
    canvas2.addEventListener('mouseup', self.dd.drop);
  });
};

function drawCharts(ctx, skip, display, maxy, charts){
  let count = arr.length;
  let realWidthCanvas = x - x0;
  let skipItem = Math.floor((skip / realWidthCanvas) * count);
  let displayItem = (display / realWidthCanvas) * count;
  let stepx = realWidthCanvas/displayItem;
  displayItem = Math.floor(displayItem);
  let stepy = y0/maxy;
  let cols = 6;
  
  let chart_count = charts.length;
  ctx.lineWidth = 3;
  for(let j = 0; j < chart_count; j++){
    if(charts[j].render){
      ctx.strokeStyle = charts[j].color;
      ctx.beginPath();
      for(let i = skipItem; i <= skipItem + displayItem; i++){
        ctx.lineTo(x0 + i*stepx - stepx*skipItem, y0 - charts[j].data[i]*stepy);
      }
      ctx.stroke();
      ctx.closePath();
    }
  }

  ctx.font = "10px serif";
  ctx.fillStyle = "#7b7c7d";
  let sx = runner.x-x0;
  let ex = sx + runner.width;
  let n1 = Math.floor((sx/(x-x0)) * count);
  let n2 = Math.floor((ex/(x-x0)) * count)
  let n =  Math.floor((n2 - n1)/(cols+1));
  let stepko = Math.ceil((x-x0)/(cols+1));
  for(let i = 0; i <= cols; i++){
    if(i <= 0) continue;
    let date = new Date(arr[n1 + n*i]);
    let str = date.toDateString().split(' ');
    let txt = str[1] + ' ' + str[2];
    let wtxt = ctx.measureText(txt);
    ctx.fillText(txt, x0 + stepko * i - wtxt.width, y0 + 15);
  }
};

let runner = new Runner(50, 25, widthRunner, heightRunner);
postRequest(); //first request

function handlerCheck(index, ev){
  charts[index].render = !charts[index].render;
  updateCharts();
};

function updateCharts(){
  max_y = roundUpNumber(maxElementArray(charts));
  context.clearRect(0,0,x,y);
  drawGrid(context, max_y);
  drawCharts(context, runner.x-x0, runner.width, max_y, charts);
  
  context2.clearRect(0,0,tablo_x,tablo_y);
  drawChart(context2, charts);
  drawBackground(context2, runner, opacity);
  runner.draw(context2);
  runner.drawCircle(context2);
};

let select = document.getElementsByClassName('selectpicker')[0];
select.addEventListener('change', (ev)=>{
  let data = {value: select.value};
  let xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", ()=>{
    if(xhr.readyState == 4){
      let parse = JSON.parse(xhr.response);
      parseRequest(parse);
      createCheckboxes();
      let checkboxes = document.querySelectorAll('input.option-box');
      for(let j = 0; j < checkboxes.length; j++){
        checkboxes[j].addEventListener('click', handlerCheck.bind(null, j));
        if(dayMode) {
          checkboxes[j].parentElement.style.color = "";
        }else {
          checkboxes[j].parentElement.style.color = "#ffffff";
        }
      }
      updateCharts();
    }
  });
  xhr.open('POST', '/'); //http://localhost:5000/
  xhr.setRequestHeader('cache-control', 'no-cache');
  xhr.setRequestHeader('content-type','application/json;charset=utf-8');
  xhr.send(JSON.stringify(data));
});

function parseRequest(str){
  let parse = str;
  let types = parse.types;
  let props = [];
  charts.length = 0;
    
  for(let i = 0; i < parse.columns.length; i++){
    if(parse.columns[i][0] == "x"){
      arr.length = 0;
      arr = parse.columns[i];
      break;
    }
  }
  arr.shift();

  for(let key in types){
    if(key != "x") props.push(key);
  }
          
  for(let i = 0; i < props.length; i++){
    let chart = {};
    for(let j in parse){
      let tmp = parse[j];
      if(Array.isArray(tmp)){
        for(let k = 0; k < tmp.length; k++){
          if(tmp[k][0] == props[i] && tmp[k][0] != "x"){
            chart.data = tmp[k];
            chart.data.shift();
          }
        }
      }else{
        if(j == 'colors') chart.color = tmp[props[i]];
        if(j == 'types') chart.type = tmp[props[i]];
        if(j == 'names') chart.name = tmp[props[i]];
      }
    }
    chart.render = true;
    charts.push(chart);
  }
};

function postRequest(value, ev){
  if(value == undefined) value = "0";
  let data = {value: value};
  let xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", ()=>{
    if(xhr.readyState == 4){
      let parse = JSON.parse(xhr.response);
      parseRequest(parse);
      createCheckboxes();
      max_y = roundUpNumber(maxElementArray(charts));
      let checkboxes = document.querySelectorAll('input.option-box');
      for(let j = 0; j < checkboxes.length; j++){
        checkboxes[j].addEventListener('click', handlerCheck.bind(null, j));
      }
      drawChart(context2, charts);
      context.clearRect(0,0,x,y);
      drawCharts(context, 0, widthRunner, max_y, charts);
      drawGrid(context, max_y);
      drawBackground(context2, runner, opacity);
      runner.init();
      runner.draw(context2);
    }
  });

  xhr.open('POST', '/');
  xhr.setRequestHeader('cache-control', 'no-cache');
  xhr.setRequestHeader('content-type','application/json;charset=utf-8');
  xhr.send(JSON.stringify(data));
};

function createCheckboxes(){
  let panel = document.getElementById('panel');
  let main = document.querySelectorAll('div.main');
  if(main.length != 0){
    for(let i = 0; i < main.length; i++){
      main[i].remove();
    }
  }
  for(let i = 0; i < charts.length; i++){
    let div = document.createElement('div');
    div.className = 'main';
    let input = document.createElement('input');
    input.type = 'checkbox';
    let colorName = 'color' + charts[i].name;
    let bg = 'background-color:' + charts[i].color;
    input.className = 'option-box';
    input.id = 'check-' + colorName;
    input.checked = 'checked';
    input.style = bg;
    label = document.createElement('label');
    label.htmlFor = 'check-' + colorName;
    label.style = bg;
    let span = document.createElement('span');
    span.style = 'padding: 0 10px; font-size: 16px';
    let txt = document.createTextNode(charts[i].name);
    span.appendChild(txt);
    div.appendChild(input);
    div.appendChild(label);
    div.appendChild(span);
    panel.appendChild(div);
  }
};
function getMaxOfArray(numArray) {
  return Math.max.apply(null, numArray);
};
function getMinOfArray(numArray) {
  return Math.min.apply(null, numArray);
};
function roundUpNumber(num){
  let r = 1;
  let res = num;
  let count = 0; 
  while(res > 10){
    count++;
    res = res/10;
    r = r * 10;
  } 
  return Math.ceil(num/r) * r;
};
function maxElementArray(charts){
  let chart_count = charts.length;
  let tmp = [];
  for(let i = 0; i < chart_count; i++){
    if(charts[i].render){
      tmp.push(getMaxOfArray(charts[i].data));
    }
  }
  return getMaxOfArray(tmp);
};

function drawBackground(ctx, run, opacity){
  ctx.fillStyle =  opacity;
  ctx.beginPath();
  ctx.rect(0, run.y, run.x, 100);
  ctx.fill();
  ctx.closePath();
  ctx.beginPath();
  ctx.rect(run.x+run.width, run.y, canvas2.width, 100);
  ctx.fill();
  ctx.closePath();
};

function drawGrid(ctx, grid){
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#cdcbcbb0"; 
  ctx.fillStyle = "#7b7c7d";
  ctx.font = "10px serif"; 
  let rows = 6;
  let stepy = grid/rows;
  let scaley = y0/grid;
  ctx.beginPath();
  
  for(let i = 0; i < rows; i++){
    ctx.moveTo(x0, y0-i*stepy*scaley);
    ctx.lineTo(x, y0-i*stepy*scaley);
    ctx.fillText(i * Math.floor(grid/rows), x0, y0-i*stepy*scaley-5);
  }
  ctx.stroke();
};

function drawChart(ctx, charts, offsetHeight=25){
  ctx.lineWidth = 1;
  let count = arr.length;
  let chart_count = charts.length;
  let stepx = (tablo_x - x0)/count;

  for(let j = 0; j < chart_count; j++){
    if(charts[j].render){
      ctx.strokeStyle = charts[j].color;
      ctx.beginPath();
      ctx.moveTo(x0, tablo_y - offsetHeight - ((tablo_y-2*offsetHeight)/max_y) * charts[j].data[0]);
      for(let i = 0; i < count; i++){
        ctx.lineTo(x0 + i * stepx, tablo_y-offsetHeight - ((tablo_y-2*offsetHeight)/max_y) * charts[j].data[i]);    
      }
      ctx.stroke();
      ctx.closePath();    
    }
  }
};

function hexToRgb (hex) {
  hex = hex.trim();
  hex = hex[0] === '#' ? hex.substr(1) : hex;
  let bigint = parseInt(hex, 16); 
  let rgb = [];
  if (hex.length === 3) {
      rgb.push((bigint >> 4) & 255);
      rgb.push((bigint >> 2) & 255);
  } else {
      rgb.push((bigint >> 16) & 255);
      rgb.push((bigint >> 8) & 255);
  }
  rgb.push(bigint & 255);
  rgb.push(255);
  return rgb;
};

CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r){
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  let fillColor = dayMode ? "#FFFFFF" : "#253241";
  this.fillStyle = fillColor;
  this.beginPath();
  this.moveTo(x+r, y);
  this.arcTo(x+w, y, x+w, y+h, r);
  this.arcTo(x+w, y+h, x, y+h, r);
  this.arcTo(x, y+h, x, y, r);
  this.arcTo(x, y, x+w, y, r);
  this.closePath();
  this.fill();
  // return this;
};

function roundRectText(ctx, x, y, w, index){
  ctx.font = "bold 18px Roboto"; 
  let fillColor = dayMode ? "#000000" : "#FFFFFF";
  ctx.fillStyle = fillColor; 
  let str = new Date(arr[index]).toDateString().split(' ');
  let txt = str[0] + ", " + str[1] + " " + str[2];
  let txt_width = ctx.measureText(txt);
  ctx.fillText(txt, x + w/2-(txt_width.width)/2, y + 20);
  ctx.font = "16px Roboto";
  let bx = x;

  for(let i = 0; i < charts.length; i++){
    if(!charts[i].render) continue;
    ctx.fillStyle = charts[i].color;
    let str = charts[i].data[index];
    let strw = ctx.measureText(str);
    let middle = bx + w/2;  
    let middle2 = bx + (middle-bx)/2 - strw.width/2;  
    let name = charts[i].name;
    let namew = ctx.measureText(name);
    let mid = bx + (middle-bx)/2 - namew.width/2;
    ctx.fillText(charts[i].data[index], middle2, y + 45); 
    ctx.fillText(charts[i].name, mid, y + 65);
    bx = middle; 
  }
};