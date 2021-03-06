/*!
 * JY javascript库，版本号：1.0
 * http://www.lovewebgames.com
 * Copyright 2012, 田想兵 
 * Email : yoooyeeey@163.com
 * QQ:55342775
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Date: 2012/7/11
 */

(function(win){
	var JY ={};
	var readyList=[];
	var _ie=document.all?true:false;
	var  n=0;
	var aps = Array.prototype.slice;
	var doc = document;
	//*正则*/
	var spaceRex =/ +/ , 
		trimLeft = /^[\s\xA0]+/,
		trimRight = /[\s\xA0]+$/,
		domRex= /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/;
		splitRex = /(\.\w+)|(\[\w+=[\"\']\w+[\"\']\])/,
		attrRex = /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/ ;
	JY=JY.prototype={
		byId:function(id,doc){
			return ((typeof id =="string") ?(doc||document).getElementById(id):id)||null;
		},
		//**事件延迟加载*/
		//****绑定事件****/
		bind:function(target,eventType,handle){
			/*
			if(target.addEventListener){
				this.bind=function(target,eventType,handle){
					target.addEventListener(eventType,handle,false);
				}
			}else{
				this.bind=function(target,eventType,handle){
					target.attachEvent("on"+eventType,handle);
				}
			};
			this.bind(target,eventType,handle);
			*/
			target = JY.byId(target);
			JY.event.add(target,eventType,handle);
			return JY;
		},
		unbind:function(target,eventType,handle){
			/*
			if(target.removeEventListener){
				this.unbind=function(target,eventType){
					target.removeEventListener(eventType,handle,false);
				}
			}else{
				this.unbind=function(target,eventType){
					target.detachEvent("on"+eventType,handle);
				}
			};
			this.unbind(target,eventType);
			*/
			target = JY.byId(target);
			JY.event.remove(target,eventType,handle);
			return JY;
		},
		one:function(target,eventType,handle){
			target = JY.byId(target);
			JY.event.add(target,eventType,handle,"one");
			return JY;
		},
		//为所有选择器匹配的元素附加一个处理一个或多个事件，现在或将来，基于一组特定的根元素。
		//父节点是trigger，目标节点是selector
		delegate:function(trigger,selector,eventType,handle){
			JY.event.add(trigger,eventType,handle,"delegate",selector);
			return JY;
		},
		live:function(target,eventType,handle){
			JY.event.add(document,eventType,handle,"delegate",target);
			return JY;			
		},
		ready:function(func){	
			readyList.push(func);
			if(_ie){		
				JY.unbind(document,"readystatechange",JY.DOMContentLoaded);
				JY.bind(document,"readystatechange",JY.DOMContentLoaded);
			}else{
				JY.bind(win,"DOMContentLoaded",JY.DOMContentLoaded);
			};
			return JY;
		},
		_startReady:function(){
			for(var i=0,len=readyList.length;i<len;i++){
				setTimeout(readyList[i],25);
			};
			return JY;
		},
		DOMContentLoaded:function(func){
			if(_ie){
				if( document.readyState ==="complete"||document.readyState==="interactive"){					
					JY.unbind(document,"readystatechange",JY.DOMContentLoaded);
					JY._startReady();
				}
			}else{
				JY.unbind(win,"DOMContentLoaded",JY.DOMContentLoaded);
				JY._startReady();
			};
			return JY;
		},
		//查找元素父级节点
		parent:function(elem){
			elem = JY.byId(elem);
			var p = elem. parentNode;
			return p && p.nodeType !== 11 ? p : null;
		},
		//查找当前元素的子级
		child:function(elem){
			elem=JY.byId(elem); 
			var n = elem.firstChild;
			var r = new List();
			for ( ; n; n = n.nextSibling ) {
				if ( n.nodeType === 1 && n !== elem ) {
					r.push( n );
				}
			};
			return r;
		},
		//查找相邻元素(后面)
		next:function (elem){
			return this._brother(elem,"nextSibling");
		},
			//查找相领前面元素
		prev:function(elem){
			return this._brother(elem,"previousSibling");
		},
			//第一个子级节点
		first:function(elem){
			elem=JY.byId(elem).firstChild;
			return (elem && elem.nodeType !=1) ? this.next(elem):elem;
		},
			// 最后一个子级节点
		last:function(elem){
			elem = JY.byId(elem).lastChild;
			return (elem && elem.nodeType !=1) ? this.prev(elem):elem;
		},
		_brother:function(elem,position){
			elem=JY.byId(elem); 
			do{
				elem = elem[position];
			}
			while (elem && elem.nodeType !=1);
			return elem;
		},
			//设置或获取节点样式
		css:function(elem,name,value){
			elem=JY.byId(elem);
			if (typeof name ==="object"){
				for (var i in name ){
					this.css(elem, i,name[i]);
				}
				return this;
			}else{
				if (value){
					return JY._assign(elem,name,value,'style');
				}else{
					return JY.curCss(elem,name);	
				}
			}
		},
		curCss:function(elem,name){
			if (doc.defaultView){
				this.curCss = function(elem,name){
					return doc.defaultView.getComputedStyle(elem,null)[name];
				};
				return this.curCss(elem,name);
			}else{
				this.curCss = function(elem ,name){
					return elem.currentStyle ? elem. currentStyle[name]:elem.style[name];
				};
				return this.curCss(elem ,name);
			}
		},
			//获取或设置属性置
		attr:function(elem,name,value){
			elem=JY.byId(elem);
			return JY._assign(elem,name,value,'attribute');
		},
		_assign:function(elem,name,value,func){
			if(typeof name ==="string"){
					if (typeof value!=="undefined"){
						func==="style" ? elem[func][name]=value : elem.setAttribute(name,value);
					}else{
						return (func==="style" ?  elem[func][name] :  elem.getAttribute(name))||"";						
					}
				}else{
					for(var i in name){
						JY._assign(elem,i,name[i],func);
					}
			}
		},
			//隐藏节点
		hide:function(elem){
			elem = JY.byId(elem);
			JY.css(elem,"display","none");
			return this;
		},
			//显示节点
		show:function(elem){
			elem = JY.byId(elem);
			JY.css(elem,"display","block");
			return this; 
		},
		//*继承扩展对象*/
		extend:function(){
			var target = arguments[0]||{};
			var obj = arguments[1];
			if (typeof target == "function"){
				target =target.prototype;
			}
			if (typeof obj ==="object"){
				for (var i  in obj ){
					target[i]=obj[i];
				}
				if (arguments.length>2){
					arguments.callee.apply(this,[target].concat(aps.call(arguments,2)));
				}
			}
		},
		//*样式类*/
		addClass:function(elem,cls){
			if (elem.addClass){
				elem.addClass(cls);
			}else
			if ( !JY.hasClass(elem,cls) ){
				var tempCls = JY.attr(elem,"class");
				tempCls = tempCls ? (tempCls + " " + cls) : cls;
				JY.attr(elem,"class",tempCls);
			};
			return elem;
		},
			//判断是否有class
		hasClass:function(elem,cls){
			var elem = JY.byId(elem);
			if (elem.hasClass){
				return elem.hasClass(cls);
			}else{
				var tmpCls = JY.attr(elem,"class");
				var re =new RegExp("\\b"+cls+"\\b");
				return re.test(elem.className);
				/*
				var cls_list = tmpCls?tmpCls.split(spaceRex):[];
				var isCls = false;
				for (var i =cls_list.length-1; i>=0 ;i-- ){
					if (cls_list[i]===cls){
						isCls = true;
					}
				}
				return isCls;*/
			}
		},
			//根据class查找节点列表List
		byClass:function(cls,parent,isArr){
			if (doc.getElementsByClassName ){
				return isArr ? Array.prototype.slice.call(doc.getElementsByClassName (cls)): List.prototype.init.call(null,doc.getElementsByClassName (cls));
			};
			if (parent){
				parent = JY.byId(parent).childNodes;
			}else{
				parent = doc.getElementsByTagName("*");
			};
			var re = new RegExp('\\b' + cls + '\\b');
			var list =isArr ? [] : new List();
			var item = null;
			for (var i =0,l=parent.length; i<l ; i++ ){
				item = parent[i];
				if (JY.hasClass(item,cls)){
					list.push(item);
				}
			};
			return list;
		},
		//删除样式类
		removeClass:function(elem,cls){
			var classlist =JY.attr(elem,"class").split(spaceRex);
			var tmp = [];
			for (var i =0; i < classlist.length ;i++ ){
				if (classlist[i] !== cls){
					tmp.push(classlist[i]);
				}
			};
			JY.attr(elem,"class", tmp.join(" "));
			return this;
		},
		//根据tagName获取节点列表List
		byTag:function(tag,context,isArr){
			//return List.prototype.init.call(null,doc.getElementsByTagName(tag));
			context = context||doc;
			var arr = context.getElementsByTagName(tag);
			 arr =isArr ? Array.prototype.slice.call(arr) : JY.makeArr(arr);
			 return arr;
		},
		//根据css3查找节点列表List
		query:function(){
			return this.makeArr(this._query.apply(this,arguments));
		},
		_query:function(queryStr , context,tmpList ){
			context = context||doc;
			if (doc.querySelectorAll&&false){
				return context.querySelectorAll(queryStr);
			}else{
				tmpList = tmpList ||[];
				var matchArr = queryStr .split(spaceRex);
				var f = matchArr. shift();
				if (f){
					
					var filter = f.split(splitRex);
					f= filter [0];
					var match=domRex.exec(f);
					//标签查询
					if (match[1]){
						tmpList = tmpList.concat ( JY.byTag(f,context,1) );
					//类查询
					}else if (match[2]){
						tmpList = tmpList.concat (JY.byClass(match[2],context,1) );
					}else if(match[3]){
						tmpList = tmpList .concat(JY.byId(match[3],context));
					};
					var tmpArr = [];
					for (var j = 0, len=matchArr.length; j <len ; j++ ){
						tmpArr = [];
						for (var i = 0,l = tmpList.length; i < l ; i++ ){
							tmpArr = tmpArr.concat( arguments.callee( matchArr .join(" ") ,tmpList[i]  ) );
						}
					};
					tmpList= tmpArr.length== 0 ? tmpList:tmpArr;
				};
				return tmpList ;
			}
		},
			/*
		_query:function(queryStr , context , tmpList){	
			var match=domRex.exec(queryStr);
			tmpList = tmpList||new List;
			//标签查询
			if (match[1]){
				tmpList = tmpList.concat (JY.byTag(queryStr,context) );
			//类查询
			}else if (match[2]){
				tmpList = tmpList.concat (JY.byClass(match[2],context) );
			}
			return tmpList;
		}*/
		//筛选出与指定表达式匹配的元素集合。
		filter:function(filterStr , list){
			
		},
		//htmlCollection生成List
		makeArr:function(htmlConllecton){
			/*return List.prototype.init.call(null,htmlConllecton);*/
			/*
			var arr = Array.prototype.slice.call(htmlConllecton);
			//arr.push.apply(arr, arguments);
			arr.__proto__ = List.prototype;
			return arr;
			*/
			var list = new List();
			var arr = Array.prototype.slice.call(htmlConllecton);
			return list.concat (arr);
		},
			//ajax异表
		ajax:function(argsObj){
			var xhr = new XHR();
			return xhr.send(argsObj);
		},
			//get方法的ajax
		get:function(){
			var args = arguments ;
			var argsObj = {};
			argsObj . url = args[0];
			argsObj .data = args [1]||{};
			argsObj .success = args [2] || null;
			argsObj.dataType =args[3]||"html";
			new XHR().send(argsObj);
		},
			//post方法的ajax
		post:function(){
			var args = arguments ;
			var argsObj = {};
			argsObj . url = args[0];
			argsObj .data = args [1]||{};
			argsObj .success = args [2] || null;
			argsObj. type = "POST";
			argsObj.dataType =args[3]||"html";
			new XHR().send(argsObj);
		},
			//字符串转换成json格式
		parseJson:function(txt){
			return  typeof txt ==="string" ? ( new Function( "return " + txt ) )() :  txt;
		},
		method:function(){
			var func = arguments[0]; 
			var args = Array.prototype.slice.call(arguments , 1);
			if (func ){
				func.apply(null,args);
			}
		},
			//json转换成&url参数
		param:function(obj){
			if (typeof obj =="string"){
				return obj;
			}else{
				var a = [];
				for (var i in obj ){
					if (typeof obj[i] =="object"){
						a.push(i+"="+this.param(obj[i]));
					}else
					a.push(i+"="+obj[i]);
				}
				return a.join("&");
			}
		},
		//用一个表达式来检查当前选择的元素集合，如果其中至少有一个元素符合这个给定的表达式就返回true。
		is: function(elem, selector ) {
			return !!selector && JY.query.filter( selector , elem ).length > 0 ;
		},
			//遍历集合List或array
		each:function(arr , callback){
			for (var i = 0,l = arr. length; i<l ; i++ ){
				if (arr [i]!==undefined){
					callback.call(arr[i],arr[i],i);
				}
			};
			return this;
		},
		//元素位置
		position:function(elem){
			elem = JY.byId(elem);	
			return {x:elem.getBoundingClientRect().left + doc.documentElement.scrollLeft,y:elem.getBoundingClientRect().top + doc.documentElement.scrollTop};
		},
		//元素偏移量
		offset:function(elem){
			elem = JY.byId(elem);	
			return {x:elem.getBoundingClientRect().left + doc.documentElement.scrollLeft,y:elem.getBoundingClientRect().top + doc.documentElement.scrollTop};
		},
		//交互变换的样式
		toggleClass:function(elem,cls){
			if (JY.hasClass(elem,cls)){
				JY.removeClass(elem,cls);
			}else{
				JY.addClass(elem,cls);
			};
			return this;
		},
		//去除空格
		trim:function(txt){
			return txt == null? "": txt.toString().replace(trimLeft , "").replace(trimRight ,"");
		},
		//dom插入操作的中间函数
		_domInsert:function(elem,child,callback){
			var tmp = document.createElement("div");
			var frag = document.createDocumentFragment();
			if (typeof child ==="string"){
				tmp.innerHTML = child;
			}else{
				tmp.appendChild(child);
			};	
			var n = tmp.firstChild;
			for ( ; n; n = n.nextSibling ) {
				if ( (n.nodeType === 1|| n.nodeType ===3) && n !== tmp ) {
					frag.appendChild(n);
				}
			};
			//elem.appendChild(frag);
			callback.call(elem,frag);
			return elem;
		},
		//字符串转换成DOM对象
		convertDOM:function(str){
			if (typeof str ==="string"){
				var tmp = document.createElement("div");
				tmp.innerHTML = str;
				var childList  = JY.child(tmp);
				return childList.length==1 ? childList[0]:childList;
			}else{
				return str;
			}
		},
		//追加，插入到后面
		append:function(elem ,child){
			elem = this.byId(elem);
			return this._domInsert(elem,child,function(c){
				this.appendChild(c);
			} )
		},
		//移除
		remove:function(elem){
			elem = this.byId(elem);
			var p = this.parent(elem);
			p?p.removeChild(elem):null;
		},
		//插入最前面
		prepend:function(elem,child){
			elem = this.byId(elem);			
			return this._domInsert(elem,child,function(c){
				this.insertBefore(c,this.firstChild);
			} );
		},
		//插入之前
		before:function(elem,node){
			elem = this.byId (elem);
			return this._domInsert(elem,node,function(c){
				this.parentNode.insertBefore(c,elem);
			});
		},
		//插入之后
		after:function(elem,node){
			elem = this.byId (elem);
			return this._domInsert(elem,node,function(c){
				this.parentNode.insertBefore(c,JY.next(elem));
			});
		},
		//HTML文本
		toText:function(elem,txt){
			elem = this.byId(elem);
			if (txt ==null){
				var tmpNode = document.createElement("div");
				tmpNode.appendChild( document.createTextNode(elem.innerHTML));
				return tmpNode.innerHTML;
			}else{
				elem.appendChild( document.createTextNode(txt));
				return elem;
			}
		},
		//鼠标拖动事件
		mouseDrag:function(elem,callback,stopCallback){
			var mousemove = null, mouseEvent = {};
			JY.bind(elem,"mousedown",function(e){
				getMousePosition(e);
				JY.bind(elem,"mousemove",getMousePosition);
				callback.call(this,e);
				mousemove = setInterval(JY.proxyFunc(callback,this),15);
			}).bind(window,"mouseup",function(e){
				clearInterval(mousemove);
				JY.unbind(elem,"mousemove",getMousePosition);
				delete callback.prevEvent;
				delete callback.event;
				mouseEvent = null;
				stopCallback.call(this,e);
			});
			//获取鼠标
			function getMousePosition(e){	
				callback.event = e;		
				callback.prevEvent = mouseEvent;	
				mouseEvent = e;
			};
		},
		//代理函数，处理改变当前作用域
		proxyFunc:function(func,pointer){
			return function(){
				func.apply(pointer,Array.prototype.slice.call(arguments));
			}
		},
		//分解优化循环
		resolve:function(callback,startIndex,max,arr){
			var start =+ new Date();
			var n = startIndex;
			for (; n<max && +new Date()-start<50 ; n++){
				if (arr && arr[n] ===undefined){
					continue;
				};
				arr ? callback.call(arr[n],arr[n],n) :  callback(n) ;
			};
			if (n<max){
				var calleeFunc = arguments.callee;
				setTimeout(applyr(calleeFunc,callback,n,max),25);
			}
		},
		//碰撞检测
		hits:function(oA,oB){
			return  (Math.abs(oA.x - oB.x) <=Math.max(oA.width,oB.width) && Math.abs(oA.y - oB.y) <= Math.max(oA.width,oB.width) )
		}
	};
	//元素高度和宽度
	JY.each(["Height","Width"],function(){		
		var _self = this;
		var name = this.toLowerCase();
		JY[name] = function(elem , value){
				elem = JY.byId(elem);
				if (value){
					value = typeof value ==="string" ?value:value+'px';
					JY.css(elem,name ,value);
					return this;
				}
				if (elem == window){
					return document.compatMode == "CSS1Compat" && document.documentElement[ "client" + _self ] || document.body[ "client" + _self ];
				}else
				if (elem == document ){
					return Math.max(
						document.documentElement["client" + _self],
						document.body["scroll" + _self], document.documentElement["scroll" + _self],
						document.body["offset" + _self], document.documentElement["offset" + _self]
					);
				}else{
						var val = 0;
						var wich = name=="height"?["Top","Bottom"]:["Left","Right"];
						if (doc.defaultView ){
							val = parseFloat(JY.curCss(elem,name));
						}else{
							val = elem["offset"+_self];
							JY.each(wich,function(){
								val -= parseFloat(JY.css(elem,"border"+this+"Width"));
								val -= parseFloat(JY.css(elem, "padding"+this));
							});
						}
						return Math.round(val) ;
					}
			}
	});
	//*列表集合*/
	var List = function(){		
	};
	List.prototype = new Array();
	List.prototype.constructor = List;
	JY.extend(List,{		
		each : function(callBack){
			/*
				for (var i = 0,l = this.length; i<l ;i++ ){
					callBack.call(this[i],this[i],i);
				}
				*/
				JY.each(this,callBack);
				return this;
		},
		_assign:function(v,n){			
			this.each(function(){
				JY[n](this,v);
			});
		},
		css:function(){
			if (arguments.length ==2){
				applyr(this._assign,"css").apply(this,arguments);
				return this;
			}else{
				JY.css(this[0],arguments[0]);
			}
		},
		attr:function(){
			applyr(this._assign,"attr").apply(this,arguments);
		},
		init:function(){
			var tmp = new List();
			var arg = arguments[0];
			var n= null;
			for (var i=0,l = arg.length; i<l ;i++ ){
				n =arg [i];
				if ( n.nodeType === 1){
					tmp.push(n);
				}
			}
			return tmp;
		},
		concat:function(list2){
			return List.prototype.init.call(null,Array.prototype.slice.call(this).concat(Array.prototype.slice.call(list2)));
		},
		first:function(){
			return this[0];
		},
		last:function(){
			return this[this.length-1];
		},
		child:function(){
			var list =new List();
			this.each(function(){
				JY.child(this).each(function(){
					list.push(this);
				});
			});
			return list;
		},
		eq:function(i){
			return this[i];
		},
		find:function(arg){
			var list = new List();
			this.each(function(){
				var tmp =JY.query.find(arg,this).set;
				Array.prototype.push.apply( list, tmp);
			});
			return list;
		},
		filter:function(arg){
			var tmp =JY.query.filter(arg,this);
			return  JY.makeArr(tmp);
		},
		parents:function(arg){
			var tmp = new List();
			var arr= new List();
			this.each(function(){		
				var p =  JY.parent(this);
				while (p&&p.nodeType !== 9){
					tmp.push(p);
					p = JY.parent(p);
				}
			});
			arr = JY.makeArr (JY.unique(JY.query.filter( arg , tmp) ));
			return arr;
		},
		closest:function(arg){
			var tmp = new List();
			this.each(function(){		
				var p =  JY.parent(this);
				while (p && p.nodeType !== 9){
					if (JY.is([p], arg)){
						tmp.push( p );
						break;
					}
					p = JY.parent(p);
				}
			});
			return JY.unique(tmp);
		}
		/*,
		height:function(arg){
			if (this.length==1){
				if( arg ){
					JY.height(this[0],arg);
					return this;
				}else{
					return JY.height(this[0]);
				}
			}else{
				var arr = [];
				this.each(function(){
					arr.push(JY.height(this,arg));
				});
				return arg  ? this : arr;
			}
		}*/
	});
	JY.each(["height","width","position"],function(){
		var name  = this;
		List.prototype[name] = function(arg){			
			if (this.length==1){
				if( arg ){
					JY[name](this[0],arg);
					return this;
				}else{
					return JY[name](this[0]);
				}
			}else{
				var arr = [];
				this.each(function(){
					arr.push(JY[name](this,arg));
				});
				return arg  ? this : arr;
			}
		}
	});
	JY.each(["bind","unbind","show","hide","addClass","toggleClass","removeClass","live","one","delegate"],function(){
		var name = this;
		List.prototype[name]=function(){
			var args = Array.prototype.slice.call( arguments, 0 );
			this.each(function(){
				JY[name].apply( this,[this].concat(args) );
			});
			return this;
		};
		return this;
	});
	function applyr(f){
		var args =  Array.prototype.slice.call(arguments,1);
		return function (x){
			return f.apply( this,[x].concat(args) );
		}
	};
	JY.cache = {};
	//事件驱动
	JY.event={
		add:function(target,eventType,handle,type,selector){			
			if(target.addEventListener){
				this.add=function(target,eventType,handle){
					handle = this._proxy.apply(this,Array.prototype.slice.call(arguments,0));
					target.addEventListener(eventType,handle,false);
				}
			}else{
				this.add=function(target,eventType,handle){
					handle = this._proxy.apply(this,Array.prototype.slice.call(arguments,0));
					target.attachEvent("on"+eventType,handle);
				}
			};
			this.add.apply(this,Array.prototype.slice.call(arguments ,0));
		},
		_proxy:function(target,eventType,handle,type,selector){
			var fn = handle;
			var _self = this;
			_self.guid++;
			_self.handleList[_self.guid] = fn ;
			handle = function(e){
				e.stop=function(){
					e.preventDefault();
					e.stopPropagation();
				};
				if (type==="delegate"){
					var evtList =new List;
					if (typeof selector === "object"){
						if (selector.constructor === List){
							evtList = selector;
						}else{
							evtList.push(selector);
						}
					}else{
						evtList = JY.query(selector,target);
					};
					evtList.each(function(){					
						if (e.target === this){
							fn.call(target,e)
						};
					});
					return false;
				};
				if (!fn.call(target,e)){
					e.preventDefault?e.preventDefault():null;
				};
				if (type==="one"){
					_self.remove(target,eventType,handle)
				}
			};
			handle.guid = _self.guid;			
			JY.cache.event =JY.cache.event||{};
			JY.cache.event[_self.guid] = {target:target,handle:handle};
			return handle;
		},
		remove:function(target,eventType,handle){
			if(target.removeEventListener){
				this.remove=function(target,eventType,handle){
					if (handle){
						for (var i=0,l=this.handleList.length;i<l ;i++ ){
							if (handle == this.handleList[i]){
								handle = JY.cache.event [i].handle;
								delete JY.cache.event [i];
								delete this.handleList[i];
							}
						};
						target.removeEventListener(eventType,handle,false);
					}else{
						for (var j in JY.cache.event ){
							if (JY.cache.event [j].target == target){
								target.removeEventListener(eventType,JY.cache.event [j].handle,false);
								delete JY.cache.event [j];
								delete this.handleList[i];
							}
						}
					}
				}
			}else{
				this.remove=function(target,eventType,handle){
					target.detachEvent("on"+eventType,handle);
				}
			};
			this.remove(target,eventType,handle);
		},
		guid:0,
		handleList:[]
	};
	//绘图函数
	JY.draw={
		cache:{},
		setStyle:function(cssObj){
			this.cache = cssObj;
		},
		setPosition:function(o,x,y){
			JY.css(o,{left:x+"px",top:y+"px"});
		},
		//画点
		point:function(container,x,y){
			var p = document.createElement("i");
			JY.css(p,this.cache);
			JY.append(container,p);
			this.setPosition(p,x,y);
			return p;
		},
		//绘线
		line:function(objA,objB,c){
			var DvalueX = objB.x-objA.x;
			var DvalueY =  objB.y -objA.y ;
			var w =parseInt(this.cache.width);
			var len = parseInt( Math.sqrt (DvalueX*DvalueX + DvalueY*DvalueY)) /w;//两点间距离
			var angle=Math.atan2(DvalueX,DvalueY);//角度
			JY.resolve(function(){				
				var x =objA.x+ Math.sin(angle)*w;
				var y =objA.y + Math.cos(angle)*w;
				JY.draw.point(c,x,y);
				objA.x=x;
				objA.y=y;
			},1,len);
		}
	};
	win.JY=JY;
	win.List=List;
	var XHR = function(){
	};
	XHR.prototype = {
		create:function(){
			var msxml_progid=['MSXML2.XMLHTTP.6.0', 
			'MSXML3.XMLHTTP', 
			'Microsoft.XMLHTTP', // Doesn't support readyState 3. 
			'MSXML2.XMLHTTP.3.0' // Doesn't support readyState 3. 
			];
			var xhr;
			try{
				xhr=new XMLHttpRequest();
			}catch(e){
				for(var i =0,len =msxml_progid.length;i<len;i++){
					try{
						xhr=new ActiveXObject(msxml_progid[i]);
						break;
					}catch(e){}
				};
			}finally{
				return xhr;
			};
		},
		send:function(argsObj){
			var _self = this;
			var xhr = _self.create();
			dataType =argsObj.dataType||"html";
			argsObj.contentType = argsObj.contentType||"application/x-www-form-urlencoded";
			if (argsObj.async == undefined){
				argsObj.async=true;
			};
			if (argsObj.async){
				xhr.onreadystatechange = function(){
					if(xhr.readyState==4 ){
						JY.method(argsObj.success,_self.format(xhr.responseText,xhr.responseXML, argsObj.dataType)) ;
					}
				};
			}
			if (argsObj.type == "GET" || !argsObj.type){
				var tmpArr = argsObj.url.split("?");
				if (tmpArr[1]){
					argsObj.url += "&"+JY.param(argsObj.data);
				}else{
					argsObj.url = tmpArr[0]+"?"+JY.param(argsObj.data);
				};
				xhr.open("GET",argsObj.url,argsObj.async);
				xhr.send(null);
			}else{
				xhr.open("POST",argsObj.url, argsObj.async);
				xhr.setRequestHeader("Content-Type",argsObj.contentType);
				try{
					xhr.send(JY.param(argsObj.data));
				}catch(e){
					JY.method(argsObj.error ,e);
				}
			}
			if (!argsObj.async){
				JY.method(argsObj.success,_self.format(xhr.responseText,xhr.responseXML,argsObj.dataType)) ;
			};
			return xhr;
		},
		format:function(txt,xml, type){
			switch(type){
				case "xml":{
					return xml;
				}break;
				case "json":{
					return JY.parseJson(txt);
				}break;
				case "html":;
				default:{
					return txt;
				}break;
			}
		}
	};
})(window);


/*!
 * Sizzle CSS Selector Engine
 *  Copyright 2011, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
(function(){

var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
	expando = "sizcache" + (Math.random() + '').replace('.', ''),
	done = 0,
	toString = Object.prototype.toString,
	hasDuplicate = false,
	baseHasDuplicate = true,
	rBackslash = /\\/g,
	rReturn = /\r\n/g,
	rNonWord = /\W/;

// Here we check if the JavaScript engine is using some sort of
// optimization where it does not always call our comparision
// function. If that is the case, discard the hasDuplicate value.
//   Thus far that includes Google Chrome.
[0, 0].sort(function() {
	baseHasDuplicate = false;
	return 0;
});

var Sizzle = function( selector, context, results, seed ) {
	results = results || new List;
	context = context || document;

	var origContext = context;

	if ( context.nodeType !== 1 && context.nodeType !== 9 ) {
		return [];
	}
	
	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	var m, set, checkSet, extra, ret, cur, pop, i,
		prune = true,
		contextXML = Sizzle.isXML( context ),
		parts = [],
		soFar = selector;
	
	// Reset the position of the chunker regexp (start from head)
	do {
		chunker.exec( "" );
		m = chunker.exec( soFar );

		if ( m ) {
			soFar = m[3];
		
			parts.push( m[1] );
		
			if ( m[2] ) {
				extra = m[3];
				break;
			}
		}
	} while ( m );

	if ( parts.length > 1 && origPOS.exec( selector ) ) {

		if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
			set = posProcess( parts[0] + parts[1], context, seed );

		} else {
			set = Expr.relative[ parts[0] ] ?
				[ context ] :
				Sizzle( parts.shift(), context );

			while ( parts.length ) {
				selector = parts.shift();

				if ( Expr.relative[ selector ] ) {
					selector += parts.shift();
				}
				
				set = posProcess( selector, set, seed );
			}
		}

	} else {
		// Take a shortcut and set the context if the root selector is an ID
		// (but not if it'll be faster if the inner selector is an ID)
		if ( !seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
				Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]) ) {

			ret = Sizzle.find( parts.shift(), context, contextXML );
			context = ret.expr ?
				Sizzle.filter( ret.expr, ret.set )[0] :
				ret.set[0];
		}

		if ( context ) {
			ret = seed ?
				{ expr: parts.pop(), set: makeArray(seed) } :
				Sizzle.find( parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML );

			set = ret.expr ?
				Sizzle.filter( ret.expr, ret.set ) :
				ret.set;

			if ( parts.length > 0 ) {
				checkSet = makeArray( set );

			} else {
				prune = false;
			}

			while ( parts.length ) {
				cur = parts.pop();
				pop = cur;

				if ( !Expr.relative[ cur ] ) {
					cur = "";
				} else {
					pop = parts.pop();
				}

				if ( pop == null ) {
					pop = context;
				}

				Expr.relative[ cur ]( checkSet, pop, contextXML );
			}

		} else {
			checkSet = parts = [];
		}
	}

	if ( !checkSet ) {
		checkSet = set;
	}

	if ( !checkSet ) {
		Sizzle.error( cur || selector );
	}

	if ( toString.call(checkSet) === "[object Array]" ) {
		if ( !prune ) {
			results.push.apply( results, checkSet );

		} else if ( context && context.nodeType === 1 ) {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i])) ) {
					results.push( set[i] );
				}
			}

		} else {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
					results.push( set[i] );
				}
			}
		}

	} else {
		makeArray( checkSet, results );
	}

	if ( extra ) {
		Sizzle( extra, origContext, results, seed );
		Sizzle.uniqueSort( results );
	}

	return results;
};

Sizzle.uniqueSort = function( results ) {
	if ( sortOrder ) {
		hasDuplicate = baseHasDuplicate;
		results.sort( sortOrder );

		if ( hasDuplicate ) {
			for ( var i = 1; i < results.length; i++ ) {
				if ( results[i] === results[ i - 1 ] ) {
					results.splice( i--, 1 );
				}
			}
		}
	}

	return results;
};

Sizzle.matches = function( expr, set ) {
	return Sizzle( expr, null, null, set );
};

Sizzle.matchesSelector = function( node, expr ) {
	return Sizzle( expr, null, null, [node] ).length > 0;
};

Sizzle.find = function( expr, context, isXML ) {
	var set, i, len, match, type, left;

	if ( !expr ) {
		return [];
	}

	for ( i = 0, len = Expr.order.length; i < len; i++ ) {
		type = Expr.order[i];
		
		if ( (match = Expr.leftMatch[ type ].exec( expr )) ) {
			left = match[1];
			match.splice( 1, 1 );

			if ( left.substr( left.length - 1 ) !== "\\" ) {
				match[1] = (match[1] || "").replace( rBackslash, "" );
				set = Expr.find[ type ]( match, context, isXML );

				if ( set != null ) {
					expr = expr.replace( Expr.match[ type ], "" );
					break;
				}
			}
		}
	}

	if ( !set ) {
		set = typeof context.getElementsByTagName !== "undefined" ?
			context.getElementsByTagName( "*" ) :
			[];
	}

	return { set: set, expr: expr };
};

Sizzle.filter = function( expr, set, inplace, not ) {
	var match, anyFound,
		type, found, item, filter, left,
		i, pass,
		old = expr,
		result = [],
		curLoop = set,
		isXMLFilter = set && set[0] && Sizzle.isXML( set[0] );

	while ( expr && set.length ) {
		for ( type in Expr.filter ) {
			if ( (match = Expr.leftMatch[ type ].exec( expr )) != null && match[2] ) {
				filter = Expr.filter[ type ];
				left = match[1];

				anyFound = false;

				match.splice(1,1);

				if ( left.substr( left.length - 1 ) === "\\" ) {
					continue;
				}

				if ( curLoop === result ) {
					result = [];
				}

				if ( Expr.preFilter[ type ] ) {
					match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not, isXMLFilter );

					if ( !match ) {
						anyFound = found = true;

					} else if ( match === true ) {
						continue;
					}
				}

				if ( match ) {
					for ( i = 0; (item = curLoop[i]) != null; i++ ) {
						if ( item ) {
							found = filter( item, match, i, curLoop );
							pass = not ^ found;

							if ( inplace && found != null ) {
								if ( pass ) {
									anyFound = true;

								} else {
									curLoop[i] = false;
								}

							} else if ( pass ) {
								result.push( item );
								anyFound = true;
							}
						}
					}
				}

				if ( found !== undefined ) {
					if ( !inplace ) {
						curLoop = result;
					}

					expr = expr.replace( Expr.match[ type ], "" );

					if ( !anyFound ) {
						return [];
					}

					break;
				}
			}
		}

		// Improper expression
		if ( expr === old ) {
			if ( anyFound == null ) {
				Sizzle.error( expr );

			} else {
				break;
			}
		}

		old = expr;
	}

	return curLoop;
};

Sizzle.error = function( msg ) {
	throw "Syntax error, unrecognized expression: " + msg;
};

/**
 * Utility function for retreiving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
var getText = Sizzle.getText = function( elem ) {
    var i, node,
		nodeType = elem.nodeType,
		ret = "";

	if ( nodeType ) {
		if ( nodeType === 1 ) {
			// Use textContent || innerText for elements
			if ( typeof elem.textContent === 'string' ) {
				return elem.textContent;
			} else if ( typeof elem.innerText === 'string' ) {
				// Replace IE's carriage returns
				return elem.innerText.replace( rReturn, '' );
			} else {
				// Traverse it's children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling) {
					ret += getText( elem );
				}
			}
		} else if ( nodeType === 3 || nodeType === 4 ) {
			return elem.nodeValue;
		}
	} else {

		// If no nodeType, this is expected to be an array
		for ( i = 0; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			if ( node.nodeType !== 8 ) {
				ret += getText( node );
			}
		}
	}
	return ret;
};

var Expr = Sizzle.selectors = {
	order: [ "ID", "NAME", "TAG" ],

	match: {
		ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
		ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
		TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
		CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
		POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
		PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
	},

	leftMatch: {},

	attrMap: {
		"class": "className",
		"for": "htmlFor"
	},

	attrHandle: {
		href: function( elem ) {
			return elem.getAttribute( "href" );
		},
		type: function( elem ) {
			return elem.getAttribute( "type" );
		}
	},

	relative: {
		"+": function(checkSet, part){
			var isPartStr = typeof part === "string",
				isTag = isPartStr && !rNonWord.test( part ),
				isPartStrNotTag = isPartStr && !isTag;

			if ( isTag ) {
				part = part.toLowerCase();
			}

			for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
				if ( (elem = checkSet[i]) ) {
					while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}

					checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ?
						elem || false :
						elem === part;
				}
			}

			if ( isPartStrNotTag ) {
				Sizzle.filter( part, checkSet, true );
			}
		},

		">": function( checkSet, part ) {
			var elem,
				isPartStr = typeof part === "string",
				i = 0,
				l = checkSet.length;

			if ( isPartStr && !rNonWord.test( part ) ) {
				part = part.toLowerCase();

				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						var parent = elem.parentNode;
						checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
					}
				}

			} else {
				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						checkSet[i] = isPartStr ?
							elem.parentNode :
							elem.parentNode === part;
					}
				}

				if ( isPartStr ) {
					Sizzle.filter( part, checkSet, true );
				}
			}
		},

		"": function(checkSet, part, isXML){
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "parentNode", part, doneName, checkSet, nodeCheck, isXML );
		},

		"~": function( checkSet, part, isXML ) {
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "previousSibling", part, doneName, checkSet, nodeCheck, isXML );
		}
	},

	find: {
		ID: function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		},

		NAME: function( match, context ) {
			if ( typeof context.getElementsByName !== "undefined" ) {
				var ret = [],
					results = context.getElementsByName( match[1] );

				for ( var i = 0, l = results.length; i < l; i++ ) {
					if ( results[i].getAttribute("name") === match[1] ) {
						ret.push( results[i] );
					}
				}

				return ret.length === 0 ? null : ret;
			}
		},

		TAG: function( match, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( match[1] );
			}
		}
	},
	preFilter: {
		CLASS: function( match, curLoop, inplace, result, not, isXML ) {
			match = " " + match[1].replace( rBackslash, "" ) + " ";

			if ( isXML ) {
				return match;
			}

			for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
				if ( elem ) {
					if ( not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n\r]/g, " ").indexOf(match) >= 0) ) {
						if ( !inplace ) {
							result.push( elem );
						}

					} else if ( inplace ) {
						curLoop[i] = false;
					}
				}
			}

			return false;
		},

		ID: function( match ) {
			return match[1].replace( rBackslash, "" );
		},

		TAG: function( match, curLoop ) {
			return match[1].replace( rBackslash, "" ).toLowerCase();
		},

		CHILD: function( match ) {
			if ( match[1] === "nth" ) {
				if ( !match[2] ) {
					Sizzle.error( match[0] );
				}

				match[2] = match[2].replace(/^\+|\s*/g, '');

				// parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
				var test = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(
					match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
					!/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

				// calculate the numbers (first)n+(last) including if they are negative
				match[2] = (test[1] + (test[2] || 1)) - 0;
				match[3] = test[3] - 0;
			}
			else if ( match[2] ) {
				Sizzle.error( match[0] );
			}

			// TODO: Move to normal caching system
			match[0] = done++;

			return match;
		},

		ATTR: function( match, curLoop, inplace, result, not, isXML ) {
			var name = match[1] = match[1].replace( rBackslash, "" );
			
			if ( !isXML && Expr.attrMap[name] ) {
				match[1] = Expr.attrMap[name];
			}

			// Handle if an un-quoted value was used
			match[4] = ( match[4] || match[5] || "" ).replace( rBackslash, "" );

			if ( match[2] === "~=" ) {
				match[4] = " " + match[4] + " ";
			}

			return match;
		},

		PSEUDO: function( match, curLoop, inplace, result, not ) {
			if ( match[1] === "not" ) {
				// If we're dealing with a complex expression, or a simple one
				if ( ( chunker.exec(match[3]) || "" ).length > 1 || /^\w/.test(match[3]) ) {
					match[3] = Sizzle(match[3], null, null, curLoop);

				} else {
					var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);

					if ( !inplace ) {
						result.push.apply( result, ret );
					}

					return false;
				}

			} else if ( Expr.match.POS.test( match[0] ) || Expr.match.CHILD.test( match[0] ) ) {
				return true;
			}
			
			return match;
		},

		POS: function( match ) {
			match.unshift( true );

			return match;
		}
	},
	
	filters: {
		enabled: function( elem ) {
			return elem.disabled === false && elem.type !== "hidden";
		},

		disabled: function( elem ) {
			return elem.disabled === true;
		},

		checked: function( elem ) {
			return elem.checked === true;
		},
		
		selected: function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}
			
			return elem.selected === true;
		},

		parent: function( elem ) {
			return !!elem.firstChild;
		},

		empty: function( elem ) {
			return !elem.firstChild;
		},

		has: function( elem, i, match ) {
			return !!Sizzle( match[3], elem ).length;
		},

		header: function( elem ) {
			return (/h\d/i).test( elem.nodeName );
		},

		text: function( elem ) {
			var attr = elem.getAttribute( "type" ), type = elem.type;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc) 
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" && "text" === type && ( attr === type || attr === null );
		},

		radio: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "radio" === elem.type;
		},

		checkbox: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "checkbox" === elem.type;
		},

		file: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "file" === elem.type;
		},

		password: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "password" === elem.type;
		},

		submit: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && "submit" === elem.type;
		},

		image: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "image" === elem.type;
		},

		reset: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && "reset" === elem.type;
		},

		button: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && "button" === elem.type || name === "button";
		},

		input: function( elem ) {
			return (/input|select|textarea|button/i).test( elem.nodeName );
		},

		focus: function( elem ) {
			return elem === elem.ownerDocument.activeElement;
		}
	},
	setFilters: {
		first: function( elem, i ) {
			return i === 0;
		},

		last: function( elem, i, match, array ) {
			return i === array.length - 1;
		},

		even: function( elem, i ) {
			return i % 2 === 0;
		},

		odd: function( elem, i ) {
			return i % 2 === 1;
		},

		lt: function( elem, i, match ) {
			return i < match[3] - 0;
		},

		gt: function( elem, i, match ) {
			return i > match[3] - 0;
		},

		nth: function( elem, i, match ) {
			return match[3] - 0 === i;
		},

		eq: function( elem, i, match ) {
			return match[3] - 0 === i;
		}
	},
	filter: {
		PSEUDO: function( elem, match, i, array ) {
			var name = match[1],
				filter = Expr.filters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );

			} else if ( name === "contains" ) {
				return (elem.textContent || elem.innerText || getText([ elem ]) || "").indexOf(match[3]) >= 0;

			} else if ( name === "not" ) {
				var not = match[3];

				for ( var j = 0, l = not.length; j < l; j++ ) {
					if ( not[j] === elem ) {
						return false;
					}
				}

				return true;

			} else {
				Sizzle.error( name );
			}
		},

		CHILD: function( elem, match ) {
			var first, last,
				doneName, parent, cache,
				count, diff,
				type = match[1],
				node = elem;

			switch ( type ) {
				case "only":
				case "first":
					while ( (node = node.previousSibling) )	 {
						if ( node.nodeType === 1 ) { 
							return false; 
						}
					}

					if ( type === "first" ) { 
						return true; 
					}

					node = elem;

				case "last":
					while ( (node = node.nextSibling) )	 {
						if ( node.nodeType === 1 ) { 
							return false; 
						}
					}

					return true;

				case "nth":
					first = match[2];
					last = match[3];

					if ( first === 1 && last === 0 ) {
						return true;
					}
					
					doneName = match[0];
					parent = elem.parentNode;
	
					if ( parent && (parent[ expando ] !== doneName || !elem.nodeIndex) ) {
						count = 0;
						
						for ( node = parent.firstChild; node; node = node.nextSibling ) {
							if ( node.nodeType === 1 ) {
								node.nodeIndex = ++count;
							}
						} 

						parent[ expando ] = doneName;
					}
					
					diff = elem.nodeIndex - last;

					if ( first === 0 ) {
						return diff === 0;

					} else {
						return ( diff % first === 0 && diff / first >= 0 );
					}
			}
		},

		ID: function( elem, match ) {
			return elem.nodeType === 1 && elem.getAttribute("id") === match;
		},

		TAG: function( elem, match ) {
			return (match === "*" && elem.nodeType === 1) || !!elem.nodeName && elem.nodeName.toLowerCase() === match;
		},
		
		CLASS: function( elem, match ) {
			return (" " + (elem.className || elem.getAttribute("class")) + " ")
				.indexOf( match ) > -1;
		},

		ATTR: function( elem, match ) {
			var name = match[1],
				result = Sizzle.attr ?
					Sizzle.attr( elem, name ) :
					Expr.attrHandle[ name ] ?
					Expr.attrHandle[ name ]( elem ) :
					elem[ name ] != null ?
						elem[ name ] :
						elem.getAttribute( name ),
				value = result + "",
				type = match[2],
				check = match[4];

			return result == null ?
				type === "!=" :
				!type && Sizzle.attr ?
				result != null :
				type === "=" ?
				value === check :
				type === "*=" ?
				value.indexOf(check) >= 0 :
				type === "~=" ?
				(" " + value + " ").indexOf(check) >= 0 :
				!check ?
				value && result !== false :
				type === "!=" ?
				value !== check :
				type === "^=" ?
				value.indexOf(check) === 0 :
				type === "$=" ?
				value.substr(value.length - check.length) === check :
				type === "|=" ?
				value === check || value.substr(0, check.length + 1) === check + "-" :
				false;
		},

		POS: function( elem, match, i, array ) {
			var name = match[2],
				filter = Expr.setFilters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );
			}
		}
	}
};

var origPOS = Expr.match.POS,
	fescape = function(all, num){
		return "\\" + (num - 0 + 1);
	};

for ( var type in Expr.match ) {
	Expr.match[ type ] = new RegExp( Expr.match[ type ].source + (/(?![^\[]*\])(?![^\(]*\))/.source) );
	Expr.leftMatch[ type ] = new RegExp( /(^(?:.|\r|\n)*?)/.source + Expr.match[ type ].source.replace(/\\(\d+)/g, fescape) );
}

var makeArray = function( array, results ) {
	array = JY.makeArr(array);
	//Array.prototype.slice.call( array, 0 );

	if ( results ) {
		results.push.apply( results, array );
		return results;
	}
	
	return array;
};

// Perform a simple check to determine if the browser is capable of
// converting a NodeList to an array using builtin methods.
// Also verifies that the returned array holds DOM nodes
// (which is not the case in the Blackberry browser)
try {
	Array.prototype.slice.call( document.documentElement.childNodes, 0 )[0].nodeType;
	//JY.makeArr( document.documentElement.childNodes)[0].nodeType;
// Provide a fallback method if it does not work
} catch( e ) {
	makeArray = function( array, results ) {
		var i = 0,
			ret = results || [];

		if ( toString.call(array) === "[object Array]" ) {
			Array.prototype.push.apply( ret, array );

		} else {
			if ( typeof array.length === "number" ) {
				for ( var l = array.length; i < l; i++ ) {
					ret.push( array[i] );
				}

			} else {
				for ( ; array[i]; i++ ) {
					ret.push( array[i] );
				}
			}
		}

		return ret;
	};
}

var sortOrder, siblingCheck;

if ( document.documentElement.compareDocumentPosition ) {
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		if ( !a.compareDocumentPosition || !b.compareDocumentPosition ) {
			return a.compareDocumentPosition ? -1 : 1;
		}

		return a.compareDocumentPosition(b) & 4 ? -1 : 1;
	};

} else {
	sortOrder = function( a, b ) {
		// The nodes are identical, we can exit early
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Fallback to using sourceIndex (in IE) if it's available on both nodes
		} else if ( a.sourceIndex && b.sourceIndex ) {
			return a.sourceIndex - b.sourceIndex;
		}

		var al, bl,
			ap = [],
			bp = [],
			aup = a.parentNode,
			bup = b.parentNode,
			cur = aup;

		// If the nodes are siblings (or identical) we can do a quick check
		if ( aup === bup ) {
			return siblingCheck( a, b );

		// If no parents were found then the nodes are disconnected
		} else if ( !aup ) {
			return -1;

		} else if ( !bup ) {
			return 1;
		}

		// Otherwise they're somewhere else in the tree so we need
		// to build up a full list of the parentNodes for comparison
		while ( cur ) {
			ap.unshift( cur );
			cur = cur.parentNode;
		}

		cur = bup;

		while ( cur ) {
			bp.unshift( cur );
			cur = cur.parentNode;
		}

		al = ap.length;
		bl = bp.length;

		// Start walking down the tree looking for a discrepancy
		for ( var i = 0; i < al && i < bl; i++ ) {
			if ( ap[i] !== bp[i] ) {
				return siblingCheck( ap[i], bp[i] );
			}
		}

		// We ended someplace up the tree so do a sibling check
		return i === al ?
			siblingCheck( a, bp[i], -1 ) :
			siblingCheck( ap[i], b, 1 );
	};

	siblingCheck = function( a, b, ret ) {
		if ( a === b ) {
			return ret;
		}

		var cur = a.nextSibling;

		while ( cur ) {
			if ( cur === b ) {
				return -1;
			}

			cur = cur.nextSibling;
		}

		return 1;
	};
}

// Check to see if the browser returns elements by name when
// querying by getElementById (and provide a workaround)
(function(){
	// We're going to inject a fake input element with a specified name
	var form = document.createElement("div"),
		id = "script" + (new Date()).getTime(),
		root = document.documentElement;

	form.innerHTML = "<a name='" + id + "'/>";

	// Inject it into the root element, check its status, and remove it quickly
	root.insertBefore( form, root.firstChild );

	// The workaround has to do additional checks after a getElementById
	// Which slows things down for other browsers (hence the branching)
	if ( document.getElementById( id ) ) {
		Expr.find.ID = function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);

				return m ?
					m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ?
						[m] :
						undefined :
					[];
			}
		};

		Expr.filter.ID = function( elem, match ) {
			var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");

			return elem.nodeType === 1 && node && node.nodeValue === match;
		};
	}

	root.removeChild( form );

	// release memory in IE
	root = form = null;
})();

(function(){
	// Check to see if the browser returns only elements
	// when doing getElementsByTagName("*")

	// Create a fake element
	var div = document.createElement("div");
	div.appendChild( document.createComment("") );

	// Make sure no comments are found
	if ( div.getElementsByTagName("*").length > 0 ) {
		Expr.find.TAG = function( match, context ) {
			var results = context.getElementsByTagName( match[1] );

			// Filter out possible comments
			if ( match[1] === "*" ) {
				var tmp = [];

				for ( var i = 0; results[i]; i++ ) {
					if ( results[i].nodeType === 1 ) {
						tmp.push( results[i] );
					}
				}

				results = tmp;
			}

			return results;
		};
	}

	// Check to see if an attribute returns normalized href attributes
	div.innerHTML = "<a href='#'></a>";

	if ( div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
			div.firstChild.getAttribute("href") !== "#" ) {

		Expr.attrHandle.href = function( elem ) {
			return elem.getAttribute( "href", 2 );
		};
	}

	// release memory in IE
	div = null;
})();

if ( document.querySelectorAll ) {
	(function(){
		var oldSizzle = Sizzle,
			div = document.createElement("div"),
			id = "__sizzle__";

		div.innerHTML = "<p class='TEST'></p>";

		// Safari can't handle uppercase or unicode characters when
		// in quirks mode.
		if ( div.querySelectorAll && div.querySelectorAll(".TEST").length === 0 ) {
			return;
		}
	
		Sizzle = function( query, context, extra, seed ) {
			context = context || document;

			// Only use querySelectorAll on non-XML documents
			// (ID selectors don't work in non-HTML documents)
			if ( !seed && !Sizzle.isXML(context) ) {
				// See if we find a selector to speed up
				var match = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec( query );
				
				if ( match && (context.nodeType === 1 || context.nodeType === 9) ) {
					// Speed-up: Sizzle("TAG")
					if ( match[1] ) {
						return makeArray( context.getElementsByTagName( query ), extra );
					
					// Speed-up: Sizzle(".CLASS")
					} else if ( match[2] && Expr.find.CLASS && context.getElementsByClassName ) {
						return makeArray( context.getElementsByClassName( match[2] ), extra );
					}
				}
				
				if ( context.nodeType === 9 ) {
					// Speed-up: Sizzle("body")
					// The body element only exists once, optimize finding it
					if ( query === "body" && context.body ) {
						return makeArray( [ context.body ], extra );
						
					// Speed-up: Sizzle("#ID")
					} else if ( match && match[3] ) {
						var elem = context.getElementById( match[3] );

						// Check parentNode to catch when Blackberry 4.6 returns
						// nodes that are no longer in the document #6963
						if ( elem && elem.parentNode ) {
							// Handle the case where IE and Opera return items
							// by name instead of ID
							if ( elem.id === match[3] ) {
								return makeArray( [ elem ], extra );
							}
							
						} else {
							return makeArray( [], extra );
						}
					}
					
					try {
						return makeArray( context.querySelectorAll(query), extra );
					} catch(qsaError) {}

				// qSA works strangely on Element-rooted queries
				// We can work around this by specifying an extra ID on the root
				// and working up from there (Thanks to Andrew Dupont for the technique)
				// IE 8 doesn't work on object elements
				} else if ( context.nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
					var oldContext = context,
						old = context.getAttribute( "id" ),
						nid = old || id,
						hasParent = context.parentNode,
						relativeHierarchySelector = /^\s*[+~]/.test( query );

					if ( !old ) {
						context.setAttribute( "id", nid );
					} else {
						nid = nid.replace( /'/g, "\\$&" );
					}
					if ( relativeHierarchySelector && hasParent ) {
						context = context.parentNode;
					}

					try {
						if ( !relativeHierarchySelector || hasParent ) {
							return makeArray( context.querySelectorAll( "[id='" + nid + "'] " + query ), extra );
						}

					} catch(pseudoError) {
					} finally {
						if ( !old ) {
							oldContext.removeAttribute( "id" );
						}
					}
				}
			}
		
			return oldSizzle(query, context, extra, seed);
		};

		for ( var prop in oldSizzle ) {
			Sizzle[ prop ] = oldSizzle[ prop ];
		}

		// release memory in IE
		div = null;
	})();
}

(function(){
	var html = document.documentElement,
		matches = html.matchesSelector || html.mozMatchesSelector || html.webkitMatchesSelector || html.msMatchesSelector;

	if ( matches ) {
		// Check to see if it's possible to do matchesSelector
		// on a disconnected node (IE 9 fails this)
		var disconnectedMatch = !matches.call( document.createElement( "div" ), "div" ),
			pseudoWorks = false;

		try {
			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( document.documentElement, "[test!='']:sizzle" );
	
		} catch( pseudoError ) {
			pseudoWorks = true;
		}

		Sizzle.matchesSelector = function( node, expr ) {
			// Make sure that attribute selectors are quoted
			expr = expr.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");

			if ( !Sizzle.isXML( node ) ) {
				try { 
					if ( pseudoWorks || !Expr.match.PSEUDO.test( expr ) && !/!=/.test( expr ) ) {
						var ret = matches.call( node, expr );

						// IE 9's matchesSelector returns false on disconnected nodes
						if ( ret || !disconnectedMatch ||
								// As well, disconnected nodes are said to be in a document
								// fragment in IE 9, so check for that
								node.document && node.document.nodeType !== 11 ) {
							return ret;
						}
					}
				} catch(e) {}
			}

			return Sizzle(expr, null, null, [node]).length > 0;
		};
	}
})();

(function(){
	var div = document.createElement("div");

	div.innerHTML = "<div class='test e'></div><div class='test'></div>";

	// Opera can't find a second classname (in 9.6)
	// Also, make sure that getElementsByClassName actually exists
	if ( !div.getElementsByClassName || div.getElementsByClassName("e").length === 0 ) {
		return;
	}

	// Safari caches class attributes, doesn't catch changes (in 3.2)
	div.lastChild.className = "e";

	if ( div.getElementsByClassName("e").length === 1 ) {
		return;
	}
	
	Expr.order.splice(1, 0, "CLASS");
	Expr.find.CLASS = function( match, context, isXML ) {
		if ( typeof context.getElementsByClassName !== "undefined" && !isXML ) {
			return context.getElementsByClassName(match[1]);
		}
	};

	// release memory in IE
	div = null;
})();

function dirNodeCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;

			elem = elem[dir];

			while ( elem ) {
				if ( elem[ expando ] === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 && !isXML ){
					elem[ expando ] = doneName;
					elem.sizset = i;
				}

				if ( elem.nodeName.toLowerCase() === cur ) {
					match = elem;
					break;
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

function dirCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;
			
			elem = elem[dir];

			while ( elem ) {
				if ( elem[ expando ] === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 ) {
					if ( !isXML ) {
						elem[ expando ] = doneName;
						elem.sizset = i;
					}

					if ( typeof cur !== "string" ) {
						if ( elem === cur ) {
							match = true;
							break;
						}

					} else if ( Sizzle.filter( cur, [elem] ).length > 0 ) {
						match = elem;
						break;
					}
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

if ( document.documentElement.contains ) {
	Sizzle.contains = function( a, b ) {
		return a !== b && (a.contains ? a.contains(b) : true);
	};

} else if ( document.documentElement.compareDocumentPosition ) {
	Sizzle.contains = function( a, b ) {
		return !!(a.compareDocumentPosition(b) & 16);
	};

} else {
	Sizzle.contains = function() {
		return false;
	};
}

Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833) 
	var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;

	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

var posProcess = function( selector, context, seed ) {
	var match,
		tmpSet = [],
		later = "",
		root = context.nodeType ? [context] : context;

	// Position selectors must be done after the filter
	// And so must :not(positional) so we move all PSEUDOs to the end
	while ( (match = Expr.match.PSEUDO.exec( selector )) ) {
		later += match[0];
		selector = selector.replace( Expr.match.PSEUDO, "" );
	}

	selector = Expr.relative[selector] ? selector + "*" : selector;

	for ( var i = 0, l = root.length; i < l; i++ ) {
		Sizzle( selector, root[i], tmpSet, seed );
	}

	return Sizzle.filter( later, tmpSet );
};
JY.query = Sizzle;
JY.text = Sizzle.getText;
JY.contains = Sizzle.contains;
Sizzle.attr = JY.attr;
JY.unique = Sizzle.uniqueSort;
})();
(function(){
	//状态码
	var JYGSTATE={
				STATE_SYSTEM_WAIT_FOR_CLOSE: 0,   
				STATE_SYSTEM_TITLE: 1,   
				STATE_SYSTEM_INSTRUCTIONS: 2,   
				STATE_SYSTEM_NEW_GAME: 3,  
				STATE_SYSTEM_GAME_OVER: 4,   
				STATE_SYSTEM_NEW_LEVEL: 5,  
				STATE_SYSTEM_LEVEL_IN: 6, 
				STATE_SYSTEM_GAME_PLAY: 7,  
				STATE_SYSTEM_LEVEL_OUT: 8,
				STATE_SYSTEM_WAIT: 9
			};
	var JYG = function(stage){
		this.timer=null;//计时器
		this.func = new Function();//当前执行函数
		this.stage=stage;//舞台
		if (stage){
			this.stage.width = JY.width(stage);
			this.stage.height = JY.height(stage);
		};
		this.lastState=null;
		this.currentState=null;//当前状态
		this.nextState = null;
		this.game = new Game();
		this.waitCount = 0;//等待
		this.waitTime = 30;
		this.titleScreen = null;
		this.InstructionsScreen= null;
		this.scoreScreen=null;
		this.gameOverScreen=null;
		this.frequency =100;//刷新频率
	};
	var Game =function(){
		this.newLevel=function(){};
	};
	JYG.prototype={
		init:function(){
		//over
		},
		setStage:function(stage){
			this.stage = stage;
			this.stage.width = JY.width(stage);
			this.stage.height = JY.height(stage);		
		},
		startTimer:function(){
			var _self=this;
			if (!_self.timer){
				_self.timer = setInterval(JY.proxyFunc(_self.runGame,_self),_self.frequency);
			}
		},
		runGame:function(){
			this.func();
		},
		checkState:function(stateVal){
			this.lastState=this.currentState;
			this.currentState = stateVal;
			switch(stateVal){
				case JYGSTATE.STATE_SYSTEM_WAIT_FOR_CLOSE:{
					this.func=  this.waitClose;
				}break;
				case JYGSTATE.STATE_SYSTEM_TITLE:{
					this.func = this.setTitle;
				}break;   
				case JYGSTATE.STATE_SYSTEM_INSTRUCTIONS:{
					this.func = this.setInstructions;
				}break;   
				case JYGSTATE.STATE_SYSTEM_NEW_GAME:{
					this.func = this.systemNewGame;
				}break; 
				case JYGSTATE.STATE_SYSTEM_GAME_OVER:{
					this.func = this.gameOver;
				} break;
				case JYGSTATE.STATE_SYSTEM_NEW_LEVEL: {
					this.func = this.newLevel;
				}break; 
				case JYGSTATE.STATE_SYSTEM_LEVEL_IN: {
					this.func = this.levelIn;
				}break;
				case JYGSTATE.STATE_SYSTEM_GAME_PLAY: {
					this.func = this.gamePlay;
				}break; 
				case JYGSTATE.STATE_SYSTEM_LEVEL_OUT:{
					this.func = this.levelOut;
				}break;
				case JYGSTATE.STATE_SYSTEM_WAIT:{
					this.func = this.wait;
				}break;
			}
		},
		setTitle:function(){
			this.addChild(this.titleScreen);
			//JY.bind(this.titleScreen,"click", JY.proxyFunc( this.okButtonClickListener,this));
			this.checkState(JYGSTATE.STATE_SYSTEM_WAIT);
			this.nextState=JYGSTATE.STATE_SYSTEM_INSTRUCTIONS;
			//this.stopTimer();
		},
		setInstructions:function(){		
			this.addChild(this.InstructionsScreen);
			JY.bind(this.InstructionsScreen,"click", JY.proxyFunc( this.okButtonClickListener,this));
			this.nextState=JYGSTATE.STATE_SYSTEM_NEW_GAME;
			this.stopTimer();
		},
		systemNewGame:function(){
			this.game.newGame();
			this.addChild(this.scoreScreen);
			this.checkState(JYGSTATE.STATE_SYSTEM_NEW_LEVEL);
		},
		gameOver:function(){
			this.clearState();
			this.addChild(this.gameOverScreen);
			JY.bind(this.gameOverScreen,"click", JY.proxyFunc( this.okButtonClickListener,this));
			//this.checkState(JYGSTATE.STATE_SYSTEM_WAIT_FOR_CLOSE);
			this.nextState=JYGSTATE.STATE_SYSTEM_TITLE;
			this.stopTimer();
		},
		newLevel:function(){
			this.game.newLevel();
			this.checkState(JYGSTATE.STATE_SYSTEM_LEVEL_IN);
		},
		gamePlay:function(){
			this.game.runGame();
		},
		wait:function(){
			this.waitCount ++;
			if (this.waitCount > this.waitTime){
				this.checkState(JYGSTATE.STATE_SYSTEM_WAIT_FOR_CLOSE);
			}
		},
		waitClose:function(){
			//this.checkState(this.nextState);
			this.okButtonClickListener();
			waitCount = 0;
		},
		levelIn:function(){
			waitTime = 10;
			this.checkState(JYGSTATE.STATE_SYSTEM_WAIT);
			this.nextState=JYGSTATE.STATE_SYSTEM_GAME_PLAY;
		},
		clearState:function(){
			var _self= this;
			var child = JY.child(_self.stage);
			JY.each(child,function(){
				_self.removeChild(this);
			});
			this.stopTimer();
		},
		okButtonClickListener:function(e){
			switch(this.nextState){
				case JYGSTATE.STATE_SYSTEM_TITLE:{
					this.removeChild(this.gameOverScreen);
					this.startTimer();
				}break;
				case JYGSTATE.STATE_SYSTEM_INSTRUCTIONS:{	
					this.removeChild(this.titleScreen);
				}break;
				case JYGSTATE.STATE_SYSTEM_NEW_GAME:{	
					this.removeChild(this.InstructionsScreen);
					this.startTimer();
				}break;
			}
			this.checkState(this.nextState);
		},
		removeChild:function(child){
			JY.remove(child);
		},
		addChild:function(child){
			if (child){
				JY.append(this.stage,child);
			}
		},
		stopTimer:function(){
			clearInterval(this.timer);
			this.timer=null;
		}
	};	
	function Sprite(w,h,style){
		this.DOM = document.createElement("i");
		style = style||{};
		JY.extend(style,{position:"absolute",overflow:"hidden",width:w+"px",height:h+"px"});
		JY.css(this.DOM,style);
		this.width = w;
		this.height = h;
		this.x = 0;
		this.y= 0;
		this.data=null;
		this.remove=function(){
			JY.remove(this.DOM);
		};
		this.setPosition=function(x,y){
			this.x = x||this.x;
			this.y = y||this.y;
			JY.css(this.DOM,{left:x+"px",top:y+"px"});
		}
	}
	window.JYG = JYG;
	window.JYGSTATE =JYGSTATE;
	window.Game=Game;
	window.Sprite = Sprite;
})();
