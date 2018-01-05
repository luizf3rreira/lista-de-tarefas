$(function() {
	
	
	var $lastClicked;
	
	function onTarefaDeleteClick() {
		$(this).parent(".tarefa-item").off("click").hide("slow", function() {
			$.post(server + "/tarefa",
							{usuario: meuLogin,
							 _method: "DELETE",
							 tarefa_id: $(this).children(".tarefa-id").text() });
			
			$(this).remove();
		});
	}
	
	function onTarefaItemClick() {
		if(!$(this).is($lastClicked)) {
			if($lastClicked !== undefined) {
				savePendingEdition($lastClicked);
			}
				
			$lastClicked = $(this);
				
			var text = $lastClicked.children(".tarefa-texto").text();
			// guardamos o id da tarefa na edição
			var id = $lastClicked.children(".tarefa-id").text();
			
			var html = "<div class='tarefa-id'>" + id + "</div>" +
						"<input type='text' " + "class='tarefa-edit' value='" + text + "'>";
						
			$(this).html(html);
			
			$(".tarefa-edit").keydown(onTarefaEditKeydown);
		}
	}
	
	function onTarefaKeyDown() {
		if(event.which ===13) {
			addTarefa($("#tarefa").val());
			$("#tarefa").val("");
		}
	}
	
	function onTarefaEditKeydown(event) {
		if(event.which === 13) {
			savePendingEdition($lastClicked);
			$lastClicked = undefined;
		}
	}
	
	function addTarefa(text, id) {
		id = id || 0;
		
		var $tarefa = $("<div />")
						.addClass("tarefa-item")
						.append($("<div />")
								.addClass("tarefa-id")
								.text(id))
						.append($("<div />")
								.addClass("tarefa-texto")
								.text(text))
						.append($("<div />")
								.addClass("tarefa-delete"))
						.append($("<div />")
								.addClass("clear"));
								
		$("#tarefa-list").append($tarefa);
		
		$(".tarefa-delete").click(onTarefaDeleteClick);
		
		$(".tarefa-item").click(onTarefaItemClick);
		
		if(id === 0) {
			var div = $tarefa.children(".tarefa-id");
			console.log("id", div);
			newTarefa(text, $(div));
		}
	}
	
	function savePendingEdition($tarefa) {
		var text = $tarefa.children(".tarefa-edit").val();
		var id = $tarefa.children(".tarefa-id").text();
		
		$tarefa.empty();
		
		$tarefa.append("<div class='tarefa-id'>" + id + "</div>")
				.append("<div class='tarefa-texto'>" + text + "</div>")
				.append("<div class='tarefa-delete'></div>")
				.append("<div class='clear'></div>");

		updateTarefa(text, id);

		$(".tarefa-delete").click(onTarefaDeleteClick);

		$tarefa.click(onTarefaItemClick);
	}
	
	function loadTarefas() {
		$("#tarefa").empty();
		
		$.getJSON(server + "/tarefas", {usuario: meuLogin})
				.done(function(data) {
					console.log("data: ", data);
					
					for(var tarefa = 0; tarefa < data.length; tarefa++) {
						addTarefa(data[tarefa].texto, data[tarefa].id);
					}
				});
	}
	
	function updateTarefa(texto, id) {
			$.post(server + "/tarefa", {tarefa_id: id, texto: texto})
	}
	
	function newTarefa(text, $div) {
		$.post(server + "/tarefa", 
						{usuario: meuLogin, 
						 texto: text, 
						 _method: "PUT"})
			.done(function(data) {
				console.log($div);
				$div.text(data.id);
		});
	}
	
	$("#tarefa").keydown(onTarefaKeyDown);
	
	$(".tarefa-delete").click(onTarefaDeleteClick);
	
	$(".tarefa-item").click(onTarefaItemClick);
	
	loadTarefas();
}
);