// ==UserScript==
// @name         BluerSkies
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Replace Twitter handles with links to BlueSky
// @author       tylermakes
// @match        https://twitter.com/*
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_addStyle
// ==/UserScript==

'use strict';

(function() {
    'use strict';

    var twitterHandles = {};
    var twitterHandlesSize = 0;

    function insertSidebar() {
        var sidebarWidth    = "300px";
        $("html").css ( {
            position:   "relative",
            width:      "calc(100% - " + sidebarWidth + ")",
            height: "100%",
        } );

        $("body").append ( '                                                \
<div id="gmRightSideBar">                                       \
<ul>                                                        \
</ul>                                                       \
</div>                                                          \
' );

        GM_addStyle ( "                                                     \
#gmRightSideBar {                                               \
position:               fixed;                              \
top:                    0;                                  \
right:                  0;                                  \
margin:                 1ex;                                \
padding:                1em;                                \
background:             lightblue;                             \
width:                  calc(" + sidebarWidth + " - 2ex);    \
height:                  100%;    \
overflow-y:             scroll; \
}                                                               \
#gmRightSideBar ul {                                            \
margin:                 0ex;                                \
}                                                               \
#gmRightSideBar a {                                             \
color:                  blue;                               \
}                                                               \
" );

    }

    function updatedHandles() {
        console.log("found:");
        console.log(twitterHandles);
        for (const [key, value] of Object.entries(twitterHandles)) {
            if (value == "not_looked_up") {
                if (key.length < 24) {
                    let name = key.replace("@", "");
                    name = name.replace(/_/g, "");
                    $("#gmRightSideBar ul").append(`<li>${key}: <a href="https://bsky.app/search?q=${name}" target="_blank">search</a> __ <a href="https://bsky.app/profile/${name}.bsky.social" target="_blank">profile</a></li>`);
                }
                twitterHandles[key] = "looked_up";
            }
            console.log(twitterHandles);
        }
    }

    function getEveryone() {
        $( "span" ).each(function( index ) {
            if($(this).text().match(/@/, false)) {
                let foundName = $( this ).text();
                if (!twitterHandles[foundName]) {
                    twitterHandles[foundName] = "not_looked_up";
                }
                let name = foundName.replace("@", "");
                name = name.replace(/_/g, "");
                $(this).html(`<li>${name}: <a href="https://bsky.app/profile/${name}.bsky.social" target="_blank">bsky_profile</a></li>`);

            }
            let newSize = Object.keys(twitterHandles).length;
            //console.log(`span count: ${$( "span" ).length}`);
            if (newSize != twitterHandlesSize) {
                console.log(`new count: ${newSize}`);
                twitterHandlesSize = newSize;
                updatedHandles();
            }
        });
    }
    insertSidebar();

    window.addEventListener('load', function() {
        setInterval(getEveryone, 3);
    }, false);
})();