
var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : 'dqm50vnc',
  database : 'Jogo'
});

app.listen(80);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

// CHANCE.JS LIB
!function(){function a(a,b){if(a||(a={}),!b)return a;for(var c in b)"undefined"==typeof a[c]&&(a[c]=b[c]);return a}function b(a,b){if(a)throw new RangeError(b)}var c=9007199254740992,d=-c,e="0123456789",f="abcdefghijklmnopqrstuvwxyz",g=f.toUpperCase(),h=e+"abcdef",i=function(a){void 0!==a&&("function"==typeof a?this.random=a:this.seed=a),"undefined"==typeof this.random&&(this.mt=this.mersenne_twister(a),this.random=function(){return this.mt.random(this.seed)})};i.prototype.bool=function(c){return c=a(c,{likelihood:50}),b(c.likelihood<0||c.likelihood>100,"Chance: Likelihood accepts values from 0 to 100."),100*this.random()<c.likelihood},i.prototype.natural=function(d){return d=a(d,{min:0,max:c}),b(d.min>d.max,"Chance: Min cannot be greater than Max."),Math.floor(this.random()*(d.max-d.min+1)+d.min)},i.prototype.integer=function(b){var e,f;b=a(b,{min:d,max:c}),f=Math.max(Math.abs(b.min),Math.abs(b.max));do e=this.natural({max:f}),e=this.bool()?e:-1*e;while(e<b.min||e>b.max);return e},i.prototype.normal=function(b){b=a(b,{mean:0,dev:1});var c,d,e,f,g=b.mean,h=b.dev;do d=2*this.random()-1,e=2*this.random()-1,c=d*d+e*e;while(c>=1);return f=d*Math.sqrt(-2*Math.log(c)/c),h*f+g},i.prototype.floating=function(d){var e;d=a(d,{fixed:4});var f=Math.pow(10,d.fixed);b(d.fixed&&d.precision,"Chance: Cannot specify both fixed and precision.");var g=c/f,h=-g;b(d.min&&d.fixed&&d.min<h,"Chance: Min specified is out of range with fixed. Min should be, at least, "+h),b(d.max&&d.fixed&&d.max>g,"Chance: Max specified is out of range with fixed. Max should be, at most, "+g),d=a(d,{min:h,max:g}),e=this.integer({min:d.min*f,max:d.max*f});var i=(e/f).toFixed(d.fixed);return parseFloat(i)},i.prototype.character=function(c){c=a(c);var d,h,i="!@#$%^&*()[]";return b(c.alpha&&c.symbols,"Chance: Cannot specify both alpha and symbols."),d="lower"===c.casing?f:"upper"===c.casing?g:f+g,h=c.pool?c.pool:c.alpha?d:c.symbols?i:d+e+i,h.charAt(this.natural({max:h.length-1}))},i.prototype.string=function(b){b=a(b);for(var c=b.length||this.natural({min:5,max:20}),d="",e=b.pool,f=0;c>f;f++)d+=this.character({pool:e});return d},i.prototype.capitalize=function(a){return a.charAt(0).toUpperCase()+a.substr(1)},i.prototype.pick=function(a,b){return b&&1!==b?this.shuffle(a).slice(0,b):a[this.natural({max:a.length-1})]},i.prototype.shuffle=function(a){for(var b=a.slice(0),c=[],d=0,e=Number(b.length),f=0;e>f;f++)d=this.natural({max:b.length-1}),c[f]=b[d],b.splice(d,1);return c},i.prototype.paragraph=function(b){b=a(b);for(var c=b.sentences||this.natural({min:3,max:7}),d=[],e=0;c>e;e++)d.push(this.sentence());return d.join(" ")},i.prototype.sentence=function(b){b=a(b);for(var c,d=b.words||this.natural({min:12,max:18}),e=[],f=0;d>f;f++)e.push(this.word());return c=e.join(" "),c=this.capitalize(c)+"."},i.prototype.syllable=function(b){b=a(b);for(var c,d=b.length||this.natural({min:2,max:3}),e="bcdfghjklmnprstvwz",f="aeiou",g=e+f,h="",i=0;d>i;i++)c=0===i?this.character({pool:g}):-1===e.indexOf(c)?this.character({pool:e}):this.character({pool:f}),h+=c;return h},i.prototype.word=function(c){c=a(c),b(c.syllables&&c.length,"Chance: Cannot specify both syllables AND length.");var d=c.syllables||this.natural({min:1,max:3}),e="";if(c.length){do e+=this.syllable();while(e.length<c.length);e=e.substring(0,c.length)}else for(var f=0;d>f;f++)e+=this.syllable();return e},i.prototype.first=function(){return this.capitalize(this.word())},i.prototype.last=function(){return this.capitalize(this.word())},i.prototype.name=function(b){b=a(b);var c,d=this.first(),e=this.last();return c=b.middle?d+" "+this.capitalize(this.word())+" "+e:b.middle_initial?d+" "+this.character({alpha:!0,casing:"upper"})+". "+e:d+" "+e,b.prefix&&(c=this.prefix()+" "+c),c},i.prototype.name_prefixes=function(){return[{name:"Doctor",abbreviation:"Dr."},{name:"Miss",abbreviation:"Miss"},{name:"Misses",abbreviation:"Mrs."},{name:"Mister",abbreviation:"Mr."}]},i.prototype.prefix=function(a){return this.name_prefix(a)},i.prototype.name_prefix=function(b){return b=a(b),b.full?this.pick(this.name_prefixes()).name:this.pick(this.name_prefixes()).abbreviation},i.prototype.color=function(b){function c(a,b){return[a,a,a].join(b||"")}b=a(b,{format:this.pick(["hex","shorthex","rgb"]),grayscale:!1});var d=b.grayscale;if("hex"===b.format)return"#"+(d?c(this.hash({length:2})):this.hash({length:6}));if("shorthex"===b.format)return"#"+(d?c(this.hash({length:1})):this.hash({length:3}));if("rgb"===b.format)return d?"rgb("+c(this.natural({max:255}),",")+")":"rgb("+this.natural({max:255})+","+this.natural({max:255})+","+this.natural({max:255})+")";throw new Error('Invalid format provided. Please provide one of "hex", "shorthex", or "rgb"')},i.prototype.domain=function(b){return b=a(b),this.word()+"."+(b.tld||this.tld())},i.prototype.email=function(b){return b=a(b),this.word()+"@"+(b.domain||this.domain())},i.prototype.fbid=function(){return"10000"+this.natural({max:1e11}).toString()},i.prototype.ip=function(){return this.natural({max:255})+"."+this.natural({max:255})+"."+this.natural({max:255})+"."+this.natural({max:255})},i.prototype.ipv6=function(){for(var a="",b=0;8>b;b++)a+=this.hash({length:4})+":";return a.substr(0,a.length-1)},i.prototype.tlds=function(){return["com","org","edu","gov","co.uk","net","io"]},i.prototype.tld=function(){return this.pick(this.tlds())},i.prototype.twitter=function(){return"@"+this.word()},i.prototype.address=function(b){return b=a(b),this.natural({min:5,max:2e3})+" "+this.street(b)},i.prototype.areacode=function(b){b=a(b,{parens:!0});var c=this.natural({min:2,max:9}).toString()+this.natural({min:0,max:8}).toString()+this.natural({min:0,max:9}).toString();return b.parens?"("+c+")":c},i.prototype.city=function(){return this.capitalize(this.word({syllables:3}))},i.prototype.coordinates=function(b){return b=a(b),this.latitude(b)+", "+this.longitude(b)},i.prototype.latitude=function(b){return b=a(b,{fixed:5}),this.floating({min:-90,max:90,fixed:b.fixed})},i.prototype.longitude=function(b){return b=a(b,{fixed:5}),this.floating({min:0,max:180,fixed:b.fixed})},i.prototype.phone=function(b){b=a(b,{formatted:!0}),b.formatted||(b.parens=!1);var c=this.areacode(b).toString(),d=this.natural({min:2,max:9}).toString()+this.natural({min:0,max:9}).toString()+this.natural({min:0,max:9}).toString(),e=this.natural({min:1e3,max:9999}).toString();return b.formatted?c+" "+d+"-"+e:c+d+e},i.prototype.postal=function(){var a=this.character({pool:"XVTSRPNKLMHJGECBA"}),b=a+this.natural({max:9})+this.character({alpha:!0,casing:"upper"}),c=this.natural({max:9})+this.character({alpha:!0,casing:"upper"})+this.natural({max:9});return b+" "+c},i.prototype.provinces=function(){return[{name:"Alberta",abbreviation:"AB"},{name:"British Columbia",abbreviation:"BC"},{name:"Manitoba",abbreviation:"MB"},{name:"New Brunswick",abbreviation:"NB"},{name:"Newfoundland and Labrador",abbreviation:"NL"},{name:"Nova Scotia",abbreviation:"NS"},{name:"Ontario",abbreviation:"ON"},{name:"Prince Edward Island",abbreviation:"PE"},{name:"Quebec",abbreviation:"QC"},{name:"Saskatchewan",abbreviation:"SK"},{name:"Northwest Territories",abbreviation:"NT"},{name:"Nunavut",abbreviation:"NU"},{name:"Yukon",abbreviation:"YT"}]},i.prototype.province=function(a){return a&&a.full?this.pick(this.provinces()).name:this.pick(this.provinces()).abbreviation},i.prototype.radio=function(b){b=a(b,{side:"?"});var c="";switch(b.side.toLowerCase()){case"east":case"e":c="W";break;case"west":case"w":c="K";break;default:c=this.character({pool:"KW"})}return c+this.character({alpha:!0,casing:"upper"})+this.character({alpha:!0,casing:"upper"})+this.character({alpha:!0,casing:"upper"})},i.prototype.state=function(a){return a&&a.full?this.pick(this.states()).name:this.pick(this.states()).abbreviation},i.prototype.states=function(){return[{name:"Alabama",abbreviation:"AL"},{name:"Alaska",abbreviation:"AK"},{name:"American Samoa",abbreviation:"AS"},{name:"Arizona",abbreviation:"AZ"},{name:"Arkansas",abbreviation:"AR"},{name:"Armed Forces Europe",abbreviation:"AE"},{name:"Armed Forces Pacific",abbreviation:"AP"},{name:"Armed Forces the Americas",abbreviation:"AA"},{name:"California",abbreviation:"CA"},{name:"Colorado",abbreviation:"CO"},{name:"Connecticut",abbreviation:"CT"},{name:"Delaware",abbreviation:"DE"},{name:"District of Columbia",abbreviation:"DC"},{name:"Federated States of Micronesia",abbreviation:"FM"},{name:"Florida",abbreviation:"FL"},{name:"Georgia",abbreviation:"GA"},{name:"Guam",abbreviation:"GU"},{name:"Hawaii",abbreviation:"HI"},{name:"Idaho",abbreviation:"ID"},{name:"Illinois",abbreviation:"IL"},{name:"Indiana",abbreviation:"IN"},{name:"Iowa",abbreviation:"IA"},{name:"Kansas",abbreviation:"KS"},{name:"Kentucky",abbreviation:"KY"},{name:"Louisiana",abbreviation:"LA"},{name:"Maine",abbreviation:"ME"},{name:"Marshall Islands",abbreviation:"MH"},{name:"Maryland",abbreviation:"MD"},{name:"Massachusetts",abbreviation:"MA"},{name:"Michigan",abbreviation:"MI"},{name:"Minnesota",abbreviation:"MN"},{name:"Mississippi",abbreviation:"MS"},{name:"Missouri",abbreviation:"MO"},{name:"Montana",abbreviation:"MT"},{name:"Nebraska",abbreviation:"NE"},{name:"Nevada",abbreviation:"NV"},{name:"New Hampshire",abbreviation:"NH"},{name:"New Jersey",abbreviation:"NJ"},{name:"New Mexico",abbreviation:"NM"},{name:"New York",abbreviation:"NY"},{name:"North Carolina",abbreviation:"NC"},{name:"North Dakota",abbreviation:"ND"},{name:"Northern Mariana Islands",abbreviation:"MP"},{name:"Ohio",abbreviation:"OH"},{name:"Oklahoma",abbreviation:"OK"},{name:"Oregon",abbreviation:"OR"},{name:"Pennsylvania",abbreviation:"PA"},{name:"Puerto Rico",abbreviation:"PR"},{name:"Rhode Island",abbreviation:"RI"},{name:"South Carolina",abbreviation:"SC"},{name:"South Dakota",abbreviation:"SD"},{name:"Tennessee",abbreviation:"TN"},{name:"Texas",abbreviation:"TX"},{name:"Utah",abbreviation:"UT"},{name:"Vermont",abbreviation:"VT"},{name:"Virgin Islands, U.S.",abbreviation:"VI"},{name:"Virginia",abbreviation:"VA"},{name:"Washington",abbreviation:"WA"},{name:"West Virginia",abbreviation:"WV"},{name:"Wisconsin",abbreviation:"WI"},{name:"Wyoming",abbreviation:"WY"}]},i.prototype.street=function(b){b=a(b);var c=this.word({syllables:2});return c=this.capitalize(c),c+=" ",c+=b.short_suffix?this.street_suffix().abbreviation:this.street_suffix().name},i.prototype.street_suffix=function(){return this.pick(this.street_suffixes())},i.prototype.street_suffixes=function(){return[{name:"Avenue",abbreviation:"Ave"},{name:"Boulevard",abbreviation:"Blvd"},{name:"Center",abbreviation:"Ctr"},{name:"Circle",abbreviation:"Cir"},{name:"Court",abbreviation:"Ct"},{name:"Drive",abbreviation:"Dr"},{name:"Extension",abbreviation:"Ext"},{name:"Glen",abbreviation:"Gln"},{name:"Grove",abbreviation:"Grv"},{name:"Heights",abbreviation:"Hts"},{name:"Highway",abbreviation:"Hwy"},{name:"Junction",abbreviation:"Jct"},{name:"Key",abbreviation:"Key"},{name:"Lane",abbreviation:"Ln"},{name:"Loop",abbreviation:"Loop"},{name:"Manor",abbreviation:"Mnr"},{name:"Mill",abbreviation:"Mill"},{name:"Park",abbreviation:"Park"},{name:"Parkway",abbreviation:"Pkwy"},{name:"Pass",abbreviation:"Pass"},{name:"Path",abbreviation:"Path"},{name:"Pike",abbreviation:"Pike"},{name:"Place",abbreviation:"Pl"},{name:"Plaza",abbreviation:"Plz"},{name:"Point",abbreviation:"Pt"},{name:"Ridge",abbreviation:"Rdg"},{name:"River",abbreviation:"Riv"},{name:"Road",abbreviation:"Rd"},{name:"Square",abbreviation:"Sq"},{name:"Street",abbreviation:"St"},{name:"Terrace",abbreviation:"Ter"},{name:"Trail",abbreviation:"Trl"},{name:"Turnpike",abbreviation:"Tpke"},{name:"View",abbreviation:"Vw"},{name:"Way",abbreviation:"Way"}]},i.prototype.zip=function(a){for(var b="",c=0;5>c;c++)b+=this.natural({max:9}).toString();if(a&&a.plusfour===!0)for(b+="-",c=0;4>c;c++)b+=this.natural({max:9}).toString();return b},i.prototype.ampm=function(){return this.bool()?"am":"pm"},i.prototype.hour=function(b){b=a(b);var c=b.twentyfour?24:12;return this.natural({min:1,max:c})},i.prototype.minute=function(){return this.natural({max:59})},i.prototype.month=function(b){b=a(b);var c=this.pick(this.months());return b.raw?c:c.name},i.prototype.months=function(){return[{name:"January",short_name:"Jan",numeric:"01"},{name:"February",short_name:"Feb",numeric:"02"},{name:"March",short_name:"Mar",numeric:"03"},{name:"April",short_name:"Apr",numeric:"04"},{name:"May",short_name:"May",numeric:"05"},{name:"June",short_name:"Jun",numeric:"06"},{name:"July",short_name:"Jul",numeric:"07"},{name:"August",short_name:"Aug",numeric:"08"},{name:"September",short_name:"Sep",numeric:"09"},{name:"October",short_name:"Oct",numeric:"10"},{name:"November",short_name:"Nov",numeric:"11"},{name:"December",short_name:"Dec",numeric:"12"}]},i.prototype.second=function(){return this.natural({max:59})},i.prototype.timestamp=function(){return this.natural({min:1,max:parseInt((new Date).getTime()/1e3,10)})},i.prototype.year=function(b){return b=a(b,{min:(new Date).getFullYear()}),b.max="undefined"!=typeof b.max?b.max:b.min+100,this.natural(b).toString()},i.prototype.cc=function(b){b=a(b);var c,d,e;c=b.type?this.cc_type({name:b.type,raw:!0}):this.cc_type({raw:!0}),d=c.prefix.split(""),e=c.length-c.prefix.length-1;for(var f=0;e>f;f++)d.push(this.integer({min:0,max:9}));return d.push(this.luhn_calculate(d.join(""))),d.join("")},i.prototype.cc_types=function(){return[{name:"American Express",short_name:"amex",prefix:"34",length:15},{name:"Bankcard",short_name:"bankcard",prefix:"5610",length:16},{name:"China UnionPay",short_name:"chinaunion",prefix:"62",length:16},{name:"Diners Club Carte Blanche",short_name:"dccarte",prefix:"300",length:14},{name:"Diners Club enRoute",short_name:"dcenroute",prefix:"2014",length:15},{name:"Diners Club International",short_name:"dcintl",prefix:"36",length:14},{name:"Diners Club United States & Canada",short_name:"dcusc",prefix:"54",length:16},{name:"Discover Card",short_name:"discover",prefix:"6011",length:16},{name:"InstaPayment",short_name:"instapay",prefix:"637",length:16},{name:"JCB",short_name:"jcb",prefix:"3528",length:16},{name:"Laser",short_name:"laser",prefix:"6304",length:16},{name:"Maestro",short_name:"maestro",prefix:"5018",length:16},{name:"Mastercard",short_name:"mc",prefix:"51",length:16},{name:"Solo",short_name:"solo",prefix:"6334",length:16},{name:"Switch",short_name:"switch",prefix:"4903",length:16},{name:"Visa",short_name:"visa",prefix:"4",length:16},{name:"Visa Electron",short_name:"electron",prefix:"4026",length:16}]},i.prototype.cc_type=function(b){b=a(b);var c=this.cc_types(),d=null;if(b.name){for(var e=0;e<c.length;e++)if(c[e].name===b.name||c[e].short_name===b.name){d=c[e];break}if(null===d)throw new Error("Credit card type '"+b.name+"'' is not suppoted")}else d=this.pick(c);return b.raw?d:d.name},i.prototype.dollar=function(b){b=a(b,{max:1e4,min:0});var c=this.floating({min:b.min,max:b.max,fixed:2}).toString(),d=c.split(".")[1];return void 0===d?c+=".00":d.length<2&&(c+="0"),"$"+c},i.prototype.exp=function(b){b=a(b);var c={};return c.year=this.exp_year(),c.month=c.year===(new Date).getFullYear()?this.exp_month({future:!0}):this.exp_month(),b.raw?c:c.month+"/"+c.year},i.prototype.exp_month=function(b){b=a(b);var c,d;if(b.future){do c=this.month({raw:!0}).numeric,d=parseInt(c,10);while(d<(new Date).getMonth())}else c=this.month({raw:!0}).numeric;return c},i.prototype.exp_year=function(){return this.year({max:(new Date).getFullYear()+10})},i.prototype.d4=function(){return this.natural({min:1,max:4})},i.prototype.d6=function(){return this.natural({min:1,max:6})},i.prototype.d8=function(){return this.natural({min:1,max:8})},i.prototype.d10=function(){return this.natural({min:1,max:10})},i.prototype.d12=function(){return this.natural({min:1,max:12})},i.prototype.d20=function(){return this.natural({min:1,max:20})},i.prototype.d30=function(){return this.natural({min:1,max:30})},i.prototype.d100=function(){return this.natural({min:1,max:100})},i.prototype.rpg=function(b,c){if(c=a(c),null===b)throw new Error("A type of die roll must be included");var d=b.toLowerCase().split("d"),e=[];if(2!==d.length||!parseInt(d[0],10)||!parseInt(d[1],10))throw new Error("Invalid format provided. Please provide #d# where the first # is the number of dice to roll, the second # is the max of each die");for(var f=d[0];f>0;f--)e[f-1]=this.natural({min:1,max:d[1]});return"undefined"!=typeof c.sum&&c.sum?e.reduce(function(a,b){return a+b}):e},i.prototype.guid=function(){return this.hash({casing:"upper",length:8})+"-"+this.hash({casing:"upper",length:4})+"-"+this.hash({casing:"upper",length:4})+"-"+this.hash({casing:"upper",length:4})+"-"+this.hash({casing:"upper",length:12})},i.prototype.hash=function(b){b=a(b,{length:40,casing:"lower"});var c="upper"===b.casing?h.toUpperCase():h;return this.string({pool:c,length:b.length})},i.prototype.mersenne_twister=function(a){return new j(a)},i.prototype.luhn_check=function(a){var b=a.toString(),c=+b.substring(b.length-1);return c===this.luhn_calculate(+b.substring(0,b.length-1))},i.prototype.luhn_calculate=function(a){for(var b=a.toString().split("").reverse(),c=0,d=0,e=b.length;e>d;++d){var f=+b[d];0===d%2&&(f*=2,f>9&&(f-=9)),c+=f}return 9*c%10},i.prototype.VERSION="0.4.3";var j=function(a){void 0===a&&(a=(new Date).getTime()),this.N=624,this.M=397,this.MATRIX_A=2567483615,this.UPPER_MASK=2147483648,this.LOWER_MASK=2147483647,this.mt=new Array(this.N),this.mti=this.N+1,this.init_genrand(a)};j.prototype.init_genrand=function(a){for(this.mt[0]=a>>>0,this.mti=1;this.mti<this.N;this.mti++)a=this.mt[this.mti-1]^this.mt[this.mti-1]>>>30,this.mt[this.mti]=(1812433253*((4294901760&a)>>>16)<<16)+1812433253*(65535&a)+this.mti,this.mt[this.mti]>>>=0},j.prototype.init_by_array=function(a,b){var c,d,e=1,f=0;for(this.init_genrand(19650218),c=this.N>b?this.N:b;c;c--)d=this.mt[e-1]^this.mt[e-1]>>>30,this.mt[e]=(this.mt[e]^(1664525*((4294901760&d)>>>16)<<16)+1664525*(65535&d))+a[f]+f,this.mt[e]>>>=0,e++,f++,e>=this.N&&(this.mt[0]=this.mt[this.N-1],e=1),f>=b&&(f=0);for(c=this.N-1;c;c--)d=this.mt[e-1]^this.mt[e-1]>>>30,this.mt[e]=(this.mt[e]^(1566083941*((4294901760&d)>>>16)<<16)+1566083941*(65535&d))-e,this.mt[e]>>>=0,e++,e>=this.N&&(this.mt[0]=this.mt[this.N-1],e=1);this.mt[0]=2147483648},j.prototype.genrand_int32=function(){var a,b=new Array(0,this.MATRIX_A);if(this.mti>=this.N){var c;for(this.mti===this.N+1&&this.init_genrand(5489),c=0;c<this.N-this.M;c++)a=this.mt[c]&this.UPPER_MASK|this.mt[c+1]&this.LOWER_MASK,this.mt[c]=this.mt[c+this.M]^a>>>1^b[1&a];for(;c<this.N-1;c++)a=this.mt[c]&this.UPPER_MASK|this.mt[c+1]&this.LOWER_MASK,this.mt[c]=this.mt[c+(this.M-this.N)]^a>>>1^b[1&a];a=this.mt[this.N-1]&this.UPPER_MASK|this.mt[0]&this.LOWER_MASK,this.mt[this.N-1]=this.mt[this.M-1]^a>>>1^b[1&a],this.mti=0}return a=this.mt[this.mti++],a^=a>>>11,a^=2636928640&a<<7,a^=4022730752&a<<15,a^=a>>>18,a>>>0},j.prototype.genrand_int31=function(){return this.genrand_int32()>>>1},j.prototype.genrand_real1=function(){return this.genrand_int32()*(1/4294967295)},j.prototype.random=function(){return this.genrand_int32()*(1/4294967296)},j.prototype.genrand_real3=function(){return(this.genrand_int32()+.5)*(1/4294967296)},j.prototype.genrand_res53=function(){var a=this.genrand_int32()>>>5,b=this.genrand_int32()>>>6;return(67108864*a+b)*(1/9007199254740992)},"undefined"!=typeof exports&&("undefined"!=typeof module&&module.exports&&(exports=module.exports=i),exports.Chance=i),"function"==typeof define&&define.amd&&define("Chance",[],function(){return i}),"object"==typeof window&&"object"==typeof window.document&&(window.Chance=i,window.chance=new i)}();

io.sockets.on('connection', function (socket) {

  /////////////
  // onLogin //
  /////////////
  socket.on('login', function (data) {
		console.log("logging user "+data.p1+" with passw "+data.p2);
		connection.query("call Auth('"+data.p1+"','"+data.p2+"');", function(err, rows, fields) {
            console.log(err);
            if(err) throw err;
			if(rows==undefined || rows.length==undefined || rows.length==0)
				socket.emit("message", {msg:"Wrong username and/or Passworde!"});
			else
                if(rows[0].msg != undefined) {
                    socket.emit("message", {msg:rows[0].msg});
                } else {

				    socket.emit("loginok", rows);
                    console.log("Loggin "+rows[1].userId+" with sid "+rows[1].sessionId);
                }
		});
  });

    ///////////////////
    // Request Chunk //
    ///////////////////
    socket.on('onResourcesUpdate', function(data) {
        //var chunk = data.chunk;
        //console.log("getting chunk data for chunk zone ="+chunk.zoneId+" and chunk XY = "+chunk.x+","+chunk.y);
        //if(false) {
        //
        //}
    });

  //////////////////////////
  // onResourcesUpdate    //
  //////////////////////////
  socket.on('onResourcesUpdate', function(data) {
      console.log("getting resources from idUser ="+data.userId);
      connection.query("CALL `getResources`('"+data.userId+"')",function(err, rows, fields){
          if(rows.length==undefined || rows.length==0)
              socket.emit("message", {msg:"Player not found!"});
          socket.emit("onResourcesUpdate", rows);
     });
  });
  
	//////////////////////////
	// onResourcesCollect    //
	//////////////////////////
	socket.on('onResourcesCollect', function(data) {
		connection.query("CALL `TimeCheckResource`("+data.idVillage+","+data.x+","+data.y+")",function(err, rows, fields){
			if(rows.length==undefined || rows.length==0)
				socket.emit("message", {msg:"Error!"});
			socket.emit("onResourcesCollect", rows, data);
		});
	});

    //////////////////////////
    // onListBuilding       //
    //////////////////////////
    socket.on('onListBuilding', function(data) {
        console.log("getting build list for user idUser ="+data.userId);
        connection.query("CALL `possibleBuildings`("+data.userId+")",function(err, rows, fields){
            if(rows == undefined ||rows.length==undefined || rows.length==0)
                socket.emit("message", {msg:"Player not found!"});
            socket.emit("onListBuilding", rows);
        });
    });

    //////////////////////////
    // onConstructRequest   //
    //////////////////////////
   socket.on('onConstructRequest', function(data) {
        console.log("verifying and building idBuilding="+ data.idBuilding +" idVillage=" + data.idVillage + " posx =" + data.x + " posy ="+ data.y);
        connection.query("CALL `makeBuildings`("+data.idVillage+","+data.x+","+data.y+","+data.idBuilding+")",function(err, rows, fields){
            if(rows == undefined ||rows.length==undefined || rows.length==0){
                socket.emit("message", {msg:"ERROR:"+ err});
            }else{
				socket.emit("onConstructRequest", rows, data);
            }
        });
    });



    ////////////////////
    // onCreateUnit   //
    ////////////////////
    socket.on('onUnitCreate', function(data) {
        console.log("creating unit name "+Chance.first());
        console.log("creating unit id "+data.idUnit+" at building id " + data.idBuildingBuilt);
        connection.query("CALL `CreateUnit`("+data.idBuildingBuilt+","+data.idUnit+",'"+randonName()+"')",function(err, rows, fields){
            if(rows == undefined ||rows.length==undefined || rows.length==0){
                socket.emit("message", {msg:"ERROR:"+ err});
            }else{
                socket.emit("onCreateUnit", rows, data);
             }
            connection.query("CALL `getResources`('"+data.userId+"')",function(err, rows, fields){
                if(rows.length==undefined || rows.length==0)
                    socket.emit("message", {msg:"Player not found!"});
                socket.emit("onResourcesUpdate", rows);
            });
        });
    });
	
    //////////////////////////
    // onConstructCheck     //
    //////////////////////////
   socket.on('onConstructCheck', function(data) {
        console.log("verifying if building its finished idBuilding="+ data.idBuilding +" idVillage=" + data.idVillage + " posx =" + data.x + " posy ="+ data.y);
        connection.query("CALL `TimeCheck`("+data.idVillage+","+data.x+","+data.y+")",function(err, rows, fields){
            if(rows == undefined ||rows.length==undefined || rows.length==0){
                socket.emit("message", {msg:"ERROR:"+ err});
            }else{
				socket.emit("onConstructCheck", rows, data);
            }
        });
    });

    //////////////////////////
    // onConstructCheck     //
    //////////////////////////
    socket.on('onListVillageUnits', function(data) {
        console.log("listando units da vila "+data.villageId);
        connection.query("CALL `getVillageUnit`("+data.villageId+")",function(err, rows, fields){
            if(rows == undefined ||rows.length==undefined || rows.length==0){
                socket.emit("message", {msg:"ERROR:"+ err});
            }else{
                if(data.openMenu != undefined)
                    rows[2] = "openMenu";
                socket.emit("onListVillageUnits", rows);
            }
        });
    });


	//////////////////////////
    // onBuildingSelect     //
    //////////////////////////
	socket.on('onBuildingSelect', function(data) {
		console.log("Verifying if the building exist on : idVillage->"+data.idVillage+" X->"+data.X+" Y->"+data.Y);
		connection.query("CALL `upgradeBuildView`("+data.idVillage+","+data.X+","+data.Y+")",function(err, rows, fields){
			if(rows == undefined ||rows.length==undefined || rows.length==0){
                socket.emit("message", {msg:"ERROR:"+ err});
            }else{
                var idBuilding = rows[0][0].idBuilding;
                connection.query("CALL `UnitBuildingCanBuild`('"+idBuilding+"')",function(err2, rows2, fields2){
                    if(rows2 == undefined ||rows2.length==undefined || rows2.length==0){

                        //socket.emit("message", {msg:"ERROR:"+ err2});
                    }else{
                        rows[0][0].listUnitsCanMake = rows2[0];

                    }
                    socket.emit("onBuildingSelect",rows);
                });

			}
		});
	});
	////////////

    ////////////////////////////
    // onListVillageBuildings //
    ////////////////////////////
    socket.on('onListVillageBuildings', function(data){
        console.log("Listing Buildings from idVillage:"+data);
        connection.query("CALL `getVillageBuilding`("+data+")", function(err, rows, fields){
            if(rows == undefined ||rows.length==undefined || rows.length==0){
                socket.emit("message", {msg:"ERROR:"+ err});
            }else{
                socket.emit("onListVillageBuildings",rows);
            }
        });
    });
    /////////////////////////

    ////////////////////////////
    // onListVillages //////////
    ////////////////////////////
    socket.on('onListVillages', function(data){
        console.log("Listing Villages from userId:"+data.userId);
        connection.query("CALL `getUserVillages`("+data.userId+")", function(err, rows, fields){
            if(rows == undefined ||rows.length==undefined || rows.length==0){
                socket.emit("message", {msg:"ERROR:"+ err});
            }else{
                socket.emit("onListVillages",rows);
            }
        });
    });
	
	////////////////////////////
    // onRequestUpdate //////////
    ////////////////////////////
    socket.on('onRequestUpdate', function(data){
        console.log("Updating idbuilding:"+data.idBuilding+" x:"+data.posX+" y:"+data.posY);
        connection.query("CALL `updateBuildings`("+data.idVillage+","+data.idBuilding+","+data.posX+","+data.posY+")", function(err, rows, fields){
            if(rows == undefined ||rows.length==undefined || rows.length==0){
                socket.emit("message", {msg:"ERROR:"+ err});
            }else{
                socket.emit("onRequestUpdate",rows, data);
            }
        });
    });
	
	////////////////////////////
    // onCheckUpdate //////////
    ////////////////////////////
    socket.on('onCheckUpdate', function(data){
        console.log("Updating idbuilding:"+data.idBuilding+" x:"+data.posX+" y:"+data.posY);
        connection.query("CALL `TimeCheck`("+data.idVillage+","+data.posX+","+data.posY+")", function(err, rows, fields){
            if(rows == undefined ||rows.length==undefined || rows.length==0){
                socket.emit("message", {msg:"ERROR:"+ err});
            }else{
                socket.emit("onCheckUpdate",rows, data);
            }
        });
    });
    /////////////////////////
	
});

// gotta put some more names here or try to use this:
// http://deron.meranda.us/data/census-dist-male-first.txt
var nomes = [
    "Jhony", "Manolo", "Dirceu", "Castro","Tod","Ted","Toky", "Texugo"
]

var randomName = function() {
    var random =  Math.floor((Math.random()*nomes.length-1));
    return nomes[random];
}


console.log("Way of The Temple SuperDumper Server running beautifully on port 8080");