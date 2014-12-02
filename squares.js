var WIDTH = 640;
var HEIGHT = 480;
var BLOCKCOUNT = 10;

var GRAVITY =  0.20; // 0 < x
var REBOUND =  0.60; // 0 < x <= 1
var FRICTION = 0.10; // 0 < x <= 1

var negate = function(i) {
    return i < 0 ? Math.abs(i) : 0 - i;
};

var minmax = function(i, min, max) {
    return Math.min(Math.max(i, min), max);
};

var collisionX = function(self) {
    return self.x <= 0 || self.x + self.w >= WIDTH;
};

var collisionY = function(self) {
    return self.y <= 0 || self.y + self.h >= HEIGHT;
}

var newSquareSprite = function(options) {
				
    var self = {};
    
    self.context = options.context;
    self.tick = 0;
    self.xHist = [0, 0, 0];
    self.yHist = [0, 0, 0];
    self.x = options.x;
    self.y = options.y;
    self.w = options.w;
    self.h = options.h;
    self.image = options.image;
    self.vec = {
        x: (Math.random() - 0.5) * 10,
        y: (Math.random() - 0.9) * 10,
    };
    
    self.step = function() {
        
        self.tick++;
        
        if (collisionX(self)) {
            self.vec.x = negate(self.vec.x) * REBOUND;
            self.vec.y *= (1 - FRICTION);
        }
        if (collisionY(self)) {
            self.vec.y = negate(self.vec.y) * REBOUND;
            self.vec.x *= (1 - FRICTION);
        }
        
        self.vec.y += GRAVITY;
        
        self.x += self.vec.x;
        self.y += self.vec.y;
        
        self.x = minmax(self.x, 0, WIDTH - self.w);
        self.y = minmax(self.y, 0, HEIGHT - self.h);
        
        self.xHist.shift();
        self.xHist.push(self.x);
        self.yHist.shift();
        self.yHist.push(self.y);
    };
    
    self.render = function() {
        self.context.drawImage(self.image, self.x, self.y);
    };
    
    return self;
};

function go(canvasId) {

    var canvas = document.getElementById(canvasId);
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    
    var context = canvas.getContext("2d");
    
    var blockImage = new Image();
    
    var blocks = [];
    
    for (i = 0; i < BLOCKCOUNT; i++) {
        blocks.push(newSquareSprite({
            context: context,
            x: WIDTH/2, y: HEIGHT/2, w: 35, h: 35,
            image: blockImage,
        }));
    }
    
    blockImage.addEventListener("load", gameLoop);
    blockImage.src = "square.png";
    
    function gameLoop () {
        window.requestAnimationFrame(gameLoop);
        context.clearRect(0, 0, WIDTH, HEIGHT);
        for (i = 0; i < blocks.length; i++) {
            blocks[i].step();
            blocks[i].render();
        }
	}
}