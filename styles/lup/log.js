/*==============================================================================

    Routines written by John Gardner - 2003 - 2005

    See www.braemoor.co.uk/software for information about more freeware
    available.

================================================================================

Routine to write a session cookie

    Parameters:
        cookieName        Cookie name
        cookieValue       Cookie Value
    
    Return value:
        true              Session cookie written successfullly
        false             Failed - persistent cookies are not enabled

   e.g. if (writeSessionCookie("pans","drizzle") then
           alert ("Session cookie written");
        else
           alert ("Sorry - Session cookies not enabled");
*/

function writeSessionCookie (cookieName, cookieValue) {
  if (testSessionCookie()) {
    document.cookie = escape(cookieName) + "=" + escape(cookieValue) + "; path=/";
    return true;
  }
  else return false;
}

/*==============================================================================

Routine to get the current value of a cookie

    Parameters:
        cookieName        Cookie name
    
    Return value:
        false             Failed - no such cookie
        value             Value of the retrieved cookie

   e.g. if (!getCookieValue("pans") then  {
           cookieValue = getCoookieValue ("pans2);
        }
*/

function getCookieValue (cookieName) {
  var exp = new RegExp (escape(cookieName) + "=([^;]+)");
  if (exp.test (document.cookie + ";")) {
    exp.exec (document.cookie + ";");
    return unescape(RegExp.$1);
  }
  else return false;
}

/*==============================================================================

Routine to see if session cookies are enabled

    Parameters:
        None
    
    Return value:
        true              Session cookies are enabled
        false             Session cookies are not enabled

   e.g. if (testSessionCookie())
           alert ("Session coookies are enabled");
        else
           alert ("Session coookies are not enabled");
*/

function testSessionCookie () {
  document.cookie ="testSessionCookie=Enabled";
  if (getCookieValue ("testSessionCookie")=="Enabled")
    return true 
  else
    return false;
}

/*==============================================================================

Routine to see of persistent cookies are allowed:

    Parameters:
        None
    
    Return value:
        true              Session cookies are enabled
        false             Session cookies are not enabled

   e.g. if (testPersistentCookie()) then
           alert ("Persistent coookies are enabled");
        else
           alert ("Persistent coookies are not enabled");
*/

function testPersistentCookie () {
  writePersistentCookie ("testPersistentCookie", "Enabled", "minutes", 1);
  if (getCookieValue ("testPersistentCookie")=="Enabled")
    return true  
  else 
    return false;
}

/*==============================================================================

Routine to write a persistent cookie

    Parameters:
        CookieName        Cookie name
        CookieValue       Cookie Value
        periodType        "years","months","days","hours", "minutes"
        offset            Number of units specified in periodType
    
    Return value:
        true              Persistent cookie written successfullly
        false             Failed - persistent cookies are not enabled
    
    e.g. writePersistentCookie ("Session", id, "years", 1);
*/       

function writePersistentCookie (CookieName, CookieValue, periodType, offset) {

  var expireDate = new Date ();
  offset = offset / 1;
  
  var myPeriodType = periodType;
  switch (myPeriodType.toLowerCase()) {
    case "years": 
     var year = expireDate.getYear();     
     // Note some browsers give only the years since 1900, and some since 0.
     if (year < 1000) year = year + 1900;     
     expireDate.setYear(year + offset);
     break;
    case "months":
      expireDate.setMonth(expireDate.getMonth() + offset);
      break;
    case "days":
      expireDate.setDate(expireDate.getDate() + offset);
      break;
    case "hours":
      expireDate.setHours(expireDate.getHours() + offset);
      break;
    case "minutes":
      expireDate.setMinutes(expireDate.getMinutes() + offset);
      break;
    default:
      alert ("Invalid periodType parameter for writePersistentCookie()");
      break;
  } 
  
  document.cookie = escape(CookieName ) + "=" + escape(CookieValue) + "; expires=" + expireDate.toGMTString() + "; path=/";
}  

/*==============================================================================

Routine to delete a persistent cookie

    Parameters:
        CookieName        Cookie name
    
    Return value:
        true              Persistent cookie marked for deletion
    
    e.g. deleteCookie ("Session");
*/    

function deleteCookie (cookieName) {

  if (getCookieValue (cookieName)) writePersistentCookie (cookieName,"Pending delete","years", -1);  
  return true;     
}


/* Logging */

document.write('<img id="trackingimg" src="" border="0" height="0" width="0" style="visibility:hidden;">');

var cssformclass = "tsaid_formlink";
function fixFormLinks()
{
	var myLinks = document.links;
	for(var i=0;i < myLinks.length;i++)
	{
		var cssclass = myLinks[i].className;
		if (cssclass == cssformclass)
		{
			var button = myLinks[i];
			button.onclick = registerClick;
		}
	}
}

function registerClick()
{
	var id = this.id;
	var title = this.title;
	var data = {
				"singleViewObjectId01" : id.replace(/\D+/, ""),
				"singleViewClass01" : "Form",
				"singleViewObjectTitle01" : title
				};
	sendLog(data);
}

function sendLog()
{
	var logdatastring = decode64(logdataenc);
	//var logdatastring = atob(logdataenc);
	var logdata = eval('(' + logdatastring + ')');
	var data = new Array();
	for (attr in logdata) 
		data[attr] = logdata[attr];
	
	data["userAgent"] = navigator.userAgent;
	
	if (trackingurl == "")
		return;
	var sessionid = getCookieValue("tsaid");
	if (sessionid == "")
	{
		sessionid = randomString()
		writeSessionCookie("tsaid",sessionid);
	}

	var img = document.getElementById("trackingimg");
	var url = trackingurl + "?sessionid=" + sessionid + "&" + makeQS(data);
	img.src = url;
	
}

function makeQS(arr)
{
    var s = "";
    for ( var e in arr )
    {
       s += "&" + e + "=" + escape( arr[e] );
    }
    return s.substring(1);
}

function randomString() 
{
	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
	var string_length = 20;
	var randomstring = '';
	for (var i=0; i<string_length; i++) {
		var rnum = Math.floor(Math.random() * chars.length);
		randomstring += chars.substring(rnum,rnum+1);
	}
	return randomstring;
}


var keyStr = "ABCDEFGHIJKLMNOP" +
             "QRSTUVWXYZabcdef" +
             "ghijklmnopqrstuv" +
             "wxyz0123456789+/" +
             "=";

function encode64(input) {
   input = escape(input);
   var output = "";
   var chr1, chr2, chr3 = "";
   var enc1, enc2, enc3, enc4 = "";
   var i = 0;

   do {
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);

      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;

      if (isNaN(chr2)) {
         enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
         enc4 = 64;
      }

      output = output +
         keyStr.charAt(enc1) +
         keyStr.charAt(enc2) +
         keyStr.charAt(enc3) +
         keyStr.charAt(enc4);
      chr1 = chr2 = chr3 = "";
      enc1 = enc2 = enc3 = enc4 = "";
   } while (i < input.length);

   return output;
}

function decode64(input) {
   var output = "";
   var chr1, chr2, chr3 = "";
   var enc1, enc2, enc3, enc4 = "";
   var i = 0;

   // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
   var base64test = /[^A-Za-z0-9\+\/\=]/g;
   if (base64test.exec(input)) {
      alert("There were invalid base64 characters in the input text.\n" +
            "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
            "Expect errors in decoding.");
   }
   input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

   do {
      enc1 = keyStr.indexOf(input.charAt(i++));
      enc2 = keyStr.indexOf(input.charAt(i++));
      enc3 = keyStr.indexOf(input.charAt(i++));
      enc4 = keyStr.indexOf(input.charAt(i++));

      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;

      output = output + String.fromCharCode(chr1);

      if (enc3 != 64) {
         output = output + String.fromCharCode(chr2);
      }
      if (enc4 != 64) {
         output = output + String.fromCharCode(chr3);
      }

      chr1 = chr2 = chr3 = "";
      enc1 = enc2 = enc3 = enc4 = "";

   } while (i < input.length);

   return unescape(output);
}


//initialization hook up
//DOM2
if ( typeof window.addEventListener != "undefined" )
	window.addEventListener( "load", fixFormLinks, false );

//IE 
else if ( typeof window.attachEvent != "undefined" ) {
	window.attachEvent( "onload", fixFormLinks );
}

else {
	if ( window.onload != null ) {
		var oldOnload = window.onload;
		window.onload = function ( e ) {
			oldOnload( e );
			fixFormLinks();
		};
	}
	else 
		window.onload = fixFormLinks;
}

