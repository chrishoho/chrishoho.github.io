webpackJsonp([1],{
	A9fn:function(t,e,n){
		"use strict";
		var a={
			render:function(){
				this.$createElement;
				this._self._c;
				return this._m(0)},
			staticRenderFns:[function(){
				var t=this.$createElement,e=this._self._c||t;
				return e("div",[e("h2",[this._v("A playground of Tensorflow JS")])])}
			]
		};
	e.a=a},
	C9st:function(t,e){},
	NHnr:function(t,e,n){
		"use strict";
		Object.defineProperty(e,"__esModule",{value:!0});
		var a=n("7+uW"),s={render:function(){var t=this.$createElement,e=this._self._c||t;
		return e("div",{staticClass:"container-fluid"},[e("ul",{staticClass:"nav nav-tabs"},[e("li",{class:this.tabClass("Home")},[e("router-link",{attrs:{to:{name:"Home"}}},[this._v("Home")])],1),this._v(" "),e("li",{class:this.tabClass("Yolo")},[e("router-link",{attrs:{to:{name:"Yolo"}}},[this._v("Tiny YOLOv2")])],1)]),this._v(" "),e("div",{attrs:{id:"app"}},[e("router-view")],1)])},staticRenderFns:[]};
		var r=n("VU/8")(
			{
				name:"app",
				methods:{
					tabClass:function(t){
						return this.$route.name===t?"active":""}
				}
			},s,!1,function(t){
				n("geS0")
			},
			null,
			null
		).exports,
		o=n("/ocq"),
		i=n("Xxa5"),
		c=n.n(i),
		l=n("exGp"),
		d=n.n(l),
		u=n("//Fk"),
		h=n.n(u),
		f=["person","bicycle","car","motorbike","aeroplane","bus","train","truck","boat","traffic light","fire hydrant","stop sign","parking meter","bench","bird","cat","dog","horse","sheep","cow","elephant","bear","zebra","giraffe","backpack","umbrella","handbag","tie","suitcase","frisbee","skis","snowboard","sports ball","kite","baseball bat","baseball glove","skateboard","surfboard","tennis racket","bottle","wine glass","cup","fork","knife","spoon","bowl","banana","apple","sandwich","orange","broccoli","carrot","hot dog","pizza","donut","cake","chair","sofa","pottedplant","bed","diningtable","toilet","tvmonitor","laptop","mouse","remote","keyboard","cell phone","microwave","oven","toaster","sink","refrigerator","book","clock","vase","scissors","teddy bear","hair drier","toothbrush"],
		m=[[.57273,.677385],[1.87446,2.06253],[3.33843,5.47434],[7.88282,3.52778],[9.77052,9.16828]],
		//v={modelUrl:"https://raw.githubusercontent.com/syshen/tfjs-models/master/Yolov2-Tiny/model.json",
		v={modelUrl:"Yolov2-Tiny/model.json",
		size:{width:416,height:416},
		toTensor:function(t){
			var e=this;
			return tf.tidy(function(){
				var n=tf.fromPixels(t),a=e.size.width,s=n.shape[1]/2-a/2,r=n.shape[0]/2-a/2;
				return n.slice([r,s,0],[a,a,3]).expandDims(0).toFloat().div(tf.scalar(255))
			}
			)
		},
		box_iou:function(t,e){
			var n=t[2]*t[3];
			if(n<=0)	return 0;
			var a=e[2]*e[3];
			if(a<=0)	return 0;
			var s=Math.max(t[0],e[0]),r=Math.max(t[1],e[1]),o=Math.min(t[0]+t[2],e[0]+e[2]),i=Math.min(t[1]+t[3],e[1]+e[3]),c=Math.max(i-r,0)*Math.max(o-s,0);
return c/(n+a-c)},
nonMaxSuppression:function(t,e){for(var n=this,a=[],s=0;
s<t.length;
s++)a.push([t[s],[e[4*s],e[4*s+1],e[4*s+2],e[4*s+3]],s]);
var r=a.sort(function(t,e){return e[0]-t[0]}),o=[];
return r.forEach(function(t){for(var e=!0,a=0;
a<o.length;
a++){n.box_iou(t[1],o[a][1])>.5&&(e=!1)}e&&o.push(t)}),o},computeBoundingBoxes:function(t){return tf.tidy(function(){var e=tf.scalar(.5),n=f.length,a=m.length,s=tf.tensor2d(m),r=tf.reshape(s,[1,1,a,2]),o=t.shape.slice(1,3),i=o[0],c=o[1],l=tf.range(0,o[0]),d=tf.range(0,o[1]);
l=tf.tile(l,[o[1]]),d=tf.tile(tf.expandDims(d,0),[o[0],1]),d=(d=tf.transpose(d)).flatten();
var u=tf.transpose(tf.stack([l,d]));
u=tf.reshape(u,[o[0],o[1],1,2]),u=tf.cast(u,t.dtype),t=tf.reshape(t,[o[0],o[1],a,n+5]),o=tf.cast(tf.reshape(tf.tensor1d(o),[1,1,1,2]),t.dtype);
var h=tf.sigmoid(t.slice([0,0,0,0],[i,c,a,2])),v=tf.exp(t.slice([0,0,0,2],[i,c,a,2])),p=tf.sigmoid(t.slice([0,0,0,4],[i,c,a,1])),g=tf.softmax(t.slice([0,0,0,5],[i,c,a,n]));
h=tf.div(tf.add(h,u),o),v=tf.div(tf.mul(v,r),o);
for(var b=tf.tensor1d([2]),w=tf.sub(h,tf.div(v,b)),x=[w.shape[0],w.shape[1],w.shape[2],1],y=tf.concat([w.slice([0,0,0,0],x),w.slice([0,0,0,1],x),v.slice([0,0,0,0],x),v.slice([0,0,0,1],x)],3),_=p.mul(g),C=tf.argMax(_,-1),k=tf.max(_,-1),L=tf.greaterEqual(k,e).flatten(),E=L.buffer(),B=[],M=0;
M<L.shape[0];
M++){E.get(M)&&B.push(M)}if(0==B.length)return[null,null,null];
var z=tf.tensor1d(B);
return z=tf.cast(z,"int32"),[tf.gather(C.flatten(),z),tf.gather(k.flatten(),z),tf.gather(y.reshape([L.shape[0],4]),z)]})}},p={name:"yolo",data:function(){return{label:"Drop image here",logs:null,colors:{head:"red",face:"green",person:"yellow",leg:"blue",hand:"blue",bed:"white"}}},methods:{sendLog:function(t){null===this.logs?this.logs=t:this.logs=this.logs+"<br/>"+t,console.log(t)},drawImage:function(t){var e=document.getElementById("canvas"),n=e.getContext("2d");
return new h.a(function(a,s){var r=new FileReader;
r.onload=function(t){var s=new Image;
s.onload=function(){var t=416,r=416;
s.width<s.height?r=416*s.height/s.width:t=416*s.width/s.height,e.width=t,e.height=r,e.setAttribute("style","width: "+t+"px; height: "+r+"px"),document.getElementById("overlay").setAttribute("style","width: "+t+"px; height: "+r+"px"),n.drawImage(s,0,0,t,r),a()},s.src=t.target.result},r.readAsDataURL(t)})},drop:function(t){var e=this;
this.logs=null;
var n=t.dataTransfer;
n.files.length>0?(this.clearBBox(),this.drawImage(n.files[0]).then(function(){return tf.nextFrame}).then(function(){e.start()})):console.error("no file readed")},dragover:function(){},dragleave:function(){},drawBBox:function(t,e,n,a){t.width,v.size.width,t.height,v.size.height;
var s=Math.max(e[0]*v.size.width+(t.width-v.size.width)/2,0),r=Math.max(e[1]*v.size.height+(t.height-v.size.height)/2,0),o=Math.min(e[2]*v.size.width,v.size.width),i=Math.min(e[3]*v.size.height,v.size.height),c=document.createElement("div");
c.classList.add("bbox"),c.setAttribute("style","top: "+r+"px; left: "+s+"px; width: "+o+"px; height: "+i+"px");
var l=document.createElement("div");
l.classList.add("label"),l.innerText=n,c.appendChild(l);
var d=document.getElementById("overlay");
d.setAttribute("style","left: "+t.offsetLeft+"px"),d.appendChild(c)},clearBBox:function(){for(var t=document.getElementById("overlay");
t.firstChild;
)t.removeChild(t.firstChild)},detect:function(){var t=d()(c.a.mark(function t(){var e,n,a,s,r,o,i,l,d,u;
return c.a.wrap(function(t){for(;
;
)switch(t.prev=t.next){case 0:return e=this,n=document.getElementById("canvas"),a=v.toTensor(n),this.sendLog("> Begin detecting"),s=performance.now(),console.log(e.model),r=e.model.predict(a),this.sendLog("< End detecting ("+(performance.now()-s)/1e3+" seconds)"),this.sendLog("-------"),t.next=11,tf.nextFrame();
case 11:return this.sendLog("Post-processing"),this.sendLog("> Computing bounding boxes"),t.next=15,tf.nextFrame();
case 15:return s=performance.now(),o=v.computeBoundingBoxes(r),this.sendLog("< Computing bounding boxes ("+(performance.now()-s)/1e3+" seconds)"),this.sendLog("-------"),t.next=21,tf.nextFrame();
case 21:if(null!==o[0]){t.next=24;
break}return this.sendLog("Detect nothing"),t.abrupt("return");
case 24:return t.next=26,o[0].data();
case 26:return i=t.sent,t.next=29,o[1].data();
case 29:return l=t.sent,t.next=32,o[2].data();
case 32:return d=t.sent,this.sendLog("> Non-max-suppression"),s=performance.now(),u=v.nonMaxSuppression(l,d),this.sendLog("< Non-max-suppression: ("+(performance.now()-s)/1e3+" seconds)"),this.sendLog("Number of boxes detected:"+u.length),this.sendLog("-------"),t.next=41,tf.nextFrame();
case 41:return this.sendLog("> Begin drawing boxes"),t.next=44,tf.nextFrame();
case 44:u.forEach(function(t){var a=f[i[t[2]]],s=t[0];
e.drawBBox(n,t[1],a,s)}),this.sendLog("< Done");
case 46:case"end":return t.stop()}},t,this)}));
return function(){return t.apply(this,arguments)}}(),start:function(){var t=this;
if(void 0!==this.model)this.detect();
else{var e=performance.now();
this.sendLog("> Load model file"),tf.loadModel(v.modelUrl).then(function(n){var a=(performance.now()-e)/1e3;
return t.sendLog("< Model file was loaded ("+a+" seconds)"),t.sendLog("-------"),t.model=n,tf.nextFrame()}).then(function(){t.detect()}).catch(function(e){t.sendLog("Failed to load model file"),console.error(e)})}}},mounted:function(){window.addEventListener("dragover",function(t){return t.preventDefault()},!1),window.addEventListener("drop",function(t){return t.preventDefault()},!1)},destroyed:function(){window.removeEventListener("dragover",function(t){return t.preventDefault()}),window.removeEventListener("drop",function(t){return t.preventDefault()})}},g={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;
return n("div",{staticClass:"hello"},[n("div",{staticClass:"row"},[n("div",{staticClass:"col-md-8 col-md-offset-2 dropzone",on:{drop:t.drop,dragover:function(e){return e.preventDefault(),t.dragover(e)},dragleave:t.dragleave}},[n("svg",{staticClass:"icon",attrs:{xmlns:"http://www.w3.org/2000/svg",width:"50",height:"43",viewBox:"0 0 50 43"}},[n("path",{attrs:{d:"M48.4 26.5c-.9 0-1.7.7-1.7 1.7v11.6h-43.3v-11.6c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v13.2c0 .9.7 1.7 1.7 1.7h46.7c.9 0 1.7-.7 1.7-1.7v-13.2c0-1-.7-1.7-1.7-1.7zm-24.5 6.1c.3.3.8.5 1.2.5.4 0 .9-.2 1.2-.5l10-11.6c.7-.7.7-1.7 0-2.4s-1.7-.7-2.4 0l-7.1 8.3v-25.3c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v25.3l-7.1-8.3c-.7-.7-1.7-.7-2.4 0s-.7 1.7 0 2.4l10 11.6z"}})]),t._v(" "),n("label",[t._v(t._s(t.label))])])]),t._v(" "),n("div",{staticClass:"row"},[n("div",{staticClass:"col-md-4  text-left"},[t.logs?n("div",[n("pre",{domProps:{innerHTML:t._s(t.logs)}})]):t._e()]),t._v(" "),t._m(0)])])},staticRenderFns:[function(){var t=this.$createElement,e=this._self._c||t;
return e("div",{staticClass:"col-md-6 "},[e("canvas",{attrs:{id:"canvas"}}),this._v(" "),e("div",{attrs:{id:"overlay"}})])}]};
var b=n("VU/8")(p,g,!1,function(t){n("iD2w"),n("vyDi")},"data-v-48add75f",null).exports,w=n("xa4f"),x={name:"webcam",data:function(){return{camera:null,stopped:!1,videoHeight:null,videoWidth:null,timer:null}},methods:{pause:function(){this.timer&&(this.stopped=!0,clearInterval(this.timer),this.timer=null)},resume:function(){this.stopped=!1,this.start()},start:function(){var t=this,e=this;
this.timer=setInterval(function(){var n=t.camera.capture();
e.$emit("video",n)},2e3)}},mounted:function(){this.camera=new JpegCamera("#camera");
var t=this;
this.camera.ready(function(e){t.videoHeight=e.video_height,t.videoWidth=e.video_width,console.log(t.camera)}),this.start()},destroyed:function(){this.pause(),this.camera.video.src.getTracks().forEach(function(t){t.stop()}),this.camera.discard_all()}},y={render:function(){var t=this.$createElement;
return(this._self._c||t)("div",{staticStyle:{"background-color":"grey"},attrs:{id:"camera"}})},staticRenderFns:[]},_={name:"YoloWelCam",components:{WebCam:n("VU/8")(x,y,!1,null,null,null).exports},data:function(){return{detecting:!1,model:null}},methods:{drawBBox:function(t,e,n){},detect:function(){var t=d()(c.a.mark(function t(e){return c.a.wrap(function(t){for(;
;
)switch(t.prev=t.next){case 0:v.toTensor(e);
case 1:case"end":return t.stop()}},t,this)}));
return function(e){return t.apply(this,arguments)}}(),handleVideo:function(){var t=d()(c.a.mark(function t(e){var n;
return c.a.wrap(function(t){for(;
;
)switch(t.prev=t.next){case 0:n=this,this.model&&this.detecting&&e.get_canvas(function(t){tf.tidy(function(){n.detect(cavnas)})});
case 2:case"end":return t.stop()}},t,this)}));
return function(e){return t.apply(this,arguments)}}(),start:function(){var t=this;
console.log("start loading model"),tf.loadModel(this.modelUrl).then(function(e){t.detecting=!0,t.model=e})},stop:function(){self.begin=!1}},mounted:function(){}},C={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;
return n("div",{staticClass:"container"},[n("div",{staticClass:"row"},[n("div",{staticClass:"col-sm-6"},[n("WebCam",{staticClass:"webcam",on:{video:t.handleVideo}}),t._v(" "),n("canvas",{attrs:{id:"overlay"}})],1)]),t._v(" "),n("div",{staticClass:"row"},[n("div",{staticClass:"col-sm-3"},[n("a",{staticClass:"btn btn-block btn-info",on:{click:t.start}},[t._v("Start")])]),t._v(" "),n("div",{staticClass:"col-sm-3"},[n("a",{staticClass:"btn btn-block btn-warn",on:{click:t.stop}},[t._v("Stop")])])])])},staticRenderFns:[]};
var k=n("VU/8")(_,C,!1,function(t){n("n97K")},"data-v-b8f4c218",null).exports;
a.a.use(o.a);
var L=new o.a({routes:[{path:"/",name:"Home",component:w.default},{path:"/yolo",name:"Yolo",component:b},{path:"/yolo-webcam",name:"YoloWebCam",component:k}]});
a.a.config.productionTip=!1,n("C9st"),new a.a({el:"#app",router:L,components:{App:r},template:"<App/>"})},geS0:function(t,e){},iD2w:function(t,e){},n97K:function(t,e){},uXHU:function(t,e){},vyDi:function(t,e){},xa4f:function(t,e,n){"use strict";
var a=n("uXHU"),s=n.n(a),r=n("A9fn"),o=n("VU/8")(s.a,r.a,!1,null,null,null);
e.default=o.exports}},["NHnr"]);

//# sourceMappingURL=app.957c7bb1cfd039d51123.js.map