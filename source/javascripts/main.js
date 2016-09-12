/* text area resizer: http://plugins.jquery.com/project/TextAreaResizer */
(function($){var textarea,staticOffset;var iLastMousePos=0;var iMin=32;var grip;$.fn.TextAreaResizer=function(){return this.each(function(){textarea=$(this).addClass('processed'),staticOffset=null;$(this).wrap('<div class="resizable-textarea"><span></span></div>').parent().append($('<div class="grippie"></div>').bind("mousedown",{el:this},startDrag));var grippie=$('div.grippie',$(this).parent())[0];grippie.style.marginRight=(grippie.offsetWidth-$(this)[0].offsetWidth)+'px'})};function startDrag(e){textarea=$(e.data.el);textarea.blur();iLastMousePos=mousePosition(e).y;staticOffset=textarea.height()-iLastMousePos;textarea.css('opacity',0.25);$(document).mousemove(performDrag).mouseup(endDrag);return false}function performDrag(e){var iThisMousePos=mousePosition(e).y;var iMousePos=staticOffset+iThisMousePos;if(iLastMousePos>=(iThisMousePos)){iMousePos-=5}iLastMousePos=iThisMousePos;iMousePos=Math.max(iMin,iMousePos);textarea.height(iMousePos+'px');if(iMousePos<iMin){endDrag(e)}return false}function endDrag(e){$(document).unbind('mousemove',performDrag).unbind('mouseup',endDrag);textarea.css('opacity',1);textarea.focus();textarea=null;staticOffset=null;iLastMousePos=0}function mousePosition(e){return{x:e.clientX+document.documentElement.scrollLeft,y:e.clientY+document.documentElement.scrollTop}}})(jQuery);

$(document).ready(function() {
	// layout.init();
	contactForm.init();
});

// Layout
var layout = {
	init: function() {
		layout.header = $('#header');
		layout.body = $('#page');
		layout.footer = $('#footer');
		
		layout.height = $(window).height();
				
		layout.apply();
	},
	apply: function() {
		bodyHeight = layout.height - layout.header.height() - layout.footer.height();
		
		layout.body.height( bodyHeight );
	}
}

/* validation part */
var contactForm = {
	init: function() {
		var form = $("form#jambo");
		$(form).attr({autocomplete: "off"});

		$('textarea:not(.processed)').TextAreaResizer();
		
		$( '.field.text input, .field.textarea textarea', form).focus( function() {
			$(this).parents( '.field' ).addClass( 'active' );
		} ).blur( function()
		{
			$(this).parents( '.field' ).removeClass( 'active' );
		});
		
	}
};