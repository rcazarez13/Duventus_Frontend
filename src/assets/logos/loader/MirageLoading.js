(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [];


(lib.AnMovieClip = function(){
	this.actionFrames = [];
	this.ignorePause = false;
	this.gotoAndPlay = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.play = function(){
		cjs.MovieClip.prototype.play.call(this);
	}
	this.gotoAndStop = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndStop.call(this,positionOrLabel);
	}
	this.stop = function(){
		cjs.MovieClip.prototype.stop.call(this);
	}
}).prototype = p = new cjs.MovieClip();
// symbols:
// helper functions:

function mc_symbol_clone() {
	var clone = this._cloneProps(new this.constructor(this.mode, this.startPosition, this.loop, this.reversed));
	clone.gotoAndStop(this.currentFrame);
	clone.paused = this.paused;
	clone.framerate = this.framerate;
	return clone;
}

function getMCSymbolPrototype(symbol, nominalBounds, frameBounds) {
	var prototype = cjs.extend(symbol, cjs.MovieClip);
	prototype.clone = mc_symbol_clone;
	prototype.nominalBounds = nominalBounds;
	prototype.frameBounds = frameBounds;
	return prototype;
	}


(lib.Símbolo1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Capa_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#B2191A").s().p("AoQH/IgGAAIgBAAQgNgCgMgJIgBAAIAAgBIAAAAQgHgGgFgIQgKgTAGgWIABgDIIaukQAJgKAOgGIABAAQAIgDAIAAQAZAAAQAVIAAABIAHAKIIOOWIACAEIgBAAQAEAMgCANQgCAIgEAIQgMAWgaAEgACyiyIgFACIoXE0QgNAKAAAQQAAAOAMAJIAAAAIAGAFIISEwIAFACQAMAEAMgGQANgJACgOIAAgBIAAgDIAApkIAAgEIAAgBQgBgIgGgHQgDgDgFgDQgHgFgHAAIgKACg");
	this.shape.setTransform(58.0005,51.1);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Símbolo1, new cjs.Rectangle(0,0,116,102.2), null);


(lib.ClipGroup = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Capa_2 (mask)
	var mask = new cjs.Shape();
	mask._off = true;
	mask.graphics.p("AiiCCIAAkDIFFAAIAAEDg");
	mask.setTransform(16.325,13);

	// Capa_3
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#A6201F").s().p("AB4B7QgHgHAAgLIgRiFIhMBZQgIALgMAAQgMAAgHgLIhMhZIgRCFQAAALgHAHQgIAHgKAAQgLAAgHgHQgHgHAAgLIAhjRQAAgKAHgIQAIgHAKAAQANAAAHAKIBQB2IAEACQADgBABgBIBRh2QAHgKANAAQAKAAAIAHQAHAIAAAKIAhDRQAAALgHAHQgHAHgLAAQgKAAgIgHg");
	this.shape.setTransform(16.325,13);

	var maskedShapeInstanceList = [this.shape];

	for(var shapedInstanceItr = 0; shapedInstanceItr < maskedShapeInstanceList.length; shapedInstanceItr++) {
		maskedShapeInstanceList[shapedInstanceItr].mask = mask;
	}

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.ClipGroup, new cjs.Rectangle(0,0,32.7,26), null);


// stage content:
(lib.MirageLoading = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Capa_2
	this.instance = new lib.Símbolo1();
	this.instance.setTransform(89,88.65,1,1,0,0,0,58,67.1);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1).to({regY:51.1,rotation:3.7895,x:90,y:72.7},0).wait(1).to({rotation:7.5789,x:91.05,y:72.75},0).wait(1).to({rotation:11.3684,x:92.15,y:72.95},0).wait(1).to({rotation:15.1579,x:93.15,y:73.15},0).wait(1).to({rotation:18.9474,x:94.15,y:73.55},0).wait(1).to({rotation:22.7368,x:95.15,y:73.85},0).wait(1).to({rotation:26.5263,x:96.1,y:74.3},0).wait(1).to({rotation:30.3158,x:97,y:74.8},0).wait(1).to({rotation:34.1053,x:97.9,y:75.35},0).wait(1).to({rotation:37.8947,x:98.75,y:75.95},0).wait(1).to({rotation:41.6842,x:99.55,y:76.7},0).wait(1).to({rotation:45.4737,x:100.3,y:77.4},0).wait(1).to({rotation:49.2632,x:101.05,y:78.2},0).wait(1).to({rotation:53.0526,x:101.7,y:79},0).wait(1).to({rotation:56.8421,x:102.25,y:79.85},0).wait(1).to({rotation:60.6316,x:102.85,y:80.75},0).wait(1).to({rotation:64.4211,x:103.35,y:81.7},0).wait(1).to({rotation:68.2105,x:103.8,y:82.65},0).wait(1).to({rotation:72,x:104.1,y:83.7},0).wait(1).to({rotation:75.7895,x:104.4,y:84.7},0).wait(1).to({rotation:79.5789,x:104.65,y:85.75},0).wait(1).to({rotation:83.3684,x:104.8,y:86.75},0).wait(1).to({rotation:87.1579,x:104.9,y:87.85},0).wait(1).to({rotation:90.9474,y:88.9},0).wait(1).to({rotation:94.7368,x:104.8,y:89.95},0).wait(1).to({rotation:98.5263,x:104.7,y:90.95},0).wait(1).to({rotation:102.3158,x:104.55,y:92},0).wait(1).to({rotation:106.1053,x:104.25,y:93.05},0).wait(1).to({rotation:109.8947,x:103.9,y:94.05},0).wait(1).to({rotation:113.6842,x:103.5,y:95},0).wait(1).to({rotation:117.4737,x:103.05,y:96},0).wait(1).to({rotation:121.2632,x:102.5,y:96.95},0).wait(1).to({rotation:125.0526,x:101.95,y:97.85},0).wait(1).to({rotation:128.8421,x:101.3,y:98.65},0).wait(1).to({rotation:132.6316,x:100.6,y:99.45},0).wait(1).to({rotation:136.4211,x:99.85,y:100.25},0).wait(1).to({rotation:140.2105,x:99.1,y:100.9},0).wait(1).to({rotation:144,x:98.25,y:101.55},0).wait(1).to({rotation:147.7895,x:97.35,y:102.15},0).wait(1).to({rotation:151.5789,x:96.45,y:102.7},0).wait(1).to({rotation:155.3684,x:95.5,y:103.15},0).wait(1).to({rotation:159.1579,x:94.5,y:103.6},0).wait(1).to({rotation:162.9474,x:93.5,y:103.9},0).wait(1).to({rotation:166.7368,x:92.5,y:104.2},0).wait(1).to({rotation:170.5263,x:91.45,y:104.4},0).wait(1).to({rotation:174.3158,x:90.4,y:104.55},0).wait(1).to({rotation:178.1053,x:89.35,y:104.6},0).wait(1).to({rotation:181.8947,x:88.3,y:104.65},0).wait(1).to({rotation:185.6842,x:87.2,y:104.55},0).wait(1).to({rotation:189.4737,x:86.15,y:104.4},0).wait(1).to({rotation:193.2632,x:85.1,y:104.2},0).wait(1).to({rotation:197.0526,x:84.1,y:103.95},0).wait(1).to({rotation:200.8421,x:83.1,y:103.55},0).wait(1).to({rotation:204.6316,x:82.15,y:103.2},0).wait(1).to({rotation:208.4211,x:81.15,y:102.7},0).wait(1).to({rotation:212.2105,x:80.3,y:102.15},0).wait(1).to({rotation:216,x:79.4,y:101.55},0).wait(1).to({rotation:219.7895,x:78.55,y:100.95},0).wait(1).to({rotation:223.5789,x:77.75,y:100.2},0).wait(1).to({rotation:227.3684,x:76.95,y:99.5},0).wait(1).to({rotation:231.1579,x:76.25,y:98.7},0).wait(1).to({rotation:234.9474,x:75.7,y:97.8},0).wait(1).to({rotation:238.7368,x:75.1,y:96.95},0).wait(1).to({rotation:242.5263,x:74.55,y:96.05},0).wait(1).to({rotation:246.3158,x:74.1,y:95.05},0).wait(1).to({rotation:250.1053,x:73.65,y:94.05},0).wait(1).to({rotation:253.8947,x:73.35,y:93.1},0).wait(1).to({rotation:257.6842,x:73.1,y:92.05},0).wait(1).to({rotation:261.4737,x:72.9,y:91},0).wait(1).to({rotation:265.2632,x:72.8,y:89.95},0).wait(1).to({rotation:269.0526,x:72.75,y:88.9},0).wait(1).to({rotation:272.8421,y:87.85},0).wait(1).to({rotation:276.6316,x:72.8,y:86.8},0).wait(1).to({rotation:280.4211,x:72.95,y:85.75},0).wait(1).to({rotation:284.2105,x:73.2,y:84.75},0).wait(1).to({rotation:288,x:73.45,y:83.7},0).wait(1).to({rotation:291.7895,x:73.85,y:82.65},0).wait(1).to({rotation:295.5789,x:74.25,y:81.7},0).wait(1).to({rotation:299.3684,x:74.75,y:80.75},0).wait(1).to({rotation:303.1579,x:75.3,y:79.9},0).wait(1).to({rotation:306.9474,x:75.9,y:79},0).wait(1).to({rotation:310.7368,x:76.55,y:78.2},0).wait(1).to({rotation:314.5263,x:77.25,y:77.4},0).wait(1).to({rotation:318.3158,x:78.05,y:76.7},0).wait(1).to({rotation:322.1053,x:78.85,y:76},0).wait(1).to({rotation:325.8947,x:79.65,y:75.4},0).wait(1).to({rotation:329.6842,x:80.55,y:74.8},0).wait(1).to({rotation:333.4737,x:81.5,y:74.3},0).wait(1).to({rotation:337.2632,x:82.45,y:73.9},0).wait(1).to({rotation:341.0526,x:83.45,y:73.5},0).wait(1).to({rotation:344.8421,x:84.45,y:73.2},0).wait(1).to({rotation:348.6316,x:85.45,y:72.9},0).wait(1).to({rotation:352.4211,x:86.55,y:72.75},0).wait(1).to({rotation:356.2105,x:87.55,y:72.65},0).wait(1).to({rotation:360,x:88.65},0).wait(1));

	// Layer_1
	this.instance_1 = new lib.ClipGroup();
	this.instance_1.setTransform(89,87.1,1,1,0,0,0,16.3,13);
	this.instance_1.alpha = 0;

	this.timeline.addTween(cjs.Tween.get(this.instance_1).to({alpha:1},23).wait(1).to({alpha:0},23).wait(1).to({alpha:1},23).wait(1).to({alpha:0},23).wait(1));

	this._renderFirstFrame();

}).prototype = p = new lib.AnMovieClip();
p.nominalBounds = new cjs.Rectangle(110.7,104.1,45.3,51.599999999999994);
// library properties:
lib.properties = {
	id: '0C591E9E8D2F4590B35416C143BBE3F3',
	width: 178,
	height: 165,
	fps: 24,
	color: "#FFFFFF",
	opacity: 1.00,
	manifest: [],
	preloads: []
};



// bootstrap callback support:

(lib.Stage = function(canvas) {
	createjs.Stage.call(this, canvas);
}).prototype = p = new createjs.Stage();

p.setAutoPlay = function(autoPlay) {
	this.tickEnabled = autoPlay;
}
p.play = function() { this.tickEnabled = true; this.getChildAt(0).gotoAndPlay(this.getTimelinePosition()) }
p.stop = function(ms) { if(ms) this.seek(ms); this.tickEnabled = false; }
p.seek = function(ms) { this.tickEnabled = true; this.getChildAt(0).gotoAndStop(lib.properties.fps * ms / 1000); }
p.getDuration = function() { return this.getChildAt(0).totalFrames / lib.properties.fps * 1000; }

p.getTimelinePosition = function() { return this.getChildAt(0).currentFrame / lib.properties.fps * 1000; }

an.bootcompsLoaded = an.bootcompsLoaded || [];
if(!an.bootstrapListeners) {
	an.bootstrapListeners=[];
}

an.bootstrapCallback=function(fnCallback) {
	an.bootstrapListeners.push(fnCallback);
	if(an.bootcompsLoaded.length > 0) {
		for(var i=0; i<an.bootcompsLoaded.length; ++i) {
			fnCallback(an.bootcompsLoaded[i]);
		}
	}
};

an.compositions = an.compositions || {};
an.compositions['0C591E9E8D2F4590B35416C143BBE3F3'] = {
	getStage: function() { return exportRoot.stage; },
	getLibrary: function() { return lib; },
	getSpriteSheet: function() { return ss; },
	getImages: function() { return img; }
};

an.compositionLoaded = function(id) {
	an.bootcompsLoaded.push(id);
	for(var j=0; j<an.bootstrapListeners.length; j++) {
		an.bootstrapListeners[j](id);
	}
}

an.getComposition = function(id) {
	return an.compositions[id];
}


an.makeResponsive = function(isResp, respDim, isScale, scaleType, domContainers) {		
	var lastW, lastH, lastS=1;		
	window.addEventListener('resize', resizeCanvas);		
	resizeCanvas();		
	function resizeCanvas() {			
		var w = lib.properties.width, h = lib.properties.height;			
		var iw = window.innerWidth, ih=window.innerHeight;			
		var pRatio = window.devicePixelRatio || 1, xRatio=iw/w, yRatio=ih/h, sRatio=1;			
		if(isResp) {                
			if((respDim=='width'&&lastW==iw) || (respDim=='height'&&lastH==ih)) {                    
				sRatio = lastS;                
			}				
			else if(!isScale) {					
				if(iw<w || ih<h)						
					sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==1) {					
				sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==2) {					
				sRatio = Math.max(xRatio, yRatio);				
			}			
		}
		domContainers[0].width = w * pRatio * sRatio;			
		domContainers[0].height = h * pRatio * sRatio;
		domContainers.forEach(function(container) {				
			container.style.width = w * sRatio + 'px';				
			container.style.height = h * sRatio + 'px';			
		});
		stage.scaleX = pRatio*sRatio;			
		stage.scaleY = pRatio*sRatio;
		lastW = iw; lastH = ih; lastS = sRatio;            
		stage.tickOnUpdate = false;            
		stage.update();            
		stage.tickOnUpdate = true;		
	}
}
an.handleSoundStreamOnTick = function(event) {
	if(!event.paused){
		var stageChild = stage.getChildAt(0);
		if(!stageChild.paused || stageChild.ignorePause){
			stageChild.syncStreamSounds();
		}
	}
}
an.handleFilterCache = function(event) {
	if(!event.paused){
		var target = event.target;
		if(target){
			if(target.filterCacheList){
				for(var index = 0; index < target.filterCacheList.length ; index++){
					var cacheInst = target.filterCacheList[index];
					if((cacheInst.startFrame <= target.currentFrame) && (target.currentFrame <= cacheInst.endFrame)){
						cacheInst.instance.cache(cacheInst.x, cacheInst.y, cacheInst.w, cacheInst.h);
					}
				}
			}
		}
	}
}


})(createjs = createjs||{}, AdobeAn = AdobeAn||{});
var createjs, AdobeAn;