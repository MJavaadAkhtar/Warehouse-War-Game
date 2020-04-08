class Monsters {
	constructor(x, y, imgsrc, grid) {
		this.x = x;
		this.y = y;
		this.img = imgsrc;
		this.grid = grid;
		this.isBox = false;
		this.possibleMove = []
		this.isPlayer = false;
		this.isMonster = true;
		this.kill = "";
	}

	getPossibleMoves(){
		this.possibleMove = []
		var temp = this.x - 1;
		if (((temp.toString() + "," + this.y.toString()) in this.grid.hashing) 
			&& ((this.grid.hashing[(temp.toString() + "," + this.y.toString())]).isPlayer)) {
			if (this.x - 1 > 0) {
				this.possibleMove.push((temp.toString() + "," + this.y.toString()));
			}
		}
		if (!((temp.toString() + "," + this.y.toString()) in this.grid.hashing)) {
			if (this.x - 1 > 0) {
				this.possibleMove.push((temp.toString() + "," + this.y.toString()));
			}
		}
		var temp2 = this.y - 1;
		if (((temp.toString() + "," + temp2.toString()) in this.grid.hashing) && (this.grid.hashing[(temp.toString() + "," + temp2.toString())]).isPlayer) {
			if (this.x - 1 > 0 && this.y - 1 > 0) {
				this.possibleMove.push((temp.toString() + "," + temp2.toString()));
			}
		}
		if (!((temp.toString() + "," + temp2.toString()) in this.grid.hashing)) {
			if (this.x - 1 > 0 && this.y - 1 > 0) {
				this.possibleMove.push((temp.toString() + "," + temp2.toString()));
			}
		}
		temp2 = this.y + 1;
		if (((temp.toString() + "," + temp2.toString()) in this.grid.hashing) && (this.grid.hashing[(temp.toString() + "," + temp2.toString())]).isPlayer) {
			if (this.x - 1 > 0 && this.y + 1 < this.grid.width - 1) {
				this.possibleMove.push((temp.toString() + "," + temp2.toString()));
			}
		}
		if (!((temp.toString() + "," + temp2.toString()) in this.grid.hashing)) {
			if (this.x - 1 > 0 && this.y + 1 < this.grid.width - 1) {
				this.possibleMove.push((temp.toString() + "," + temp2.toString()));
			}
		}
		temp = this.x + 1;
		if (((temp.toString() + "," + this.y.toString()) in this.grid.hashing) && (this.grid.hashing[(temp.toString() + "," + this.y.toString())]).isPlayer) {
			if (this.x + 1 < this.grid.height - 1) {
				this.possibleMove.push((temp.toString() + "," + this.y.toString()));
			}
		}
		if (!((temp.toString() + "," + this.y.toString()) in this.grid.hashing)) {
			if (this.x + 1 < this.grid.height - 1) {
				this.possibleMove.push((temp.toString() + "," + this.y.toString()));
			}
		}
		temp2 = this.y - 1;
		if (((temp.toString() + "," + temp2.toString()) in this.grid.hashing) && (this.grid.hashing[(temp.toString() + "," + temp2.toString())]).isPlayer) {
			if (this.x + 1 < this.grid.height - 1 && this.y - 1 > 0) {
				this.possibleMove.push((temp.toString() + "," + temp2.toString()));
			}
		}
		if (!((temp.toString() + "," + temp2.toString()) in this.grid.hashing)) {
			if (this.x + 1 < this.grid.height - 1 && this.y - 1 > 0) {
				this.possibleMove.push((temp.toString() + "," + temp2.toString()));
			}
		}
		temp2 = this.y + 1;
		if (((temp.toString() + "," + temp2.toString()) in this.grid.hashing) && (this.grid.hashing[(temp.toString() + "," + temp2.toString())]).isPlayer) {
			if (this.x + 1 < this.grid.height - 1 && this.y + 1 < this.grid.width - 1) {
				this.possibleMove.push((temp.toString() + "," + temp2.toString()));
			}
		}
		if (!((temp.toString() + "," + temp2.toString()) in this.grid.hashing)) {
			if (this.x + 1 < this.grid.height - 1 && this.y + 1 < this.grid.width - 1) {
				this.possibleMove.push((temp.toString() + "," + temp2.toString()));
			}
		}
		temp2 = this.y - 1;
		if (((this.x.toString() + "," + temp2.toString()) in this.grid.hashing) && ((this.grid.hashing[(this.x.toString() + "," + temp2.toString())].isPlayer))) {
			if (this.y - 1 > 0) {
				this.possibleMove.push((this.x.toString() + "," + temp2.toString()));
			}
		}
		if ((!((this.x.toString() + "," + temp2.toString()) in this.grid.hashing))) {
			if (this.y - 1 > 0) {
				this.possibleMove.push((this.x.toString() + "," + temp2.toString()));
			}
		}
		temp2 = this.y + 1;
		if (((this.x.toString() + "," + temp2.toString()) in this.grid.hashing) && ((this.grid.hashing[(this.x.toString() + "," + temp2.toString())].isPlayer))) {
			if ((this.y + 1 < this.grid.width - 1)) {
				this.possibleMove.push((this.x.toString() + "," + temp2.toString()));
			}
		}
		if ((!((this.x.toString() + "," + temp2.toString()) in this.grid.hashing))) {
			if ((this.y + 1 < this.grid.width - 1)) {
				this.possibleMove.push((this.x.toString() + "," + temp2.toString()));
			}
		}
	}
	getRandMove (user) {
		this.getPossibleMoves();
		if (this.possibleMove.length > 0) {
			var pickedMove = this.possibleMove[Math.floor(Math.random() * this.possibleMove.length)];
			var splitting = pickedMove.split(",");
			delete this.grid.hashing[(this.x.toString() + "," + this.y.toString())]
			this.x = Number(splitting[0]);
			this.y = Number(splitting[1]);

			if (this.grid.getNumPlayers() > 0) {
				for (var username in this.grid.getPlayers()) {
					var player = this.grid.getPlayers()[username];
					if (player.x == this.x && player.y == this.y) {
						this.grid.removePlayer(username);
					}
				}
			}
			this.grid.hashing[(this.x.toString() + "," + this.y.toString())] = this;
		}
		else {
			// this.grid.score += 250;
			user.score +=250;
			console.log("deleted " + (this.x.toString() + "," + this.y.toString()));
			delete this.grid.hashing[(this.x.toString() + "," + this.y.toString())]
		}
	}
}

class SmartMonsters extends Monsters {
	constructor(x, y, imgsrc, grid) {
		super(x,y,imgSrc,grid);
		this.isSmartMonster = true;
	}
	getPossibleMoves  () {
		this.possibleMove = []
		var temp = this.x - 1;
		if (((temp.toString() + "," + this.y.toString()) in this.grid.hashing) && ((this.grid.hashing[(temp.toString() + "," + this.y.toString())]).isPlayer)) {
			if (this.x - 1 > 0) {
				this.possibleMove.push((temp.toString() + "," + this.y.toString()));
			}
		}
		if (!((temp.toString() + "," + this.y.toString()) in this.grid.hashing)) {
			if (this.x - 1 > 0) {
				this.possibleMove.push((temp.toString() + "," + this.y.toString()));
			}
		}
		var temp2 = this.y - 1;
		if (((temp.toString() + "," + temp2.toString()) in this.grid.hashing) && (this.grid.hashing[(temp.toString() + "," + temp2.toString())]).isPlayer) {
			if (this.x - 1 > 0 && this.y - 1 > 0) {
				this.possibleMove.push((temp.toString() + "," + temp2.toString()));
			}
		}
		if (!((temp.toString() + "," + temp2.toString()) in this.grid.hashing)) {
			if (this.x - 1 > 0 && this.y - 1 > 0) {
				this.possibleMove.push((temp.toString() + "," + temp2.toString()));
			}
		}
		temp2 = this.y + 1;
		if (((temp.toString() + "," + temp2.toString()) in this.grid.hashing) && (this.grid.hashing[(temp.toString() + "," + temp2.toString())]).isPlayer) {
			if (this.x - 1 > 0 && this.y + 1 < this.grid.width - 1) {
				this.possibleMove.push((temp.toString() + "," + temp2.toString()));
			}
		}
		if (!((temp.toString() + "," + temp2.toString()) in this.grid.hashing)) {
			if (this.x - 1 > 0 && this.y + 1 < this.grid.width - 1) {
				this.possibleMove.push((temp.toString() + "," + temp2.toString()));
			}
		}
		temp = this.x + 1;
		if (((temp.toString() + "," + this.y.toString()) in this.grid.hashing) && (this.grid.hashing[(temp.toString() + "," + this.y.toString())]).isPlayer) {
			if (this.x + 1 < this.grid.height - 1) {
				this.possibleMove.push((temp.toString() + "," + this.y.toString()));
			}
		}
		if (!((temp.toString() + "," + this.y.toString()) in this.grid.hashing)) {
			if (this.x + 1 < this.grid.height - 1) {
				this.possibleMove.push((temp.toString() + "," + this.y.toString()));
			}
		}
		temp2 = this.y - 1;
		if (((temp.toString() + "," + temp2.toString()) in this.grid.hashing) && (this.grid.hashing[(temp.toString() + "," + temp2.toString())]).isPlayer) {
			if (this.x + 1 < this.grid.height - 1 && this.y - 1 > 0) {
				this.possibleMove.push((temp.toString() + "," + temp2.toString()));
			}
		}
		if (!((temp.toString() + "," + temp2.toString()) in this.grid.hashing)) {
			if (this.x + 1 < this.grid.height - 1 && this.y - 1 > 0) {
				this.possibleMove.push((temp.toString() + "," + temp2.toString()));
			}
		}
		temp2 = this.y + 1;
		if (((temp.toString() + "," + temp2.toString()) in this.grid.hashing) && (this.grid.hashing[(temp.toString() + "," + temp2.toString())]).isPlayer) {
			if (this.x + 1 < this.grid.height - 1 && this.y + 1 < this.grid.width - 1) {
				this.possibleMove.push((temp.toString() + "," + temp2.toString()));
			}
		}
		if (!((temp.toString() + "," + temp2.toString()) in this.grid.hashing)) {
			if (this.x + 1 < this.grid.height - 1 && this.y + 1 < this.grid.width - 1) {
				this.possibleMove.push((temp.toString() + "," + temp2.toString()));
			}
		}
		temp2 = this.y - 1;
		if (((this.x.toString() + "," + temp2.toString()) in this.grid.hashing) && ((this.grid.hashing[(this.x.toString() + "," + temp2.toString())].isPlayer))) {
			if (this.y - 1 > 0) {
				this.possibleMove.push((this.x.toString() + "," + temp2.toString()));
			}
		}
		if ((!((this.x.toString() + "," + temp2.toString()) in this.grid.hashing))) {
			if (this.y - 1 > 0) {
				this.possibleMove.push((this.x.toString() + "," + temp2.toString()));
			}
		}
		temp2 = this.y + 1;
		if (((this.x.toString() + "," + temp2.toString()) in this.grid.hashing) && ((this.grid.hashing[(this.x.toString() + "," + temp2.toString())].isPlayer))) {
			if ((this.y + 1 < this.grid.width - 1)) {
				this.possibleMove.push((this.x.toString() + "," + temp2.toString()));
			}
		}
		if ((!((this.x.toString() + "," + temp2.toString()) in this.grid.hashing))) {
			if ((this.y + 1 < this.grid.width - 1)) {
				this.possibleMove.push((this.x.toString() + "," + temp2.toString()));
			}
		}
	}

	// Euclidean(x, y) {
	// 	return Math.sqrt(Math.pow((x - this.player.x), 2) + Math.pow((y - this.player.y), 2));
	// }

}

module.exports = { 
	SmartMonsters: SmartMonsters,
	Monsters: Monsters
  }