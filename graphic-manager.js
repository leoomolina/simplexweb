function GraphicManager(){
	var $function_head = $('#function_head');
	var $function_variables = $('#function_variables');
	var $constraints_head = $('#constraints_head');
	var $constraints = $("#constraints");

	this.numberOfVariables = 0; // número total de varáveis do PPL.
	this.numberOfConstraints = 0; // número total restrições do PPL.


	var that = this;

	var addVariableInFunctionHead = function(number){
		var element = '<th>x'+number+'</th>';
		$function_head.append(element);
	};

	var addFunctionVariables = function(number){
		var element = '<td><input id="x'+number+'" value="1" type="number" class="form-control min_width_in"/></td>';
		$function_variables.append(element);
	};

	var updateConstraintHead = function(){
		$constraints_head.empty();
		
		var element = '<tr>';
		element += '<th>#</th>';
		for(var i=0; i<that.numberOfVariables; i++){
			element += '<th>x'+(i+1)+'</th>';
		}

		element += 	'<th>Sinal</th>'+
					'<th>b</th>'+
					'</tr>';

		$constraints_head.append(element);
	};

	var addConstraint = function(number){

		var element = '<tr id="constraint_'+number+'">';
		element += '<td>'+number+'</td>';

		for(var i=0; i<that.numberOfVariables; i++){
			element += '<td><input id="x'+number+'_'+(i+1)+'" value="1" type="number" class="form-control min_width_in"/></td>';
		}

		element += 	'<td>'+
						'<select id="sign_'+number+'" class="form-control min_width_in">'+
							'<option value="<">&leq; &nbsp; &nbsp; &nbsp;</option>'+
						'</select>'+
					'</td>'+
					'<td><input id="b'+number+'" value="1" type="number" class="form-control min_width_in"/></td>';
		element += '</tr>';

		$constraints.append(element);
	};

	var updateConstraintVariable = function(){
		$constraints.empty();
		for(var i=0; i<that.numberOfConstraints; i++){
			addConstraint(i+1);
		}
	};

	this.getNumberOfLines = function(){
		return that.numberOfConstraints;
	};

	this.getNumberOfColumns = function(){
		return that.numberOfVariables;
	};

	this.addLine = function(){
		that.numberOfConstraints++;
		addConstraint(that.numberOfConstraints);
	};

	this.addColumn = function(){
		that.numberOfVariables++;
		addVariableInFunctionHead(that.numberOfVariables);
		addFunctionVariables(that.numberOfVariables);
		updateConstraintHead();
		updateConstraintVariable();
	};

	this.removeLine = function(){
		if(that.numberOfConstraints == 0) return;

		that.numberOfConstraints--;
		$constraints.empty();
		for(var i=0; i<that.numberOfConstraints; i++){
			addConstraint(i+1);
		}
	};

	this.removeColumn = function(){
		if(that.numberOfVariables == 0) return;

		that.numberOfVariables--;
		$function_head.empty();
		$function_variables.empty();
		updateConstraintHead();
		updateConstraintVariable();
		for(var i=0; i<that.numberOfVariables; i++){
			addVariableInFunctionHead(i+1);
			addFunctionVariables(i+1);
		}
	};

	this.putMColumns = function(numberOfColumns){
		if(numberOfColumns < 0) return;

		that.numberOfVariables = numberOfColumns;
		$function_head.empty();
		$function_variables.empty();
		updateConstraintHead();
		updateConstraintVariable();
		for(var i=0; i<that.numberOfVariables; i++){
			addVariableInFunctionHead(i+1);
			addFunctionVariables(i+1);
		}
		
	};

	this.putNLines = function(numberOfLines){
		if(numberOfLines < 0) return;

		that.numberOfConstraints = numberOfLines;
		$constraints.empty();
		for(var i=0; i<that.numberOfConstraints; i++){
			addConstraint(i+1);
		}
	};

	this.putMatrix = function(lines, columns){
		if(lines < 0 || columns < 0) return;

		$constraints.empty();
		this.putMColumns(columns);
		this.putNLines(lines);
	};

	// this.endOfFirstFaseMessage = function(){
	// 	var $step = $("#steps");
	// 	var element = '<div class="alert alert-success">';
	// 	element += '<strong>Fim da primeira fase.<strong>';
	// 	element += '</div>';
	// 	$step.append(element);
	// };

	this.putAlertMessage = function(id,msg,type){
		var element = '<div class="alert alert-'+type+'">';
		element += '<button type="button" class="close" data-dismiss="alert">&times;</button>';
		element += '<strong>'+msg+'<strong>';
		element += '</div>';
		var $id = $("#"+id);
		$id.empty();
		$id.append(element);
	};

	this.removeAlertMessage = function(id){
		var $id = $("#"+id);
		$id.empty();
	};

	this.printTabelaMaxMin = function (senseMatriz) {
		var linhas = senseMatriz.length;
		var colunas = senseMatriz[0].length;
		var tabela = document.createElement("table");
		tabela.id = 'table-maxMin';
	
		tabela.className = "table table-striped";
		var thead = document.createElement("thead");
		thead.className = "thead-dark";
		var tbody=document.createElement("tbody");
		var tr = document.createElement("tr");
		tr.scope = "col";
	
		cabecalho = ['Varíaveis','Preço Sombra','Menor Valor','Maior Valor'];
	
		for (var l = 0; l < colunas; l++) {
			var variavel = cabecalho[l];
			var th = document.createElement("th");
			var texto = document.createTextNode(variavel);
			th.appendChild(texto);
			tr.appendChild(th);
		}
	
		thead.appendChild(tr);
	
		for(var n = 0; n < linhas; n++) {
	
			var tr = document.createElement("tr");
	
			for(var o = 0; o < colunas; o++) {
	
				var variavel = senseMatriz[n][o];
	
				if(variavel < 0) {
					variavel = variavel * (-1);
				}
				var td = document.createElement("td");
	
				td.appendChild(document.createTextNode(variavel));
	
				tr.appendChild(td);
			}
			tbody.appendChild(tr);
		}
	
		tabela.appendChild(thead);
		tabela.appendChild(tbody);
		tabela.border = 1;
	
		document.getElementById("valuesMaxMin").appendChild(tabela);
		$('#box-table-MaxMin').css('display','block');
		$('#hr-pos-box-table-final').css('display','block');
	
	};

	// this.printTypeOfSolution = function(id,type){
	// 	switch(type){
	// 		case "single":
	// 			that.putAlertMessage(id,"Esta é uma solução única.","info");
	// 			break;
	// 		case "infinite_solutions":
	// 			that.putAlertMessage(id,"Existem infinitas soluções.","info");
	// 			break;
	// 		case "multiple_solutions":
	// 			that.putAlertMessage(id,"Existe multiplas soluções.","info");
	// 			break;
	// 		case "unlimited":
	// 			that.putAlertMessage(id,"A solução é ilimitada.","info");
	// 			break;
	// 		default:
	// 			break;
	// 	}
	// };
}
