function negate(i) {
    return i < 0 ? Math.abs(i) : 0 - i;
}

function collisionX(self) {
    return self.x < 0 || self.x + self.w > 640;
}

function collisionY(self) {
    return self.y < 0 || self.y + self.w > 480;
}

function newSquareSprite(options) {
				
    var self = {};
    
    self.context = options.context;
    self.tick = 1;
    self.x = options.x;
    self.y = options.y;
    self.w = options.w;
    self.h = options.h;
    self.image = options.image;
    self.vec = {
        x: Math.random(),
        y: Math.random(),
        s: Math.random() + 2,
    };
    
    self.step = function() {
        
        self.tick++;
        
        if (collisionX(self))
            self.vec.x = negate(self.vec.x);
        if (collisionY(self))
            self.vec.y = negate(self.vec.y);
        
        self.vec.y = self.vec.y + 0.1;
        
        self.x += self.vec.x * self.vec.s;
        self.y += self.vec.y * self.vec.s;
    };
    
    self.render = function() {
        self.context.drawImage(self.image, self.x, self.y);
    };
    
    return self;
}

function go(canvasId) {

    var width = 640;
    var height = 480;
    
    var canvas = document.getElementById(canvasId);
    canvas.width = width;
    canvas.height = height;
    
    var context = canvas.getContext("2d");
    
    var blockImage = new Image();
    
    var things = [];
    
    for (i = 0; i < 10; i++) {
        things.push(newSquareSprite({
            context: context,
            x: 10, y: 50, w: 35, h: 35,
            image: blockImage,
        }));
    }
    
    blockImage.addEventListener("load", gameLoop);
    blockImage.src = "square.png";
    
    function gameLoop () {
        window.requestAnimationFrame(gameLoop);
        context.clearRect(0, 0, width, height);
        for (i = 0; i < things.length; i++) {
            things[i].step();
            things[i].render();
        }
	}
}
