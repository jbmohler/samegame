

var squaresize = 40;
var spotdiam = 36;
var max_x = 800 / squaresize;
var max_y = 600 / squaresize;

var colors = ["blue", "red", "green", "magenta", "purple"];

function random_color() {
	var index = Math.floor(Math.random() * colors.length);
	return colors[index];
}

function draw_spot(ctx, x, y, fill, highlight) {
	var cx = x*squaresize + squaresize/2;
	var cy = y*squaresize + squaresize/2;

	ctx.beginPath();
	ctx.arc(cx, cy, spotdiam/2, 0, 2 * Math.PI);
	ctx.fillStyle = fill;
	ctx.fill();

	if (highlight) {
		ctx.beginPath();
		ctx.arc(cx, cy, spotdiam/2 - 3, 0, 2 * Math.PI);
		ctx.lineWidth = 5;
		ctx.stroke();
	}
}

function keyfunc(i, j){
	return "sp"+i+"_"+j;
}

function SameGame() {

	this.board = {};
	this.focus_spots = new Set();

	var c = document.getElementById("board");

	this.init = function() {
		for( var i = 0; i < max_x; i++ ){
			for( var j = 0; j < max_y; j++ ){
				this.board[keyfunc(i,j)] = random_color();
			}
		}

		this.draw();
	}

	this.search_adjacent = function(i, j) {
		var adjacent  = new Set();
		var fill = this.board[keyfunc(i, j)];

		function _match(currx, curry) {
			return fill == this.board[keyfunc(currx, curry)];
		}

		function _snake_around(currx, curry, matchfunc) {
			if( currx < 0 || currx >= max_x ){ return;}
			if( curry < 0 || curry >= max_y ){ return;}

			if( matchfunc(currx, curry) ) {
				var k = keyfunc(currx, curry);
				if ( !adjacent.has(k) ) {
					adjacent.add(k);

					_snake_around(currx - 1, curry, matchfunc);
					_snake_around(currx + 1, curry, matchfunc);
					_snake_around(currx, curry - 1, matchfunc);
					_snake_around(currx, curry + 1, matchfunc);
				}
			}
		}

		_snake_around(i, j, _match);
		if( adjacent.size > 1 ){ return adjacent;} else{ return new Set(); }
	}

	this.hover_mouse = function(e) {
		var cellx = Math.floor(e.offsetX / squaresize);
		var celly = Math.floor(e.offsetY / squaresize);

		var cx = cellx * squaresize + squaresize / 2;
		var cy = celly * squaresize + squaresize / 2;

		var dsq = (cx - e.offsetX)**2 + (cy - e.offsetY)**2;
		if( dsq < (spotdiam / 2)**2 ) {
			this.focus_spots = this.search_adjacent(cellx, celly);
		}else{
			this.focus_spots = new Set();
		}
		this.draw();
	}

	c.addEventListener('mousemove', e => {this.hover_mouse(e);});

	this.draw = function() {
		var c = document.getElementById("board");
		var ctx = c.getContext("2d");

		ctx.clearRect(0, 0, c.width, c.height);

		for( var i = 0; i < max_x; i++ ){
			for( var j = 0; j < max_y; j++ ){
				var k = keyfunc(i, j);
				var f = this.board[k];
				var highlight = this.focus_spots.has(k);

				draw_spot(ctx, i, j, f, highlight);
			}
		}
	}

	return this;
}


function game_load() {
	var game = SameGame();
	game.init();
}
