// Global benötigte Variablen
var serverUrl = "http://localhost:8080/";
var rulesArray = [];

/* Funktionen zum Anzeigen und ändern der Regeln */
function switchFulfilledState(flag, ruleId) {
    var rule = $.grep(rulesArray, function(e) {
	return e.id == ruleId;
    })[0];
    
    rule.fulfilled = flag;
    $.ajax({
	headers : {
	    'Accept' : 'application/json',
	    'Content-Type' : 'application/json'
	},
	'type' : 'POST',
	'url' : serverUrl + 'rules',
	'data' : JSON.stringify(rule),
	'dataType' : 'json',
	'success' : function(data) {
	    var classAttribute
	    data.fulfilled ? classAttribute = 'success' : classAttribute = 'danger';
	    $("#" + ruleId).hide().html(getRuleRowContentAsString(data)).attr('class', classAttribute).fadeIn('fast');

	    $.ajax({
		url : serverUrl + "rules/todoCount"
	    }).then(function(data) {
		$('#todoCount').html(data);
	    });
	}
    });
};

function getRuleRowString(rule) {
    return '<tr id="' + rule.id + '" style="display: table-row;">' + getRuleRowContentAsString(rule) + '</tr>';
};

function getRuleRowContentAsString(rule) {
    var date = new Date(rule.date);
    var rowString = '<td>' + rule.id + '</td>' + '<td>' + rule.name + '</td>' + '<td>' + rule.description + '</td>' + '<td>'
	    + ((date == 0) ? '0.0.0000' : date.toLocaleDateString()) + '</td>' + '<td><i class="'
	    + ((rule.fulfilled) ? 'glyphicon glyphicon-ok' : 'glyphicon glyphicon-remove') + '"></i></a></td>' + '<td><div class="btn-group">'
	    + '<a id="btn-edit" class="btn btn-primary"><i class="icon_plus_alt2"></i></a>' + '<a id="btnSolveRule" class="btn btn-success"><i class="icon_check_alt2"></i></a>'
	    + '<a class="btn btn-danger"><i class="icon_close_alt2"></i></a>' + '</div></td>';
    return rowString;
};

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
	var pair = vars[i].split("=");
	if (pair[0] == variable) {
	    return pair[1];
	}
    }
    return (false);
}

$(document).ready(function() {

    $('#menu').load('menu.html', function() {
	$('#SearchField').keypress(function(e) {
	    if (e.which == 13) {
		$('#Search').submit();
		return false;
	    }
	});

	$('#Search').submit(function(event) {
	    url = "/list_rules.html?name=" + $('#SearchField').val();
	    window.location.href = url;
	    event.preventDefault();
	});

	// sidebar dropdown menu
	jQuery('#sidebar .sub-menu > a').click(function() {
	    var last = jQuery('.sub-menu.open', jQuery('#sidebar'));
	    jQuery('.menu-arrow').removeClass('arrow_carrot-right');
	    jQuery('.sub', last).slideUp(200);
	    var sub = jQuery(this).next();
	    if (sub.is(":visible")) {
		jQuery('.menu-arrow').addClass('arrow_carrot-right');
		sub.slideUp(200);
	    } else {
		jQuery('.menu-arrow').addClass('arrow_carrot-down');
		sub.slideDown(200);
	    }
	    var o = (jQuery(this).offset());
	    diff = 200 - o.top;
	    if (diff > 0)
		jQuery("#sidebar").scrollTo("-=" + Math.abs(diff), 500);
	    else
		jQuery("#sidebar").scrollTo("+=" + Math.abs(diff), 500);
	});

	// sidebar menu toggle
	jQuery(function() {
	    function responsiveView() {
		var wSize = jQuery(window).width();
		if (wSize <= 768) {
		    jQuery('#container').addClass('sidebar-close');
		    jQuery('#sidebar > ul').hide();
		}

		if (wSize > 768) {
		    jQuery('#container').removeClass('sidebar-close');
		    jQuery('#sidebar > ul').show();
		}
	    }
	    jQuery(window).on('load', responsiveView);
	    jQuery(window).on('resize', responsiveView);
	});

	jQuery('.toggle-nav').click(function() {
	    if (jQuery('#sidebar > ul').is(":visible") === true) {
		jQuery('#main-content').css({
		    'margin-left' : '0px'
		});
		jQuery('#sidebar').css({
		    'margin-left' : '-180px'
		});
		jQuery('#sidebar > ul').hide();
		jQuery("#container").addClass("sidebar-closed");
	    } else {
		jQuery('#main-content').css({
		    'margin-left' : '180px'
		});
		jQuery('#sidebar > ul').show();
		jQuery('#sidebar').css({
		    'margin-left' : '0'
		});
		jQuery("#container").removeClass("sidebar-closed");
	    }
	});
	
	/* Q-Politik in den Header wenn gefüllt*/
	$.ajax({
	    url : serverUrl + "rules/get?id=" + "1"
	}).then(function(data) {
	    if (data.fulfilled) {
		$('#QPolitik').append(" - " + data.category.politik);
	    }
	});
	
    });
});