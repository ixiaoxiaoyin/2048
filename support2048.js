documentWidth = window.screen.availWidth;//取得屏幕宽度
gridContainerWidth = 0.92*documentWidth;//大的方块。左右各留百分之四
cellSideLength = 0.18 * documentWidth;//每个方格的边长
cellSpace = 0.04 * documentWidth;//每个方块间的留白

function getPosTop(i,j){
	return cellSpace+i*(cellSpace+cellSideLength);
}
function getPosLeft(i,j){
	return cellSpace+j*(cellSpace+cellSideLength);
}

function getNumberBackgroundColor(number){
	switch(number){
		case 2:return "#eee4da";break;
		case 4:return "#ede0c8";break;
		case 8:return "#f2b179";break;
		case 16:return "#f59563";break;
		case 32:return "#f67e5f";break;
		case 64:return "#f65e3b";break;
		case 128:return "#edcf72";break;
		case 512:return "#9c0";break;
		case 1024:return "#33b5e5";break;
		case 2048:return "#09e";break;
		case 4096:return "#a6e";break;
		case 8192:return "#93e";break;
	}
	return "black";
}

function getNumberColor(number){
	if(number <=4)
		return "#776e65";

	return "#fff";
}

function nospace(board){
	// 判断4*4棋盘格是否还有为0的格子。
		for(var i = 0 ; i < 4 ; i ++ )
			for(var j = 0 ; j < 4 ; j ++ )
				if(board[i][j] == 0)
					// 还有为0的说明当前还有空间
					return false;
				// else
		return true;
		// 说明真的没有空间了return true
} 

function canmoveleft(board){
		for(var i = 0 ; i < 4 ; i ++ )
			for(var j = 1 ; j < 4 ; j ++ )
			// 列从1开始，因为最左边的一个格子不用判断是否能向左运动
			if(board[i][j] !=0)//存在数字，则考虑两种情况
				if(board[i][j-1] == 0 || board[i][j-1] == board[i][j])
					// 左侧的数字为零，或者左侧的数字和当前数字相同，则可向左移动
					return true;

					return false;
}

function canmoveright(board){
		for(var i = 0 ; i < 4 ; i ++ )
			for(var j = 2 ; j  >= 0 ; j -- )
			// 列从2开始，因为最y右边的一个格子不用判断是否能向左运动
			if(board[i][j] !=0)//存在数字，则考虑两种情况
				if(board[i][j+1] == 0 || board[i][j+1] == board[i][j])
					// 右侧的数字为零，或者左侧的数字和当前数字相同，则可向右移动
					return true;

					return false;
}

function canmovetop(board){
		for(var j = 0 ; j  < 4 ; j ++ )
		 for(var i = 1 ; i < 4 ; i ++ )
			// 列从2开始，因为最y右边的一个格子不用判断是否能向左运动
			if(board[i][j] !=0)//存在数字，则考虑两种情况
				if(board[i-1][j] == 0 || board[i-1][j] == board[i][j])
					// 上侧的数字为零，或者左侧的数字和当前数字相同，则可向右移动
					return true;

					return false;
}

function canmovebottom(board){
		for(var j = 0 ; j  < 4 ; j ++ )
		 	for(var i =2  ; i >=0 ; i -- )
			// 列从2开始，因为最y右边的一个格子不用判断是否能向左运动
			if(board[i][j] !=0)//存在数字，则考虑两种情况
				if(board[i+1][j] == 0 || board[i+1][j] == board[i][j])
					// 上侧的数字为零，或者左侧的数字和当前数字相同，则可向右移动
					return true;

					return false;
}


function noBlockHorizontal(row,col1,col2,board){
	// 判断row行，col1到col2，中间有无board，就是障碍物
	for(var i = col1 +1; i<col2;i++)
		if(board[row][i]!=0)
			return false;//有障碍物
		return true;//无障碍物，return true

}

function noBlockHorizontalrow(col,row1,row2,board){
	// 判断col列，row1到row2，中间有无board，就是障碍物
	for(var i = row1 +1; i<row2;i++)
		if(board[i][col]!=0)
			return false;//有障碍物
		return true;//无障碍物，return true

}

function nomove(board){
	if(canmovebottom(board)||
		canmovetop(board)||
		canmoveleft(board)||
		canmoveright(board))
		return false;
	// 右任何一个方向的可以移动，则不能算作游戏结束
	return true;
}