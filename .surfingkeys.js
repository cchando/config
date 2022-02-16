
// file:///home/cameron/.surfingkeys.js


/*
---- WARNING: ----

The SurfingKeys settings interface is just like vimscript, i.e., it exhibits poor design and
makes it extremely easy to make mistakes since the config is not declarative and thus imposes
on the user the burden of keeping track of the order in which values are set.
Also it forces the user to map e.g. p to P rather than explicitly to the named function
that P denotes (since most built-in functions are anonymous).

      All 'removeSearchAlias' calls should happen BEFORE any mappings that reference any
			search alias, e.g.,
			      mapkey('sg', '#8Search with Google', function() {
			      Front.openOmnibar({type: "SearchEngine", extra: "sP"});
			      });

						'removeSearchAlias('s')'; // remove default Stack Overflow search alias

						addSearchAlias('sP', 'startpage', 'https://startpage.com/sp/search/?q=');
			The above code inadvertently removes the 'sP' search alias, as 's' -- a prefix of
			'sP', is removed. Note that this happens even though the 'sP' alias is added after
			the removal of 's'. As long as 's' is removed after some reference to 'sP', the 'sP'
			alias will not be available. Exceptionally strange.

    - Remapping is automatic and not even optional: there is no "noremap" command (yikes).
      E.g., we must set P=p *before* setting p=k if we want P to be the original p.

    - Also, setting e.g. both e=E and E=e will cause a logic loop rather than swapping
	      	them.

	  - Errors can be hard to track since assignment is chained, e.g. p=P,e=p,j=e.
		  So avoid chained assignment. Instead do e.g. p=P,e=P,j=P.

		- Furthermore, if you first map e.g. ';' to '<Ctrl-6>' and then map 'c' to ';j', the 2nd
		      mapping will be null because the default binding ';j' was nullified when its prefix
					';' was remapped. This is the case for any prefix, so you really have to be on your
					toes. Really poor design. Thus, keybindings must be organized by prefix rather than
					by functionality, whenever the two conflict.

		- NOTE: - unmapping e.g. 'm' will also unmap any bindings for 'ma', 'mb', etc. If you want
		  to map e.g. "ma" to "d" and also unmap "m", you must unmap "m" first, since unmapping "m"
			will also unmap any bindings prefixed by "m". This means longer-keystroke bindings must
			always come before shorter ones.

		- To swap two bindings ⍺ and ⍵:
        // save default key `t` to temp key `>_t`
		   	// NOTE: This must not shadow an existing key binding β, or β will be gone and will not
				   // be "revived" after unmapping `>_t`
   	  	map('>_⍵', '⍵'); // temp name
				map('⍵', '⍺');
  		  map('⍺', '>_⍵');
  		  unmap('>_⍵');

		- NOTE: Disabling settings.digitForRepeat will break any keys mapped to e.g. {g0, g$},
			since they're implemented as {99E, 99R}, resp., even if the mapping is done before
			the setting is disabled.


    - NOTE: Unbelievably, since e.g., g0/g$ (navigate to first/last tab, resp.) are implemented
	   	in terms of 99E/99R (navigate to tab left/right, resp.), if you remap E/R, then g0/g$ WILL BE
			IMPLICITLY REMAPPED. E.g., if you `map('E', 'j')`, then g0, inadvertently, will now scroll
			down 99 lines. Horrible of horrible.
			    Strangely, the same does not hold for merely unmapping E/R, i.e., doing so does not affect
					g0/g$. Go figure.
			    Also, unlike with keybindings, which are set sequentially, the settings are automatically
			set before all keybindings, regardless of the line number on which the settings are set.
			Thus, setting `settings.digitForRepeat = false` will break e.g., g0/g$ since they are
			implemented as 99E and 99R.
			   So basically, you can't ever turn off digitForRepeat if you want to ever use the functionality
			of {g0, g$} without reimplementing them in Javascript yourself.


			- NOTE: !!! if we do e.g., `map('⍺', '⍵')`, and '⍵' was already shadowed or unmapped (i.e.,
			  if this is a meaningless mapping), then pressing the ⍺ key sequence will cause a gap where
				the next keypress will "enter a vacuum", i.e., β may open the omnibar, but the sequence '⍺ β'
				will do nothing, even though ⍺ should do nothing, and then the β should still open the omnibar.
				Also, ⍺ will not show up in the help menu/hints, but if it's a sequence, e.g., 'ojjj', it will
				still show up in the corner during the keypresses (unless you do it slowly enough for the hints
				to come up).

		- NOTE: !!! poster-child case study of the terribleness of SurfingKeys config——conflicting
		  conditions among different mappings:
         sequence 1:
     	      map('o', 't'); // !!! 'o' prefixes (and thus shadows) 'on', which we're attempting to use below
		        unmap('t');
            map('tt', 'on'); // !!! 'on' no longer mapped to anything, so neither is 'tt'
            unmap('on');

				OK, so we try sequence 2:
            map('tt', 'on'); // !!! 'tt' is prefixed by (and thus will be shadowed by) 't', so this mapping never takes effect
            unmap('on');
     	      map('o', 't');
           E.g., 't' and 'tt' bindings cannot logically both exist. The prefix always covers (shadows) the
				longer one that's prefixed by it——each time we set try to set 'tt', it won't be accessible if there
				was any existing 't' binding, because that 't' binding will still be in effect afterward, thus
				shadowing 'tt'. The question [of whether 'tt' was mapped before or after 't'] is inconsequential——
				the result in both cases is that the 't' binding alone prevails.

       Thus, in the above case, we must use a temp variable for either 't' or 'o':
			     map('_t', 't'); // temp key
    			 unmap('t'); // make 't_' space available; said space will be preemtively shadowed otherwise
    			 map('tt', 'on');
    			 unmap('on');
    			 map('o', '_t');
    			 unmap('_t');
			 NOTE: This (just above) is why it's always better to use temp keys for everything, e.g., always do
			 `map('o', '_t')` rather than `map('o', 't')`——it's because when you then unmap the key you just
			 mapped to, there is no chance it will unbind your previous bindings. If we unmap 't' after mapping
			 'o' to it (b/c we don't want the extra 't' binding cluttering up the command hints/menu), it will
			 also unmap our 't_' bindings, unless we're careful to unmap 't' only *before* declaring the 't_'
			 mappings. But when unmapping '_t', we don't have to worry about that, since we only use '_⍵' key
			 sequences as temporaries (and it's probably not a prefix to even any temp stuff anyway, since all
			 '_⍵' bindings are at least two characters).


      - NOTE: !!! (debugging algorithm): if there's an issue with e.g.,
			     `map('tw', 'op')`
				then
				1. First try replacing 'tw' with the letters of an already-working binding, thus shadowing that old
				   binding temporarily during this testing phase.
				2. If that doesn't fix it, then do the same with 'op' (i.e., try assigning 'tw' to an already-working
				   functionality). This way you can narrow down which side is being shadowed or unmapped somewhere.
        3. In the worst case, both would be. In that case, try moving the binding to the very top of the file,
					 and doing the above steps again, to account for any shadowing. If still not working, move it to the
					 very bottom.
				4. If still not working, probably one is being shadowed or unmapped prior to the binding in question,
				   and the other is being shadowed or unmapped after the binding in question.
			  5. In the rarest and worst of cases, it's some hidden dependency being violated, such as the default g$
				   binding being implemented as 99R, and thus breaking if either digitForRepeat is disabled (hidden
					 dependency #1), or if R is remapped anywhere (hidden dependency #2).

---- END OF WARNING ----
*/



// Migrate settings from 0.9.74 to 1.0 (change e.g., map to api.map)
const {
		aceVimMap,
		mapkey,
		imap,
		imapkey,
		iunmap,
		vmap,
		getClickableElements,
		vmapkey,
		map,
		unmap,
		cmap,
		addSearchAlias,
		removeSearchAlias,
		tabOpenLink,
		readText,
		Clipboard,
		Front,
		Hints,
		Visual,
		RUNTIME
} = api;


/* scrolling */
map('(', 'h'); // scroll left
unmap('h');

map(')', 'l'); // scroll right
unmap('l');

map('g(', '0'); // scroll all the way left
unmap('0');

map('g)', '$'); // scroll all the way right
unmap('$');

map('J', 'd'); // scroll half-page down
unmap('d');

map('K', 'u'); // scroll half-page up
unmap('u');

map('<Space>', 'j'); // scroll down; prevent large scroll from <Space>



/* navigate tabs */

map('ga', ':feedkeys 99h', 0, "#3Go to the first tab");
// map('ga', 'g0'); // !!! must come BEFORE unmapping 'E', since 'g0' depends on 'E'; ga is now focus leftmost tab
unmap('g0');
map('gl', ':feedkeys 99l', 0, "#3Go to the last tab");
// map('gl', 'g$'); // !!! must come BEFORE unmapping 'R', since 'g$' depends on 'R'; gl is now focus rightmost tab
unmap('g$');
map('h', 'E'); // tab left
unmap('E'); // !!! must come AFTER using g0, since g0 is implemented as 99E
map('l', 'R'); // tab right
unmap('R'); // !!! must come AFTER using g$, since g$ is implemented as 99R



map('O', 'ox'); // open recently-closed url
unmap('ox');

map('w', 'oh'); // open from history
unmap('oh');

// complex dependencies block
map('_t', 't'); // temp key
unmap('t'); // make '⍵_' space available; said space will be preemtively shadowed otherwise
// map('tt', 'on'); // open new tab
mapkey('tt', '#3Open newtab', function() {
    tabOpenLink("file:///home/cameron/.blank");
});

unmap('on');
map('o', '_t'); // !!! must happen BEFORE any mappings using 'o_';  open omnibar  // 't', 'go'
unmap('_t');


map('td', 'W'); // detach tab (new window w/ current tab)
unmap('W');

map('p', '<Alt-p>'); // pin current tab
unmap('<Alt-p');




/* navigate history */
map('H', 'S'); // back
unmap('S');

map('L', 'D'); // forward
unmap('D');



// /* marks */
// map('ma', 'm'); // create mark -- replace with Vimium C's marks



/* closing tabs: */
map('cH', 'gx0'); // close all tabs to left
unmap('gx0');

map('cL', 'gx$'); // close all tabs to right
unmap('gx$');

map('cO', 'gxx'); // close all tabs except current one
unmap('gxx');

map('ch', 'gxt'); // close tab to left
unmap('gxt');

map('cl', 'gxT'); // close tab to right
unmap('gxT');





/* move tab left/right */

map('u', '<<');
unmap('<<');
map('d', '>>');
unmap('>>');
mapkey('U', '#3Move current tab to leftmost', function() {
    RUNTIME('moveTab', {
        step: -99
    });
});
mapkey('D', '#3Move current tab to rightmost', function() {
    RUNTIME('moveTab', {
        step: 99
    });
});

/* open links */
map('F', 'cf'); // open multiple links in new tabs
unmap('cf');

map('C', 'af'); // open link in active new tab
unmap('af');

// map(',', '[['); // prev -- replace w/ Vimium's prevPage/nextPage
// map('<', '[['); // prev -- replace w/ Vimium's prevPage/nextPage
unmap('[[');

// map('.', ']]'); // next -- replace w/ Vimium's prevPage/nextPage
// map('>', ']]'); // next -- replace w/ Vimium's prevPage/nextPage
unmap(']]');






/*
  -----------------------------------------------------------------
	open particular tabs
	-----------------------------------------------------------------
*/

map('g/', ';e'); // open SurfingKeys settings
unmap(';e');

mapkey('gE', '#12Open Chrome extension shortcuts', function() {
    tabOpenLink("chrome://extensions/shortcuts");
});

map('gS', 'gs'); // view page source
mapkey('gs', '#12Open Chrome settings', function() {
    tabOpenLink("chrome://settings");
});

mapkey('<Ctrl-/>', '#12Open Vimium C Settings', function() {
		tabOpenLink("chrome-extension://hfjbmagddngcpeloejdejnfgbamkjaeg/pages/options.html");
});







/* omnibar controls */
cmap('<Ctrl-j>', '<Tab>'); // up
cmap('<Ctrl-k>', '<Shift-Tab>'); // down
// NOTE: use <Ctrl-d> to remove given entry from bookmarks while in omnibar
// NOTE: input '<' to change omnibar mode from "search bookmarks" to "search bookmark folders"




/* visual mode mappings */
vmap('mm', 'zz'); // center the display
vmap('J', '<Ctrl-d>'); // scroll 20 lines down
vmap('K', '<Ctrl-u>'); // scroll 20 lines up
vmap('gl', '$'); // line end
vmap('gh', '^'); // first non-whitespace on line
vmap('ga', '0'); // line beginning


/* map keys for setting escape */
cmap('<Ctrl-m>', '<Esc>');
cmap('<Ctrl-g>', '<Esc>');

cmap('<Ctrl-h>', '<Ctrl-,>');
cmap('<Ctrl-l>', '<Ctrl-.>');
// cmap('<Ctrl-u>', '<Ctrl-,>');
// cmap('<Ctrl-i>', '<Ctrl-.>');
/* ctrl apparently cannot be used for vim visual mode commands -- always exits (not documented!) */
// aceVimMap('fd', '<Esc>', 'insert');
// aceVimMap('fd', '<Esc>', 'visual');
/* ctrl has to be used for vim normal mode (not documented!) */
aceVimMap('<Ctrl-m>', '<Esc>', 'normal');
aceVimMap('<Ctrl-g>', '<Esc>', 'normal');
aceVimMap('<C-h>','<Esc>h','insert');
aceVimMap('<C-j>','<Esc>j','insert');
aceVimMap('<C-k>','<Esc>k','insert');
aceVimMap('<C-l>','<Esc>l','insert');
/* Alt can be used in regular field boxes to exit the input box */
imap('<Alt-h>', '<Esc>');
imap('<Alt-j>', '<Esc>');
imap('<Alt-k>', '<Esc>');
imap('<Alt-l>', '<Esc>');
/* Exiting visual / find mode (also seems to require the binding to include Ctrl, or at least some modifier key) */
map('<Ctrl-]>', '<Esc>');
map('<Ctrl-m>', '<Esc>');
map('<Ctrl-g>', '<Esc>');
// escape keys for vim-map insert mode
/*
	aceVimMap('<C-h>','<Esc>h','insert');
	aceVimMap('<C-j>','<Esc>j','insert');
	aceVimMap('<C-k>','<Esc>k','insert');
	aceVimMap('<C-l>','<Esc>l','insert');
*/


/* ACE-Vim-Map bindings */
// NOTE: these don't allow for temp keys since ['_', '~', etc., aren't automatically shadowed by creating mappings that prefix them], and [all these already have the regular vim mappings], and there is no 'unmap' command. Instead of prefix shadowing, the prefix mappings just don't take effect.
aceVimMap('gl', '$', 'normal'); // line end
aceVimMap('gh', '^', 'normal'); // first non-whitespace on line
aceVimMap('ga', '0', 'normal'); // line beginning
aceVimMap('gi', 'A', 'normal'); // insert at line end






/*
  -----------------------------------------------------------------
  Misc
  -----------------------------------------------------------------
*/
// map('_r', 'r'); // reload page
// unmap('r');
// map('rr', '_r'); // reload page
// map('ra', ':feedkeys 99_r', 0, "#4Reload all pages"); // doesn't work somewhy

// map('<Ctrl-Alt-m>', '<Alt-m>'); // mute current tab  -- use Vimium C's muteTab variants
unmap('<Alt-m>');


// !!! must unmap ':' BEFORE any new bindings prefixed by it
// map('A', ':'); // open Omnibar for commands -- doesn't work somewhy
mapkey('\"', '#8Open commands', function() {
    Front.openOmnibar({type: "Commands"});
});
unmap(':'); // free up ':_' space, which would be preemptively shadowed otherwise; was 'open omnibar for arb. command'
map(':dh', ';dh'); // delete history older than 30 days
unmap(';dh');
map(':db', ';db'); // delete bookmark for current tab
unmap(';db');
map(':di', ';di'); // download image
unmap(';di');


mapkey(':s', '#5Save session', function() {
		RUNTIME('createSession', {
				name: 'LAST',
				quitAfterSaved: false
		});
		Front.showBanner('Session saved');
});

// mapkey(':dH', '#14Delete history newer than 2 hours', function(){
// 		var nor=(newDate).getTime();
// 		chrome.history.deleteRange({startTime: now -2*1e3*3600, endTime: now})
// })


map('P', '<Alt-i>'); // enter PassThrough mode (refined version of Vimium's insert mode)
unmap('<Alt-i>');

map('e', ';fs'); // hints for scroll targets (pressing any key outside the hints resets to the default scroll target)
unmap(';fs');

map('E', 'cs'); // change scroll target
unmap('cs');

map('ZL', 'ZR'); // open last browser session
unmap('ZR'); // 'R' is being used by Vimium C for 'reload hard', and thus shadows the 'R' keypress in 'ZR'

map('cd', ';j'); // close Downloads bar
unmap(';j');

map('tj', ';gt'); // "tab join": [join into current window] filtered tabs from another window, filtered from Omnibar
unmap(';gt');

map('<Alt-p>', ';s'); // toggle pdf viewer
unmap(';s');

map('gH', 'g#'); // open current url without the hash fragment  // shadows default "go to history" binding
// unmap('g#');

map('gq', 'g?'); // open current url without the hash fragment  // shadows default "go to history" binding
// unmap('g?');

map(':u', ';U'); // edit current url w/ vim editor and reload
unmap(';U');
map(':U', ';u'); // edit current url w/ vim editor and open in new tab
unmap(';u');

map('B', 'ab'); // add bookmark
unmap('ab'); // add bookmark

map('yA', 'yma'); // copy urls from multiple links
unmap('yma');

// map(':l', ';ql'); // show last command

// !!! must put this AFTER all mappings based on ';'-prefixed default bindings
map(';', '<Ctrl-6>'); // tab back-and-forth (must map AFTER any "map('⍵', ';_')")
// map('<Ctrl-;>', '<Ctrl-6>'); // toggle prev tab (must map AFTER any "map('⍵', ';_')")
unmap('<Ctrl-6>');






/*
  -----------------------------------------------------------------
	unmap unused bindings
	-----------------------------------------------------------------
*/
unmap('_'); // unmap all temp bindings, which are prefixed with '_'
unmap('.'); // repeat last command
unmap(','); // prefix key
// unmap(';'); // was prefix key, now tab-back-and-forth
unmap('gx'); // prefix key
// replace '<' and '>' w/ Vimium's goPrevious / goNext
unmap('<');
unmap('>');
iunmap(':'); // disable emoji suggestions
unmap('m'); // replaced by Vimium C's marks since the popup looks better and we can use '' with it
unmap("'"); // replaced by Vimium C's marks since it can use '' to toggle prev mark
unmap(';m'); // mouse-out last element (?)
unmap('go'); // replaced by 'o'
unmap('cs'); // change scroll target (use 'e' for scroll hints instead)
unmap('og');
unmap('@'); // Vimium_C toggleMuteTab all
unmap('$'); // Vimium_C toggleMuteTab other
unmap('om'); // open url from marks
unmap('gf'); // redundant since <Shift> after 'f' does the same thing
// unmap('C'); // same as 'gf' above
unmap('M'); // not sure if mapped; Vimium_C toggleMuteTab all
unmap('<Ctrl-d>');
unmap('<Ctrl-u>');
unmap('<Shift-Tab>');
unmap('<Tab>');
unmap('cc'); // open selected link, or link from clipboard
// unmap('ya'); // copy a link url to the clipboard







/*
  Remove default search aliases
  WARNING: !!! Broadly speaking, all 'removeSearchAlias' calls must happen BEFORE any 'mapkey' calls
           that reference a search alias. See the top warning block for details.
*/
removeSearchAlias('g'); // google
removeSearchAlias('d'); // duck-duck-go
removeSearchAlias('b'); // baidu
removeSearchAlias('e'); // wikipedia
removeSearchAlias('w'); // bing
removeSearchAlias('s'); // stack overflow
removeSearchAlias('h'); // github
removeSearchAlias('y'); // youtube



/*
	----------------------------------------------------------------------
	----------------------------------------------------------------------
	Search alias definitions:
	----------------------------------------------------------------------
	----------------------------------------------------------------------

	Include "_" suffix in each search alias name to prevent e.g., inadvertently doing a
	NixPkgs search when doing "T nix pills" to search through our open tabs for a tab that
	includes "nix pills" in the page name. Otherwise said key sequence would bring up
	"nixpkgs➤ pills" in the omnibar. If we name the search alias "nIX" instead of "nix", then
	we'd have to do "T nix_ pills" to get the same accidental result, so we can now safely type
	"T nix pills". Or you can just make them one or two letters, in which case it shouldn't be a problem,
  and which has the added benefit of being easy to type as a suffix for a visual-mode search (e.g.,
  "sg" to search the with Google for the text that's selected in visual mode) -- useful for copying
  something that's unwieldy to type, e.g., `source ~/.nix-profile/etc/profile.d/nix.sh`.
*/
addSearchAlias('N', 'nix revision', 'https://lazamar.co.uk/nix-versions/?channel=nixos-unstable&package=');
addSearchAlias('n', 'nixpkgs', 'https://search.nixos.org/packages?from=0&size=60&sort=relevance&channel=unstable&query=');
addSearchAlias('m', 'melpa', 'https://melpa.org/#/?q=');
addSearchAlias('r', 'racket docs', 'https://docs.racket-lang.org/search/index.html?q=');
addSearchAlias('t', 'typed-racket docs', 'https://docs.racket-lang.org/search/index.html?q=L%3Atyped%2Fracket%20');
addSearchAlias('h', 'hoogle', 'https://hoogle.haskell.org/?hoogle=');
addSearchAlias('p', 'pursuit', 'https://pursuit.purescript.org/search?q=');
addSearchAlias('o', 'stack overflow', 'http://stackoverflow.com/search?q=');
addSearchAlias('e', 'stack exchange', 'http://stackexchange.com/search?q=');
addSearchAlias('a', 'arch-linux wiki', 'https://wiki.archlinux.org/index.php?search=');
addSearchAlias('A', 'amazon', 'https://www.amazon.com/s/?field-keywords=');
addSearchAlias('y', 'youtube', 'https://www.youtube.com/results?search_query=');
addSearchAlias('w', 'wikipedia', 'https://en.wikipedia.org/wiki/');
addSearchAlias('u', 'github', 'https://github.com/search?q=');
addSearchAlias('M', 'google maps', 'https://www.google.com/maps?q=');
addSearchAlias('g', 'google', 'https://www.google.com/search?q=');
addSearchAlias('G', 'google (site only)', 'https://www.google.com/search?q=site%3A'+window.location.href.split('/')[2]+'%20');
// addSearchAlias('G', 'google', 'https://www.google.com/search?q=site%3A' + window.location.href.replace(/\?)+'%20'); // search pages only from current site --> replace everything after hostname, e.g., after '*.com' or '*.net'
// window.location.href = window.location.href.replace(/\?[^\?]*$/, ''); --> 'g?' for reference

/*
	----------------------------------------------------------------------
	----------------------------------------------------------------------
	Search alias keybindings:
	----------------------------------------------------------------------
	----------------------------------------------------------------------
*/
/*
	We want our search mappings to prefix our search aliases (e.g., the 'w' in 'sw' prefixes the "wi_"
	alias used by the 'sw' command) in order to shadow the "search selected (i.e., clipboard text)
	with search alias 'wi_'" that would otherwise be *implicitly* created upon defining said search alias.
*/

mapkey('sw', '#8Search Wikipedia', function() {
   Front.openOmnibar({type: "SearchEngine", extra: "w"});
});
mapkey('sa', '#8Search Arch-Linux Wiki', function() {
		Front.openOmnibar({type: "SearchEngine", extra: "a"});
});
mapkey('sg', '#8Search with Google', function() {
   Front.openOmnibar({type: "SearchEngine", extra: "g"});
});
mapkey('sG', '#8Search with Google on current site only', function() {
		Front.openOmnibar({type: "SearchEngine", extra: "G"});
});
mapkey('sy', '#8Search Youtube', function() {
   Front.openOmnibar({type: "SearchEngine", extra: "y"});
});
mapkey('sA', '#8Search Amazon', function() {
   Front.openOmnibar({type: "SearchEngine", extra: "A"});
});
mapkey('sm', '#8Search MELPA', function() {
   Front.openOmnibar({type: "SearchEngine", extra: "m"});
});
mapkey('sM', '#8Search with Google Maps', function() {
		Front.openOmnibar({type: "SearchEngine", extra: "M"});
});
mapkey('sh', '#8Search Hoogle', function() {
   Front.openOmnibar({type: "SearchEngine", extra: "h"});
});
mapkey('sp', '#8Search Pursuit', function() {
   Front.openOmnibar({type: "SearchEngine", extra: "p"});
});
mapkey('so', '#8Search Stack Overflow', function() {
  Front.openOmnibar({type: "SearchEngine", extra: "o"});
});
mapkey('se', '#8Search Stack Exchange', function() {
		Front.openOmnibar({type: "SearchEngine", extra: "e"});
});
mapkey('sn', '#8Search Nixpkgs', function() {
   Front.openOmnibar({type: "SearchEngine", extra: "n"});
});
mapkey('sN', '#8Find Nix revision for given package', function() {
		Front.openOmnibar({type: "SearchEngine", extra: "N"});
});
mapkey('st', '#8Search Typed-Racket Docs', function() {
   Front.openOmnibar({type: "SearchEngine", extra: "t"});
});
mapkey('sr', '#8Search Racket Docs', function() {
   Front.openOmnibar({type: "SearchEngine", extra: "r"});
});
mapkey('su', '#8Search GitHub', function() {
  Front.openOmnibar({type: "SearchEngine", extra: "u"});
});





/*
	----------------------------------------------------------------------
	----------------------------------------------------------------------
	Settings:
	----------------------------------------------------------------------
	----------------------------------------------------------------------
*/

settings.scrollStepSize = 200;
settings.hintAlign = "left";
settings.focusAfterClosed = "last";
settings.prevLinkRegex = '/(([Bb]ack|[Oo]lder|<|‹|←|«|≪|<<|[Pp]rev(ious)?)+)/i';
settings.nextLinkRegex = '/(([Mm]ore|[Nn]ewer|>|›|→|»|≫|>>|[Nn]ext)+)/i'; // TODO: adjust to account for "* ->", "* |>", etc.
settings.digitForRepeat	= true; // can never set to false if using e.g., ⍺ ← navigateToLeftmostTab, since ⍺ is implemented as 99[navigateToTabLeft] under-the-hood
settings.hintShiftNonActive	= true;
settings.hintExplicit = true;
settings.omnibarMaxResults = 10;
settings.omnibarPosition = "middle";
settings.focusFirstCandidate = true; // for omnibar
settings.focusOnSaved = false; // do not focus the text input after quitting from vim editor
settings.tabsThreshold = 0; // threshold at/above which to show tabs in omnibar instead of in overlay
settings.interceptedErrors = ["*"]; // allow SurfingKeys on all error pages
Hints.numericHints = false; // type text to filter hints

// Vimium C bindings: (M, mute all tabs) (ma, create mark) (R, reload hard)
Hints.characters = "sdfghjkletncvbw"; // default value "asdfgqwertzxcvb"
Hints.scrollKeys = "0G$"; // for scrolling in hints mode


// Vimium-style link hints
Hints.style(
  `
  display: block;
  top: -1px;
  left: -1px;
  white-space: nowrap;
  overflow: hidden;
  font-family: Helvetica, Arial, sans-serif;
  font-style: normal;
  font-variant: normal;
  font-weight: bold;
  font-size: 12px;
  padding: 1px 3px 0px 3px;
  background: linear-gradient(to bottom, #FFF785 0%,#FFC542 100%);
  border: solid 1px #C38A22;
  border-radius: 3px;
  box-shadow: 0px 3px 7px 0px rgba(0, 0, 0, 0.3);
	`
);


// set theme
settings.theme = `
.sk_theme {
    font-family: Input Sans Condensed, Charcoal, sans-serif;
		font-size: 11pt;
    background: #24272e;
    color: #abb2bf;
}
.sk_theme tbody {
    color: #fff;
}
.sk_theme input {
    color: #d0d0d0;
}
.sk_theme .url {
    color: #61afef;
}
.sk_theme .annotation {
    color: #56b6c2;
}
.sk_theme .omnibar_highlight {
    color: #528bff;
}
.sk_theme .omnibar_timestamp {
    color: #e5c07b;
}
.sk_theme .omnibar_visitcount {
    color: #98c379;
}
.sk_theme #sk_omnibarSearchResult ul li:nth-child(odd) {
    background: #303030;
}
.sk_theme #sk_omnibarSearchResult ul li.focused {
    background: #3e4452;
}
#sk_status, #sk_find {
    font-size: 11pt;
}
`;
