var name = "";
var initial = "?";
var assistenza_active = false;
var language = 'en';

const answer_for_greetings_en = 'Hi!';
const answer_for_greetings_it = 'Ciao!';
const greetings = ['hi!', 'hello', 'morning', 'evening', 'whats up', 'ciao', 'salve', 'buongiorno', 'buonasera', 'come va'];

const answer_for_bad_words_en = "Please don't address me that way.";
const answer_for_bad_words_it = 'Ti prego di non rivolgerti a me in questo modo.';
const bad_words = ['fuck', 'cock', 'ass ', 'shit', 'cacca', 'cazzo', 'culo', 'figa', 'merda', 'stronzo', 'troia'];

const answer_for_forbidden_words_en = "I'm sorry, I don't do these things.";
const answer_for_forbidden_words_it = 'Mi dispiace, non faccio queste cose.';
const forbidden_words = ['repair', 'repair', 'printer', 'sexy', 'phone', 'aggiustare', 'riparare', 'stampante', 'sexy', 'telefono'];

var answer = "";
var answer_i = 0; // For type animation

const possible_answers_en = [
	'Have you tried turning it off and on?',
	'Have you checked that the power socket is correctly connected?'
];
const possible_answers_it = [
	'Hai provato a spengere e riaccendere?',
	'Hai controllato che la presa della corrente sia correttamente connessa?'
];
var possible_answers_index = 0; // For loop all possible anwers

const swiperElements = [];

function ask() {
	
	// Get question
	input = $(".assistenzaTecnica input.question");
	// Regular expression to identify HTML tags in
    // the input string. Replacing the identified
    // HTML tag with a null string.
	question = input.val().replace(/(<([^>]+)>)/ig, '');
	input.val('');
	if(question == '' || question == null) { return; }
	
	// Lock input
	input.attr("disabled", true);
	
	// Get answer
	if(language == 'it' && containWords(bad_words, question)) {
		answer = answer_for_bad_words_it;
	} else if(language != 'it' && containWords(bad_words, question)) {
		answer = answer_for_bad_words_en;
	} else if(language == 'it' && containWords(greetings, question)) {
		answer = answer_for_greetings_it;
	}  else if(language != 'it' && containWords(greetings, question)) {
		answer = answer_for_greetings_en;
	} else if(name == "") {
		name = question.replace(/ .*/,'').toLowerCase(); // Get fist word lowercase
		initial = name.charAt(0).toUpperCase(); // Get first letter uppercase
		name = initial + name.slice(1); // Set name with first letter uppercase
		console.log("language: " + language);
		if(language == 'it') {
			answer = "Ciao " + name + ", come posso esserti utile?";
			input.attr("placeholder", "Chiedimi qualcosa");
		} else {
			answer = "Hi " + name + ", how can i help you?";
			input.attr("placeholder", "Ask me something");
		}
	} else if(language == 'it' && containWords(forbidden_words, question)) {
		answer = answer_for_forbidden_words_it;
	} else if(language != 'it' && containWords(forbidden_words, question)) {
		answer = answer_for_forbidden_words_en;
	} else if(language == 'it') {
		answer = possible_answers_it[possible_answers_index];
		possible_answers_index = (possible_answers_index + 1) % possible_answers_it.length;
	} else {
		answer = possible_answers_en[possible_answers_index];
		possible_answers_index = (possible_answers_index + 1) % possible_answers_en.length;
	}
	
	// Append question to conversation
	questionHtml = '<div class="dialogue user"><div class="initial">' + initial + '</div><p>' + question + '</p><span class="time">'+ getNow() +'</span></div>';
	$(".conversation").append(questionHtml);
	$(".conversation").scrollTop($(".conversation").scrollTop() + $(".conversation").height());
	
	insertAnswer();
}

function getNow() {
	now = new Date();
	hours = now.getHours() < 10 ? "0" + now.getHours() : now.getHours();
	minutes = now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes();
	return hours + ':' + minutes;
}

function insertAnswer() {	
	// Type answer (with 500ms delay)
	setTimeout(function() {
		answerHtml = '<div class="dialogue ai"><?xml version="1.0" encoding="utf-8"?><svg width="60px" height="60px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="6" r="4" stroke="' + getSVGColor() + '" stroke-width="1.5"/><path d="M19 2C19 2 21 3.2 21 6C21 8.8 19 10 19 10" stroke="' + getSVGColor() + '" stroke-width="1.5" stroke-linecap="round"/><path d="M17 4C17 4 18 4.6 18 6C18 7.4 17 8 17 8" stroke="' + getSVGColor() + '" stroke-width="1.5" stroke-linecap="round"/><path d="M13 20.6151C12.0907 20.8619 11.0736 21 10 21C6.13401 21 3 19.2091 3 17C3 14.7909 6.13401 13 10 13C13.866 13 17 14.7909 17 17C17 17.3453 16.9234 17.6804 16.7795 18" stroke="' + getSVGColor() + '" stroke-width="1.5" stroke-linecap="round"/></svg><p></p><span class="time">'+ getNow() +'</span></div>';
		//answerHtml = '<div class="dialogue ai"><img src="https://www.w3schools.com/w3images/bandmember.jpg" alt="Avatar"><p></p><span class="time">'+ getNow() +'</span></div>';
		$(".conversation").append(answerHtml);
		$(".conversation").scrollTop($(".conversation").scrollTop() + $(".conversation").height());
		answerElement = $(".dialogue.ai:last-child p");
		// Initialize animation
		answerElement.siblings("svg").find("path").eq(0).hide();
		answerElement.siblings("svg").find("path").eq(1).hide();
		answer_i = 0;
		typeAnswer(answerElement);
	}, 500);
}

function getSVGColor() {
	return $("body").hasClass("dark") ? "#03A062" : '#1C274C';
}

function containWords(words, input) {
	input = input.toLowerCase();
	for(let i = 0; i < words.length; i++) {
		if (input.includes(words[i])) { return true; }
	}
	return false;
}

function typeAnswer(answerElement) {
	if (answer_i < answer.length) {
		answerElement.html(answerElement.html() + answer.charAt(answer_i));
		
		// Animation for svg ai
		if((answer_i + 3) % 6 == 0) {
			answerElement.siblings("svg").find("path").eq(0).toggle();
		}
		if(answer_i % 6 == 0) {
			answerElement.siblings("svg").find("path").eq(1).toggle();
		}
		
		answer_i++;
		setTimeout(function() {
			typeAnswer(answerElement);
		}, 50);
	} else {
		// Scroll to bottom
		$(".conversation").scrollTop($(".conversation").scrollTop() + $(".conversation").height());
		// Unlock input
		$(".assistenzaTecnica input.question").attr("disabled", false).focus();
		// Stop animation
		answerElement.siblings("svg").find("path").eq(0).hide();
		answerElement.siblings("svg").find("path").eq(1).hide();
	}
}

function closeAssistenzaTecnica() {
	$(".main").show();
	$(".videogames").show();
	$(".assistenzaTecnica").hide();
	assistenza_active = false;
}

function assistenzaTecnica() {
	if (assistenza_active) {
		closeAssistenzaTecnica();
	} else {
		$("nav input[type=search]").val("");
		var question = $(".assistenzaTecnica input.question");
		if(question.attr("disabled")) { return; } // because can create conflict
		$('.conversation').empty();
		name = "";
		initial = "";
		placeholder = language == 'it' ? "Inserisci il tuo nome" : "Insert your name";
		question.attr("placeholder", placeholder);
		$(".main").hide();
		$(".videogames").hide();
		$(".assistenzaTecnica").show();
		// Initial question
		answer = language == 'it' ? "Ciao, come ti chiami?" : "Hello, what's your name?";
		question.attr("disabled", true);
		insertAnswer();
		assistenza_active = true;
	}
}

function darkMode() {
	if($("body").hasClass("dark")) {
		// TODO (maybe): enable alert, and remove rest // alert("Once go black, you never come back");
		localStorage.setItem('max-dark-mode', 0);
		$("body").removeClass("dark");
		$("meta[name='theme-color']").attr("content", "#B678E6");
		$(".conversation .dialogue.ai svg circle").attr("stroke", "#1C274C");
		$(".conversation .dialogue.ai svg path").attr("stroke", "#1C274C");
	} else {
		// if(!confirm("Vuoi passare alla dark mode?")) { return; }
		localStorage.setItem('max-dark-mode', 1);
		$("body").addClass("dark");
		$("meta[name='theme-color']").attr("content", "#000000");
		$(".conversation .dialogue.ai svg circle").attr("stroke", "#03A062");
		$(".conversation .dialogue.ai svg path").attr("stroke", "#03A062");
	}
}

function search(search_val = null) {
	
	// Get search val from input (if not passed from function)
	if(search_val == '' || search_val == null) {
		search_val = $("nav input[type=search]").val().toLowerCase();
	}

	// If value is empty, reset page
	if(search_val == '' || search_val == null) {
		$("h2").show();
		$(".search-label").hide();
		$(".img-404").hide();
		$(".card").parent("div").show();
		swiperElements.forEach(resetSwiperElements);
		return;
	}

	if(assistenza_active) { closeAssistenzaTecnica(); }
	$("h2").hide();
	$(".img-404").hide();

	var finds = 0;
	var single_find = "";
	$(".card").each(function() {
		var card_content = $(this).text().trim().replace(/^\s+|\s+$/gm,'').toLowerCase();
		if(card_content.indexOf(search_val) >= 0) {
			$(this).parent("div").show();
			finds++;
			single_find = $(this).find("h3").html();
			// $(this).parent().parent().siblings("h2").show();
		} else {
			$(this).parent("div").hide();
		}
  	});

  	swiperElements.forEach(resetSwiperElements);

	var search_label = $(".search-label");
	if(finds == 0) {
		search_label.html(language = 'it' ? ' Nessun risultato' : ' No results');
		$(".img-404").show();
	} else if (finds == 1) {
		search_label.html(single_find);
	} else if (finds > 1) {
		search_label.html(finds + (language = 'it' ? ' risultati' : ' finds'));
	}
	search_label.show();
}

function resetSwiperElements(item, index, arr) {
	item.update();
}

function setIta() {
	language = 'it';
	$("html").attr("lang", language);
	$("html [lang=en]").hide();
	$("html [lang=it]").show();
	$("nav input[type=search]").attr("placeholder", "Cerca");
}

function setEng() {
	language = 'en';
	$("html").attr("lang", language);
	$("html [lang=en]").show();
	$("html [lang=it]").hide();
	$("nav input[type=search]").attr("placeholder", "Search");
}

/*function setUrlLang(lang = 'en') {
	const urlParams = new URLSearchParams(window.location.search);
	urlParams.set('lang', lang);
	window.location.search = urlParams;
}*/

$(document).ready(function() {

	// Search by default if provided by url
	const urlParams = new URLSearchParams(window.location.search);
	var search_val = urlParams.get('search');
	if(search_val != '' && search_val != null) {
		search(search_val.toLowerCase());
	}

	/*language = urlParams.get('lang');
	if(language == 'it') {
		setIta();
	}
	else*/ if(window.navigator.userLanguage || window.navigator.language == 'it-IT') { setIta(); /*setUrlLang('it');*/ }
	// else { setEng(); }
	/*$(".assistenzaTecnica input.question").attr("disabled", true);
	insertAnswer();*/
	/* TODO (maybe) if(localStorage.getItem('max-dark-mode') == 1) {
		darkMode();
	}*/
	$("nav input[type=search]").keyup(function() { search(); });

	// Swiper
	const swiper_parameters = {
	 	loop: true,
		pagination: {
			el: ".swiper-pagination",
		},
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		},
		/*autoplay: {
	   		delay: 3000,
	 	},*/
	};
	swiperElements.push(new Swiper(".swiperS13", swiper_parameters));
	swiperElements.push(new Swiper(".swiperAntigravityTrees", swiper_parameters));
	swiperElements.push(new Swiper(".swiperLostAirlines", swiper_parameters));
	swiperElements.push(new Swiper(".swiperZipTime", swiper_parameters));
	swiperElements.push(new Swiper(".swiperMomtitasking", swiper_parameters));
	swiperElements.push(new Swiper(".swiperUfoTransmitter", swiper_parameters));
	swiperElements.push(new Swiper(".swiperTheBottle", swiper_parameters));
	swiperElements.push(new Swiper(".swiperAddiction", swiper_parameters));
	swiperElements.push(new Swiper(".swiperRoyPizzaRush", swiper_parameters));
	swiperElements.push(new Swiper(".swiperGalaxyGuts", swiper_parameters));
});