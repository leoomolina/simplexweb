(function(){
	var gm = new GraphicManager();
	var dm = new DataManager(gm);
	var firstLPP = new LPP();

	mostrarConteudo = true;

	var numbVar = 2;
	$('.numbVar').append(numbVar);
	var numbRes = 4;
	$('#numbRes').append(numbRes);
	//optimal solution single.
	firstLPP.setFunction("min",[-1,-1]);
	firstLPP.createConstraint([3,2],'>',6);
	firstLPP.createConstraint([4,1],'<',16);
	firstLPP.createConstraint([-2,3],'<',6);
	firstLPP.createConstraint([1,4],'>',4);

	//infinite solutions.
	/*firstLPP.setFunction("min",[5,4,1]);
	firstLPP.createConstraint([2,3,0],'>',1);
	firstLPP.createConstraint([1,-4,-2],'>',3);*/

	//unlimited solution.
	/*firstLPP.setFunction("max",[1,2]);
	firstLPP.createConstraint([4,1],'>',20);
	firstLPP.createConstraint([1,2],'>',10);
	firstLPP.createConstraint([1,0],'>',2);*/

	//multiple solutions.
	/*firstLPP.setFunction("max",[1,2]);
	firstLPP.createConstraint([1,0],'<',3);
	firstLPP.createConstraint([0,1],'<',4);
	firstLPP.createConstraint([1,2],'<',9);*/

	dm.putLPP(firstLPP);

	var firstFase = true;

	var simplex = null;

	setTranslations();

	var clearAll = function(){
		$('#great_base').empty();
		$('#solutions').empty();
		$('#steps').empty();
		simplex = null;
		firstFase = true;
		
		gm.removeAlertMessage("type_solution_msg");
		gm.removeAlertMessage("solve_msg");
		gm.removeAlertMessage("next_solution_msg");
		gm.removeAlertMessage("next_step_msg");
	};

	$("#add_column_btn").on('click',function(e){
		var lpp = dm.getLPP();
		numbVar++;
		console.log("add coluna variavel"+numbVar);
		$('.numbVar').empty();
		$('.numbVar').append(numbVar);
		gm.addColumn();	
		dm.partialPutLPP(lpp);

		setTranslations();
	});
	$("#remove_column_btn").on('click',function(e){
		var lpp = dm.getLPP();
		if(numbVar != 0){
			numbVar--;

			//console.log(numbVar);
			$('.numbVar').empty();
			$('.numbVar').append(numbVar);
      
			gm.removeColumn();
			dm.partialPutLPP(lpp);
	
			setTranslations();
		}
	});
	$("#add_line_btn").on('click',function(e){
		var lpp = dm.getLPP();
		numbRes++;
		console.log(numbRes);
		$('#numbRes').empty();
		$('#numbRes').append(numbRes);
		gm.addLine();
		dm.partialPutLPP(lpp);
	
		setTranslations();
	});
	$("#remove_line_btn").on('click',function(e){
		var lpp = dm.getLPP();
		if(numbRes != 0)
		{
			numbRes--;
      
			//console.log(numbRes);

			$('#numbRes').empty();
			$('#numbRes').append(numbRes);
			gm.removeLine();
			dm.partialPutLPP(lpp);
	
			setTranslations();
		}
	});
	$("#calculate_simplex_btn").on('click',function(e){
		clearAll();
		
		/* ### animação de rolagem ###*/
		$('html, body').animate({
			scrollTop: $("#solution_head").offset().top
		}, 2000);

		if(gm.getNumberOfLines() == 0 || gm.getNumberOfColumns() == 0){
			gm.putAlertMessage("solve_msg","size_error","danger");
			setTranslations();
			return;
		}

		var lpp = dm.getLPP();
		dm.putLPP(lpp);
		firstFase = true;

		var sp = new Simplex(lpp);
		if(sp.calculateSimplex2Fases()){
			gm.putAlertMessage("solve_msg","problem_solved","success");
			gm.printTypeOfSolution("type_solution_msg", sp.getSolution().getTypeOfSolution());
			simplex = sp;
			dm.putSolution(sp.getSolution(),1);
			dm.putGreatBase(sp.getGreatBase());
		}
		else{
			gm.removeAlertMessage("type_solution_msg");
			gm.putAlertMessage("solve_msg","invalid_lpp","danger");
		}
		
		setTranslations();


	});

	$("#clear_solutions_btn").on('click',function(){
		clearAll();
		setTranslations();
	});

	$("#next_solution").on('click',function(){
		gm.removeAlertMessage("next_solution_msg");
		if(simplex == null){
			gm.putAlertMessage("next_solution_msg","first_press_button_solve_lpp","warning");
			setTranslations();
			$('#solutions').empty();
			return;
		}

		var result = simplex.nextSolution();
		if(result == null){
			gm.putAlertMessage("next_solution_msg","there_isnt_more_solutions","info");
			setTranslations();
			return;
		}
		dm.putSolution(result, simplex.getStepSolution());

		setTranslations();
	});

	$("#next_step").on('click',function(){
		gm.removeAlertMessage("next_step_msg");
		if(simplex == null){
			gm.putAlertMessage("next_step_msg","first_press_button_solve_lpp","warning");
			$('#steps').empty();
			firstFase = true;
			setTranslations();
			return;
		}

		var result = simplex.nextStepFirstFase();
		if(result == null){
			if(firstFase){
				gm.endOfFirstFaseMessage();				
				firstFase = false;
			}
			result = simplex.nextStepSecondFase();
		}
		if(result == null) gm.putAlertMessage("next_step_msg","end_of_steps","info");

		dm.putStep(result, simplex.getStep());
		
		setTranslations();
	});

	$("#language").on("change",setTranslations);

	$(".toggler").click(function(){
		var target = $(this).attr("data-target");
		$(target).fadeToggle();
		$(this).find('i').toggleClass('glyphicon-chevron-down glyphicon-chevron-right');
		if (mostrarConteudo == true) {
			mostrarConteudo = false;
		}
	});
})();