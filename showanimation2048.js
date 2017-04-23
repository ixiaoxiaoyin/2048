function showNumberWithAnimation(i,j,randnumber){
	var numberCell = $('#number-cell-'+i+'-'+j);

	numberCell.css('background-color',getNumberBackgroundColor(randnumber));
	numberCell.css('color',getNumberColor(randnumber));
	numberCell.text(randnumber);

	numberCell.animate({
		width:cellSideLength,
		height:cellSideLength,
		top:getPosTop(i,j),
		left:getPosLeft(i,j)
	},100);
}

function showMoveAnimation(fromx,fromy,tox,toy){
	var numberCell = $('#number-cell-'+fromx+'-'+fromy);
	numberCell.animate({
		top:getPosTop(tox,toy),
		left:getPosLeft(tox,toy),
	},200)
}

function updatescore(score){
	$('#score').text(score);
}