module.exports = class Player {
	constructor(x, y, imgsrc, grid, username) {
		this.x = x;
		this.y = y;
		this.img = imgsrc;
		this.grid = grid;
		this.isPlayer = true;
		this.isMonster = false;
		this.username = username;
		this.score = 1000;
	}
	makeMove (str) {
		var possibleMove;
		var temp1;
		var temp2;
		switch (str) {
			case "N":
				
				if (this.x - 1 > 0) {
					temp1 = this.x - 1;
					if ((temp1.toString() + "," + this.y.toString()) in this.grid.hashing) {
						if ((this.grid.hashing[(temp1.toString() + "," + this.y.toString())].isMonster)) {
							this.grid.removePlayer(this.username); 
							break;
						}
						if ((this.grid.hashing[(temp1.toString() + "," + this.y.toString())].isPlayer)) {
							 break;
						}
						if (this.grid.hashing[(temp1.toString() + "," + this.y.toString())].isBox) {
							// alert("reaches here");
							possibleMove = this.grid.hashing[(temp1.toString() + "," + this.y.toString())].makeMove("N");
							if (!possibleMove) {
								break;
														}}
					}
					this.x = this.x - 1;
				}
				break;
	
			case "NW":
				if (this.x - 1 > 0 && this.y - 1 > 0) {
					temp1 = this.x - 1;
					temp2 = this.y - 1;
					if ((temp1.toString() + "," + temp2.toString()) in this.grid.hashing) {
						if (this.grid.hashing[(temp1.toString() + "," + temp2.toString())].isMonster) {
							this.grid.removePlayer(this.username); 
							break;
						}
						if ((this.grid.hashing[(temp1.toString() + "," + temp2.toString())].isPlayer)) {
							break;
					   }
						if (this.grid.hashing[(temp1.toString() + "," + temp2.toString())].isBox) {
							possibleMove = this.grid.hashing[(temp1.toString() + "," + temp2.toString())].makeMove("NW");
							if (!possibleMove) {
								break;
															}}
					}
					this.x = this.x - 1;
					this.y = this.y - 1;
				}
				break;
	
	
			case "NE":
				if (this.x - 1 > 0 && this.y + 1 < this.grid.width - 1) {
					temp1 = this.x - 1;
					temp2 = this.y + 1;
					if ((temp1.toString() + "," + temp2.toString()) in this.grid.hashing) {
						if (this.grid.hashing[(temp1.toString() + "," + temp2.toString())].isMonster) {
							this.grid.removePlayer(this.username); 
							break;
						}
						if (this.grid.hashing[(temp1.toString() + "," + temp2.toString())].isPlayer) {
							break;
						}
						
						if (this.grid.hashing[(temp1.toString() + "," + temp2.toString())].isBox) {
							possibleMove = this.grid.hashing[(temp1.toString() + "," + temp2.toString())].makeMove("NE");
							if (!possibleMove) {
								break;
							}
						}
					}
					this.x = this.x - 1;
					this.y = this.y + 1;
				}
				break;
	
	
			case "S":
				if (this.x + 1 < this.grid.height - 1) {
					temp1 = this.x + 1;
					if ((temp1.toString() + "," + this.y.toString()) in this.grid.hashing) {
						if (this.grid.hashing[(temp1.toString() + "," + this.y.toString())].isMonster) {
							this.grid.removePlayer(this.username); 
							break;
						}
	
						if (this.grid.hashing[(temp1.toString() + "," + this.y.toString())].isPlayer) {
							 break;
						}
						if (this.grid.hashing[(temp1.toString() + "," + this.y.toString())].isBox) {
							possibleMove = this.grid.hashing[(temp1.toString() + "," + this.y.toString())].makeMove("S");
							if (!possibleMove) {
								break;
							}
						}
					}
					this.x = this.x + 1;
				}
				break;
	
	
			case "SW":
				if (this.x + 1 < this.grid.height - 1 && this.y - 1 > 0) {
					temp1 = this.x + 1;
					temp2 = this.y - 1;
					if ((temp1.toString() + "," + temp2.toString()) in this.grid.hashing) {
						if (this.grid.hashing[(temp1.toString() + "," + temp2.toString())].isMonster) {
							this.grid.removePlayer(this.username); 
							break;
						}
						if (this.grid.hashing[(temp1.toString() + "," + temp2.toString())].isPlayer) {
							break;
						}
						if (this.grid.hashing[(temp1.toString() + "," + temp2.toString())].isBox) {
							possibleMove = this.grid.hashing[(temp1.toString() + "," + temp2.toString())].makeMove("SW");
							if (!possibleMove) {
								break;
							}
						}
					}
					this.x = this.x + 1;
					this.y = this.y - 1;
				}
				break;
	
			case "SE":
				if (this.x + 1 < this.grid.height - 1 && this.y + 1 < this.grid.width - 1) {
					temp1 = this.x + 1;
					temp2 = this.y + 1;
					if ((temp1.toString() + "," + temp2.toString()) in this.grid.hashing) {
						if (this.grid.hashing[(temp1.toString() + "," + temp2.toString())].isMonster) {
							this.grid.removePlayer(this.username); 
							break;
						}
	
						if (this.grid.hashing[(temp1.toString() + "," + temp2.toString())].isPlayer) {
							 break;
						}
	
						if (this.grid.hashing[(temp1.toString() + "," + temp2.toString())].isBox) {
							possibleMove = this.grid.hashing[(temp1.toString() + "," + temp2.toString())].makeMove("SE");
							if (!possibleMove) {
								break;
							}
						}
					}
					this.x = this.x + 1;
					this.y = this.y + 1;
				}
				break;
	
			case "W":
				if (this.y - 1 > 0) {
					temp1 = this.y - 1;
					if ((this.x.toString() + "," + temp1.toString()) in this.grid.hashing) {
						if (this.grid.hashing[(this.x.toString() + "," + temp1.toString())].isMonster) {
							this.grid.removePlayer(this.username); 
							break;
						}
						if (this.grid.hashing[(this.x.toString() + "," + temp1.toString())].isPlayer) {
							 break;
						}
						if (this.grid.hashing[(this.x.toString() + "," + temp1.toString())].isBox) {
							possibleMove = this.grid.hashing[(this.x.toString() + "," + temp1.toString())].makeMove("W");
	
							if (!possibleMove) {
								break;
							}
						}
					}
	
					this.y = this.y - 1;
				}
				break;
	
			case "E":
				if (this.y + 1 < this.grid.width - 1) {
					temp1 = this.y + 1;
					if ((this.x.toString() + "," + temp1.toString()) in this.grid.hashing) {
						if (this.grid.hashing[(this.x.toString() + "," + temp1.toString())].isMonster) {
							this.grid.removePlayer(this.username); 
							break;
						}
						if (this.grid.hashing[(this.x.toString() + "," + temp1.toString())].isPlayer) {
							 break;
						}
						if (this.grid.hashing[(this.x.toString() + "," + temp1.toString())].isBox) {
							possibleMove = this.grid.hashing[(this.x.toString() + "," + temp1.toString())].makeMove("E");
							if (!possibleMove) {
								break;
							}
						}
					}
					this.y = this.y + 1;
				}
				break;
		}
		// this.grid.update();
	}
}