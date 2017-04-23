var board = new Array();
var score = 0;
var hasConflicted = new Array();
// 记录每个小格子是否已经发生过了一次碰撞

var startx = 0;
var starty = 0
var endx = 0
var endy = 0;//触控时用到的点

$(document).ready(function(){
	prepareForMobile();
	newgame();
});

function prepareForMobile(){

   	if(documentWidth > 500){
   		// pc端不用手机端一样采用自适应，可有自己的一套尺寸
   		gridContainerWidth = 500;
   		cellSpace = 20;
   		cellSideLength =100;
   	}

	$("#grid-container").css("width",gridContainerWidth - 2*cellSpace);
	$("#grid-container").css("height",gridContainerWidth - 2*cellSpace);
	$("#grid-container").css("padding", cellSpace);
	$("#grid-container").css("border-radius", 0.02*gridContainerWidth);
  
	$(".grid-cell").css("width",cellSideLength);
	$(".grid-cell").css("height",cellSideLength);
	$(".grid-cell").css("border-radius", 0.02 * cellSideLength);

}

function newgame(){
	// 初始化棋盘格
	init();
	// 随机在两个格子里生成数字
	// 需要随机找两个空闲的格子生成数字
	generateOneNumber();
	generateOneNumber();
}
// 初始化棋盘格
function init(){
	// 为16个小格子找到其位置
	for(var i = 0 ; i < 4 ; i ++ )
		for(var j = 0 ; j < 4 ; j ++ ){

			var gridCell = $("#grid-cell-"+i+"-"+j);
			gridCell.css('top',getPosTop(i,j));
			gridCell.css('left',getPosLeft(i,j));
			// 根据每一个格子信息算出其top和left值
			// top值为20px+i*120px
		}
		for(var i = 0 ; i < 4 ; i ++ ){
			board[i] = new Array();
			hasConflicted[i] = new Array();
			for(var j = 0 ; j < 4 ; j ++ ){
				board[i][j] = 0;
				hasConflicted[i][j] = false;
				// 初始化为FALSE，记录为没有发生过碰撞
			}
		}
		updateBoardView();

		score = 0; 
}

function updateBoardView(){
	// 用户每操作一次board里面的值都会发生变化，所以每次需要把之前的都更新一遍
	$(".number-cell").remove();
	for(var i = 0 ; i < 4 ; i ++ )
		for(var j = 0 ; j < 4 ; j ++ ){
			$('#grid-container').append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
			var theNumberCell = $("#number-cell-"+i+"-"+j);

			if(board[i][j]==0){
				// 预设numbercell为0时候不显示
				theNumberCell.css("width",'0px');
				theNumberCell.css("height",'0px');
				theNumberCell.css("top",getPosTop(i,j)+cellSideLength/2);
				theNumberCell.css("left",getPosLeft(i,j)+cellSideLength/2);
				// 把numbercell放在gridcell的中心
			}else{
				theNumberCell.css("width",cellSideLength);
				theNumberCell.css("height",cellSideLength);
				theNumberCell.css("top",getPosTop(i,j));
				theNumberCell.css("left",getPosLeft(i,j));
				// 这样设置numbercell就刚好把gridcell覆盖住
				theNumberCell.css("background-color",getNumberBackgroundColor(board[i][j]));
				theNumberCell.css("color",getNumberColor(board[i][j]));
				theNumberCell.text(board[i][j]);
			}
				hasConflicted[i][j] = false;
				// 表示新的一轮开始的，碰撞进行归位
		}
		$('.number-cell').css('line-height',cellSideLength+'px');
		$('.number-cell').css('font-size',0.6 * cellSideLength+'px');
}

function generateOneNumber(){
	// 用Nospace函数判断是否4乘4棋盘格还有空间。
	if(nospace(board))
		// nospace为true，也就是当前棋盘格没空间了
		return false;
		// 表示此时已经无法生成一个数字

		// 随机一个位置
		var randx = parseInt(Math.floor(Math.random()*4));//0,1,2,3
		var randy = parseInt(Math.floor(Math.random()*4));//0,1,2,3
		var times = 0;
		while(times<50){//避免死循环。
			if(board[randx][randy] == 0)
				//如果随机到的是一个空的，可用则退出循环
				break;
				// 如果随机到的已经有数字，则要继续随机找到新的空位置
		randx = parseInt(Math.floor(Math.random()*4));
		randy = parseInt(Math.floor(Math.random()*4));
		times ++;
		}
		if(times == 50){
			// 如果不控制次数，则在游戏进行到最后空位很少的时候很难才能在正确的位置生成board
			// 所以控制次数，当电脑已经随机了超过五十次时便人工的为电脑分配一个找到的空位
			for(var i = 0 ; i < 4 ; i ++ )
				for(var j = 0 ; j < 4 ; j ++ ){
					if(board[i][j]==0){
						randx = i;
						randy = j;
					}
				}
		}

		// 随机一个数字  2 or 4;
		var randnumber = Math.random() < 0.5?2:4;
		// 用百分之五十的概率生成2和4

		// 在随机位置里显示随机数字
		board[randx][randy] = randnumber;
		showNumberWithAnimation(randx,randy,randnumber);
		// 生成一个新的数字需要一定的动画


	return true;
}

$(document).keydown(function(event){
	switch(event.keyCode){
		case 37://left
		event.preventDefault();
		// 阻挡这个行为发生时默认的效果
		// 避免在有进度条的pc屏幕里面，按住上下左右键时屏幕跟随着一起滑动
		if(moveLeft()){//如果能向左移动
			setTimeout('generateOneNumber()',210);
				//随机找一个空位生成随机数
			setTimeout('isgameover()',300);
			   //每随机生成一个随机数都可能导致游戏结束
		}
		break;
		case 38://top
		event.preventDefault();
		if(moveTop()){
			setTimeout('generateOneNumber()',210);
			setTimeout('isgameover()',300);
		}
		break;
		case 39://right
		event.preventDefault();
		if(moveRight()){
//随机找一个空位生成随机数
			setTimeout('generateOneNumber()',210);
			setTimeout('isgameover()',300);
		}
		break;
		case 40://bottom
		event.preventDefault();
		if(moveBottom()){
			setTimeout('generateOneNumber()',210);
			setTimeout('isgameover()',300);
		}
		break;
		default:break;
	}
});

document.addEventListener("touchmove",function(event){
	event.preventDefault();
	//为了避免使用preventDefault引起的bug
})

document.addEventListener('touchstart',function(event){
	startx = event.touches[0].pageX;
	starty = event.touches[0].pageY;
	// touches为多点触控，该游戏为单点触控，取零
})

document.addEventListener('touchend',function(event){
	endx = event.changedTouches[0].pageX;
	endy = event.changedTouches[0].pageY;
	// changedTouches为一次触控行为结束

	var deltax = endx - startx;
	var deltay = endy - starty;

	if(Math.abs(deltax) < 0.3*documentWidth&&Math.abs(deltay)<0.3*documentWidth)
		return;
 	// 控制deltax和deltay的值，可消除电脑以为点击开始按钮时三个numbercell，在屏幕上点击也产生nubmercell
	//x
	//用deltax和deltay的绝对值可判断是在x轴还是y轴上的滑动
	if(Math.abs(deltax) >= Math.abs(deltay)){
		if(deltax > 0){
			//move right
			//和判断上下左右按键之后的相同
			if(moveRight()){
			setTimeout('generateOneNumber()',210);
			setTimeout('isgameover()',300);
			}
		}else{
			//move left
			if(moveLeft()){
			setTimeout('generateOneNumber()',210);
			setTimeout('isgameover()',300);
		}}
	}else{
		if(deltay > 0){
			//move bottom
			if(moveBottom()){
			setTimeout('generateOneNumber()',210);
			setTimeout('isgameover()',300);
		}
		}else{
			//move top
			if(moveTop()){
			setTimeout('generateOneNumber()',210);
			setTimeout('isgameover()',300);
		}
		}
	}
})

function isgameover(){
	if(nospace(board)&&nomove(board)){
		gameover();
	}

};

function gameover(){
	alert('gameover!');
}

function moveLeft(){
	// 对每一个数字的左侧位置进行判断，看是否可能为落脚点

	if(!canmoveleft(board))
		// 左边是否没有数字
		// 左边数字是否和自己相同
		return false;

	//moveleft
	for(var i = 0 ; i < 4 ; i ++ )
		for(var j = 1 ; j < 4 ; j ++ ){
			if(board[i][j]!=0){
				// 再做一层循环，则将ij左侧的所有位置ik进行了遍历
				for(var k = 0; k<j;k++){
					if(board[i][k] == 0 && noBlockHorizontal(i,k,j,board)){
						// 判断ij左侧的ik不为空并且ij和ik之间有无障碍物
						//move
						showMoveAnimation(i,j,i,k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
						continue;
					}else if(board[i][k] == board[i][j]&&noBlockHorizontal(i,k,j,board)&& !hasConflicted[i][k]){
						// 判断ij等于左侧的ik并且ij和ik之间有无障碍物，则可移动和合并
						//move
						showMoveAnimation(i,j,i,k);
						//add
						board[i][k]+=board[i][j];
						board[i][j]=0;
						// add score
						score += board[i][k];
						updatescore(score);
						hasConflicted[i][k] = true;
						// 设置为TRUE，下一次便不能进行碰撞，以高度还原游戏
						continue;
					}
				}
			}
		}
		setTimeout("updateBoardView()",200);
		// 网页很快的实现了之前的animation功能，立即update，以至于看不见animation效果了，所以加一个200毫秒，便可以看见animation的效果
return true;
}

function moveRight(){
	// 对每一个数字的右侧位置进行判断，看是否可能为落脚点

	if(!canmoveright(board))
		// 右边是否没有数字
		// 右边数字是否和自己相同
		return false;

	//moveright
	for(var i = 0 ; i < 4 ; i ++ )
		for(var j = 2 ; j  >= 0 ; j -- ){
			if(board[i][j]!=0){
				// 再做一层循环，则将ij右侧的所有位置ik进行了遍历
				for(var k = 3; k >j;k--){
					if(board[i][k] == 0 && noBlockHorizontal(i,j,k,board)){
						// 判断ij左侧的ik不为空并且ij和ik之间有无障碍物
						//move
						showMoveAnimation(i,j,i,k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
						continue;
					}else if(board[i][k] == board[i][j]&&noBlockHorizontal(i,j,k,board)&& !hasConflicted[i][k]){
						// 判断ij等于左侧的ik并且ij和ik之间有无障碍物，则可移动和合并
						//move
						showMoveAnimation(i,j,i,k);
						//add
						board[i][k]+= board[i][j];
						board[i][j]=0;
						score += board[i][k];
						updatescore(score);
						hasConflicted[i][k] = true;
						continue;
					}
				}
			}
		}
		setTimeout("updateBoardView()",200);
		// 网页很快的实现了之前的animation功能，立即update，以至于看不见animation效果了，所以加一个200毫秒，便可以看见animation的效果
return true;
}

function moveTop(){
	// 对每一个数字的左侧位置进行判断，看是否可能为落脚点

	if(!canmovetop(board))
		// 左边是否没有数字
		// 左边数字是否和自己相同
		return false;

	//moveleft
	for(var i = 1 ; i < 4 ; i ++ )
		for(var j = 0 ; j < 4 ; j ++ ){
			if(board[i][j]!=0){
				// 再做一层循环，则将ij左侧的所有位置ik进行了遍历
				for(var k = 0; k<i;k++){
					if(board[k][j] == 0 && noBlockHorizontalrow(j,k,i,board)){
						// 判断ij左侧的ik不为空并且ij和ik之间有无障碍物
						//move
						showMoveAnimation(i,j,k,j);
						board[k][j] = board[i][j];
						board[i][j] = 0;
						continue;
					}else if(board[k][j] == board[i][j]&&noBlockHorizontalrow(j,k,i,board)&& !hasConflicted[k][j]){
						// 判断ij等于左侧的ik并且ij和ik之间有无障碍物，则可移动和合并
						//move
						showMoveAnimation(i,j,k,j);
						//add
						board[k][j]+=board[i][j];
						board[i][j]=0;
						score += board[k][j];
						updatescore(score);
						hasConflicted[k][j] = true;
						continue;
					}
				}
			}
		}
		setTimeout("updateBoardView()",200);
		// 网页很快的实现了之前的animation功能，立即update，以至于看不见animation效果了，所以加一个200毫秒，便可以看见animation的效果
return true;
}

function moveBottom(){
	// 对每一个数字的左侧位置进行判断，看是否可能为落脚点

	if(!canmovebottom(board))
		// 左边是否没有数字
		// 左边数字是否和自己相同
		return false;

	//moveleft
	for(var i = 2 ; i >=0 ; i -- )
		for(var j = 0 ; j < 4 ; j ++ ){
			if(board[i][j]!=0){
				// 再做一层循环，则将ij左侧的所有位置ik进行了遍历
				for(var k = 3; k > i;k--){
					if(board[k][j] == 0 && noBlockHorizontalrow(j,i,k,board)){
						// 判断ij左侧的ik不为空并且ij和ik之间有无障碍物
						//move
						showMoveAnimation(i,j,k,j);
						board[k][j] = board[i][j];
						board[i][j] = 0;
						continue;
					}else if(board[k][j] == board[i][j]&&noBlockHorizontalrow(j,i,k,board)&& !hasConflicted[k][j]){
						// 判断ij等于左侧的ik并且ij和ik之间有无障碍物，则可移动和合并
						//move
						showMoveAnimation(i,j,k,j);
						//add
						board[k][j]+=board[i][j];
						board[i][j]=0;
						score += board[k][j];
						updatescore(score);
						hasConflicted[k][j] = true;
						continue;
					}
				}
			}
		}
		setTimeout("updateBoardView()",200);
		// 网页很快的实现了之前的animation功能，立即update，以至于看不见animation效果了，所以加一个200毫秒，便可以看见animation的效果
return true;
}