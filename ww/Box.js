//Box class
module.exports = class Box {
	constructor(x, y, imgsrc, grid) {
		this.x = x;
		this.y = y;
		this.img = imgsrc;
		this.grid = grid;
		this.isBox = true;
		this.isPlayer = false;
		this.isMonster = false;
		this.isSmartMonster = false;
	}
	makeMove(str) {
		var temp1;
		var temp2;
		var possibleMove;

		switch (str) {
			case "N":
				if (this.x - 1 > 0) {
					temp1 = this.x - 1;
					if ((temp1.toString() + "," + this.y.toString()) in this.grid.hashing) {
						if ((this.grid.hashing[(temp1.toString() + "," + this.y.toString())].isMonster)) {
							return false; break
						}
						if (this.grid.hashing[(temp1.toString() + "," + this.y.toString())].isBox) {
							possibleMove = this.grid.hashing[(temp1.toString() + "," + this.y.toString())].makeMove("N");
							if (possibleMove) {
								delete this.grid.hashing[(this.x.toString() + "," + this.y.toString())];
								this.x = this.x - 1;
								this.grid.hashing[(this.x.toString() + "," + this.y.toString())] = this;
								return true; break;
							} else { return false; break; }
						}
					}
					delete this.grid.hashing[(this.x.toString() + "," + this.y.toString())];
					this.x = this.x - 1;
					this.grid.hashing[(this.x.toString() + "," + this.y.toString())] = this;
					return true;
				}
				else {
					return false;
				}
				break;
			case "NW":
				if (this.x - 1 > 0 && this.y - 1 > 0) {
					temp1 = this.x - 1;
					temp2 = this.y - 1;
					if ((temp1.toString() + "," + temp2.toString()) in this.grid.hashing) {
						if (this.grid.hashing[(temp1.toString() + "," + temp2.toString())].isMonster) {
							return false; break;
						}
						if (this.grid.hashing[(temp1.toString() + "," + temp2.toString())].isBox) {
							possibleMove = this.grid.hashing[(temp1.toString() + "," + temp2.toString())].makeMove("NW");
							if (possibleMove) {
								delete this.grid.hashing[(this.x.toString() + "," + this.y.toString())];
								this.x = this.x - 1;
								this.y = this.y - 1;
								this.grid.hashing[(this.x.toString() + "," + this.y.toString())] = this;
								return true; break;
							} else { return false; break; }
						}
					}
					delete this.grid.hashing[(this.x.toString() + "," + this.y.toString())];
					this.x = this.x - 1;
					this.y = this.y - 1;
					this.grid.hashing[(this.x.toString() + "," + this.y.toString())] = this;
					return true;
				}
				else {
					return false;
				}
				break;
			case "NE":
				if (this.x - 1 > 0 && this.y + 1 < this.grid.width - 1) {
					temp1 = this.x - 1;
					temp2 = this.y + 1;
					if ((temp1.toString() + "," + temp2.toString()) in this.grid.hashing) {
						if (this.grid.hashing[(temp1.toString() + "," + temp2.toString())].isMonster) {
							return false; break;
						}
						if (this.grid.hashing[(temp1.toString() + "," + temp2.toString())].isBox) {
							possibleMove = this.grid.hashing[(temp1.toString() + "," + temp2.toString())].makeMove("NE");
							if (possibleMove) {
								delete this.grid.hashing[(this.x.toString() + "," + this.y.toString())];
								this.x = this.x - 1;
								this.y = this.y + 1;
								this.grid.hashing[(this.x.toString() + "," + this.y.toString())] = this;
								return true; break;
							} else { return false; break; }
						}
					}
					delete this.grid.hashing[(this.x.toString() + "," + this.y.toString())];
					this.x = this.x - 1;
					this.y = this.y + 1;
					this.grid.hashing[(this.x.toString() + "," + this.y.toString())] = this;
					return true;
				}
				else {
					return false;
				}
				break;
			case "SW":
				if (this.x + 1 < this.grid.height - 1 && this.y - 1 > 0) {
					temp1 = this.x + 1;
					temp2 = this.y - 1;
					if ((temp1.toString() + "," + temp2.toString()) in this.grid.hashing) {
						if (this.grid.hashing[(temp1.toString() + "," + temp2.toString())].isMonster) {
							return false; break;
						}
						if (this.grid.hashing[(temp1.toString() + "," + temp2.toString())].isBox) {
							possibleMove = this.grid.hashing[(temp1.toString() + "," + temp2.toString())].makeMove("SW");
							if (possibleMove) {
								delete this.grid.hashing[(this.x.toString() + "," + this.y.toString())];
								this.x = this.x + 1;
								this.y = this.y - 1;
								this.grid.hashing[(this.x.toString() + "," + this.y.toString())] = this;
								return true; break;
							} else { return false; break; }
						}
					}
					delete this.grid.hashing[(this.x.toString() + "," + this.y.toString())];
					this.x = this.x + 1;
					this.y = this.y - 1;
					this.grid.hashing[(this.x.toString() + "," + this.y.toString())] = this;
					return true;
				} else { return false; }
				break;
			case "SE":
				if (this.x + 1 < this.grid.height - 1 && this.y + 1 < this.grid.width - 1) {
					temp1 = this.x + 1;
					temp2 = this.y + 1;
					if ((temp1.toString() + "," + temp2.toString()) in this.grid.hashing) {
						if (this.grid.hashing[(temp1.toString() + "," + temp2.toString())].isMonster) {
							return false; break;
						}
						if (this.grid.hashing[(temp1.toString() + "," + temp2.toString())].isBox) {
							possibleMove = this.grid.hashing[(temp1.toString() + "," + temp2.toString())].makeMove("SE");
							if (possibleMove) {
								delete this.grid.hashing[(this.x.toString() + "," + this.y.toString())];
								this.x = this.x + 1;
								this.y = this.y + 1;
								this.grid.hashing[(this.x.toString() + "," + this.y.toString())] = this;
								return true; break;
							} else { return false; break; }
						}
					}
					delete this.grid.hashing[(this.x.toString() + "," + this.y.toString())];
					this.x = this.x + 1;
					this.y = this.y + 1;
					this.grid.hashing[(this.x.toString() + "," + this.y.toString())] = this;
					return true;
				} else { return false; }
				break;
			case "S":
				if (this.x + 1 < this.grid.height - 1) {
					temp1 = this.x + 1;
					if ((temp1.toString() + "," + this.y.toString()) in this.grid.hashing) {
						if (this.grid.hashing[(temp1.toString() + "," + this.y.toString())].isMonster) {
							return false; break;
						}
						if (this.grid.hashing[(temp1.toString() + "," + this.y.toString())].isBox) {
							possibleMove = this.grid.hashing[(temp1.toString() + "," + this.y.toString())].makeMove("S");
							if (possibleMove) {
								delete this.grid.hashing[(this.x.toString() + "," + this.y.toString())];
								this.x = this.x + 1;
								this.grid.hashing[(this.x.toString() + "," + this.y.toString())] = this;
								return true; break;
							} else { return false; break; }
						}
					}
					delete this.grid.hashing[(this.x.toString() + "," + this.y.toString())];
					this.x = this.x + 1;
					this.grid.hashing[(this.x.toString() + "," + this.y.toString())] = this;
					return true;
				} else { return false; }
				break;
			case "W":
				if (this.y - 1 > 0) {
					temp1 = this.y - 1;
					if ((this.x.toString() + "," + temp1.toString()) in this.grid.hashing) {
						if (this.grid.hashing[(this.x.toString() + "," + temp1.toString())].isMonster) {
							return false; break;
						}
						if (this.grid.hashing[(this.x.toString() + "," + temp1.toString())].isBox) {
							possibleMove = this.grid.hashing[(this.x.toString() + "," + temp1.toString())].makeMove("W");
							if (possibleMove) {
								delete this.grid.hashing[(this.x.toString() + "," + this.y.toString())];
								this.y = this.y - 1;
								this.grid.hashing[(this.x.toString() + "," + this.y.toString())] = this;
								return true; break;
							} else { return false; break; }
						}
					}
					delete this.grid.hashing[(this.x.toString() + "," + this.y.toString())];
					this.y = this.y - 1;
					this.grid.hashing[(this.x.toString() + "," + this.y.toString())] = this;
					return true;
				} else { return false; }
				break;
			case "E":
				if (this.y + 1 < this.grid.width - 1) {
					temp1 = this.y + 1;
					if ((this.x.toString() + "," + temp1.toString()) in this.grid.hashing) {
						if (this.grid.hashing[(this.x.toString() + "," + temp1.toString())].isMonster) {
							return false; break;
						}
						if (this.grid.hashing[(this.x.toString() + "," + temp1.toString())].isBox) {
							possibleMove = this.grid.hashing[(this.x.toString() + "," + temp1.toString())].makeMove("E");
							if (possibleMove) {
								delete this.grid.hashing[(this.x.toString() + "," + this.y.toString())];
								this.y = this.y + 1;
								this.grid.hashing[(this.x.toString() + "," + this.y.toString())] = this;
								return true; break;
							} else { return false; break; }
						}
					}
					delete this.grid.hashing[(this.x.toString() + "," + this.y.toString())];
					this.y = this.y + 1;
					this.grid.hashing[(this.x.toString() + "," + this.y.toString())] = this;
					return true;
				}
				else {
					return false; break;
				}
				break;
		}
	}
}